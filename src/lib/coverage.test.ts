import { describe, expect, it } from 'vitest';

import {
  EVIDENCE_FOR_MASTERY,
  GUESS_ODDS_FOR_MASTERY,
  SESSIONS_FOR_MASTERY,
  guessOdds,
  skillState,
  standardCoverage,
  type Evidence,
  type SubSkillState,
} from './coverage.ts';

/** n distinct questions, spread across `sessions` sittings. */
function evidence(n: number, sessions = n, twoOptions = false, first = 1): Evidence[] {
  return Array.from({ length: n }, (_, i) => ({
    questionId: `q${first + i}`,
    sessionId: `s${(i % sessions) + 1}`,
    twoOptions,
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
      { questionId: 'q1', sessionId: 's1', twoOptions: false },
      { questionId: 'q1', sessionId: 's2', twoOptions: false },
      { questionId: 'q1', sessionId: 's3', twoOptions: false },
    ];
    expect(skillState({ attempted: true, evidence: repeated }).status).toBe('evaluating');
  });

  /*
    The guess ceiling, from the teacher's record: blind guessing every distinct
    question right must happen at most 4% of the time. A two-option guess is
    right one time in two. There is no "four two-option questions" rule; four
    of them are 1/16, 6.25%, and stay under the bar. The rule reads the evidence
    the child actually gave, never the item bank.
  */
  it('stays evaluating on three two-option questions (1/8)', () => {
    expect(skillState({ attempted: true, evidence: evidence(3, 2, true) }).status).toBe('evaluating');
  });

  it('stays evaluating on four two-option questions (1/16)', () => {
    expect(skillState({ attempted: true, evidence: evidence(4, 2, true) }).status).toBe('evaluating');
  });

  it('is mastered on five two-option questions across two sessions (1/32)', () => {
    expect(skillState({ attempted: true, evidence: evidence(5, 2, true) }).status).toBe('mastered');
  });

  it('does not let a two-option answer stand in for the third of three (1/18)', () => {
    const mixed = [...evidence(2, 2), ...evidence(1, 1, true, 3)];
    expect(skillState({ attempted: true, evidence: mixed }).status).toBe('evaluating');
  });

  it('stays evaluating on three two-option and one three-option question (1/24)', () => {
    const mixed = [...evidence(1, 1), ...evidence(3, 2, true, 2)];
    expect(skillState({ attempted: true, evidence: mixed }).status).toBe('evaluating');
  });

  it('is mastered on two two-option and two three-option questions (1/36)', () => {
    const mixed = [...evidence(2, 2), ...evidence(2, 2, true, 3)];
    expect(skillState({ attempted: true, evidence: mixed }).status).toBe('mastered');
  });

  /*
    Odds are per question. The same three-option question answered right in two
    sittings is one guess, not two: counted twice, q1 would lift 1/12 to 1/36.
  */
  it('takes the odds of a repeated question once', () => {
    const repeated: Evidence[] = [
      { questionId: 'q1', sessionId: 's1', twoOptions: false },
      { questionId: 'q1', sessionId: 's2', twoOptions: false },
      { questionId: 'q2', sessionId: 's1', twoOptions: true },
      { questionId: 'q3', sessionId: 's2', twoOptions: true },
    ];
    expect(skillState({ attempted: true, evidence: repeated }).status).toBe('evaluating');
  });

  /*
    A question recorded once with two options and once with three is costed as
    two. Costed as three, this would be 1/27 and mastered.
  */
  it('costs a question as two options if any of its evidence says so', () => {
    const conflicting: Evidence[] = [
      { questionId: 'q1', sessionId: 's1', twoOptions: true },
      { questionId: 'q1', sessionId: 's2', twoOptions: false },
      { questionId: 'q2', sessionId: 's1', twoOptions: false },
      { questionId: 'q3', sessionId: 's2', twoOptions: false },
    ];
    expect(skillState({ attempted: true, evidence: conflicting }).status).toBe('evaluating');
  });

  /*
    Three three-option answers are the bar on their own; a two-option answer the
    child also gave does not raise it.
  */
  it('is mastered on three three-option questions even beside a two-option one', () => {
    const mixed = [...evidence(3, 2), ...evidence(1, 1, true, 4)];
    expect(skillState({ attempted: true, evidence: mixed }).status).toBe('mastered');
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
    expect(GUESS_ODDS_FOR_MASTERY).toBe(25);
    expect(SESSIONS_FOR_MASTERY).toBe(2);
  });
});

describe('guess odds', () => {
  it('multiplies two for a two-option question and three otherwise', () => {
    expect(guessOdds([])).toBe(1);
    expect(guessOdds([false, false, false])).toBe(27);
    expect(guessOdds([true, true, true, true])).toBe(16);
    expect(guessOdds([false, false, true])).toBe(18);
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
