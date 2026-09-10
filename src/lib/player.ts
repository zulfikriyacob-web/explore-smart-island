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

/** The slice of Howl this module uses. Narrow on purpose, so a fake is cheap. */
export interface Sound {
  play(): void;
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
   * Record that a real user gesture has happened. Callers check `unlocked()`
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
    clip.play();
  }

  return {
    play,
    stop,
    playing: () => currentSrc,
    prefetch: (src) => {
      sound(src);
    },
    unlock: () => {
      if (gestured) return;
      gestured = true;
      onUnlock?.();
    },
    unlocked: () => gestured,
  };
}

/** Wraps a Howl in the narrow shape above. */
export function howlSound(src: string): Sound {
  const howl = new Howl({ src: [src], preload: true });
  return {
    play: () => {
      howl.play();
    },
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
 * Resume the shared AudioContext. Howler creates it suspended when the page has
 * had no gesture, and a suspended context plays nothing while still reporting
 * that it is playing — the trap CLAUDE.md records. Resuming has to happen inside
 * the gesture's own call stack, which is why `unlock()` is called straight from
 * the press handler rather than from an effect afterwards.
 */
function resumeContext(): void {
  const ctx = Howler.ctx as AudioContext | undefined;
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}

export const promptPlayer: Player = createPlayer(howlSound, resumeContext);
