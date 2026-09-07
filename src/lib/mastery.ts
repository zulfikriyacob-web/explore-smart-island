/**
 * Mastery, difficulty selection and streaks (SPEC sections 5.4 - 5.6).
 *
 * Pure functions only. Nothing here reads the clock: today's date is always
 * passed in, which is what makes streak behaviour testable without faking time.
 */

import type { Difficulty } from '../content/schema.ts';

/** A new session carries 40% of the weight. (SPEC 5.4) */
export const ALPHA = 0.4;

/** Untouched for this long, a standard starts decaying. (SPEC 5.4) */
export const DECAY_AFTER_DAYS = 30;
export const DECAY_STEP = 0.05;

export const MASTERED_AT = 0.85;

export type MasteryLabel = 'not-started' | 'learning' | 'mastered';

/** Exponential moving average. One number, no tuning knobs. (SPEC 5.4) */
export function updateMastery(prev: number | null, sessionAccuracy: number): number {
  if (prev === null) return sessionAccuracy;
  return prev + ALPHA * (sessionAccuracy - prev);
}

export function masteryLabel(m: number | null): MasteryLabel {
  if (m === null) return 'not-started';
  return m >= MASTERED_AT ? 'mastered' : 'learning';
}

/**
 * Decay: a standard untouched for 30 days drops by 0.05, once. This floats old
 * topics back into "this week's focus" without punishing a child who went on
 * holiday — hence once, not once per day. (SPEC 5.4)
 */
export function decayMastery(m: number | null, daysSinceTouched: number): number | null {
  if (m === null) return null;
  if (daysSinceTouched < DECAY_AFTER_DAYS) return m;
  return Math.max(0, m - DECAY_STEP);
}

/**
 * Deliberately dumb three-rung ladder. Do not build an IRT model for a
 * 7-year-old. (SPEC 5.5)
 */
export function nextDifficulty(current: Difficulty, sessionAccuracy: number): Difficulty {
  if (sessionAccuracy >= 0.9) return Math.min(3, current + 1) as Difficulty;
  if (sessionAccuracy < 0.55) return Math.max(1, current - 1) as Difficulty;
  return current;
}

/**
 * Question mix for an activity at level `d`: 70% at d, 20% at d-1, 10% at d+1,
 * clamped at the boundaries so the share of a level that does not exist folds
 * back into d. The mix gives easy wins plus a little stretch. (SPEC 5.5)
 *
 * Counts always sum to `total`; the remainder from rounding lands on d.
 */
export function questionMix(d: Difficulty, total: number): Record<Difficulty, number> {
  if (!Number.isInteger(total) || total < 0) {
    throw new RangeError(`total must be a non-negative integer, got ${total}`);
  }
  const mix: Record<Difficulty, number> = { 1: 0, 2: 0, 3: 0 };
  if (total === 0) return mix;

  const below = (d - 1) as Difficulty;
  const above = (d + 1) as Difficulty;
  const hasBelow = below >= 1;
  const hasAbove = above <= 3;

  const belowCount = hasBelow ? Math.round(total * 0.2) : 0;
  const aboveCount = hasAbove ? Math.round(total * 0.1) : 0;

  if (hasBelow) mix[below] += belowCount;
  if (hasAbove) mix[above] += aboveCount;
  mix[d] += total - belowCount - aboveCount;
  return mix;
}

/** Daily streak state. (SPEC 5.6, PRD 10) */
export interface Streak {
  count: number;
  lastActiveDate: string;
  /** Two freezes are held and spent automatically on a missed day. (PRD 10) */
  freezes: number;
}

/** Whole days between two ISO calendar dates (YYYY-MM-DD), b minus a. */
export function daysBetween(aISO: string, bISO: string): number {
  const a = parseISODate(aISO);
  const b = parseISODate(bISO);
  const MS_PER_DAY = 86_400_000;
  return Math.round((b - a) / MS_PER_DAY);
}

function parseISODate(iso: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new RangeError(`expected an ISO calendar date YYYY-MM-DD, got "${iso}"`);
  }
  // Parsed as UTC midnight so daylight-saving shifts cannot move a boundary.
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(ms)) {
    throw new RangeError(`"${iso}" is not a real date`);
  }
  // Date.parse rolls an impossible day over instead of rejecting it: 2026-02-30
  // silently becomes 2026-03-02. Round-trip to catch that, because a streak
  // computed from a rolled-over date is wrong without ever looking wrong.
  if (new Date(ms).toISOString().slice(0, 10) !== iso) {
    throw new RangeError(`"${iso}" is not a real date`);
  }
  return ms;
}

/**
 * Runs once a day in the user's local time, or at app start. A missed day
 * spends a freeze if one is held; otherwise the streak resets to 1, without
 * drama. (SPEC 5.6)
 */
export function updateStreak(s: Streak, todayISO: string): Streak {
  const gapDays = daysBetween(s.lastActiveDate, todayISO);
  if (gapDays === 0) return s; // already counted today
  if (gapDays < 0) return s; // clock skew: never rewind a streak
  if (gapDays === 1) return { ...s, count: s.count + 1, lastActiveDate: todayISO };
  if (s.freezes > 0) {
    return { ...s, freezes: s.freezes - 1, lastActiveDate: todayISO };
  }
  return { ...s, count: 1, lastActiveDate: todayISO };
}
