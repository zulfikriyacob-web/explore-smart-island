import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Question } from '../../content/schema.ts';
import { PROGRESS_KEY, STORAGE_KEY } from '../../lib/persistence.ts';
import { readSubSkill, type Progress } from '../../lib/progress.ts';
import { currentQuestion, type Response } from './session.ts';

/**
 * A finished run leaves its evidence in the progress store (SPEC 6) — once, as
 * it reaches its summary, under the id the run was made with.
 *
 * Its own file for the reason store.restore.test.ts gives: the store is a module
 * singleton that reads storage at import, so each case imports it again over
 * storage of its own.
 */

const ACTIVITY_ID = 'math-y1-nombor-100-a1';

function stubStorage(seed: Record<string, string> = {}, throwOnRead: string | null = null) {
  const map = new Map(Object.entries(seed));
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (k: string) => {
        if (k === throwOnRead) throw new Error('SecurityError');
        return map.get(k) ?? null;
      },
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

async function importStore() {
  return (await import('./store.ts')).useQuizStore;
}

type Store = Awaited<ReturnType<typeof importStore>>;

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
function playThrough(store: Store): void {
  store.getState().start();
  for (let step = 0; step < 100; step++) {
    const session = store.getState().session;
    if (session.status === 'summary') return;
    const question = currentQuestion(session);
    if (!question) throw new Error(`no question at index ${session.index}`);
    store.getState().answer(correctResponse(question));
    store.getState().next();
  }
  throw new Error('the activity never reached its summary');
}

function progressIn(map: Map<string, string>): Progress {
  const raw = map.get(PROGRESS_KEY);
  if (raw === undefined) throw new Error('nothing was written to the progress key');
  return JSON.parse(raw) as Progress;
}

/**
 * A run saved on its last question, with one question — a two-option copy of
 * q001 that names no sub-skill. The live pack gives q001 three options and
 * `1.2.2/compare_greater`.
 */
function savedRun(overrides: Record<string, unknown> = {}) {
  return {
    activityId: ACTIVITY_ID,
    sessionId: 'saved-run',
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
    ...overrides,
  };
}

const answeredQ001 = {
  questionId: 'q001',
  attempts: 1,
  correct: true,
  firstTry: true,
  hintShown: false,
  msSpent: 500,
};

describe('quiz store, banking progress', () => {
  it('writes nothing to the progress key before a run reaches its summary', async () => {
    const map = stubStorage();
    const store = await importStore();
    store.getState().start();
    const question = currentQuestion(store.getState().session)!;
    store.getState().answer(correctResponse(question));
    store.getState().next();
    expect(map.has(PROGRESS_KEY)).toBe(false);
  });

  it('banks a run under its own session id, and a replay under a new one', async () => {
    const map = stubStorage();
    const store = await importStore();

    playThrough(store);
    const first = store.getState().session.sessionId;
    store.getState().restart();
    playThrough(store);
    const second = store.getState().session.sessionId;

    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(second).toMatch(/^[0-9a-f]{32}$/);
    expect(second).not.toBe(first);

    // a1 asks count_objects twice, q003 and q006: two questions from two runs.
    const counting = readSubSkill(progressIn(map).subSkills['1.2.1/count_objects']);
    expect(counting?.evidence.map((e) => `${e.questionId}@${e.sessionId}`).sort()).toEqual(
      [`q003@${first}`, `q003@${second}`, `q006@${first}`, `q006@${second}`].sort(),
    );

    // q005 and q009 claim no sub-skill and leave nothing behind.
    expect(Object.keys(progressIn(map).subSkills).some((id) => id.startsWith('7.2.1/'))).toBe(false);
  });

  it('banks a restored run under the id it was saved with', async () => {
    const map = stubStorage({ [STORAGE_KEY]: JSON.stringify(savedRun()) });
    const store = await importStore();
    expect(store.getState().session.sessionId).toBe('saved-run');

    store.getState().answer({ kind: 'option', optionId: 'a' });
    store.getState().next();
    expect(store.getState().session.status).toBe('summary');

    // The sub-skill the live pack names, and the two options the child saw.
    expect(progressIn(map).subSkills['1.2.2/compare_greater']).toEqual({
      evidence: [{ questionId: 'q001', sessionId: 'saved-run', twoOptions: true }],
      latestWasWrong: false,
      masteredOnce: false,
    });
  });

  it('does not bank a run again when it is restored at its summary', async () => {
    const atSummary = savedRun({
      status: 'summary',
      answers: [answeredQ001],
      questionStartedMs: null,
      result: { accuracy: 1, stars: 3, gems: 30, points: 100, firstTryCount: 1, hintShownCount: 0 },
    });
    const map = stubStorage({ [STORAGE_KEY]: JSON.stringify(atSummary) });
    const store = await importStore();
    expect(store.getState().session.status).toBe('summary');
    expect(map.has(PROGRESS_KEY)).toBe(false);
  });

  /*
    Progress is written before the session. Killed between the two, the app
    comes back on the run's last question with its evidence already banked, and
    finishing it banks it again. One sitting must stay one sitting.
  */
  it('does not count a run twice when the app died between the two writes', async () => {
    const atFeedback = savedRun({ status: 'feedback', attempts: 1, answers: [answeredQ001], lastAnswerCorrect: true });
    const banked: Progress = {
      subSkills: {
        '1.2.2/compare_greater': {
          evidence: [{ questionId: 'q001', sessionId: 'saved-run', twoOptions: true }],
          latestWasWrong: false,
          masteredOnce: false,
        },
      },
    };
    const map = stubStorage({
      [STORAGE_KEY]: JSON.stringify(atFeedback),
      [PROGRESS_KEY]: JSON.stringify(banked),
    });
    const store = await importStore();

    store.getState().next();
    expect(store.getState().session.status).toBe('summary');
    expect(progressIn(map)).toEqual(banked);
  });

  it('leaves progress it cannot read untouched, rather than replacing it with one run', async () => {
    const map = stubStorage(
      { [STORAGE_KEY]: JSON.stringify(savedRun()), [PROGRESS_KEY]: '{"subSkills":{"kept":true}}' },
      PROGRESS_KEY,
    );
    const store = await importStore();

    store.getState().answer({ kind: 'option', optionId: 'a' });
    store.getState().next();
    expect(store.getState().session.status).toBe('summary');
    expect(map.get(PROGRESS_KEY)).toBe('{"subSkills":{"kept":true}}');
  });
});
