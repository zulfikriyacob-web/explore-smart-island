import { describe, expect, it, vi } from 'vitest';

import { createPlayer, howlSound, type Sound } from './player.ts';

/**
 * Howler needs a window and an AudioContext; the test environment is `node`.
 * The state machine under test never touches it — only `howlSound` does, and
 * this stands in for it there. `vi.hoisted` because `vi.mock` is lifted above
 * the imports, and the factory closes over this array.
 */
interface FakeHowl {
  src: string[];
  play: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  once: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
}
const { howlInstances } = vi.hoisted(() => ({ howlInstances: [] as FakeHowl[] }));

vi.mock('howler', () => ({
  Howl: class {
    src: string[];
    play = vi.fn();
    stop = vi.fn();
    once = vi.fn();
    off = vi.fn();
    constructor(options: { src: string[] }) {
      this.src = options.src;
      howlInstances.push(this as unknown as FakeHowl);
    }
  },
}));

/** A sound that records what was asked of it and can be ended on demand. */
function fakeSound() {
  const handlers = new Map<string, () => void>();
  const calls = { play: 0, stop: 0, off: 0 };
  const sound: Sound = {
    play: () => void calls.play++,
    stop: () => void calls.stop++,
    once: (event, handler) => void handlers.set(event, handler),
    off: () => {
      calls.off++;
      handlers.clear();
    },
  };
  return {
    sound,
    calls,
    fire: (event: 'end' | 'loaderror' | 'playerror') => handlers.get(event)?.(),
    listening: () => [...handlers.keys()].sort(),
  };
}

function harness() {
  const made: Array<ReturnType<typeof fakeSound> & { src: string }> = [];
  const player = createPlayer((src) => {
    const f = Object.assign(fakeSound(), { src });
    made.push(f);
    return f.sound;
  });
  return { player, made, last: () => made[made.length - 1]! };
}

describe('createPlayer', () => {
  it('plays a clip and reports which one is playing', () => {
    const { player, last } = harness();
    player.play('/audio/ms/q001.mp3');
    expect(player.playing()).toBe('/audio/ms/q001.mp3');
    expect(last().calls.play).toBe(1);
  });

  it('nothing is playing before the first play', () => {
    const { player } = harness();
    expect(player.playing()).toBeNull();
  });

  it('listens for the end and for both failure events', () => {
    // A clip that never loads still has to settle, or the caller's "playing"
    // flag stays on and the pulse runs forever.
    const { player, last } = harness();
    player.play('/audio/ms/q001.mp3');
    expect(last().listening()).toEqual(['end', 'loaderror', 'playerror']);
  });

  it('settles once when the clip ends', () => {
    const { player, last } = harness();
    const settled = vi.fn();
    player.play('/audio/ms/q001.mp3', settled);
    last().fire('end');
    expect(settled).toHaveBeenCalledTimes(1);
    expect(player.playing()).toBeNull();
  });

  it('settles when the clip fails to load, and when it fails to play', () => {
    for (const failure of ['loaderror', 'playerror'] as const) {
      const { player, last } = harness();
      const settled = vi.fn();
      player.play('/audio/ms/q001.mp3', settled);
      last().fire(failure);
      expect(settled).toHaveBeenCalledTimes(1);
      expect(player.playing()).toBeNull();
    }
  });

  it('reuses one sound per source rather than building a new one each press', () => {
    const { player, made, last } = harness();
    player.play('/audio/ms/q001.mp3');
    last().fire('end');
    player.play('/audio/ms/q001.mp3');
    expect(made).toHaveLength(1);
    expect(made[0]!.calls.play).toBe(2);
  });

  it('restarts the same clip when it is played again mid-playback', () => {
    // A replay button that ignores a press reads as broken to a child.
    const { player, made } = harness();
    player.play('/audio/ms/q001.mp3');
    player.play('/audio/ms/q001.mp3');
    expect(made).toHaveLength(1);
    expect(made[0]!.calls.stop).toBe(1);
    expect(made[0]!.calls.play).toBe(2);
    expect(player.playing()).toBe('/audio/ms/q001.mp3');
  });

  it('stops the previous clip when a different one starts', () => {
    const { player, made } = harness();
    player.play('/audio/ms/q001.mp3');
    player.play('/audio/ms/q002.mp3');
    expect(made[0]!.calls.stop).toBe(1);
    expect(made[0]!.calls.off).toBe(1);
    expect(player.playing()).toBe('/audio/ms/q002.mp3');
  });

  it('never settles a clip that a new play took over, before or after', () => {
    // The settle callback exists so a caller can turn its "playing" indicator
    // off. A play that immediately replaces another must not turn it off: the
    // audio is still going, just from the top.
    const { player, made } = harness();
    const first = vi.fn();
    player.play('/audio/ms/q001.mp3', first);
    player.play('/audio/ms/q002.mp3');
    expect(first).not.toHaveBeenCalled();
    made[0]!.fire('end'); // handlers were dropped by off(); nothing more happens
    expect(first).not.toHaveBeenCalled();
  });

  it('keeps a caller flag set when the same clip is restarted mid-playback', () => {
    // This is the sequence AudioButton runs: set "playing", then ask the player
    // to play. play() stops what was going first, and if that stop settled the
    // press before it, the settle is the same component's "stop pulsing" — it
    // would clear the flag the press had just set, and the pulse would stop
    // over audio that had only just restarted.
    const { player } = harness();
    let pulsing = false;
    const press = () => {
      pulsing = true;
      player.play('/audio/ms/q001.mp3', () => {
        pulsing = false;
      });
    };
    press();
    expect(pulsing).toBe(true);
    press();
    expect(pulsing).toBe(true);
  });

  it('does not settle the clip that is now playing when an older one is stopped', () => {
    const { player, made } = harness();
    player.play('/audio/ms/q001.mp3');
    const second = vi.fn();
    player.play('/audio/ms/q002.mp3', second);
    expect(second).not.toHaveBeenCalled();
    made[1]!.fire('end');
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('stop() is safe when nothing is playing', () => {
    const { player, made } = harness();
    expect(() => player.stop()).not.toThrow();
    expect(made).toHaveLength(0);
    expect(player.playing()).toBeNull();
  });

  it('stop() ends playback and settles', () => {
    const { player, last } = harness();
    const settled = vi.fn();
    player.play('/audio/ms/q001.mp3', settled);
    player.stop();
    expect(last().calls.stop).toBe(1);
    expect(settled).toHaveBeenCalledTimes(1);
    expect(player.playing()).toBeNull();
  });

  it('play without a callback does not throw when the clip ends', () => {
    const { player, last } = harness();
    player.play('/audio/ms/q001.mp3');
    expect(() => last().fire('end')).not.toThrow();
  });

  it('prefetch builds the clip without playing it, and play reuses it', () => {
    // SPEC 7.6 wants one question ahead ready to go. "Ready" has to mean built
    // and loading, not started — a prefetch that made a sound would be the next
    // question talking over this one.
    const { player, made, last } = harness();
    player.prefetch('/audio/ms/q002.mp3');
    expect(made).toHaveLength(1);
    expect(last().calls.play).toBe(0);
    expect(player.playing()).toBeNull();

    player.play('/audio/ms/q002.mp3');
    // Still one sound: the prefetched object is the one that plays, which is the
    // whole point of prefetching it.
    expect(made).toHaveLength(1);
    expect(last().calls.play).toBe(1);
  });

  it('starts locked, and every unlock does the context work', () => {
    // The iOS gate (SPEC 8). Callers autoplay only when this is true, so it must
    // not be true before a gesture has actually happened.
    const onUnlock = vi.fn();
    const player = createPlayer(() => fakeSound().sound, onUnlock);
    expect(player.unlocked()).toBe(false);

    player.unlock();
    expect(player.unlocked()).toBe(true);
    expect(onUnlock).toHaveBeenCalledTimes(1);

    // Every later gesture does it again, and that is the point.
    //
    // This assertion used to read `toHaveBeenCalledTimes(1)` after three calls,
    // on the reasoning that resuming a running context is waste. It was, and it
    // was also the iPhone bug: on the start screen App's window listener called
    // unlock() a few milliseconds before the button's own handler, so the flag
    // was already set and the context work was skipped in the one call stack
    // iOS would have honoured. Cheap and skippable are not the same thing —
    // resuming a running context is a no-op, and being in the right stack is
    // not.
    player.unlock();
    player.unlock();
    expect(onUnlock).toHaveBeenCalledTimes(3);
  });

  it('arms without caching, so an unloaded weapon cannot be played later', () => {
    // The arming Howl exists to give Howler a context before the first gesture,
    // and Howler's own unlock may call unload() on it (sample rate 48000 on an
    // iPhone). An unloaded Howl still answers play() with a sound id and makes
    // no sound, so if arming shared the play cache that dead object would be the
    // one a child hears nothing from.
    const { player, made } = harness();
    player.arm('/audio/ms/q001.mp3');
    expect(made).toHaveLength(1);

    player.play('/audio/ms/q001.mp3');
    // A second, separate sound: the armed one was never cached.
    expect(made).toHaveLength(2);
    expect(made[0]!.calls.play).toBe(0);
    expect(made[1]!.calls.play).toBe(1);
  });

  it('a locked player still plays when asked directly', () => {
    // Pressing the speaker button *is* the gesture, so an explicit play is never
    // blocked. Only autoplay consults `unlocked()`.
    const { player, last } = harness();
    player.play('/audio/ms/q001.mp3');
    expect(last().calls.play).toBe(1);
    expect(player.unlocked()).toBe(false);
  });
});

describe('howlSound', () => {
  it('maps the narrow interface onto one Howl per source', () => {
    howlInstances.length = 0;
    const sound = howlSound('/audio/ms/q001.mp3');
    const howl = howlInstances[0]!;
    expect(howl.src).toEqual(['/audio/ms/q001.mp3']);

    const handler = () => {};
    sound.play();
    sound.once('end', handler);
    sound.stop();
    sound.off();

    expect(howl.play).toHaveBeenCalledTimes(1);
    expect(howl.once).toHaveBeenCalledWith('end', handler);
    expect(howl.stop).toHaveBeenCalledTimes(1);
    expect(howl.off).toHaveBeenCalledTimes(1);
  });
});
