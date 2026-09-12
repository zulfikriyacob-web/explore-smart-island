import { describe, expect, it } from 'vitest';

import {
  EVIDENCE_FOR_MASTERY,
  SESSIONS_FOR_MASTERY,
  skillLabel,
  skillLabelFor,
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

describe('sub-skill labels', () => {
  it('is not-tried when the app has never asked', () => {
    expect(skillLabelFor(false, [])).toBe('not-tried');
  });

  /*
    The distinction the dashboard depends on: "we never asked" is a statement
    about us, "attempted and nothing banked" is about the child. Collapsing
    them would let a thin pack read as a struggling child.
  */
  it('is learning when attempted with no first-attempt correct', () => {
    expect(skillLabelFor(true, [])).toBe('learning');
  });

  it('is almost on a single correct answer, never mastered', () => {
    expect(skillLabel(evidence(1))).toBe('almost');
  });

  it('is almost on two, one short of the bar', () => {
    expect(skillLabel(evidence(2))).toBe('almost');
  });

  it('is mastered on three distinct questions across two sessions', () => {
    expect(skillLabel(evidence(3))).toBe('mastered');
  });

  /*
    Three correct answers inside one sitting can rest on one moment of
    understanding, or on the reveal shown after a third attempt (SPEC 4.2).
  */
  it('is almost when all three land in one session', () => {
    expect(skillLabel(evidence(3, 1))).toBe('almost');
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
    expect(skillLabel(repeated)).toBe('almost');
  });

  it('drops back to almost when the most recent attempt was wrong', () => {
    expect(skillLabel(evidence(4), true)).toBe('almost');
  });

  it('hands banked evidence through, attempted or not', () => {
    expect(skillLabelFor(true, evidence(3))).toBe('mastered');
    expect(skillLabelFor(true, evidence(3), true)).toBe('almost');
  });

  it('states its own thresholds', () => {
    expect(EVIDENCE_FOR_MASTERY).toBe(3);
    expect(SESSIONS_FOR_MASTERY).toBe(2);
  });
});

describe('standard roll-up', () => {
  const sub = (id: string, label: SubSkillState['label']): SubSkillState => ({ id, label });

  it('is not-tried while no sub-skill has been asked', () => {
    const r = standardCoverage([sub('a', 'not-tried'), sub('b', 'not-tried')]);
    expect(r).toMatchObject({ tested: 0, total: 2, mastered: 0, coverage: 0, label: 'not-tried' });
  });

  /*
    This is the bug the whole module exists for. 1.6.1 has four sub-skills and
    the pack tests one of them; however well a child does on that one, the
    standard must not read "Dikuasai".
  */
  it('refuses mastered while any sub-skill is untested', () => {
    const r = standardCoverage([
      sub('1.6.1/digit_at_tens', 'mastered'),
      sub('1.6.1/digit_at_ones', 'not-tried'),
      sub('1.6.1/value_of_tens_digit', 'not-tried'),
      sub('1.6.1/value_of_ones_digit', 'not-tried'),
    ]);
    expect(r.label).toBe('almost');
    expect(r).toMatchObject({ tested: 1, total: 4, mastered: 1, coverage: 0.25 });
  });

  it('is mastered only when every sub-skill is', () => {
    expect(standardCoverage([sub('a', 'mastered'), sub('b', 'mastered')]).label).toBe('mastered');
  });

  it('is learning when a tested sub-skill is below mastered', () => {
    const r = standardCoverage([sub('a', 'mastered'), sub('b', 'almost'), sub('c', 'not-tried')]);
    expect(r.label).toBe('learning');
    expect(r).toMatchObject({ tested: 2, total: 3, mastered: 1 });
  });

  it('does not divide by zero on a standard with no sub-skills recorded', () => {
    expect(standardCoverage([])).toMatchObject({ tested: 0, total: 0, coverage: 0, label: 'not-tried' });
  });
});
