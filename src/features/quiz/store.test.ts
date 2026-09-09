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
  const { start, answer, next } = useQuizStore.getState();
  // A cold start waits at `intro` for the Mula tap (Brief 03). A replay does
  // not, so this is a no-op on the second run through — the reducer ignores
  // START unless the status is `intro`.
  start();
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
  /*
    The gate. A fresh run has to stop at `intro` and stay there until something
    taps, because that tap is the gesture iOS requires before any audio can play
    (SPEC 8). The store used to send START itself, which spent the gesture before
    the child ever made one — autoplay would then be refused for the whole run
    and nothing would say so.

    This runs first, before the play-through below restarts the store: the store
    is a module singleton, so the fresh-load state can only be observed once.
  */
  it('waits at intro until the start tap, rather than sending START itself', () => {
    const session = useQuizStore.getState().session;
    expect(session.status).toBe('intro');
    // Loaded and ready — it is waiting for a tap, not for content.
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.questionStartedMs).toBeNull();

    useQuizStore.getState().start();
    expect(useQuizStore.getState().session.status).toBe('question');
  });

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

  /*
    "Main lagi" goes straight into the first question.

    The start screen exists to collect the gesture that unlocks audio. By the
    time a child can press "Main lagi" that gesture has happened, so the screen
    has no job left — showing it again would be one more tap between a child who
    has just asked to play and playing. A cold start with nothing saved is the
    only thing it is for.
  */
  it('restarts straight into the first question, not back at the start screen', () => {
    useQuizStore.getState().restart();

    const session = useQuizStore.getState().session;
    expect(session.status).toBe('question');
    expect(session.index).toBe(0);
    expect(session.answers).toHaveLength(0);
    // Started for real, not merely loaded: the first question's clock is running.
    expect(session.questionStartedMs).not.toBeNull();
  });
});
