/**
 * Prompt audio playback (SPEC §8).
 *
 * One prompt is audible at a time. Starting a clip stops whatever was playing,
 * including the same clip — pressing the replay button during playback restarts
 * it from the beginning rather than doing nothing, because a button that ignores
 * a press is a button a child reads as broken. That is the same reasoning that
 * hides the control entirely while its file is a zero-byte placeholder
 * (`lib/audio.ts`).
 *
 * Sounds are made through an injected factory: `createPlayer` holds the state
 * machine and knows nothing about Howler, so it can be tested without a browser.
 * `promptPlayer` is the instance the app uses.
 *
 * Autoplay is gated on a real gesture. iOS refuses to start audio without one
 * (SPEC §8), so `unlock()` runs on the first tap — the Mula button on the start
 * screen, or, for a restored session that never sees that screen, whatever the
 * child touches first. Until then `unlocked()` is false and callers must not
 * autoplay: a clip that silently fails to start teaches nothing, and the child
 * is not told the difference.
 *
 * Unlocking is deliberately not retroactive. It does not start the question
 * already on screen, because a restored session's first tap is usually an
 * answer, and reading the prompt aloud after it has been answered is worse than
 * silence. (Brief 03)
 */

import { Howl, Howler } from 'howler';

// TEMPORARY — diagnostics for the iOS no-sound bug. Record only: nothing below
// changes when audio unlocks or plays. Delete with the branch.
import { howlerState, inGesture, record, watchAutoResume } from './diagnostics.ts';

/** The slice of Howl this module uses. Narrow on purpose, so a fake is cheap. */
export interface Sound {
  /**
   * Returns whatever the backend hands back — Howler gives a sound id number.
   * TEMPORARY: it is surfaced only so the diagnostics can show what `play()`
   * returned on the device. Nothing branches on it.
   */
  play(): unknown;
  stop(): void;
  /**
   * `end` fires at the end of the clip; `loaderror` and `playerror` fire when it
   * cannot be loaded or started.
   */
  once(event: 'end' | 'loaderror' | 'playerror', handler: () => void): void;
  /** Drop every handler registered on this sound. */
  off(): void;
}

export type SoundFactory = (src: string) => Sound;

export interface Player {
  /**
   * Play `src` from the start, stopping anything already playing. `onSettled`
   * runs at most once, when the clip ends, fails, or is stopped outright.
   *
   * It does **not** run when another `play` takes over. The callback is how a
   * caller turns its "playing" indicator off, and a play that replaces another
   * has audio going — from the top, but going. Settling there would clear an
   * indicator that a caller had just set.
   */
  play(src: string, onSettled?: () => void): void;
  /** Stop playback and settle, as when a screen goes away. */
  stop(): void;
  /** Which clip is playing, or null. */
  playing(): string | null;
  /**
   * Build and cache the sound for `src` without playing it. SPEC §7.6 asks for
   * one question ahead, not all ten — prefetching the lot is what kills a slow
   * connection.
   */
  prefetch(src: string): void;
  /**
   * Arm the audio backend before the first gesture, and throw the result away.
   *
   * This is the fix for the iPhone silence. Howler builds its AudioContext
   * lazily — only `Howler.volume`, `Howler.mute`, `Howler.unload` and the `Howl`
   * constructor create it — and it registers its own unlock listeners from one
   * place only, inside `Howl.init`:
   *
   *     if (Howler.ctx && Howler.autoUnlock) Howler._unlockAudio();
   *
   * `_unlockAudio` returns immediately when there is no context, then registers
   * capture-phase touchstart/touchend/click/keydown handlers that play a scratch
   * buffer and call `ctx.resume()` inside the gesture. That is the path Howler
   * has tested on real iOS hardware, and it works — measured on the device, the
   * second tap unlocks. It missed the first tap only because nothing had built a
   * Howl yet, so those listeners registered 32ms after the press had gone.
   *
   * Building one Howl before the child can press hands Howler a context and lets
   * it arm itself in time.
   *
   * **A weapon, not a cache.** `_unlockAudio` calls `Howler.unload()` when the
   * sample rate is not 44100 — 48000 on a modern iPhone — which unloads Howls
   * and rebuilds the context. A Howl that survives that is dead in a way that
   * does not announce itself: `play()` on an unloaded Howl pushes to its queue,
   * returns a sound id, and never loads again. So this one is deliberately not
   * kept, and nothing is allowed to prefetch through it. The bytes are not
   * wasted — the browser's HTTP cache still has them for the real play.
   */
  arm(src: string): void;
  /**
   * Record that a real user gesture has happened, and make the audio context
   * ready inside that gesture's own call stack. Callers check `unlocked()`
   * before autoplaying; pressing a button to play is always allowed, gesture or
   * not, because the press *is* the gesture.
   */
  unlock(): void;
  /** Has a gesture happened yet? */
  unlocked(): boolean;
}

export function createPlayer(makeSound: SoundFactory, onUnlock?: () => void): Player {
  const cache = new Map<string, Sound>();
  let currentSrc: string | null = null;
  let settle: (() => void) | null = null;
  let gestured = false;
  let armed = false;

  /** One sound per src, built on first use and kept. */
  function sound(src: string): Sound {
    let s = cache.get(src);
    if (!s) {
      s = makeSound(src);
      cache.set(src, s);
    }
    return s;
  }

  /** Forget the current clip, handing back the callback that was waiting on it. */
  function release(): (() => void) | null {
    const pending = settle;
    settle = null;
    currentSrc = null;
    return pending;
  }

  /** Run the pending callback once, whatever ended the clip. */
  function finish(): void {
    release()?.();
  }

  /**
   * Silence whatever is playing and drop its handlers, returning the callback
   * that was waiting on it so the caller can decide whether it has settled.
   */
  function halt(): (() => void) | null {
    if (currentSrc === null) return null;
    const sound = cache.get(currentSrc);
    sound?.off();
    sound?.stop();
    return release();
  }

  function stop(): void {
    halt()?.();
  }

  function play(src: string, onSettled?: () => void): void {
    // Silenced, but not settled: the new clip takes the old one's place, so the
    // caller's "playing" indicator should stay on rather than blink off and
    // straight back. Only an end, a failure, or an explicit stop settles.
    //
    // One caller at a time is the assumption that makes this safe — there is a
    // single AudioButton on screen, and it stops its clip explicitly when the
    // question changes. Two callers sharing this player would leave the older
    // one's indicator stuck on.
    halt();

    const clip = sound(src);

    currentSrc = src;
    settle = onSettled ?? null;

    // A clip that fails to load has to settle too, or the pulse never stops and
    // the button sits mid-play forever.
    clip.once('end', finish);
    clip.once('loaderror', finish);
    clip.once('playerror', finish);

    // TEMPORARY diagnostics.
    record('play() called', {
      src: src.replace('/audio/ms/', ''),
      inGesture: inGesture(),
      ...howlerState(),
    });
    try {
      const id = clip.play();
      record('play() returned', { id: id === undefined ? 'undefined' : String(id) });
    } catch (err) {
      record('play() THREW', { error: String(err) });
    }
  }

  return {
    play,
    stop,
    playing: () => currentSrc,
    prefetch: (src) => {
      sound(src);
    },
    arm: (src) => {
      // Once only. Howler's `_unlockAudio` sets `autoUnlock` false the first
      // time it runs, so a second Howl cannot register those listeners again —
      // it would only cost another request. (React's development double-effect
      // makes this reachable immediately, not just in theory.)
      if (armed) return;
      armed = true;
      // Not cached, on purpose — see the interface. The return value is dropped.
      makeSound(src);
    },
    unlock: () => {
      // TEMPORARY diagnostics.
      record('unlock()', { alreadyGestured: gestured, inGesture: inGesture() });
      gestured = true;
      // Always, not just the first time. This used to return early once the flag
      // was set, and on the start screen the window listener in App set it a few
      // milliseconds before the button's own handler ran — so the context work
      // was skipped in the one call stack where iOS would have honoured it. The
      // flag is bookkeeping; the context work has to happen wherever a gesture
      // is, and resuming an already-running context costs nothing.
      onUnlock?.();
    },
    unlocked: () => gestured,
  };
}

/** Wraps a Howl in the narrow shape above. */
export function howlSound(src: string): Sound {
  const howl = new Howl({ src: [src], preload: true });
  // TEMPORARY diagnostics: building the Howl is what creates Howler's
  // AudioContext, so when it happens is itself a finding.
  record('Howl built', { src: src.replace('/audio/ms/', ''), ...howlerState() });
  howl.once('loaderror', (_id, err) => record('loaderror', { error: String(err) }));
  howl.once('playerror', (_id, err) => record('playerror', { error: String(err) }));
  return {
    play: () => howl.play(),
    stop: () => {
      howl.stop();
    },
    once: (event, handler) => {
      howl.once(event, handler);
    },
    off: () => {
      howl.off();
    },
  };
}

/**
 * Does a context in this state need resuming?
 *
 * The rule is "anything that is not running", not "suspended". That is the whole
 * of the fourth iPhone bug: our test was `ctx.state === 'suspended'`, and Safari
 * reported **`'interrupted'`** — a state that is not in the Web Audio spec at
 * all. It failed the test, `resume()` was never called, and `play()` went on to
 * park itself forever on a context that was never going to run.
 *
 * `resume()` on a running context is a documented no-op, so the safe direction
 * is to resume unless we can see that it is already running. That covers
 * `suspended`, `interrupted`, `closed`, and whatever Safari invents next —
 * which is the point, because the narrow test is what broke.
 */
export function needsResume(state: string | null | undefined): boolean {
  return state !== 'running';
}

/** The slice of the Howler global this module drives. */
interface HowlerLike {
  ctx?: AudioContext | null;
  state?: string;
  volume(vol?: number): unknown;
  _autoResume?: () => unknown;
}

/**
 * Make sure there is an AudioContext, and get it running — both inside whatever
 * call stack this runs in, which is a press handler.
 *
 * Creating it first matters. Measured on the iPhone: at the moment Mula was
 * pressed there was no context at all, so the resume had nothing to act on, and
 * the context that appeared 32ms later was born suspended outside any gesture.
 *
 * `Howler.volume()` is the cheapest public call that runs Howler's own
 * `setupAudioContext()` without building a Howl: it creates the context before
 * it looks at its argument, and passing the current volume back in changes
 * nothing. We touch `Howler.ctx` rather than making our own context, because
 * Howler plays through that one — resuming any other object would be resuming
 * something that makes no sound.
 *
 * **Why `_autoResume()` and not `ctx.resume()`.** `Howl.play()` gates on
 * `Howler.state`, Howler's own bookkeeping, not on `ctx.state`:
 *
 *     // howler.js 2.2.4, line 886
 *     if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
 *       playWebAudio();
 *     } else {
 *       self._playLock = true;
 *       self.once('resume', playWebAudio);   // parked
 *     }
 *
 * Resuming the raw context leaves `Howler.state` saying 'suspended', so play
 * still takes that second branch and parks. `_autoResume()` (line 511) is the
 * only thing that resumes, sets `state = 'running'`, and emits `'resume'` to
 * every Howl — which is what releases the parked plays.
 *
 * It is an internal method, and that is a real cost, accepted for one reason:
 * every alternative is worse. Writing `Howler.state` ourselves also touches
 * internals **and** emits nothing, so the parked plays stay parked.
 */
export function resumeAudioContext(H: HowlerLike): void {
  if (!H.ctx) {
    try {
      H.volume(H.volume() as number);
      record('ctx created in handler', howlerState());
    } catch (err) {
      record('ctx create THREW', { error: String(err) });
    }
  }

  const ctx = H.ctx;

  // TEMPORARY diagnostics.
  record('resumeAudioContext()', {
    inGesture: inGesture(),
    willResume: needsResume(ctx?.state),
    howlerState: H.state ?? null,
    ...howlerState(),
  });

  if (!ctx || !needsResume(ctx.state)) return;

  /*
    Fail loudly if this ever goes missing.

    Falling back to `ctx.resume()` would look like it worked — the context would
    resume, `Howler.state` would still read 'suspended', and every play would
    park in silence. That is exactly this bug, returning with no warning. A
    Howler upgrade that removes `_autoResume` has to break in the open, on the
    first run, in front of whoever did the upgrade.
  */
  if (typeof H._autoResume !== 'function') {
    record('_autoResume MISSING', { howler: 'upgrade broke the resume path' });
    throw new TypeError(
      'Howler._autoResume is gone. It is the only call that resumes the context, ' +
        'sets Howler.state to running, and emits "resume" to release parked plays. ' +
        'Do not fall back to ctx.resume(): that resumes the context while leaving ' +
        'Howler.state suspended, so every play parks silently — the iOS bug this ' +
        'replaced. Port the equivalent of howler 2.2.4 line 511 instead.',
    );
  }

  try {
    // TEMPORARY: watch what _autoResume actually does, rather than assuming.
    // The previous instrumentation read ctx.state straight after the call, which
    // can only ever show the old value — resume() is asynchronous. It proved
    // nothing either way.
    watchAutoResume(H, ctx);
  } catch (err) {
    record('_autoResume() THREW', { error: String(err) });
  }
}


/*
  Howler suspends its own context after 30 seconds with nothing playing
  (`_autoSuspend`, line 461, on by default at line 52), and on iOS that shows up
  as `ctx.state === 'interrupted'`.

  This app has a start screen a child can stare at and questions a child is meant
  to think about, so that 30-second window is not an edge case — it is the normal
  shape of a session. Measured on the iPhone: the context was already
  'interrupted' 54 seconds in, before a single clip had played. We suspended our
  own audio by waiting.

  The battery saving is not worth silence.
*/
Howler.autoSuspend = false;

export const promptPlayer: Player = createPlayer(howlSound, () =>
  resumeAudioContext(Howler as unknown as HowlerLike),
);
