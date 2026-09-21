import { describe, expect, it } from 'vitest';

import type { Question } from '../content/schema.ts';
import { skillState } from './coverage.ts';
import {
  emptyProgress,
  packProgress,
  readSubSkill,
  recordSession,
  skillInput,
  type Progress,
} from './progress.ts';
import type { AnswerRecord } from './scoring.ts';

const TOPIC = 'math-y1-nombor-100';

/** recordSession for one pack, in the order these tests were written in. */
function record(
  progress: Progress,
  sessionId: string,
  answers: readonly AnswerRecord[],
  answered: readonly Question[],
  liveQuestion: (id: string) => Question | undefined,
  topicId = TOPIC,
): Progress {
  return recordSession(progress, { topicId, sessionId, answers, answered, liveQuestion });
}

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

/** Right in the end, but not on the first attempt. Scores 60 of 100 (SPEC 5.1). */
const secondTry = (questionId: string): AnswerRecord => ({
  questionId,
  attempts: 2,
  correct: true,
  firstTry: false,
  hintShown: true,
  msSpent: 0,
});

/** Never right: the answer was revealed. Scores 0. */
const missed = (questionId: string): AnswerRecord => ({
  questionId,
  attempts: 2,
  correct: false,
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
    const p = record(emptyProgress(), 's1', [right('q1')], [q], pack([q]));
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
    const p = record(emptyProgress(), 's1', [right('q1')], [frozen], pack([live]));
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
    const p = record(emptyProgress(), 's1', [right('q4')], [frozen], pack([live]));
    expect(readSubSkill(p.subSkills['1.6.1/digit_at_tens'])?.evidence[0]?.twoOptions).toBe(true);
  });

  it('counts a count-tap as having no options to guess between', () => {
    const q = countTap('q3', '1.2.1/count_objects');
    const p = record(emptyProgress(), 's1', [right('q3')], [q], pack([q]));
    expect(readSubSkill(p.subSkills['1.2.1/count_objects'])?.evidence[0]?.twoOptions).toBe(false);
  });

  it('leaves nothing for a question with no sub-skill, or one gone from the pack', () => {
    const shape = mcq('q5', 3);
    const gone = mcq('q9', 3, AFTER);
    const p = record(emptyProgress(), 's1', [right('q5'), right('q9')], [shape, gone], pack([shape]));
    expect(p.subSkills).toEqual({});
  });

  it('marks a missed first attempt as asked about and wrong, without banking it', () => {
    const q = mcq('q1', 3, AFTER);
    const p = record(emptyProgress(), 's1', [secondTry('q1')], [q], pack([q]));
    expect(p.subSkills[AFTER]).toEqual({ evidence: [], latestWasWrong: true, masteredOnce: false });
    expect(skillState(skillInput(p, AFTER)).status).toBe('evaluating');
  });

  it('takes latestWasWrong from the last question the run asked for that sub-skill', () => {
    const qs = [mcq('q1', 3, AFTER), mcq('q2', 3, AFTER)];
    const rightLast = record(emptyProgress(), 's1', [secondTry('q1'), right('q2')], qs, pack(qs));
    const wrongLast = record(emptyProgress(), 's1', [right('q2'), secondTry('q1')], qs, pack(qs));
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
    const once = record(emptyProgress(), 's1', answers, qs, pack(qs));
    expect(record(once, 's1', answers, qs, pack(qs))).toEqual(once);
  });

  it('banks the same question again from a different run', () => {
    const q = mcq('q1', 3, AFTER);
    const s1 = record(emptyProgress(), 's1', [right('q1')], [q], pack([q]));
    const s2 = record(s1, 's2', [right('q1')], [q], pack([q]));
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
    const p = record(before, 's1', [right('q1')], [q], pack([q]));
    expect(p.subSkills['7.2.1/name_triangle']).toBe(kept);
    expect(p.subSkills['x/unreadable']).toBe('not an entry');
  });

  it('carries fields it does not know about, so a later one is an addition', () => {
    const before = { subSkills: {}, levels: { 'math-y1-nombor-100': 2 } } as Progress;
    const q = mcq('q1', 3, AFTER);
    expect(record(before, 's1', [right('q1')], [q], pack([q]))).toMatchObject({
      levels: { 'math-y1-nombor-100': 2 },
    });
  });

  it('replaces an unreadable entry for a sub-skill the run did touch', () => {
    const q = mcq('q1', 3, AFTER);
    const p = record({ subSkills: { [AFTER]: 42 } }, 's1', [right('q1')], [q], pack([q]));
    expect(readSubSkill(p.subSkills[AFTER])?.evidence).toHaveLength(1);
  });

  it('does not change the progress it was given', () => {
    const q = mcq('q1', 3, AFTER);
    const before = record(emptyProgress(), 's1', [right('q1')], [q], pack([q]));
    const snapshot = structuredClone(before);
    record(before, 's2', [secondTry('q1')], [q], pack([q]));
    expect(before).toEqual(snapshot);
  });

  /*
    The whole chain, end to end: three three-option questions across two runs
    meet the bar, and a later miss drops the status without erasing that it was
    met (SPEC 5.7, masteredOnce).
  */
  it('keeps masteredOnce after a later miss drops the status', () => {
    const qs = [mcq('q1', 3, AFTER), mcq('q2', 3, AFTER), mcq('q3', 3, AFTER)];
    const s1 = record(emptyProgress(), 's1', [right('q1'), right('q2')], qs, pack(qs));
    expect(skillState(skillInput(s1, AFTER))).toEqual({ status: 'evaluating', masteredOnce: false });

    const s2 = record(s1, 's2', [right('q3')], qs, pack(qs));
    expect(skillState(skillInput(s2, AFTER))).toEqual({ status: 'mastered', masteredOnce: true });

    const s3 = record(s2, 's3', [secondTry('q1')], qs, pack(qs));
    expect(skillState(skillInput(s3, AFTER))).toEqual({ status: 'evaluating', masteredOnce: true });
    expect(readSubSkill(s3.subSkills[AFTER])?.masteredOnce).toBe(true);
  });
});

describe('pack state', () => {
  const q = mcq('q1', 3, AFTER);
  const live = pack([q]);

  it('reads a pack never played as a first run at level 1', () => {
    expect(packProgress(emptyProgress(), TOPIC)).toEqual({
      level: 1,
      runs: 0,
      lastSessionId: null,
      lastAsked: {},
      timesAsked: {},
    });
  });

  it('climbs a rung on a run of 0.90 or better, and counts the run', () => {
    const p = record(emptyProgress(), 's1', [right('q1')], [q], live);
    expect(packProgress(p, TOPIC)).toEqual({
      level: 2,
      runs: 1,
      lastSessionId: 's1',
      lastAsked: { q1: 1 },
      timesAsked: { q1: 1 },
    });
  });

  const atLevelTwo: Progress = {
    subSkills: {},
    packs: { [TOPIC]: { level: 2, runs: 3, lastSessionId: 's0', lastAsked: {} } },
  };

  /*
    `lastAsked` says when, `timesAsked` says how often, and the selector needs
    the second: every question in a run carries the same `lastAsked`, so after
    the never-asked ones are gone it ties and pack order decided the rest
    (PRD 16 item 38). The count has to survive across runs to be worth anything.
  */
  it('counts how many runs a question has been in, run after run', () => {
    const q2 = mcq('q2', 3, AFTER);
    const both = pack([q, q2]);
    const first = record(emptyProgress(), 's1', [right('q1'), right('q2')], [q, q2], both);
    const second = record(first, 's2', [right('q1')], [q], both);
    expect(packProgress(second, TOPIC).timesAsked).toEqual({ q1: 2, q2: 1 });
    // and the date still says only when, so the two do not say the same thing
    expect(packProgress(second, TOPIC).lastAsked).toEqual({ q1: 2, q2: 1 });
  });

  /*
    A store written before this field exists reads as no counts at all, which is
    one run where every question looks never-asked. Written down rather than
    hidden: SPEC 6.
  */
  it('reads a store written without the count as no counts', () => {
    const old: Progress = {
      subSkills: {},
      packs: { [TOPIC]: { level: 2, runs: 3, lastSessionId: 's0', lastAsked: { q1: 3 } } },
    };
    expect(packProgress(old, TOPIC).timesAsked).toEqual({});
    expect(packProgress(old, TOPIC).lastAsked).toEqual({ q1: 3 });
  });

  it('drops count entries it cannot read, and keeps the rest', () => {
    const messy: Progress = {
      subSkills: {},
      packs: {
        [TOPIC]: {
          level: 1,
          runs: 1,
          lastSessionId: 's0',
          lastAsked: {},
          timesAsked: { q1: 2, q2: 'lots', q3: -1, q4: 1.5, q5: 0 },
        },
      },
    };
    expect(packProgress(messy, TOPIC).timesAsked).toEqual({ q1: 2, q5: 0 });
  });

  it('drops a rung below 0.55, which a run of missed questions is', () => {
    const p = record(atLevelTwo, 's1', [missed('q1')], [q], live);
    expect(packProgress(p, TOPIC).level).toBe(1);
  });

  /*
    A second-attempt answer scores 60 of 100 (SPEC 5.1), so a run of them is
    0.60 accuracy: above the 0.55 floor and below the 0.90 step, which is the
    hold band. It is neither a promotion nor a demotion, and it should not be
    mistaken for one.
  */
  it('holds the rung on a run of second-attempt answers', () => {
    const p = record(atLevelTwo, 's1', [secondTry('q1')], [q], live);
    expect(packProgress(p, TOPIC).level).toBe(2);
  });

  it('never drops below the first rung', () => {
    const p = record(emptyProgress(), 's1', [missed('q1')], [q], live);
    expect(packProgress(p, TOPIC).level).toBe(1);
  });

  /*
    A practice question is not part of the ladder. A missed practice puzzle
    beside a right answer is a run of 1.0, not 0.5: the child climbs, and is not
    pushed down for something the ladder was never calibrated on.
  */
  const practice: Question = { ...mcq('p1', 3), noEvidence: 'practice' };

  it('moves the rung on scored answers only', () => {
    const p = record(emptyProgress(), 's1', [right('q1'), missed('p1')], [q, practice], pack([q, practice]));
    expect(packProgress(p, TOPIC).level).toBe(2);
    expect(packProgress(p, TOPIC).lastAsked).toEqual({ q1: 1, p1: 1 });
  });

  it('holds the rung on a run with nothing scored', () => {
    const p = record(atLevelTwo, 's1', [missed('p1')], [practice], pack([practice]));
    expect(packProgress(p, TOPIC).level).toBe(2);
    expect(packProgress(p, TOPIC).runs).toBe(4);
  });

  it('banks no evidence from a practice question', () => {
    const p = record(emptyProgress(), 's1', [right('p1')], [practice], pack([practice]));
    expect(p.subSkills).toEqual({});
  });

  /*
    lastAsked stamps every answer, not only the ones that became evidence: it
    answers "when did the child last see this", which is what stops the selector
    asking the same ten in the same order for ever.
  */
  it('stamps every question the run asked, evidence or not', () => {
    const missed = mcq('q2', 3, AFTER);
    const p = record(emptyProgress(), 's1', [right('q1'), secondTry('q2')], [q, missed], pack([q, missed]));
    expect(packProgress(p, TOPIC).lastAsked).toEqual({ q1: 1, q2: 1 });
  });

  it('does not climb twice when the same run is banked twice', () => {
    const once = record(emptyProgress(), 's1', [right('q1')], [q], live);
    expect(record(once, 's1', [right('q1')], [q], live)).toEqual(once);
  });

  it('keeps each pack apart', () => {
    const first = record(emptyProgress(), 's1', [right('q1')], [q], live);
    const both = record(first, 's2', [right('q1')], [q], live, 'math-y1-ruang');
    expect(packProgress(both, TOPIC).runs).toBe(1);
    expect(packProgress(both, 'math-y1-ruang').runs).toBe(1);
  });

  it('reads a pack entry it cannot understand as a first run', () => {
    for (const entry of [null, 42, 'x', {}, { level: 4, runs: 1 }, { level: 2, runs: -1 }]) {
      expect(packProgress({ subSkills: {}, packs: { [TOPIC]: entry } }, TOPIC).level).toBe(1);
    }
  });

  it('keeps the readable half of a lastAsked map', () => {
    const stored = { level: 2, runs: 2, lastSessionId: 's0', lastAsked: { q1: 2, q2: 'soon' } };
    expect(packProgress({ subSkills: {}, packs: { [TOPIC]: stored } }, TOPIC).lastAsked).toEqual({
      q1: 2,
    });
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
