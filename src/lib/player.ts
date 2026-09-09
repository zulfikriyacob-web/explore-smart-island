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
 * What this file does NOT do, deliberately: no gesture unlock, no autoplay when
 * a question appears, no preloading a question ahead (SPEC §8, §7.6). Those need
 * the intro screen the store currently skips, and that screen is a design
 * decision before it is code.
 */

import { Howl } from 'howler';

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
}

export function createPlayer(makeSound: SoundFactory): Player {
  const cache = new Map<string, Sound>();
  let currentSrc: string | null = null;
  let settle: (() => void) | null = null;

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

    let sound = cache.get(src);
    if (!sound) {
      sound = makeSound(src);
      cache.set(src, sound);
    }

    currentSrc = src;
    settle = onSettled ?? null;

    // A clip that fails to load has to settle too, or the pulse never stops and
    // the button sits mid-play forever.
    sound.once('end', finish);
    sound.once('loaderror', finish);
    sound.once('playerror', finish);
    sound.play();
  }

  return { play, stop, playing: () => currentSrc };
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

export const promptPlayer: Player = createPlayer(howlSound);
