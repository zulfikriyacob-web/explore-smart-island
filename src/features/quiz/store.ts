/**
 * Zustand wrapper around the existing session reducer.
 *
 * The reducer in session.ts owns every rule. This file only holds the current
 * state, forwards events to it, and writes the result to localStorage — nothing
 * here decides anything about scoring or attempts.
 */

import { create } from 'zustand';

import { clearSession, loadSession, saveSession } from '../../lib/persistence.ts';
import { promptPlayer } from '../../lib/player.ts';
import { ACTIVITY_ID, loadActivityQuestions } from './activity.ts';
import {
  createSession,
  sessionReducer,
  type SessionEvent,
  type SessionState,
} from './session.ts';

/**
 * A fresh run of the activity.
 *
 * `isFirstClear` decides the gem bonus and nothing else. SPEC section 5.3 pays a
 * replay less so that practice is never punished and farming is never rewarded,
 * and the summary is only ever reached through here — so this is the one place
 * that has to know which kind of run it is building.
 */
/**
 * A loaded session waiting at `intro`.
 *
 * START is not sent here. It comes from the Mula tap, and that tap is the
 * gesture iOS requires before any audio can begin (SPEC 8, Brief 03); sending it
 * automatically would spend the gesture before the child made one and leave
 * autoplay silently refused for the whole run.
 */
function freshSession(isFirstClear: boolean): SessionState {
  return sessionReducer(createSession(ACTIVITY_ID, isFirstClear), {
    type: 'LOADED',
    questions: loadActivityQuestions(),
  });
}

/**
 * The same session, already started — for a replay.
 *
 * The start screen has exactly one job: collect the gesture that unlocks audio.
 * By the time a child presses "Main lagi" that gesture has already happened, so
 * the screen has no job left and would be one more tap between the child and
 * playing. A child pressing "play again" wants to play.
 */
function replaySession(): SessionState {
  return sessionReducer(freshSession(false), { type: 'START', nowMs: now() });
}

function now(): number {
  return Date.now();
}

interface QuizStore {
  session: SessionState;
  /** True when this session came back from storage rather than starting fresh. */
  restored: boolean;
  dispatch: (event: SessionEvent) => void;
  /** The Mula tap: unlocks audio, then opens the first question. */
  start: () => void;
  answer: (response: Extract<SessionEvent, { type: 'ANSWER' }>['response']) => void;
  next: () => void;
  restart: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => {
  const saved = loadSession(ACTIVITY_ID);
  // Opening the app is treated as a first clear. Nothing records past clears
  // yet — that arrives with the progress store in Phase 2 — so "first" here
  // means "not a replay within this run", which is as much as this build knows.
  const session = saved ?? freshSession(true);
  // Persist immediately, not just on the first answer: the option order is
  // shuffled once when the session is built, and it has to survive a reload
  // taken before the child has answered anything.
  if (!saved) saveSession(session);

  return {
    session,
    restored: saved !== null,

    dispatch: (event) => {
      const session = sessionReducer(get().session, event);
      if (session === get().session) return;
      saveSession(session);
      set({ session });
    },

    // Unlock first, dispatch second, both inside the press handler's own call
    // stack. Resuming an AudioContext outside the gesture is refused on iOS, and
    // the order matters for a subtler reason too: START renders the first
    // question, whose AudioButton checks `unlocked()` as it mounts. Unlocking
    // after would make the first prompt the one question that is never read.
    start: () => {
      promptPlayer.unlock();
      get().dispatch({ type: 'START', nowMs: now() });
    },

    answer: (response) => get().dispatch({ type: 'ANSWER', response, nowMs: now() }),
    next: () => get().dispatch({ type: 'NEXT', nowMs: now() }),

    restart: () => {
      clearSession();
      // Straight into the first question, no start screen. Audio was unlocked
      // long before "Main lagi" could be pressed, so that screen has no job left
      // — it would only stand between the child and playing. (Brief 03)
      //
      // A replay, so no first-clear bonus. (SPEC 5.3)
      const session = replaySession();
      saveSession(session);
      set({ session, restored: false });
    },
  };
});
