import { describe, expect, it } from 'vitest';

import type { Question } from '../../content/schema.ts';
import { scoreQuestion } from '../../lib/scoring.ts';
import {
  checkAnswer,
  createSession,
  currentQuestion,
  missesLeft,
  sessionReducer,
  type Response,
  type SessionEvent,
  type SessionState,
} from './session.ts';

const mcq: Question = {
  id: 'q001',
  type: 'mcq',
  difficulty: 1,
  prompt: { ms: 'Nombor manakah yang lebih besar?', en: 'Which number is bigger?' },
  promptAudio: { ms: '/audio/ms/q001.mp3', en: '/audio/en/q001.mp3' },
  hint: { ms: 'Lihat nombor di hadapan dahulu.', en: 'Look at the first digit.' },
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

const mcqImage: Question = {
  id: 'q005',
  type: 'mcq-image',
  difficulty: 1,
  prompt: { ms: 'Yang mana bentuk segi tiga?', en: 'Which one is a triangle?' },
  promptAudio: { ms: '/audio/ms/q005.mp3', en: '/audio/en/q005.mp3' },
  payload: {
    options: [
      { id: 'a', image: '/img/shapes/square.svg', alt: { ms: 'Segi empat sama', en: 'Square' } },
      { id: 'b', image: '/img/shapes/triangle.svg', alt: { ms: 'Segi tiga', en: 'Triangle' } },
    ],
    correctOptionId: 'b',
    shuffle: true,
  },
};

const countTap: Question = {
  id: 'q003',
  type: 'count-tap',
  difficulty: 1,
  prompt: { ms: 'Ketuk setiap buah rambutan.', en: 'Tap each rambutan.' },
  promptAudio: { ms: '/audio/ms/q003.mp3', en: '/audio/en/q003.mp3' },
  payload: {
    itemImage: '/img/fruit/rambutan.svg',
    itemCount: 7,
    layout: 'scatter',
    answerInput: 'tap-count',
    correctAnswer: 7,
  },
};

const pick = (optionId: string): Response => ({ kind: 'option', optionId });

/** A wrong count on the count-tap fixture, which wants 7. */
const miss = (nowMs: number): SessionEvent => ({
  type: 'ANSWER',
  response: { kind: 'count', value: 6 },
  nowMs,
});

function run(state: SessionState, events: readonly SessionEvent[]): SessionState {
  return events.reduce(sessionReducer, state);
}

/** A session parked on the first question, ready to answer. */
function started(questions: readonly Question[] = [mcq, mcqImage]): SessionState {
  return run(createSession('math-y1-nombor-100-a1'), [
    { type: 'LOADED', questions },
    { type: 'START', nowMs: 1_000 },
  ]);
}

describe('checkAnswer', () => {
  it('marks option questions against correctOptionId', () => {
    expect(checkAnswer(mcq, pick('b'))).toBe(true);
    expect(checkAnswer(mcq, pick('a'))).toBe(false);
    expect(checkAnswer(mcqImage, pick('b'))).toBe(true);
    expect(checkAnswer(mcqImage, pick('a'))).toBe(false);
  });

  it('marks count-tap against the tally, not the item count field alone', () => {
    expect(checkAnswer(countTap, { kind: 'count', value: 7 })).toBe(true);
    expect(checkAnswer(countTap, { kind: 'count', value: 6 })).toBe(false);
  });

  it('rejects a response shaped for a different question type', () => {
    expect(() => checkAnswer(mcq, { kind: 'count', value: 1 })).toThrow(TypeError);
    expect(() => checkAnswer(countTap, pick('a'))).toThrow(TypeError);
  });
});

describe('session lifecycle', () => {
  it('starts in loading with nothing answered', () => {
    const s = createSession('a1');
    expect(s.status).toBe('loading');
    expect(s.answers).toEqual([]);
    expect(currentQuestion(s)).toBeNull();
  });

  it('moves loading -> intro -> question', () => {
    const loaded = sessionReducer(createSession('a1'), { type: 'LOADED', questions: [mcq] });
    expect(loaded.status).toBe('intro');
    const playing = sessionReducer(loaded, { type: 'START', nowMs: 500 });
    expect(playing.status).toBe('question');
    expect(currentQuestion(playing)?.id).toBe('q001');
    expect(playing.questionStartedMs).toBe(500);
  });

  it('refuses to load an empty question list', () => {
    const s = createSession('a1');
    expect(sessionReducer(s, { type: 'LOADED', questions: [] })).toBe(s);
  });

  it('ignores events that arrive out of order instead of crashing', () => {
    const s = createSession('a1');
    expect(sessionReducer(s, { type: 'START', nowMs: 1 })).toBe(s);
    expect(sessionReducer(s, { type: 'ANSWER', response: pick('b'), nowMs: 1 })).toBe(s);
    expect(sessionReducer(s, { type: 'NEXT', nowMs: 1 })).toBe(s);

    const playing = started();
    expect(sessionReducer(playing, { type: 'LOADED', questions: [countTap] })).toBe(playing);
    expect(sessionReducer(playing, { type: 'START', nowMs: 9 })).toBe(playing);
    expect(sessionReducer(playing, { type: 'NEXT', nowMs: 9 })).toBe(playing);
  });
});

describe('attempt rules', () => {
  it('records a first-try win and moves to feedback', () => {
    const s = sessionReducer(started(), { type: 'ANSWER', response: pick('b'), nowMs: 4_000 });
    expect(s.status).toBe('feedback');
    expect(s.lastAnswerCorrect).toBe(true);
    expect(s.answers).toEqual([
      {
        questionId: 'q001',
        attempts: 1,
        correct: true,
        firstTry: true,
        hintShown: false,
        msSpent: 3_000,
      },
    ]);
  });

  it('surfaces the hint and strikes out the wrong option after one miss', () => {
    const s = sessionReducer(started(), { type: 'ANSWER', response: pick('a'), nowMs: 2_000 });
    expect(s.status).toBe('question');
    expect(s.attempts).toBe(1);
    expect(s.hintShown).toBe(true);
    expect(s.disabledOptionIds).toEqual(['a']);
    expect(s.answers).toEqual([]);
  });

  it('records the hint for analytics but costs the child nothing', () => {
    const withHint = run(started(), [
      { type: 'ANSWER', response: pick('a'), nowMs: 2_000 },
      { type: 'ANSWER', response: pick('b'), nowMs: 3_000 },
    ]);
    expect(withHint.hintShown).toBe(true);
    expect(withHint.answers[0]?.hintShown).toBe(true);
    expect(withHint.answers[0]?.attempts).toBe(2);
    expect(withHint.answers[0]?.firstTry).toBe(false);

    // Same two attempts, scored the same whether or not a hint was on screen.
    const record = withHint.answers[0]!;
    expect(scoreQuestion(record)).toBe(scoreQuestion({ ...record, hintShown: false }));
  });

  it('has no way to ask for a hint before answering', () => {
    const s = started();
    expect(s.hintShown).toBe(false);
    // The only route to a hint is a wrong answer.
    expect(sessionReducer(s, { type: 'ANSWER', response: pick('a'), nowMs: 2 }).hintShown).toBe(
      true,
    );
  });

  /*
    Three options, two wrong: the second miss leaves only the answer, so the
    child can no longer be wrong and the answer is shown then — not on a third
    attempt that the UI cannot produce, because a struck-out option cannot be
    pressed again.
  */
  it('reveals on the second miss when three options leave only the answer', () => {
    const s = run(started(), [
      { type: 'ANSWER', response: pick('a'), nowMs: 2_000 },
      { type: 'ANSWER', response: pick('c'), nowMs: 3_000 },
    ]);
    expect(s.status).toBe('feedback');
    expect(s.revealed).toBe(true);
    expect(s.attempts).toBe(2);
    expect(s.disabledOptionIds).toEqual(['a', 'c']);
    expect(s.answers).toEqual([
      {
        questionId: 'q001',
        attempts: 2,
        correct: false,
        firstTry: false,
        hintShown: true,
        msSpent: 2_000,
      },
    ]);
  });

  it('reveals on the first miss when two options leave only the answer, with no hint shown', () => {
    const s = sessionReducer(started([mcqImage]), {
      type: 'ANSWER',
      response: pick('a'),
      nowMs: 2_000,
    });
    expect(s.status).toBe('feedback');
    expect(s.revealed).toBe(true);
    expect(s.attempts).toBe(1);
    expect(s.hintShown).toBe(false);
    expect(s.answers[0]).toMatchObject({ attempts: 1, correct: false, hintShown: false });
  });

  it('does not list the same option twice if it is tapped again', () => {
    const s = run(started(), [
      { type: 'ANSWER', response: pick('a'), nowMs: 2_000 },
      { type: 'ANSWER', response: pick('a'), nowMs: 3_000 },
    ]);
    expect(s.disabledOptionIds).toEqual(['a']);
  });

  /*
    count-tap has nothing to strike out, so only MAX_ATTEMPTS ends it. This test
    used to take the three-option mcq to a third miss by pressing option `a`
    again after it was struck out — a path the reducer accepts and the UI does
    not — and that is how an unreachable `explain` on every mcq went unseen.
  */
  it('reveals a count-tap on the third miss and records a zero, without blocking', () => {
    const open = run(started([countTap]), [miss(2_000), miss(3_000)]);
    expect(open.status).toBe('question');
    expect(open.revealed).toBe(false);

    const s = sessionReducer(open, miss(5_000));
    expect(s.status).toBe('feedback');
    expect(s.revealed).toBe(true);
    expect(s.attempts).toBe(3);
    expect(s.answers).toEqual([
      {
        questionId: 'q003',
        attempts: 3,
        correct: false,
        firstTry: false,
        hintShown: true,
        msSpent: 4_000,
      },
    ]);
  });

  it('never takes another attempt once the answer is revealed', () => {
    const s = run(started([countTap]), [miss(2_000), miss(3_000), miss(4_000), miss(5_000)]);
    expect(s.attempts).toBe(3);
    expect(s.answers).toHaveLength(1);
  });
});

describe('missesLeft', () => {
  const fourImages: Question = {
    id: 'q900',
    type: 'mcq-image',
    difficulty: 1,
    prompt: { ms: 'x', en: 'x' },
    promptAudio: { ms: '/audio/ms/x.mp3', en: '/audio/en/x.mp3' },
    payload: {
      options: ['a', 'b', 'c', 'd'].map((id) => ({
        id,
        image: `/img/${id}.svg`,
        alt: { ms: id, en: id },
      })),
      correctOptionId: 'b',
      shuffle: true,
    },
  };

  it('ends a two-option question on its first miss', () => {
    expect(missesLeft(mcqImage, 0, [])).toBe(1);
    expect(missesLeft(mcqImage, 1, ['a'])).toBe(0);
  });

  it('ends a three-option question on its second miss', () => {
    expect(missesLeft(mcq, 0, [])).toBe(2);
    expect(missesLeft(mcq, 1, ['a'])).toBe(1);
    expect(missesLeft(mcq, 2, ['a', 'c'])).toBe(0);
  });

  it('lets four options run to the third miss, where attempts end it', () => {
    expect(missesLeft(fourImages, 0, [])).toBe(3);
    expect(missesLeft(fourImages, 2, ['a', 'c'])).toBe(1);
    expect(missesLeft(fourImages, 3, ['a', 'c', 'd'])).toBe(0);
  });

  it('counts only attempts on a count-tap', () => {
    expect(missesLeft(countTap, 0, [])).toBe(3);
    expect(missesLeft(countTap, 2, [])).toBe(1);
    expect(missesLeft(countTap, 3, [])).toBe(0);
  });
});

describe('progression', () => {
  it('resets per-question state on the next question', () => {
    const s = run(started(), [
      { type: 'ANSWER', response: pick('a'), nowMs: 2_000 },
      { type: 'ANSWER', response: pick('b'), nowMs: 3_000 },
      { type: 'NEXT', nowMs: 3_500 },
    ]);
    expect(s.status).toBe('question');
    expect(s.index).toBe(1);
    expect(s.attempts).toBe(0);
    expect(s.hintShown).toBe(false);
    expect(s.disabledOptionIds).toEqual([]);
    expect(s.revealed).toBe(false);
    expect(s.questionStartedMs).toBe(3_500);
    expect(currentQuestion(s)?.id).toBe('q005');
  });

  it('finishes into a summary with the session result', () => {
    const s = run(started(), [
      { type: 'ANSWER', response: pick('b'), nowMs: 2_000 },
      { type: 'NEXT', nowMs: 2_100 },
      { type: 'ANSWER', response: pick('b'), nowMs: 4_000 },
      { type: 'NEXT', nowMs: 4_100 },
    ]);
    expect(s.status).toBe('summary');
    expect(s.result).toEqual({
      accuracy: 1,
      stars: 3,
      gems: 30,
      points: 200,
      firstTryCount: 2,
      hintShownCount: 0,
    });
  });

  it('lets a child who got everything wrong still reach the summary', () => {
    // Every wrong option the screen lets a child press: two on the three-option
    // mcq, one on the two-option mcq-image. Each question then reveals.
    const s = run(started(), [
      { type: 'ANSWER', response: pick('a'), nowMs: 2_000 },
      { type: 'ANSWER', response: pick('c'), nowMs: 2_100 },
      { type: 'NEXT', nowMs: 2_500 },
      { type: 'ANSWER', response: pick('a'), nowMs: 3_000 },
      { type: 'NEXT', nowMs: 3_500 },
    ]);
    expect(s.status).toBe('summary');
    expect(s.result).toEqual({
      accuracy: 0,
      stars: 0,
      gems: 10,
      points: 0,
      firstTryCount: 0,
      // The mcq showed its hint after its first miss; the two-option question
      // revealed on its first miss and never showed one.
      hintShownCount: 1,
    });
  });

  it('pays a replay less than a first clear for the same performance', () => {
    const events: SessionEvent[] = [
      { type: 'ANSWER', response: pick('b'), nowMs: 2_000 },
      { type: 'NEXT', nowMs: 2_100 },
      { type: 'ANSWER', response: pick('b'), nowMs: 4_000 },
      { type: 'NEXT', nowMs: 4_100 },
    ];
    const load: SessionEvent[] = [
      { type: 'LOADED', questions: [mcq, mcqImage] },
      { type: 'START', nowMs: 1_000 },
    ];
    const first = run(createSession('a1', true), [...load, ...events]);
    const replay = run(createSession('a1', false), [...load, ...events]);
    expect(first.result?.stars).toBe(replay.result?.stars);
    expect(replay.result?.gems).toBeLessThan(first.result?.gems ?? 0);
  });

  it('runs every in-scope question type end to end', () => {
    const s = run(createSession('mixed'), [
      { type: 'LOADED', questions: [mcq, mcqImage, countTap] },
      { type: 'START', nowMs: 0 },
      { type: 'ANSWER', response: pick('b'), nowMs: 10 },
      { type: 'NEXT', nowMs: 20 },
      { type: 'ANSWER', response: pick('b'), nowMs: 30 },
      { type: 'NEXT', nowMs: 40 },
      { type: 'ANSWER', response: { kind: 'count', value: 7 }, nowMs: 50 },
      { type: 'NEXT', nowMs: 60 },
    ]);
    expect(s.status).toBe('summary');
    expect(s.answers).toHaveLength(3);
    expect(s.result?.stars).toBe(3);
  });

  it('reports msSpent as zero if a question was never formally started', () => {
    // Hand-built state: status question, but no start timestamp.
    const odd: SessionState = { ...started(), questionStartedMs: null };
    const s = sessionReducer(odd, { type: 'ANSWER', response: pick('b'), nowMs: 9_999 });
    expect(s.answers[0]?.msSpent).toBe(0);
  });

  it('clamps msSpent at zero if the clock jumps backwards', () => {
    const s = sessionReducer(started(), { type: 'ANSWER', response: pick('b'), nowMs: 0 });
    expect(s.answers[0]?.msSpent).toBe(0);
  });
});
