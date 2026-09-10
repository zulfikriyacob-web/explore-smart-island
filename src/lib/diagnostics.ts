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
  entries.push({ t: Date.now() - t0, label, ...(data ? { data } : {}) });
  if (entries.length > MAX) entries.shift();
  for (const l of listeners) l();
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

/** The slice of the Howler global this instrumentation reads. */
interface HowlerProbe {
  ctx?: AudioContext | null;
  state?: string;
  usingWebAudio?: boolean;
  autoSuspend?: boolean;
  _suspendTimer?: unknown;
  _autoResume?: () => unknown;
}

/**
 * TEMPORARY — watch what `Howler._autoResume()` actually does. Observes and
 * delegates; changes nothing. Delete with the branch.
 *
 * The iPhone reported `_autoResume()` called inside the gesture, and both
 * `ctx.state` and `Howler.state` still 'suspended' 2.4 seconds later. Three
 * different things could produce that, and each needs its own measurement:
 *
 * 1. **Which branch runs.** Predicted here from the same tests howler 2.2.4
 *    uses at line 511, so a wrong prediction is itself a finding.
 * 2. **Whether `ctx.resume()` is called at all.** `ctx.resume` is wrapped for
 *    the duration of the call, so the answer comes from the context rather than
 *    from reading the library and hoping.
 * 3. **Whether the promise ever settles.** This is the one that matters:
 *    `_autoResume` sets `state = 'running'` and emits `'resume'` only inside
 *    `.then()`, so a promise that never settles leaves both stuck and every
 *    play parked in silence.
 *
 * The previous instrumentation read `ctx.state` straight after the synchronous
 * call, which can only ever show the old value. It proved nothing either way.
 */
export function watchAutoResume(H: HowlerProbe, ctx: AudioContext): void {
  const timer = H._suspendTimer;
  const usingWebAudio = H.usingWebAudio;

  /*
    howler 2.2.4, _autoResume, line 511 onward:

      if (!ctx || typeof ctx.resume === 'undefined' || !usingWebAudio)  -> return
      if (state === 'running' && ctx.state !== 'interrupted' && _suspendTimer)
                                                                       -> clear timer, NO resume
      else if (state === 'suspended' || (state === 'running' && ctx.state === 'interrupted'))
                                                                       -> resume
      else if (state === 'suspending')                                 -> defer
      else                                                             -> nothing at all
  */
  const branch =
    typeof ctx.resume === 'undefined' || !usingWebAudio
      ? 'early-return (no web audio)'
      : H.state === 'running' && ctx.state !== 'interrupted' && timer
        ? 'clear-timer — NO RESUME'
        : H.state === 'suspended' || (H.state === 'running' && ctx.state === 'interrupted')
          ? 'resume'
          : H.state === 'suspending'
            ? 'defer until suspend finishes — NO RESUME NOW'
            : 'NO BRANCH MATCHES — NO RESUME';

  record('_autoResume before', {
    howlerState: H.state ?? null,
    ctxState: ctx.state,
    // The suspicion worth killing: with autoSuspend off, `_autoSuspend` returns
    // at line 464 and never sets a timer, so this should be absent. Absent is
    // fine — the only branch that wants a timer is the branch that does not
    // resume, so turning autoSuspend off cannot disable the resume path.
    suspendTimer: timer === undefined ? 'undefined' : timer === null ? 'null' : 'set',
    autoSuspend: H.autoSuspend ?? null,
    usingWebAudio: usingWebAudio ?? null,
    branchPredicted: branch,
  });

  let resumeCalls = 0;
  const original = ctx.resume;
  ctx.resume = function patched(this: AudioContext) {
    resumeCalls++;
    const p = original.call(this);
    record('ctx.resume() called inside _autoResume', { call: resumeCalls });
    void Promise.resolve(p).then(
      () => record('ctx.resume() RESOLVED', { ctxState: ctx.state, howlerState: H.state ?? null }),
      (err: unknown) => record('ctx.resume() REJECTED', { error: String(err) }),
    );
    return p;
  } as AudioContext['resume'];

  try {
    H._autoResume?.();
  } finally {
    // Back to the prototype's method, not a copy of it.
    delete (ctx as unknown as { resume?: unknown }).resume;
  }

  record('_autoResume after', {
    resumeCalls,
    // Synchronous read: still the old value if a resume is in flight. Recorded
    // so the later samples have something to compare against.
    ctxState: ctx.state,
    howlerState: H.state ?? null,
  });

  // Did anything land? Two samples: a resume that settles late still settles,
  // and one that never settles is the diagnosis.
  window.setTimeout(
    () => record('+250ms', { ctxState: ctx.state, howlerState: H.state ?? null }),
    250,
  );
  window.setTimeout(() => record('+2s', { ctxState: ctx.state, howlerState: H.state ?? null }), 2000);
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
