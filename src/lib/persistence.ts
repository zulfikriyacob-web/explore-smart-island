/**
 * Session persistence (PRD 5, SPEC 10.5): closing the app mid-activity and
 * reopening restores where the child was.
 *
 * Storage is injected so this is testable without a browser, and every access
 * is wrapped: localStorage throws outright in some privacy modes, and a child
 * losing their place is bad but an app that will not start is worse.
 */

import type { SessionState } from '../features/quiz/session.ts';
import { emptyProgress, type Progress } from './progress.ts';

export const STORAGE_KEY = 'esi.session.v1';

/**
 * Evidence per sub-skill, kept across runs (SPEC 6). Its own versioned key: the
 * session is thrown away when an activity ends, progress is not.
 */
export const PROGRESS_KEY = 'esi.progress.v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function defaultStorage(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState, storage = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or a locked-down browser. Play continues, progress is just not kept.
  }
}

export function clearSession(storage = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing useful to do.
  }
}

/**
 * Restore a saved session, but only if it is the activity being opened and the
 * stored shape still looks like a session. Anything else returns null and the
 * caller starts fresh — a corrupt blob must never stop the app from loading.
 */
export function loadSession(
  activityId: string,
  storage = defaultStorage(),
): SessionState | null {
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isSessionState(parsed)) return null;
  if (parsed.activityId !== activityId) return null;
  // A session that never got past loading has nothing worth restoring.
  if (parsed.status === 'loading') return null;
  if (parsed.index >= parsed.questions.length) return null;

  return parsed;
}

const STATUSES = ['loading', 'intro', 'question', 'feedback', 'summary'];

function isSessionState(v: unknown): v is SessionState {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.activityId === 'string' &&
    // A run saved before sessions carried an id is refused, not given one: the
    // app has not launched, so the cost is one restart on a test device. (SPEC 6)
    typeof s.sessionId === 'string' &&
    s.sessionId.length > 0 &&
    Array.isArray(s.questions) &&
    s.questions.length > 0 &&
    typeof s.index === 'number' &&
    Number.isInteger(s.index) &&
    s.index >= 0 &&
    Array.isArray(s.answers) &&
    typeof s.status === 'string' &&
    STATUSES.includes(s.status) &&
    typeof s.attempts === 'number' &&
    typeof s.hintShown === 'boolean' &&
    Array.isArray(s.disabledOptionIds)
  );
}

/**
 * The child's progress, or null when it cannot be read at all.
 *
 * Null is not empty, and the difference is the point. No storage, or a storage
 * that throws, means progress may exist and cannot be seen; writing then would
 * replace it with a single run, so the caller banks nothing.
 *
 * Nothing saved yet is empty. So is a value that is not progress — not JSON, or
 * a foreign shape — which holds nothing this build can use. It is replaced on
 * the next write rather than stopping a child's progress from ever being kept
 * again on that device. Entries inside a valid value are returned as they are,
 * readable or not (SPEC 6, rule 3).
 */
export function loadProgress(storage = defaultStorage()): Progress | null {
  if (!storage) return null;

  let raw: string | null;
  try {
    raw = storage.getItem(PROGRESS_KEY);
  } catch {
    return null;
  }
  if (raw === null) return emptyProgress();

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isProgress(parsed)) return parsed;
  } catch {
    // Not JSON: nothing this build can read. See above.
  }
  return emptyProgress();
}

export function saveProgress(progress: Progress, storage = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Quota or a locked-down browser. The run still ends; its evidence is not kept.
  }
}

function isProgress(v: unknown): v is Progress {
  if (typeof v !== 'object' || v === null) return false;
  const subSkills = (v as Record<string, unknown>).subSkills;
  return typeof subSkills === 'object' && subSkills !== null && !Array.isArray(subSkills);
}
