import { describe, expect, it } from 'vitest';

import type { Question } from '../content/schema.ts';
import { skillState } from './coverage.ts';
import { emptyProgress, readSubSkill, recordSession, skillInput, type Progress } from './progress.ts';
import type { AnswerRecord } from './scoring.ts';

function mcq(id: string, options: 2 | 3, subSkill?: string): Question {
  return {
    id,
    type: 'mcq',
    difficulty: 1,
    ...(subSkill ? { learningStandard: subSkill.slice(0, subSkill.indexOf('/')), subSkill } : {}),
    prompt: { ms: id, en: id },
    promptAudio: { ms: `/audio/ms/${id}.mp3`, en: `/audio/en/${id}.mp3` },
    payload: {
      options: ['a', 'b', 'c'].slice(0, options).map((o) => ({ id: o, text: { ms: o, en: o } })),
      correctOptionId: 'a',
      shuffle: false,
    },
  };
}

function countTap(id: string, subSkill: string): Question {
  return {
    id,
    type: 'count-tap',
    difficulty: 1,
    learningStandard: subSkill.slice(0, subSkill.indexOf('/')),
    subSkill,
    prompt: { ms: id, en: id },
    promptAudio: { ms: `/audio/ms/${id}.mp3`, en: `/audio/en/${id}.mp3` },
    payload: {
      itemImage: '/img/fruit/rambutan.svg',
      itemCount: 7,
      layout: 'scatter',
      answerInput: 'tap-count',
      correctAnswer: 7,
    },
  };
}

const right = (questionId: string): AnswerRecord => ({
  questionId,
  attempts: 1,
  correct: true,
  firstTry: true,
  hintShown: false,
  msSpent: 0,
});

/** Right in the end, but not on the first attempt. */
const secondTry = (questionId: string): AnswerRecord => ({
  questionId,
  attempts: 2,
  correct: true,
  firstTry: false,
  hintShown: true,
  msSpent: 0,
});

/** The live pack, as a lookup. */
function pack(questions: readonly Question[]) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return (id: string) => byId.get(id);
}

const AFTER = '1.2.2/after';

describe('recordSession', () => {
  it('banks a first-attempt-correct answer under the sub-skill the pack names', () => {
    const q = mcq('q1', 3, AFTER);
    const p = recordSession(emptyProgress(), 's1', [right('q1')], [q], pack([q]));
    expect(p.subSkills[AFTER]).toEqual({
      evidence: [{ questionId: 'q1', sessionId: 's1', twoOptions: false }],
      latestWasWrong: false,
      masteredOnce: false,
    });
  });

  /*
    SPEC 6, rule 4. A saved session freezes its questions, so a run that began
    before a teacher's correction still carries the old mapping. The evidence
    belongs to the mapping the pack holds now.
  */
  it('reads the sub-skill from the live pack, not from the copy the run froze', () => {
    const frozen = mcq('q1', 3, '1.2.2/before');
    const live = mcq('q1', 3, AFTER);
    const p = recordSession(emptyProgress(), 's1', [right('q1')], [frozen], pack([live]));
    expect(Object.keys(p.subSkills)).toEqual([AFTER]);
  });

  /*
    The other half of the same rule, going the other way. A guess costs what the
    child faced: a two-option question answered before it gained a third option
    was still a one-in-two guess.
  */
  it('reads two options from the question the child answered, not from the pack today', () => {
    const frozen = mcq('q4', 2, '1.6.1/digit_at_tens');
    const live = mcq('q4', 3, '1.6.1/digit_at_tens');
    const p = recordSession(emptyProgress(), 's1', [right('q4')], [frozen], pack([live]));
    expect(readSubSkill(p.subSkills['1.6.1/digit_at_tens'])?.evidence[0]?.twoOptions).toBe(true);
  });

  it('counts a count-tap as having no options to guess between', () => {
    const q = countTap('q3', '1.2.1/count_objects');
    const p = recordSession(emptyProgress(), 's1', [right('q3')], [q], pack([q]));
    expect(readSubSkill(p.subSkills['1.2.1/count_objects'])?.evidence[0]?.twoOptions).toBe(false);
  });

  it('leaves nothing for a question with no sub-skill, or one gone from the pack', () => {
    const shape = mcq('q5', 3);
    const gone = mcq('q9', 3, AFTER);
    const p = recordSession(emptyProgress(), 's1', [right('q5'), right('q9')], [shape, gone], pack([shape]));
    expect(p.subSkills).toEqual({});
  });

  it('marks a missed first attempt as asked about and wrong, without banking it', () => {
    const q = mcq('q1', 3, AFTER);
    const p = recordSession(emptyProgress(), 's1', [secondTry('q1')], [q], pack([q]));
    expect(p.subSkills[AFTER]).toEqual({ evidence: [], latestWasWrong: true, masteredOnce: false });
    expect(skillState(skillInput(p, AFTER)).status).toBe('evaluating');
  });

  it('takes latestWasWrong from the last question the run asked for that sub-skill', () => {
    const qs = [mcq('q1', 3, AFTER), mcq('q2', 3, AFTER)];
    const rightLast = recordSession(emptyProgress(), 's1', [secondTry('q1'), right('q2')], qs, pack(qs));
    const wrongLast = recordSession(emptyProgress(), 's1', [right('q2'), secondTry('q1')], qs, pack(qs));
    expect(readSubSkill(rightLast.subSkills[AFTER])?.latestWasWrong).toBe(false);
    expect(readSubSkill(wrongLast.subSkills[AFTER])?.latestWasWrong).toBe(true);
  });

  /*
    Progress is written before the session. An app killed between the two
    restores the run at its last question, and finishing it records the same
    run again under the same sessionId.
  */
  it('changes nothing when the same run is recorded twice', () => {
    const qs = [mcq('q1', 3, AFTER), mcq('q2', 3, AFTER)];
    const answers = [right('q1'), secondTry('q2')];
    const once = recordSession(emptyProgress(), 's1', answers, qs, pack(qs));
    expect(recordSession(once, 's1', answers, qs, pack(qs))).toEqual(once);
  });

  it('banks the same question again from a different run', () => {
    const q = mcq('q1', 3, AFTER);
    const s1 = recordSession(emptyProgress(), 's1', [right('q1')], [q], pack([q]));
    const s2 = recordSession(s1, 's2', [right('q1')], [q], pack([q]));
    expect(readSubSkill(s2.subSkills[AFTER])?.evidence.map((e) => e.sessionId)).toEqual(['s1', 's2']);
  });

  /*
    SPEC 6, rule 3. An id the skills file no longer lists may come back — a
    teacher's correction can be reversed — and its evidence has to come back
    with it. So a write carries every entry it did not touch, including ones this
    build cannot read.
  */
  it('carries entries the run did not touch, whether or not they can be read', () => {
    const kept = {
      evidence: [{ questionId: 'q5', sessionId: 's0', twoOptions: false }],
      latestWasWrong: false,
      masteredOnce: false,
    };
    const before: Progress = { subSkills: { '7.2.1/name_triangle': kept, 'x/unreadable': 'not an entry' } };
    const q = mcq('q1', 3, AFTER);
    const p = recordSession(before, 's1', [right('q1')], [q], pack([q]));
    expect(p.subSkills['7.2.1/name_triangle']).toBe(kept);
    expect(p.subSkills['x/unreadable']).toBe('not an entry');
  });

  it('carries fields it does not know about, so a later one is an addition', () => {
    const before = { subSkills: {}, levels: { 'math-y1-nombor-100': 2 } } as Progress;
    const q = mcq('q1', 3, AFTER);
    expect(recordSession(before, 's1', [right('q1')], [q], pack([q]))).toMatchObject({
      levels: { 'math-y1-nombor-100': 2 },
    });
  });

  it('replaces an unreadable entry for a sub-skill the run did touch', () => {
    const q = mcq('q1', 3, AFTER);
    const p = recordSession({ subSkills: { [AFTER]: 42 } }, 's1', [right('q1')], [q], pack([q]));
    expect(readSubSkill(p.subSkills[AFTER])?.evidence).toHaveLength(1);
  });

  it('does not change the progress it was given', () => {
    const q = mcq('q1', 3, AFTER);
    const before = recordSession(emptyProgress(), 's1', [right('q1')], [q], pack([q]));
    const snapshot = structuredClone(before);
    recordSession(before, 's2', [secondTry('q1')], [q], pack([q]));
    expect(before).toEqual(snapshot);
  });

  /*
    The whole chain, end to end: three three-option questions across two runs
    meet the bar, and a later miss drops the status without erasing that it was
    met (SPEC 5.7, masteredOnce).
  */
  it('keeps masteredOnce after a later miss drops the status', () => {
    const qs = [mcq('q1', 3, AFTER), mcq('q2', 3, AFTER), mcq('q3', 3, AFTER)];
    const s1 = recordSession(emptyProgress(), 's1', [right('q1'), right('q2')], qs, pack(qs));
    expect(skillState(skillInput(s1, AFTER))).toEqual({ status: 'evaluating', masteredOnce: false });

    const s2 = recordSession(s1, 's2', [right('q3')], qs, pack(qs));
    expect(skillState(skillInput(s2, AFTER))).toEqual({ status: 'mastered', masteredOnce: true });

    const s3 = recordSession(s2, 's3', [secondTry('q1')], qs, pack(qs));
    expect(skillState(skillInput(s3, AFTER))).toEqual({ status: 'evaluating', masteredOnce: true });
    expect(readSubSkill(s3.subSkills[AFTER])?.masteredOnce).toBe(true);
  });
});

describe('skillInput', () => {
  it('reads a sub-skill never recorded as never asked about', () => {
    expect(skillInput(emptyProgress(), AFTER)).toEqual({ attempted: false, evidence: [] });
  });

  it('reads an entry it cannot understand as never asked about, rather than throwing', () => {
    const junk: unknown[] = [
      null,
      'a string',
      {},
      { evidence: 'none', latestWasWrong: false, masteredOnce: false },
      { evidence: [], latestWasWrong: 'no', masteredOnce: false },
      { evidence: [], latestWasWrong: false },
      { evidence: [null], latestWasWrong: false, masteredOnce: false },
      { evidence: [{ questionId: 1, sessionId: 's1', twoOptions: false }], latestWasWrong: false, masteredOnce: false },
      { evidence: [{ questionId: 'q1', sessionId: 's1' }], latestWasWrong: false, masteredOnce: false },
    ];
    for (const entry of junk) {
      expect(skillInput({ subSkills: { [AFTER]: entry } }, AFTER)).toEqual({ attempted: false, evidence: [] });
    }
  });

  it('never reads an inherited property as a sub-skill', () => {
    expect(skillInput(emptyProgress(), 'constructor')).toEqual({ attempted: false, evidence: [] });
  });
});
