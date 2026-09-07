import { describe, expect, it } from 'vitest';

import {
  HINT_PENALTY,
  POINTS_BY_ATTEMPT,
  accuracy,
  bestStars,
  gemsFor,
  scoreQuestion,
  starsFor,
  summarise,
  type AnswerRecord,
  type Stars,
} from './scoring.ts';

function answer(over: Partial<AnswerRecord> = {}): AnswerRecord {
  return {
    questionId: 'q001',
    attempts: 1,
    correct: true,
    firstTry: true,
    hintUsed: false,
    msSpent: 4_200,
    ...over,
  };
}

describe('scoreQuestion', () => {
  it('pays full marks for a clean first attempt', () => {
    expect(scoreQuestion(answer({ attempts: 1 }))).toBe(100);
  });

  it('pays less for each further attempt', () => {
    expect(scoreQuestion(answer({ attempts: 2, firstTry: false }))).toBe(60);
    expect(scoreQuestion(answer({ attempts: 3, firstTry: false }))).toBe(30);
  });

  it('matches the published points table', () => {
    expect(POINTS_BY_ATTEMPT).toEqual({ 1: 100, 2: 60, 3: 30 });
  });

  it('subtracts the hint penalty once, at every attempt level', () => {
    expect(scoreQuestion(answer({ attempts: 1, hintUsed: true }))).toBe(100 - HINT_PENALTY);
    expect(scoreQuestion(answer({ attempts: 2, hintUsed: true }))).toBe(60 - HINT_PENALTY);
    expect(scoreQuestion(answer({ attempts: 3, hintUsed: true }))).toBe(30 - HINT_PENALTY);
  });

  it('never goes below zero', () => {
    expect(scoreQuestion(answer({ attempts: 3, hintUsed: true }))).toBeGreaterThanOrEqual(0);
  });

  it('scores a wrong answer as zero whatever else happened', () => {
    expect(scoreQuestion(answer({ correct: false, attempts: 3, firstTry: false }))).toBe(0);
    expect(
      scoreQuestion(answer({ correct: false, attempts: 3, firstTry: false, hintUsed: true })),
    ).toBe(0);
  });

  it('does not validate attempts on a wrong answer, which is never scored', () => {
    expect(scoreQuestion(answer({ correct: false, attempts: 0, firstTry: false }))).toBe(0);
  });

  it('throws rather than returning NaN for an out-of-range attempt count', () => {
    expect(() => scoreQuestion(answer({ attempts: 0 }))).toThrow(RangeError);
    expect(() => scoreQuestion(answer({ attempts: 4 }))).toThrow(RangeError);
    expect(() => scoreQuestion(answer({ attempts: 1.5 }))).toThrow(RangeError);
  });
});

describe('accuracy', () => {
  it('is 0 for an empty session rather than NaN', () => {
    expect(accuracy([])).toBe(0);
  });

  it('is 1 when every question is right first time without a hint', () => {
    const answers = ['q1', 'q2', 'q3'].map((questionId) => answer({ questionId }));
    expect(accuracy(answers)).toBe(1);
  });

  it('is 0 when every question is wrong', () => {
    const answers = ['q1', 'q2'].map((questionId) =>
      answer({ questionId, correct: false, firstTry: false, attempts: 3 }),
    );
    expect(accuracy(answers)).toBe(0);
  });

  it('measures first-attempt quality, not eventual success', () => {
    // Both children finish every question; the one who needed three goes each
    // time must not score the same as the one who got them all first time.
    const clean = ['q1', 'q2'].map((questionId) => answer({ questionId }));
    const laboured = ['q1', 'q2'].map((questionId) =>
      answer({ questionId, attempts: 3, firstTry: false }),
    );
    expect(accuracy(clean)).toBe(1);
    expect(accuracy(laboured)).toBeCloseTo(0.3, 10);
    expect(accuracy(laboured)).toBeLessThan(accuracy(clean));
  });

  it('averages a mixed session', () => {
    const answers = [
      answer({ questionId: 'q1', attempts: 1 }), // 100
      answer({ questionId: 'q2', attempts: 2, firstTry: false }), // 60
      answer({ questionId: 'q3', correct: false, firstTry: false, attempts: 3 }), // 0
      answer({ questionId: 'q4', attempts: 1, hintUsed: true }), // 90
    ];
    expect(accuracy(answers)).toBeCloseTo(250 / 400, 10);
  });
});

describe('starsFor', () => {
  it('awards three stars from 95%', () => {
    expect(starsFor(1)).toBe(3);
    expect(starsFor(0.95)).toBe(3);
  });

  it('awards two stars from 80% up to just under 95%', () => {
    expect(starsFor(0.9499)).toBe(2);
    expect(starsFor(0.8)).toBe(2);
  });

  it('awards one star from 60% up to just under 80%', () => {
    expect(starsFor(0.7999)).toBe(1);
    expect(starsFor(0.6)).toBe(1);
  });

  it('awards none below 60%', () => {
    expect(starsFor(0.5999)).toBe(0);
    expect(starsFor(0)).toBe(0);
  });
});

describe('bestStars', () => {
  it('keeps the all-time best so a replay can never cost stars', () => {
    expect(bestStars(3, 0)).toBe(3);
    expect(bestStars(1, 2)).toBe(2);
    expect(bestStars(0, 0)).toBe(0);
  });
});

describe('gemsFor', () => {
  it('pays by stars, with a first-clear bonus', () => {
    const levels: Stars[] = [0, 1, 2, 3];
    expect(levels.map((s) => gemsFor(s, true))).toEqual([10, 15, 20, 30]);
    expect(levels.map((s) => gemsFor(s, false))).toEqual([0, 5, 10, 20]);
  });

  it('always pays a replay less than the first clear', () => {
    const levels: Stars[] = [0, 1, 2, 3];
    for (const s of levels) {
      expect(gemsFor(s, false)).toBeLessThan(gemsFor(s, true));
    }
  });
});

describe('summarise', () => {
  it('rolls a session up into the summary screen numbers', () => {
    const answers = [
      answer({ questionId: 'q1' }),
      answer({ questionId: 'q2' }),
      answer({ questionId: 'q3', attempts: 2, firstTry: false }),
    ];
    expect(summarise(answers, true)).toEqual({
      accuracy: 260 / 300,
      stars: 2,
      gems: 20,
      points: 260,
      firstTryCount: 2,
    });
  });

  it('handles a session with no answers', () => {
    expect(summarise([], false)).toEqual({
      accuracy: 0,
      stars: 0,
      gems: 0,
      points: 0,
      firstTryCount: 0,
    });
  });
});
