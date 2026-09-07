/**
 * Scoring (SPEC section 5).
 *
 * Pure functions only: no React, no I/O, no clock. Time never enters a formula
 * here — that is a product decision (PRD section 1), and scoring is where it
 * would be easiest to smuggle back in.
 */

/** One question's outcome, as recorded by the session engine. (SPEC 4.3) */
export interface AnswerRecord {
  questionId: string;
  /** 1-3. Attempts beyond 3 are impossible; the engine reveals the answer instead. */
  attempts: number;
  /** Did the child get there in the end? */
  correct: boolean;
  /** Correct on attempt 1? */
  firstTry: boolean;
  hintUsed: boolean;
  /** Logged for analytics, NOT scored. */
  msSpent: number;
}

export type Stars = 0 | 1 | 2 | 3;

export const POINTS_BY_ATTEMPT = { 1: 100, 2: 60, 3: 30 } as const;
export const HINT_PENALTY = 10;
export const MAX_ATTEMPTS = 3;

/** Points per question. Full marks only for a clean first attempt. (SPEC 5.1) */
export function scoreQuestion(a: AnswerRecord): number {
  if (!a.correct) return 0;
  // SPEC 5.1 indexes POINTS_BY_ATTEMPT directly. Guarding instead of letting an
  // out-of-range attempts value produce NaN, because NaN would flow straight
  // into accuracy() and from there into stored mastery.
  if (!Number.isInteger(a.attempts) || a.attempts < 1 || a.attempts > MAX_ATTEMPTS) {
    throw new RangeError(
      `attempts must be an integer 1-${MAX_ATTEMPTS}, got ${a.attempts} (question ${a.questionId})`,
    );
  }
  const base = POINTS_BY_ATTEMPT[a.attempts as 1 | 2 | 3];
  return Math.max(0, base - (a.hintUsed ? HINT_PENALTY : 0));
}

/**
 * Accuracy measures the quality of first attempts, not whether the child got
 * there eventually. Otherwise everyone scores 100% and stars mean nothing.
 * (SPEC 5.2)
 *
 * @returns 0.0 - 1.0
 */
export function accuracy(answers: readonly AnswerRecord[]): number {
  const total = answers.reduce((sum, a) => sum + scoreQuestion(a), 0);
  const max = answers.length * 100;
  return max === 0 ? 0 : total / max;
}

/** Star thresholds. (SPEC 5.2, PRD 10) */
export function starsFor(acc: number): Stars {
  if (acc >= 0.95) return 3;
  if (acc >= 0.8) return 2;
  if (acc >= 0.6) return 1;
  return 0;
}

/**
 * Stored stars are the all-time best, never the last attempt, so replaying can
 * only ever help. (PRD 10, SPEC 5.2)
 */
export function bestStars(existing: Stars, fresh: Stars): Stars {
  return Math.max(existing, fresh) as Stars;
}

/**
 * Gems. Replays pay less — that discourages farming without punishing
 * practice. (SPEC 5.3)
 */
export function gemsFor(stars: Stars, isFirstClear: boolean): number {
  const base = [0, 5, 10, 20][stars] as number;
  return isFirstClear ? base + 10 : base;
}

/** Everything the summary screen needs, from one session's answers. */
export interface SessionResult {
  accuracy: number;
  stars: Stars;
  gems: number;
  points: number;
  firstTryCount: number;
}

export function summarise(
  answers: readonly AnswerRecord[],
  isFirstClear: boolean,
): SessionResult {
  const acc = accuracy(answers);
  const stars = starsFor(acc);
  return {
    accuracy: acc,
    stars,
    gems: gemsFor(stars, isFirstClear),
    points: answers.reduce((sum, a) => sum + scoreQuestion(a), 0),
    firstTryCount: answers.filter((a) => a.firstTry).length,
  };
}
