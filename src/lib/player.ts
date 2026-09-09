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
   * runs when the clip ends, fails, or is cut off by another play — exactly
   * once, so a caller can clear a "playing" flag without the UI sticking on.
   */
  play(src: string, onSettled?: () => void): void;
  stop(): void;
  /** Which clip is playing, or null. */
  playing(): string | null;
}

export function createPlayer(makeSound: SoundFactory): Player {
  const cache = new Map<string, Sound>();
  let currentSrc: string | null = null;
  let settle: (() => void) | null = null;

  /** Run the pending callback once, whatever ended the clip. */
  function finish(): void {
    const pending = settle;
    settle = null;
    currentSrc = null;
    pending?.();
  }

  function stop(): void {
    if (currentSrc === null) return;
    const sound = cache.get(currentSrc);
    sound?.off();
    sound?.stop();
    finish();
  }

  function play(src: string, onSettled?: () => void): void {
    stop();

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
