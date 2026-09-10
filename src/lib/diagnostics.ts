/**
 * TEMPORARY — diagnostics for the iOS audio-unlock bug. Delete with the branch.
 *
 * The bug: on iPhone, pressing Mula produces no sound at all. On a laptop the
 * same build autoplays correctly. The Browser pane cannot reproduce it — it
 * reports `navigator.vendor` as "Google Inc.", runs an Android UA, and lets
 * audio start with no trusted gesture, so the iOS unlock path is never taken
 * there (CLAUDE.md). Nothing measured on this machine is evidence about iPhone.
 *
 * So the measurement has to happen on the device. This records what actually
 * occurred, in order, and `DiagnosticsPanel` renders it on screen for a person
 * holding the phone to read back.
 *
 * It records only. Nothing here changes when audio is unlocked or played — a
 * diagnostic that alters the thing it measures would answer a different
 * question than the one asked.
 */

export interface DiagEntry {
  /** Milliseconds since the module loaded. */
  t: number;
  label: string;
  data?: Record<string, unknown>;
}

const entries: DiagEntry[] = [];
const listeners = new Set<() => void>();
const t0 = Date.now();

/** Cap the log: a stuck loop must not eat the phone's memory mid-test. */
const MAX = 60;

export function record(label: string, data?: Record<string, unknown>): void {
  // Every entry carries the live audio state, not just the panel header.
  // `_audioUnlocked` in particular: it is set from `source.onended` on Howler's
  // scratch buffer, so it can only be true once a buffer has actually played.
  // It is downstream of real output rather than a flag we declared, which makes
  // it the most honest number on the screen.
  const live = liveAudio();
  entries.push({ t: Date.now() - t0, label, data: { ...(data ?? {}), ...live } });
  if (entries.length > MAX) entries.shift();
  for (const l of listeners) l();
}

/** The three numbers worth stamping on every line. Cheap, no allocation games. */
function liveAudio(): Record<string, unknown> {
  const H = (globalThis as unknown as { Howler?: Record<string, unknown> }).Howler;
  if (!H) return {};
  const ctx = H.ctx as AudioContext | undefined;
  return {
    _ctx: ctx?.state ?? 'none',
    _howler: (H.state as string | undefined) ?? 'none',
    _unlocked: H._audioUnlocked ?? null,
  };
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

export function snapshot(): readonly DiagEntry[] {
  return entries;
}

/**
 * Is the current call inside a press handler's own synchronous call stack?
 *
 * This is the question the brief asks about `resume()`: iOS only honours a
 * resume that happens inside the gesture, and a resume moved into a promise
 * continuation or an effect is outside it even though the code reads as if it
 * follows the tap. `BlockButton` and `AudioButton` set this around their
 * handlers, and it is a plain boolean rather than a stack inspection because it
 * has to be exact, not approximate.
 */
let gestureDepth = 0;

export function inGesture(): boolean {
  return gestureDepth > 0;
}

/** Run `fn` marked as being inside a gesture's synchronous stack. */
export function duringGesture<T>(fn: () => T): T {
  gestureDepth++;
  try {
    return fn();
  } finally {
    gestureDepth--;
  }
}

/**
 * Everything Howler will admit to about its own state.
 *
 * Read off the global — `window.Howler` is the one object the page can only
 * have one of. Importing the player module from a console would hand back a
 * second instance whose singleton is not the one running (CLAUDE.md), and the
 * same trap applies to any module-level cache here.
 */
export function howlerState(): Record<string, unknown> {
  const H = (globalThis as unknown as { Howler?: Record<string, unknown> }).Howler;
  if (!H) return { Howler: 'absent' };
  const ctx = H.ctx as AudioContext | undefined;
  return {
    // The heart of it: Howler builds its AudioContext lazily, so on the start
    // screen — where no Howl exists yet — `ctx` may simply not be there when the
    // Mula press tries to resume it.
    ctx: ctx ? 'present' : 'MISSING',
    ctxState: ctx?.state ?? null,
    // Howler's own bookkeeping, which is a different number from ctx.state and
    // is the one `Howl.play()` actually gates on (line 886). The two disagreeing
    // is the whole story of the fourth bug: ctx 'interrupted' while Howler still
    // said 'suspended', so play parked and never woke.
    howlerState: H.state ?? null,
    audioUnlocked: H._audioUnlocked ?? null,
    usingWebAudio: H.usingWebAudio ?? null,
    noAudio: H.noAudio ?? null,
    autoUnlock: H.autoUnlock ?? null,
    // Off deliberately: Howler suspends its own context after 30s of silence,
    // and a start screen plus thinking time hits that constantly.
    autoSuspend: H.autoSuspend ?? null,
    howls: Array.isArray(H._howls) ? H._howls.length : null,
  };
}

/**
 * TEMPORARY — see every `ctx.resume()` in the page, whoever makes it. Patches
 * `AudioContext.prototype.resume` once, observes, and delegates. Delete with the
 * branch.
 *
 * The previous version wrapped `ctx.resume` only for the duration of our own
 * call, which could never see Howler's. That mattered: our own bare resume is
 * gone now, so if the sound comes back we would have no way to tell whether
 * Howler's unlock path fixed it or something else did. A measurement that cannot
 * distinguish the two answers is not a measurement.
 *
 * Each call records where it came from, and whether the promise settles. That
 * last one is the finding from the device: a resume issued 1.3s into the page
 * hung for 2.2 seconds and only resolved when the *next* gesture arrived. It was
 * never rejected. It simply did not settle — and since `_autoResume` sets
 * `Howler.state = 'running'` and emits `'resume'` inside `.then()`, everything
 * downstream waited with it, including a parked prompt that then spoke after the
 * child had answered.
 */
export function watchEveryResume(): void {
  if (typeof AudioContext === 'undefined') return;
  const proto = AudioContext.prototype as AudioContext & { __watched?: boolean };
  if (proto.__watched) return;
  proto.__watched = true;

  const original = proto.resume;
  let seq = 0;

  proto.resume = function patched(this: AudioContext) {
    const n = ++seq;
    // Two frames past this one: enough to name the caller, short enough to read
    // on a phone. Howler's frames appear as _unlockAudio / _autoResume; ours
    // would appear as player.ts, and there should no longer be any.
    const from = (new Error().stack ?? '')
      .split('\n')
      .slice(2, 4)
      .map((l) => l.trim().replace(/^at\s+/, '').slice(0, 60))
      .join(' <- ');

    record(`resume() #${n} called`, { inGesture: inGesture(), from });

    const started = Date.now();
    const p = original.call(this);
    void Promise.resolve(p).then(
      () => record(`resume() #${n} RESOLVED`, { afterMs: Date.now() - started }),
      (err: unknown) => record(`resume() #${n} REJECTED`, { error: String(err) }),
    );

    // A resume that has not settled by now is the symptom, so say so rather than
    // leaving its absence to be inferred from a gap in the log.
    window.setTimeout(() => {
      if (this.state !== 'running') record(`resume() #${n} +250ms STILL NOT RUNNING`);
    }, 250);
    window.setTimeout(() => {
      if (this.state !== 'running') record(`resume() #${n} +2s STILL HANGING`);
    }, 2000);

    return p;
  } as AudioContext['resume'];

  record('resume() watcher installed');
}

/** Device facts that decide which branch of Howler runs. */
export function deviceState(): Record<string, unknown> {
  return {
    // Howler branches on this inside _cleanBuffer, the Safari path found while
    // chasing the restart bug. It is worth knowing which side we are on.
    vendor: navigator.vendor,
    isAppleVendor: navigator.vendor.indexOf('Apple') > -1,
    ua: navigator.userAgent.slice(0, 90),
    standalone: (navigator as { standalone?: boolean }).standalone ?? null,
  };
}
