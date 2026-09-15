import { describe, expect, it } from 'vitest';

import type { Difficulty, Question } from '../content/schema.ts';
import { selectSession, type SelectionInput, type SkillRank } from './selection.ts';

function mcq(id: string, difficulty: Difficulty, subSkill?: string): Question {
  return {
    id,
    type: 'mcq',
    difficulty,
    ...(subSkill ? { learningStandard: subSkill.slice(0, subSkill.indexOf('/')), subSkill } : {}),
    prompt: { ms: id, en: id },
    promptAudio: { ms: `/audio/ms/${id}.mp3`, en: `/audio/en/${id}.mp3` },
    payload: {
      options: ['a', 'b', 'c'].map((o) => ({ id: o, text: { ms: o, en: o } })),
      correctOptionId: 'a',
      shuffle: false,
    },
  };
}

/** A bank shaped like the real one: three sub-skills a level, one level each. */
function bank(): Question[] {
  const out: Question[] = [];
  const skills: Array<[string, Difficulty]> = [
    ['1.2.1/count_objects', 1],
    ['1.2.2/compare_greater', 1],
    ['1.2.2/after', 1],
    ['1.2.2/compare_smaller', 2],
    ['1.2.2/order_ascending', 2],
    ['1.6.1/digit_at_tens', 2],
    ['2.2.2/two_digit_plus_two_digit_no_bridge', 3],
  ];
  let n = 1;
  for (const [subSkill, difficulty] of skills) {
    for (let i = 0; i < 3; i++) {
      out.push(mcq(`q${String(n++).padStart(3, '0')}`, difficulty, subSkill));
    }
  }
  return out;
}

function input(over: Partial<SelectionInput> = {}): SelectionInput {
  return {
    bank: bank(),
    level: 1,
    total: 10,
    rank: () => 1,
    banked: () => false,
    lastAsked: () => 0,
    ...over,
  };
}

const ids = (qs: readonly Question[]) => qs.map((q) => q.id);
const levels = (qs: readonly Question[]) => qs.map((q) => q.difficulty);

describe('selectSession', () => {
  it('fills the SPEC 5.5 mix when every level can', () => {
    const picked = selectSession(input({ level: 2 })).questions;
    expect(picked).toHaveLength(10);
    expect(levels(picked).filter((d) => d === 1)).toHaveLength(2);
    expect(levels(picked).filter((d) => d === 2)).toHaveLength(7);
    expect(levels(picked).filter((d) => d === 3)).toHaveLength(1);
  });

  it('never picks the same question twice', () => {
    const picked = selectSession(input({ level: 3 })).questions;
    expect(new Set(ids(picked)).size).toBe(picked.length);
  });

  it('asks the easiest level first, the stretch last', () => {
    const picked = selectSession(input({ level: 2 })).questions;
    expect(levels(picked)).toEqual([...levels(picked)].sort((a, b) => a - b));
  });

  /*
    The bank holds three questions at level 3, and level 3 wants eight. The mix
    is a target: the rest comes from the nearest level, and the shortfall is
    reported rather than hidden. (PRD 16 item 27, decision 1)
  */
  it('fills a short level from the nearest one and reports the gap', () => {
    const { questions, gaps } = selectSession(input({ level: 3 }));
    expect(questions).toHaveLength(10);
    expect(levels(questions).filter((d) => d === 3)).toHaveLength(3);
    expect(levels(questions).filter((d) => d === 2)).toHaveLength(7);
    expect(gaps).toEqual([{ level: 3, wanted: 8, taken: 3, filledFrom: [2] }]);
  });

  it('reports nothing when every level filled its share', () => {
    expect(selectSession(input({ level: 1 })).gaps).toEqual([]);
  });

  it('never blocks: a bank smaller than the session returns what there is', () => {
    const small = bank().slice(0, 4);
    const { questions, gaps } = selectSession(input({ bank: small, level: 1 }));
    expect(questions).toHaveLength(4);
    expect(gaps.length).toBeGreaterThan(0);
  });

  it('never picks a question that claims no sub-skill', () => {
    const withShapes = [...bank(), mcq('q900', 1), mcq('q901', 1)];
    const picked = selectSession(input({ bank: withShapes, level: 1 })).questions;
    expect(ids(picked)).not.toContain('q900');
    expect(ids(picked)).not.toContain('q901');
  });

  /*
    SPEC 5.7 puts a slipped skill ahead of one never started: it is closer to
    being recovered. Mastered skills still get asked, last — that is practice,
    and it is what fills a session once the bank has nothing left to prove.
  */
  it('asks a slipped sub-skill before one not mastered, and a mastered one last', () => {
    const rank = (id: string): SkillRank =>
      id === '1.2.2/after' ? 0 : id === '1.2.1/count_objects' ? 2 : 1;
    const picked = selectSession(input({ level: 1, total: 3, rank })).questions;
    expect(picked.every((q) => q.subSkill === '1.2.2/after')).toBe(true);

    const nine = selectSession(input({ level: 1, total: 10, rank })).questions;
    const order = nine.filter((q) => q.difficulty === 1).map((q) => q.subSkill);
    expect(order.slice(0, 3).every((s) => s === '1.2.2/after')).toBe(true);
    expect(order.slice(-3).every((s) => s === '1.2.1/count_objects')).toBe(true);
  });

  /*
    Mastery counts distinct questions (SPEC 5.7), so a question that has never
    produced first-attempt evidence is worth more than one that has.
  */
  it('prefers questions that have never been answered right on a first attempt', () => {
    const banked = (id: string) => ['q001', 'q002'].includes(id);
    const picked = selectSession(input({ level: 1, total: 4, banked })).questions;
    const counting = picked.filter((q) => q.subSkill === '1.2.1/count_objects');
    expect(ids(counting)[0]).toBe('q003');
  });

  it('then asks whatever the child has not seen for longest', () => {
    const lastAsked = (id: string) => ({ q001: 7, q002: 2, q003: 5 })[id] ?? 0;
    const picked = selectSession(
      input({ bank: bank().slice(0, 3), level: 1, total: 2, lastAsked }),
    ).questions;
    expect(ids(picked)).toEqual(['q002', 'q003']);
  });

  it('falls back to pack order, so nothing is ever decided by chance', () => {
    const picked = selectSession(input({ level: 1, total: 3 })).questions;
    expect(ids(picked)).toEqual(['q001', 'q002', 'q003']);
  });

  /*
    The whole point of refusing randomness: the same child in the same state
    gets the same session, and "why did it ask that again" has an answer.
  */
  it('gives the same session for the same input, every time', () => {
    const settings = input({ level: 2, lastAsked: (id) => (id === 'q010' ? 3 : 0) });
    const first = selectSession(settings);
    const second = selectSession(settings);
    expect(ids(first.questions)).toEqual(ids(second.questions));
    expect(first.gaps).toEqual(second.gaps);
  });

  it('does not touch the bank it was given', () => {
    const original = bank();
    const copy = [...original];
    selectSession(input({ bank: original, level: 2 }));
    expect(original).toEqual(copy);
  });
});
