import { describe, expect, it } from 'vitest';

import type { Question } from '../content/schema.ts';
import { createSession, sessionReducer, type SessionState } from '../features/quiz/session.ts';
import {
  STORAGE_KEY,
  clearSession,
  loadSession,
  saveSession,
  type StorageLike,
} from './persistence.ts';

function memoryStorage(seed: Record<string, string> = {}): StorageLike & { map: Map<string, string> } {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

/** Storage that throws on every access, like a locked-down privacy mode. */
const hostileStorage: StorageLike = {
  getItem() {
    throw new Error('SecurityError');
  },
  setItem() {
    throw new Error('QuotaExceededError');
  },
  removeItem() {
    throw new Error('SecurityError');
  },
};

/*
  Three options, not two: one miss has to leave the question open for there to
  be a mid-question state to restore. On two options the first miss reveals the
  answer (SPEC 4.2).
*/
const question: Question = {
  id: 'q001',
  type: 'mcq',
  difficulty: 1,
  prompt: { ms: 'Nombor manakah yang lebih besar?', en: 'Which number is bigger?' },
  promptAudio: { ms: '/audio/ms/q001.mp3', en: '/audio/en/q001.mp3' },
  payload: {
    options: [
      { id: 'a', text: { ms: '47', en: '47' } },
      { id: 'b', text: { ms: '74', en: '74' } },
      { id: 'c', text: { ms: '38', en: '38' } },
    ],
    correctOptionId: 'b',
    shuffle: true,
  },
};

function midActivity(): SessionState {
  return [
    { type: 'LOADED' as const, questions: [question, { ...question, id: 'q002' }] },
    { type: 'START' as const, nowMs: 0 },
    { type: 'ANSWER' as const, response: { kind: 'option' as const, optionId: 'a' }, nowMs: 100 },
  ].reduce(sessionReducer, createSession('math-y1-nombor-100-a1'));
}

describe('saveSession / loadSession', () => {
  it('round-trips a session mid-activity', () => {
    const storage = memoryStorage();
    const state = midActivity();
    saveSession(state, storage);
    expect(loadSession('math-y1-nombor-100-a1', storage)).toEqual(state);
  });

  it('keeps the child exactly where they were, wrong attempts included', () => {
    const storage = memoryStorage();
    const state = midActivity();
    saveSession(state, storage);
    const restored = loadSession('math-y1-nombor-100-a1', storage);
    expect(restored?.attempts).toBe(1);
    expect(restored?.hintShown).toBe(true);
    expect(restored?.disabledOptionIds).toEqual(['a']);
  });

  it('refuses a session saved for a different activity', () => {
    const storage = memoryStorage();
    saveSession(midActivity(), storage);
    expect(loadSession('some-other-activity', storage)).toBeNull();
  });

  it('returns null when nothing was ever saved', () => {
    expect(loadSession('math-y1-nombor-100-a1', memoryStorage())).toBeNull();
  });

  it('ignores a session still in loading, which holds nothing worth restoring', () => {
    const storage = memoryStorage();
    saveSession(createSession('a1'), storage);
    expect(loadSession('a1', storage)).toBeNull();
  });

  it('ignores an index that points past the end of the questions', () => {
    const storage = memoryStorage();
    saveSession({ ...midActivity(), index: 99 }, storage);
    expect(loadSession('math-y1-nombor-100-a1', storage)).toBeNull();
  });

  it('survives corrupt or foreign data instead of crashing the app', () => {
    for (const junk of ['not json at all', 'null', '[]', '{}', '{"activityId":"a1"}', '"a string"']) {
      const storage = memoryStorage({ [STORAGE_KEY]: junk });
      expect(loadSession('a1', storage)).toBeNull();
    }
  });

  it('survives a storage that throws on every access', () => {
    expect(() => saveSession(midActivity(), hostileStorage)).not.toThrow();
    expect(loadSession('math-y1-nombor-100-a1', hostileStorage)).toBeNull();
    expect(() => clearSession(hostileStorage)).not.toThrow();
  });

  it('does nothing at all when there is no storage', () => {
    expect(() => saveSession(midActivity(), null)).not.toThrow();
    expect(loadSession('a1', null)).toBeNull();
    expect(() => clearSession(null)).not.toThrow();
  });
});

describe('default storage', () => {
  it('uses whatever localStorage the environment provides, without throwing', () => {
    // Node 22+ exposes a global localStorage, so this exercises the real
    // default path rather than a stub. Where it is absent the functions must
    // still be safe no-ops, which is the same assertion either way.
    expect(() => saveSession(midActivity())).not.toThrow();
    expect(() => loadSession('math-y1-nombor-100-a1')).not.toThrow();
    expect(() => clearSession()).not.toThrow();
    expect(loadSession('math-y1-nombor-100-a1')).toBeNull();
  });

  it('no-ops when reading localStorage itself throws, as in some privacy modes', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError');
      },
    });
    try {
      expect(() => saveSession(midActivity())).not.toThrow();
      expect(loadSession('math-y1-nombor-100-a1')).toBeNull();
      expect(() => clearSession()).not.toThrow();
    } finally {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  });
});

describe('clearSession', () => {
  it('removes a saved session so the next open starts fresh', () => {
    const storage = memoryStorage();
    saveSession(midActivity(), storage);
    clearSession(storage);
    expect(loadSession('math-y1-nombor-100-a1', storage)).toBeNull();
    expect(storage.map.has(STORAGE_KEY)).toBe(false);
  });
});
