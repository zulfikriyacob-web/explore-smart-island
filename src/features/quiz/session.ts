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
  | { kind: 'count'; value: number }
  | { kind: 'placements'; placements: Readonly<Record<string, string>> };

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
   * True only when the child asked for the hint. The hint also appears on its
   * own after a first wrong answer (SPEC 4.2) — that automatic appearance sets
   * `hintVisible` but NOT `hintUsed`, so a second-attempt answer is not
   * penalised twice for the same mistake. See POINTS_BY_ATTEMPT in SPEC 5.1.
   */
  hintUsed: boolean;
  hintVisible: boolean;
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
  | { type: 'REQUEST_HINT' }
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
    hintUsed: false,
    hintVisible: false,
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

/**
 * Is this response correct? A multi-item drag-bucket question scores as ONE:
 * correct means every item landed in the right bucket. (SPEC 3.4)
 */
export function checkAnswer(question: Question, response: Response): boolean {
  switch (question.type) {
    case 'mcq':
    case 'mcq-image':
    case 'listen-choose':
      if (response.kind !== 'option') {
        throw new TypeError(`question ${question.id} (${question.type}) expects an option response`);
      }
      return response.optionId === question.payload.correctOptionId;

    case 'count-tap':
      if (response.kind !== 'count') {
        throw new TypeError(`question ${question.id} (count-tap) expects a count response`);
      }
      return response.value === question.payload.correctAnswer;

    case 'drag-bucket': {
      if (response.kind !== 'placements') {
        throw new TypeError(`question ${question.id} (drag-bucket) expects a placements response`);
      }
      const placed = response.placements;
      return question.payload.items.every((item) => placed[item.id] === item.bucketId);
    }
  }
}

function beginQuestion(s: SessionState, nowMs: number): SessionState {
  return {
    ...s,
    status: 'question',
    attempts: 0,
    hintUsed: false,
    hintVisible: false,
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

    case 'REQUEST_HINT':
      if (state.status !== 'question') return state;
      if (state.hintUsed) return state;
      return { ...state, hintUsed: true, hintVisible: true };

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
          hintUsed: state.hintUsed,
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

      if (attempts >= MAX_ATTEMPTS) {
        // Third miss: show the answer and `explain`, record 0, carry on. No
        // other penalty. (SPEC 4.2)
        const record: AnswerRecord = {
          questionId: question.id,
          attempts,
          correct: false,
          firstTry: false,
          hintUsed: state.hintUsed,
          msSpent: elapsed(state, event.nowMs),
        };
        return {
          ...state,
          status: 'feedback',
          attempts,
          answers: [...state.answers, record],
          disabledOptionIds: disabled,
          lastAnswerCorrect: false,
          hintVisible: true,
          revealed: true,
        };
      }

      // First or second miss: shake, surface the hint, keep the question open.
      return {
        ...state,
        status: 'question',
        attempts,
        disabledOptionIds: disabled,
        lastAnswerCorrect: false,
        hintVisible: true,
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
