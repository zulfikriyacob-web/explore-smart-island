import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Question } from '../../content/schema.ts';
import { PROGRESS_KEY, STORAGE_KEY } from '../../lib/persistence.ts';
import { packProgress, readSubSkill, type Progress } from '../../lib/progress.ts';
import { currentQuestion, type Response } from './session.ts';

/**
 * A finished run leaves its evidence in the progress store (SPEC 6) — once, as
 * it reaches its summary, under the id the run was made with — and its pack
 * state: one rung of the SPEC 5.5 ladder, one more run, and when each question
 * was last asked.
 *
 * Its own file for the reason store.restore.test.ts gives: the store is a module
 * singleton that reads storage at import, so each case imports it again over
 * storage of its own.
 */

const PRACTICE_ID = 'math-y1-nombor-100';

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

/** Play the session to its summary, every question right first time. */
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
  throw new Error('the session never reached its summary');
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
    activityId: PRACTICE_ID,
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

  it('opens a session of ten distinct questions, all of them claiming a sub-skill', async () => {
    stubStorage();
    const store = await importStore();
    const questions = store.getState().session.questions;

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((q) => q.id)).size).toBe(10);
    expect(questions.every((q) => q.subSkill !== undefined)).toBe(true);
    // q005 and q009 claim no sub-skill: excluded (PRD 16 item 27, decision 2).
    expect(questions.map((q) => q.id)).not.toContain('q005');
    expect(questions.map((q) => q.id)).not.toContain('q009');
  });

  it('banks a run under its own session id, and a replay under a new one', async () => {
    const map = stubStorage();
    const store = await importStore();

    const askedFirst = store.getState().session.questions.map((q) => q.id);
    playThrough(store);
    const first = store.getState().session.sessionId;
    store.getState().restart();
    playThrough(store);
    const second = store.getState().session.sessionId;

    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(second).not.toBe(first);

    const sessions = new Set(
      Object.values(progressIn(map).subSkills).flatMap(
        (raw) => readSubSkill(raw)?.evidence.map((e) => e.sessionId) ?? [],
      ),
    );
    expect(sessions).toEqual(new Set([first, second]));

    // Every question the first run asked was stamped with run 1.
    const state = packProgress(progressIn(map), PRACTICE_ID);
    for (const id of askedFirst) expect(state.lastAsked[id]).toBeGreaterThanOrEqual(1);
  });

  /*
    SPEC 5.5: accuracy of 0.90 or better steps the level up, and the store is
    what remembers it between runs. A perfect run is 1.0.
  */
  it('climbs the level ladder on a perfect run, and counts the run', async () => {
    const map = stubStorage();
    const store = await importStore();
    expect(packProgress({ subSkills: {} }, PRACTICE_ID).level).toBe(1);

    playThrough(store);
    const afterOne = packProgress(progressIn(map), PRACTICE_ID);
    expect(afterOne.level).toBe(2);
    expect(afterOne.runs).toBe(1);
    expect(Object.values(afterOne.lastAsked).every((run) => run === 1)).toBe(true);

    store.getState().restart();
    playThrough(store);
    const afterTwo = packProgress(progressIn(map), PRACTICE_ID);
    expect(afterTwo.level).toBe(3);
    expect(afterTwo.runs).toBe(2);
  });

  it('opens the next session at the level the last one left', async () => {
    const map = stubStorage();
    const store = await importStore();
    playThrough(store);
    expect(packProgress(progressIn(map), PRACTICE_ID).level).toBe(2);

    store.getState().restart();
    // Level 2 is 2 at level 1, 7 at level 2, 1 at level 3 (questionMix).
    const levels = store.getState().session.questions.map((q) => q.difficulty);
    expect(levels.filter((d) => d === 1)).toHaveLength(2);
    expect(levels.filter((d) => d === 2)).toHaveLength(7);
    expect(levels.filter((d) => d === 3)).toHaveLength(1);
    // Easiest first, stretch last.
    expect(levels).toEqual([...levels].sort((a, b) => a - b));
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
    finishing it banks it again. One sitting must stay one sitting — and one
    rung of the ladder must stay one rung.
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
      packs: {
        [PRACTICE_ID]: { level: 2, runs: 4, lastSessionId: 'saved-run', lastAsked: { q001: 4 } },
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
