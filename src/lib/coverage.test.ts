import { describe, expect, it } from 'vitest';

import {
  EVIDENCE_FOR_MASTERY,
  SESSIONS_FOR_MASTERY,
  skillState,
  standardCoverage,
  type Evidence,
  type SubSkillState,
} from './coverage.ts';

/** n distinct questions, spread across `sessions` sittings. */
function evidence(n: number, sessions = n): Evidence[] {
  return Array.from({ length: n }, (_, i) => ({
    questionId: `q${i + 1}`,
    sessionId: `s${(i % sessions) + 1}`,
  }));
}

describe('sub-skill status', () => {
  /*
    "Not tested" is a statement about the app, not the child. Collapsing it into
    "evaluating" would let a thin pack read as a struggling child.
  */
  it('is not-tested when the app has never asked', () => {
    expect(skillState({ attempted: false, evidence: [] })).toEqual({
      status: 'not-tested',
      masteredOnce: false,
    });
  });

  it('is evaluating once asked, with nothing banked', () => {
    expect(skillState({ attempted: true, evidence: [] }).status).toBe('evaluating');
  });

  it('stays evaluating on one correct answer', () => {
    expect(skillState({ attempted: true, evidence: evidence(1) }).status).toBe('evaluating');
  });

  it('stays evaluating on two, one short of the bar', () => {
    expect(skillState({ attempted: true, evidence: evidence(2) }).status).toBe('evaluating');
  });

  /*
    The whole bar, as a teacher's marked review settled it: three distinct items,
    first attempt, across two sessions. Nothing about the form of the questions.
    A child who answers three direct questions correctly over two sittings has
    shown the skill; that we have not yet written a reverse one is our gap.
  */
  it('is mastered on three distinct questions across two sessions', () => {
    expect(skillState({ attempted: true, evidence: evidence(3) })).toEqual({
      status: 'mastered',
      masteredOnce: true,
    });
  });

  /*
    Three correct answers inside one sitting can rest on one moment of
    understanding, or on a revealed answer (SPEC 4.2).
  */
  it('stays evaluating when all three land in one session', () => {
    expect(skillState({ attempted: true, evidence: evidence(3, 1) }).status).toBe('evaluating');
  });

  /*
    The same question answered three times is one number memorised. Evidence is
    counted by distinct question, not by answer.
  */
  it('does not count the same question three times', () => {
    const repeated: Evidence[] = [
      { questionId: 'q1', sessionId: 's1' },
      { questionId: 'q1', sessionId: 's2' },
      { questionId: 'q1', sessionId: 's3' },
    ];
    expect(skillState({ attempted: true, evidence: repeated }).status).toBe('evaluating');
  });

  it('drops back to evaluating when the most recent attempt was wrong', () => {
    expect(skillState({ attempted: true, evidence: evidence(4), latestWasWrong: true }).status).toBe(
      'evaluating',
    );
  });

  /*
    The reason masteredOnce exists. A Year 1 child mis-taps, gets tired, rushes.
    Noticing the slip must not erase what came before it.
  */
  it('keeps masteredOnce when the status drops', () => {
    const dropped = skillState({
      attempted: true,
      evidence: evidence(4),
      latestWasWrong: true,
    });
    expect(dropped).toEqual({ status: 'evaluating', masteredOnce: true });
  });

  it('carries masteredOnce in from storage and never clears it', () => {
    const thin = skillState({ attempted: true, evidence: evidence(1), masteredOnce: true });
    expect(thin).toEqual({ status: 'evaluating', masteredOnce: true });

    const untouched = skillState({ attempted: false, evidence: [], masteredOnce: true });
    expect(untouched).toEqual({ status: 'not-tested', masteredOnce: true });
  });

  it('states its own thresholds', () => {
    expect(EVIDENCE_FOR_MASTERY).toBe(3);
    expect(SESSIONS_FOR_MASTERY).toBe(2);
  });
});

describe('standard roll-up', () => {
  const sub = (
    id: string,
    status: SubSkillState['status'],
    masteredOnce?: boolean,
  ): SubSkillState => ({ id, status, masteredOnce });

  it('is not-tested while no sub-skill has been asked', () => {
    const r = standardCoverage([sub('a', 'not-tested'), sub('b', 'not-tested')]);
    expect(r).toMatchObject({ tested: 0, total: 2, mastered: 0, coverage: 0, status: 'not-tested' });
    expect(r.untestedIds).toEqual(['a', 'b']);
  });

  /*
    The bug the whole module exists for. 1.6.1 has four sub-skills and the pack
    tests one; however well a child does on that one, the standard must not read
    "Dikuasai".
  */
  it('refuses mastered while any sub-skill is untested', () => {
    const r = standardCoverage([
      sub('1.6.1/digit_at_tens', 'mastered'),
      sub('1.6.1/digit_at_ones', 'not-tested'),
      sub('1.6.1/value_of_tens_digit', 'not-tested'),
      sub('1.6.1/value_of_ones_digit', 'not-tested'),
    ]);
    expect(r.status).toBe('evaluating');
    expect(r).toMatchObject({ tested: 1, total: 4, mastered: 1, coverage: 0.25 });
  });

  /*
    A ratio alone tells a parent too little: "1 of 4" plus the name of the one
    skill actually asked about is what the display shape in SPEC 5.7 needs.
  */
  it('names which sub-skills were tested and which were not', () => {
    const r = standardCoverage([
      sub('2.2.2/two_digit_plus_two_digit_no_bridge', 'mastered'),
      sub('2.2.2/two_digit_plus_one_digit_no_bridge', 'not-tested'),
      sub('2.2.2/two_digit_plus_two_digit_bridge', 'not-tested'),
    ]);
    expect(r.testedIds).toEqual(['2.2.2/two_digit_plus_two_digit_no_bridge']);
    expect(r.untestedIds).toEqual([
      '2.2.2/two_digit_plus_one_digit_no_bridge',
      '2.2.2/two_digit_plus_two_digit_bridge',
    ]);
  });

  it('is mastered only when every sub-skill is', () => {
    expect(standardCoverage([sub('a', 'mastered'), sub('b', 'mastered')]).status).toBe('mastered');
  });

  it('reports which tested sub-skills had banked the bar before slipping', () => {
    const r = standardCoverage([
      sub('a', 'mastered'),
      sub('b', 'evaluating', true),
      sub('c', 'evaluating', false),
      sub('d', 'not-tested'),
    ]);
    expect(r.slippedIds).toEqual(['b']);
    expect(r.status).toBe('evaluating');
  });

  it('does not divide by zero on a standard with no sub-skills recorded', () => {
    expect(standardCoverage([])).toMatchObject({
      tested: 0,
      total: 0,
      coverage: 0,
      status: 'not-tested',
    });
  });
});
