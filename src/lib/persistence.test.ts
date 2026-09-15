import { describe, expect, it } from 'vitest';

import type { Question } from '../content/schema.ts';
import { createSession, sessionReducer, type SessionState } from '../features/quiz/session.ts';
import {
  PROGRESS_KEY,
  STORAGE_KEY,
  clearSession,
  loadProgress,
  loadSession,
  saveProgress,
  saveSession,
  type StorageLike,
} from './persistence.ts';
import { emptyProgress, type Progress } from './progress.ts';

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
  ].reduce(sessionReducer, createSession('math-y1-nombor-100-a1', 's1'));
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
    saveSession(createSession('a1', 's1'), storage);
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

describe('a session without an id', () => {
  it('is refused, so it can never be banked as a sitting of its own', () => {
    const { sessionId: _dropped, ...withoutId } = midActivity();
    for (const saved of [withoutId, { ...withoutId, sessionId: '' }, { ...withoutId, sessionId: 7 }]) {
      const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) });
      expect(loadSession('math-y1-nombor-100-a1', storage)).toBeNull();
    }
  });
});

describe('loadProgress / saveProgress', () => {
  const banked: Progress = {
    subSkills: {
      '1.2.2/after': {
        evidence: [{ questionId: 'q002', sessionId: 's1', twoOptions: false }],
        latestWasWrong: false,
        masteredOnce: false,
      },
    },
  };

  it('round-trips progress under its own key, apart from the session', () => {
    const storage = memoryStorage();
    saveProgress(banked, storage);
    saveSession(midActivity(), storage);
    clearSession(storage);
    expect(loadProgress(storage)).toEqual(banked);
    expect(storage.map.has(PROGRESS_KEY)).toBe(true);
  });

  it('is empty when nothing was ever saved', () => {
    expect(loadProgress(memoryStorage())).toEqual(emptyProgress());
  });

  it('reads a value that is not progress as empty, so the next write replaces it', () => {
    for (const junk of ['not json at all', 'null', '[]', '{}', '"a string"', '{"subSkills":[]}', '{"subSkills":null}']) {
      expect(loadProgress(memoryStorage({ [PROGRESS_KEY]: junk }))).toEqual(emptyProgress());
    }
  });

  /*
    SPEC 6, rule 3: an id missing from the skills file is ignored when read, not
    deleted. Loading is not reading a sub-skill, so it hands back every entry as
    stored, and the write after it carries them.
  */
  it('hands back entries as stored, including ids it does not know and entries it cannot read', () => {
    const stored = { subSkills: { 'x/gone': banked.subSkills['1.2.2/after'], 'y/odd': 42 } };
    const storage = memoryStorage({ [PROGRESS_KEY]: JSON.stringify(stored) });
    expect(loadProgress(storage)).toEqual(stored);
  });

  /*
    Null, not empty. Progress that may exist and cannot be seen must not be
    replaced by the caller's one run.
  */
  it('is null, not empty, when storage throws or is missing', () => {
    expect(loadProgress(hostileStorage)).toBeNull();
    expect(loadProgress(null)).toBeNull();
  });

  it('survives a storage that throws on write, or no storage at all', () => {
    expect(() => saveProgress(banked, hostileStorage)).not.toThrow();
    expect(() => saveProgress(banked, null)).not.toThrow();
  });

  it('uses whatever localStorage the environment provides, without throwing', () => {
    expect(() => saveProgress(emptyProgress())).not.toThrow();
    expect(() => loadProgress()).not.toThrow();
  });
});
