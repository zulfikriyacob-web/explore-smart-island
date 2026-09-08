import { describe, expect, it } from 'vitest';

import type { Question } from '../../content/schema.ts';
import type { SessionResult } from '../../lib/scoring.ts';
import { currentQuestion, type Response } from './session.ts';
import { useQuizStore } from './store.ts';

/**
 * The reducer already proves a replay pays less when it is told the run is a
 * replay (session.test.ts). What it cannot prove is that anything ever tells
 * it so — and for a while nothing did: restart() built every run as a first
 * clear, so the bonus was paid again on every replay. That gap only shows at
 * the store, which is why this test drives the store rather than the reducer.
 */

/** The right answer for any question type in scope. (SPEC 3.4) */
function correctResponse(question: Question): Response {
  switch (question.type) {
    case 'mcq':
    case 'mcq-image':
      return { kind: 'option', optionId: question.payload.correctOptionId };
    case 'count-tap':
      return { kind: 'count', value: question.payload.correctAnswer };
  }
}

/** Play the activity to its summary, every question right first time. */
function playThrough(): SessionResult {
  const { answer, next } = useQuizStore.getState();
  // Bounded rather than `while (true)`: if a change ever stops a session
  // reaching its summary, this should fail with a message instead of hanging.
  for (let step = 0; step < 100; step++) {
    const session = useQuizStore.getState().session;
    if (session.status === 'summary' && session.result) return session.result;

    const question = currentQuestion(session);
    if (!question) throw new Error(`no question at index ${session.index}`);
    answer(correctResponse(question));
    next();
  }
  throw new Error('the activity never reached its summary');
}

describe('quiz store', () => {
  it('pays a replay fewer gems than the first clear, for the same answers', () => {
    // One test rather than three: the store is a module singleton, so a test
    // that restarts it changes what any test after it would see.
    expect(useQuizStore.getState().session.isFirstClear).toBe(true);
    const first = playThrough();

    useQuizStore.getState().restart();
    const replay = playThrough();

    // Identical answers, so identical stars: replaying never costs a child
    // anything. Only the first-clear bonus separates the two.
    expect(replay.stars).toBe(first.stars);
    expect(replay.accuracy).toBe(first.accuracy);
    expect(replay.gems).toBeLessThan(first.gems);

    // Asserted after the payout, not before it: the payout is the rule, and a
    // test that trips on the flag first would report the cause while leaving
    // the effect unproven.
    expect(useQuizStore.getState().session.isFirstClear).toBe(false);
  });
});
