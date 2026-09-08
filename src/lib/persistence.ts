/**
 * Session persistence (PRD 5, SPEC 10.5): closing the app mid-activity and
 * reopening restores where the child was.
 *
 * Storage is injected so this is testable without a browser, and every access
 * is wrapped: localStorage throws outright in some privacy modes, and a child
 * losing their place is bad but an app that will not start is worse.
 */

import type { SessionState } from '../features/quiz/session.ts';

export const STORAGE_KEY = 'esi.session.v1';

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
