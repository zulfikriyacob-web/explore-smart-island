import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEY } from '../../lib/persistence.ts';

/**
 * A restored session must not be sent back through the start screen.
 *
 * The start screen exists to collect the gesture iOS needs before audio can play
 * (SPEC 8, Brief 03). A child who closed the app mid-activity has already
 * answered questions; putting a "Mula" screen in front of them again would make
 * them ask for the thing they were already doing, and would throw away their
 * place in the interest of a gesture they can just as well give by tapping an
 * answer. So the store keeps whatever status was saved, and only a *fresh* run
 * waits at `intro`.
 *
 * This lives in its own file because the store is a module singleton: it reads
 * storage once, at import. Testing what it read means importing it again with
 * different storage, which `vi.resetModules` allows and the other store test —
 * which drives the already-imported one — cannot do.
 */

const ACTIVITY_ID = 'math-y1-nombor-100-a1';

/** A session saved mid-activity: past the intro, two questions in. */
function savedMidActivity() {
  return {
    activityId: ACTIVITY_ID,
    questions: [
      {
        id: 'q001',
        type: 'mcq',
        difficulty: 1,
        prompt: { ms: 'Soalan', en: 'Question' },
        promptAudio: { ms: '/audio/ms/q001.mp3', en: '/audio/en/q001.mp3' },
        payload: {
          options: [
            { id: 'a', text: { ms: '1', en: '1' } },
            { id: 'b', text: { ms: '2', en: '2' } },
          ],
          correctOptionId: 'a',
          shuffle: false,
        },
      },
    ],
    index: 0,
    answers: [],
    status: 'question',
    attempts: 0,
    hintShown: false,
    disabledOptionIds: [],
    lastAnswerCorrect: null,
    revealed: false,
    questionStartedMs: 1000,
    result: null,
    isFirstClear: true,
  };
}

function stubStorage(seed: string | null) {
  const map = new Map<string, string>();
  if (seed !== null) map.set(STORAGE_KEY, seed);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    },
  });
  return map;
}

let original: PropertyDescriptor | undefined;

beforeEach(() => {
  original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  vi.resetModules();
});

afterEach(() => {
  if (original) Object.defineProperty(globalThis, 'localStorage', original);
  else Reflect.deleteProperty(globalThis as object, 'localStorage');
});

describe('quiz store, on load', () => {
  it('resumes a saved session at the question it was left on, not at intro', async () => {
    stubStorage(JSON.stringify(savedMidActivity()));
    const { useQuizStore } = await import('./store.ts');

    const state = useQuizStore.getState();
    expect(state.restored).toBe(true);
    expect(state.session.status).toBe('question');
    expect(state.session.index).toBe(0);
  });

  it('waits at intro when there is nothing to restore', async () => {
    stubStorage(null);
    const { useQuizStore } = await import('./store.ts');

    expect(useQuizStore.getState().restored).toBe(false);
    expect(useQuizStore.getState().session.status).toBe('intro');
  });

  it('does not resurrect an intro that was saved before the child ever tapped', async () => {
    // The other half of the rule. A run saved *at* intro genuinely has no place
    // to resume to — the child never started — so it comes back at intro and
    // asks for the tap again. That is the gate working, not a session stuck.
    const savedAtIntro = { ...savedMidActivity(), status: 'intro', questionStartedMs: null };
    stubStorage(JSON.stringify(savedAtIntro));
    const { useQuizStore } = await import('./store.ts');

    expect(useQuizStore.getState().session.status).toBe('intro');
    useQuizStore.getState().start();
    expect(useQuizStore.getState().session.status).toBe('question');
  });
});
