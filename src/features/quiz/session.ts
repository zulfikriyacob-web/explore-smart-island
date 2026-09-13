/**
 * Quiz session engine (SPEC section 4).
 *
 * A pure reducer: no React, no clock, no I/O. Wall-clock time enters only as a
 * `nowMs` field on the events that need it, so the whole engine is testable
 * without faking timers, and msSpent stays analytics-only — it never reaches a
 * scoring formula.
 */

import type { Question } from '../../content/schema.ts';
import {
  MAX_ATTEMPTS,
  summarise,
  type AnswerRecord,
  type SessionResult,
} from '../../lib/scoring.ts';

export type SessionStatus = 'loading' | 'intro' | 'question' | 'feedback' | 'summary';

/** What the child sent back, shaped per question type. (SPEC 3.4) */
export type Response =
  | { kind: 'option'; optionId: string }
  | { kind: 'count'; value: number };

export interface SessionState {
  activityId: string;
  /** Already shuffled by the caller if the question asked for it. (SPEC 4.3) */
  questions: readonly Question[];
  index: number;
  answers: readonly AnswerRecord[];
  status: SessionStatus;

  /** Attempts spent on the current question, 0-3. */
  attempts: number;
  /**
   * Is the hint on screen? It appears on its own after a first wrong answer and
   * costs nothing — there is no button to ask for one. Recorded for analytics,
   * never for scoring. (SPEC 4.2)
   */
  hintShown: boolean;
  /** Options struck out so far on this question. (SPEC 4.2) */
  disabledOptionIds: readonly string[];
  /** Outcome of the most recent attempt; null before the first one. */
  lastAnswerCorrect: boolean | null;
  /** Set after three failed attempts: show the answer and `explain`. */
  revealed: boolean;
  /** When the current question was first shown, for msSpent. */
  questionStartedMs: number | null;
  result: SessionResult | null;
  isFirstClear: boolean;
}

export type SessionEvent =
  | { type: 'LOADED'; questions: readonly Question[] }
  | { type: 'START'; nowMs: number }
  | { type: 'ANSWER'; response: Response; nowMs: number }
  | { type: 'NEXT'; nowMs: number };

export function createSession(activityId: string, isFirstClear = true): SessionState {
  return {
    activityId,
    questions: [],
    index: 0,
    answers: [],
    status: 'loading',
    attempts: 0,
    hintShown: false,
    disabledOptionIds: [],
    lastAnswerCorrect: null,
    revealed: false,
    questionStartedMs: null,
    result: null,
    isFirstClear,
  };
}

export function currentQuestion(s: SessionState): Question | null {
  return s.questions[s.index] ?? null;
}

/** Is this response correct? (SPEC 3.4) */
export function checkAnswer(question: Question, response: Response): boolean {
  switch (question.type) {
    case 'mcq':
    case 'mcq-image':
      if (response.kind !== 'option') {
        throw new TypeError(`question ${question.id} (${question.type}) expects an option response`);
      }
      return response.optionId === question.payload.correctOptionId;

    case 'count-tap':
      if (response.kind !== 'count') {
        throw new TypeError(`question ${question.id} (count-tap) expects a count response`);
      }
      return response.value === question.payload.correctAnswer;
  }
}

/**
 * Wrong answers the child can still give on this question.
 *
 * Two limits, and whichever runs out first ends the question. Every question
 * has MAX_ATTEMPTS. An option question also strikes out each wrong option it
 * is given, and a struck-out option cannot be pressed again — so once only the
 * right option is left the child can no longer be wrong, whatever attempts
 * remain. That is when the answer and `explain` are shown (SPEC 4.2): after
 * the second miss on three options, after the first on two, on the third on a
 * count-tap.
 *
 * `explain` is the message for "you cannot get this wrong any more", not a
 * third-attempt message. Tied to the third attempt it was unreachable on every
 * mcq, because mcq has at most three options.
 */
export function missesLeft(
  question: Question,
  attempts: number,
  disabledOptionIds: readonly string[],
): number {
  const byAttempts = MAX_ATTEMPTS - attempts;
  if (question.type === 'count-tap') return Math.max(0, byAttempts);
  const wrongOptionsLeft = question.payload.options.filter(
    (o) => o.id !== question.payload.correctOptionId && !disabledOptionIds.includes(o.id),
  ).length;
  return Math.max(0, Math.min(byAttempts, wrongOptionsLeft));
}

function beginQuestion(s: SessionState, nowMs: number): SessionState {
  return {
    ...s,
    status: 'question',
    attempts: 0,
    hintShown: false,
    disabledOptionIds: [],
    lastAnswerCorrect: null,
    revealed: false,
    questionStartedMs: nowMs,
  };
}

function finish(s: SessionState): SessionState {
  return {
    ...s,
    status: 'summary',
    result: summarise(s.answers, s.isFirstClear),
    questionStartedMs: null,
  };
}

/**
 * Progress is never blocked: whatever happens, the child can always reach the
 * summary screen. (SPEC 4.2)
 *
 * Unknown or out-of-order events return the state unchanged rather than
 * throwing — a stray tap must not be able to crash a session mid-activity.
 */
export function sessionReducer(state: SessionState, event: SessionEvent): SessionState {
  switch (event.type) {
    case 'LOADED':
      if (state.status !== 'loading') return state;
      if (event.questions.length === 0) return state;
      return { ...state, questions: event.questions, status: 'intro' };

    case 'START':
      if (state.status !== 'intro') return state;
      return beginQuestion(state, event.nowMs);

    case 'ANSWER': {
      if (state.status !== 'question') return state;
      const question = currentQuestion(state);
      if (question === null) return state;

      const correct = checkAnswer(question, event.response);
      const attempts = state.attempts + 1;

      if (correct) {
        const record: AnswerRecord = {
          questionId: question.id,
          attempts,
          correct: true,
          firstTry: attempts === 1,
          hintShown: state.hintShown,
          msSpent: elapsed(state, event.nowMs),
        };
        return {
          ...state,
          status: 'feedback',
          attempts,
          answers: [...state.answers, record],
          lastAnswerCorrect: true,
        };
      }

      // Wrong. Strike out the option just used, so the choice narrows.
      const disabled =
        event.response.kind === 'option' &&
        !state.disabledOptionIds.includes(event.response.optionId)
          ? [...state.disabledOptionIds, event.response.optionId]
          : state.disabledOptionIds;

      if (missesLeft(question, attempts, disabled) === 0) {
        // The child can no longer get this wrong: a third miss, or a miss that
        // leaves only the right option. Show the answer and `explain`, record 0,
        // carry on. No other penalty. (SPEC 4.2)
        const record: AnswerRecord = {
          questionId: question.id,
          attempts,
          correct: false,
          firstTry: false,
          // Only a miss that left the question open put the hint on screen. On
          // two options the first miss reveals, and no hint was ever shown.
          hintShown: state.hintShown,
          msSpent: elapsed(state, event.nowMs),
        };
        return {
          ...state,
          status: 'feedback',
          attempts,
          answers: [...state.answers, record],
          disabledOptionIds: disabled,
          lastAnswerCorrect: false,
          revealed: true,
        };
      }

      // A miss that leaves the question open: shake, surface the hint.
      return {
        ...state,
        status: 'question',
        attempts,
        disabledOptionIds: disabled,
        lastAnswerCorrect: false,
        hintShown: true,
      };
    }

    case 'NEXT': {
      if (state.status !== 'feedback') return state;
      const nextIndex = state.index + 1;
      if (nextIndex >= state.questions.length) return finish(state);
      return beginQuestion({ ...state, index: nextIndex }, event.nowMs);
    }
  }
}

function elapsed(s: SessionState, nowMs: number): number {
  if (s.questionStartedMs === null) return 0;
  return Math.max(0, nowMs - s.questionStartedMs);
}
