import { describe, expect, it } from 'vitest';

import type { Difficulty } from '../content/schema.ts';
import {
  ALPHA,
  DECAY_AFTER_DAYS,
  DECAY_STEP,
  daysBetween,
  decayMastery,
  masteryLabel,
  nextDifficulty,
  questionMix,
  updateMastery,
  updateStreak,
  type Streak,
} from './mastery.ts';

describe('updateMastery', () => {
  it('seeds from the first session', () => {
    expect(updateMastery(null, 0.72)).toBe(0.72);
  });

  it('gives a new session ALPHA of the weight', () => {
    expect(updateMastery(0.5, 1)).toBeCloseTo(0.5 + ALPHA * 0.5, 10);
    expect(updateMastery(0.8, 0.3)).toBeCloseTo(0.8 + ALPHA * (0.3 - 0.8), 10);
  });

  it('leaves a score alone when the session matches it', () => {
    expect(updateMastery(0.64, 0.64)).toBeCloseTo(0.64, 10);
  });

  it('moves toward the target but never past it in one step', () => {
    const next = updateMastery(0.2, 1);
    expect(next).toBeGreaterThan(0.2);
    expect(next).toBeLessThan(1);
  });
});

describe('masteryLabel', () => {
  it('reports a standard never practised as not-started', () => {
    expect(masteryLabel(null)).toBe('not-started');
  });

  it('reports mastered from 0.85 up', () => {
    expect(masteryLabel(0.85)).toBe('mastered');
    expect(masteryLabel(1)).toBe('mastered');
  });

  it('reports learning below 0.85', () => {
    expect(masteryLabel(0.8499)).toBe('learning');
    expect(masteryLabel(0)).toBe('learning');
  });
});

describe('decayMastery', () => {
  it('leaves an untouched standard alone before the cutoff', () => {
    expect(decayMastery(0.9, 0)).toBe(0.9);
    expect(decayMastery(0.9, DECAY_AFTER_DAYS - 1)).toBe(0.9);
  });

  it('drops the score once at the cutoff', () => {
    expect(decayMastery(0.9, DECAY_AFTER_DAYS)).toBeCloseTo(0.9 - DECAY_STEP, 10);
    expect(decayMastery(0.9, 400)).toBeCloseTo(0.9 - DECAY_STEP, 10);
  });

  it('can pull a mastered standard back into learning, which is the point', () => {
    expect(masteryLabel(0.87)).toBe('mastered');
    expect(masteryLabel(decayMastery(0.87, 31))).toBe('learning');
  });

  it('floors at zero and passes null through', () => {
    expect(decayMastery(0.02, 31)).toBe(0);
    expect(decayMastery(null, 999)).toBeNull();
  });
});

describe('nextDifficulty', () => {
  it('steps up from 0.90 accuracy', () => {
    expect(nextDifficulty(1, 0.9)).toBe(2);
    expect(nextDifficulty(2, 1)).toBe(3);
  });

  it('steps down below 0.55 accuracy', () => {
    expect(nextDifficulty(3, 0.5499)).toBe(2);
    expect(nextDifficulty(2, 0)).toBe(1);
  });

  it('holds in the middle band', () => {
    expect(nextDifficulty(2, 0.55)).toBe(2);
    expect(nextDifficulty(2, 0.8999)).toBe(2);
  });

  it('clamps at both ends of the ladder', () => {
    expect(nextDifficulty(3, 1)).toBe(3);
    expect(nextDifficulty(1, 0)).toBe(1);
  });
});

describe('questionMix', () => {
  const levels: Difficulty[] = [1, 2, 3];

  it('splits 70/20/10 in the middle of the ladder', () => {
    expect(questionMix(2, 10)).toEqual({ 1: 2, 2: 7, 3: 1 });
  });

  it('folds the missing rung back into the current level at the boundaries', () => {
    expect(questionMix(1, 10)).toEqual({ 1: 9, 2: 1, 3: 0 });
    expect(questionMix(3, 10)).toEqual({ 1: 0, 2: 2, 3: 8 });
  });

  it('always sums to the requested total', () => {
    for (const d of levels) {
      for (const total of [1, 3, 7, 10, 13, 20]) {
        const mix = questionMix(d, total);
        expect(mix[1] + mix[2] + mix[3]).toBe(total);
      }
    }
  });

  it('never asks for a negative count', () => {
    for (const d of levels) {
      for (const total of [1, 2, 3, 10]) {
        const mix = questionMix(d, total);
        expect(Math.min(mix[1], mix[2], mix[3])).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('gives the current level the largest share', () => {
    for (const d of levels) {
      const mix = questionMix(d, 10);
      expect(mix[d]).toBeGreaterThanOrEqual(7);
    }
  });

  it('returns an empty mix for zero questions', () => {
    expect(questionMix(2, 0)).toEqual({ 1: 0, 2: 0, 3: 0 });
  });

  it('rejects a nonsense total', () => {
    expect(() => questionMix(2, -1)).toThrow(RangeError);
    expect(() => questionMix(2, 2.5)).toThrow(RangeError);
  });
});

describe('daysBetween', () => {
  it('counts whole days forward', () => {
    expect(daysBetween('2026-09-07', '2026-09-07')).toBe(0);
    expect(daysBetween('2026-09-07', '2026-09-08')).toBe(1);
    expect(daysBetween('2026-09-07', '2026-09-14')).toBe(7);
  });

  it('counts backwards as negative', () => {
    expect(daysBetween('2026-09-08', '2026-09-07')).toBe(-1);
  });

  it('crosses month and year boundaries', () => {
    expect(daysBetween('2026-01-31', '2026-02-01')).toBe(1);
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
  });

  it('crosses a leap day', () => {
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2);
  });

  it('rejects anything that is not an ISO calendar date', () => {
    expect(() => daysBetween('07-09-2026', '2026-09-08')).toThrow(RangeError);
    expect(() => daysBetween('2026-09-07T10:00:00Z', '2026-09-08')).toThrow(RangeError);
    expect(() => daysBetween('2026-02-30', '2026-03-01')).toThrow(RangeError);
  });
});

describe('updateStreak', () => {
  const base: Streak = { count: 4, lastActiveDate: '2026-09-07', freezes: 2 };

  it('does nothing twice in one day', () => {
    expect(updateStreak(base, '2026-09-07')).toBe(base);
  });

  it('extends on consecutive days', () => {
    expect(updateStreak(base, '2026-09-08')).toEqual({
      count: 5,
      lastActiveDate: '2026-09-08',
      freezes: 2,
    });
  });

  it('spends a freeze on a missed day and keeps the count', () => {
    expect(updateStreak(base, '2026-09-09')).toEqual({
      count: 4,
      lastActiveDate: '2026-09-09',
      freezes: 1,
    });
  });

  it('resets to 1 once the freezes are gone', () => {
    const noFreezes: Streak = { ...base, freezes: 0 };
    expect(updateStreak(noFreezes, '2026-09-12')).toEqual({
      count: 1,
      lastActiveDate: '2026-09-12',
      freezes: 0,
    });
  });

  it('never rewinds on a backwards clock', () => {
    expect(updateStreak(base, '2026-09-01')).toBe(base);
  });
});
