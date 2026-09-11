# fix(audio): the start screen speaks on iPhone

**Branch:** `fix/ios-audio-unlock` → `main` · 8 commits

## Why this is urgent

PR #29 merged `feat/start-screen` — the start screen and its gesture gate —
but not these eight commits. So **`main` today ships a start screen that is
completely silent on iPhone**: the child presses Mula and the prompt is never
read. That is Phase 1 exit criterion 7, failing on the device the criterion is
most likely to be tested on.

## Where every number comes from

This bug cannot be reproduced on the development machine. The Browser pane
reports `navigator.vendor` as "Google Inc.", runs an Android user agent, and
lets audio start with no trusted gesture — so the iOS unlock path never runs
there. The measurements therefore come from three different places, and each
one is labelled:

- **[iPhone]** — read off a real iPhone through a temporary on-screen log,
  copied back by hand. The log was removed in the last commit of this PR.
- **[pane]** — the Browser pane. Useful for layout and for checking that the
  code does what it says; says nothing about iOS.
- **[source]** — `node_modules/howler/dist/howler.js`, version 2.2.4, by line.

A claim with no label is not in this PR.

---

## Four causes, found one at a time

Each fix exposed the next. They are listed in the order the device revealed
them.

### 1. The gesture was spent before the button ran

A capture-phase `window` listener, added so a restored session could unlock on
its first tap anywhere, fired first on the start screen and took the gesture
with it. The button's own handler was then the one call stack iOS would have
honoured, and it returned early.

```
[iPhone]   25ms  start screen        ctx: MISSING, autoUnlock: true
         2641ms  unlock()            alreadyGestured: false   <- window listener
         2641ms  resumeContext()     ctx: MISSING, willResume: false
         2646ms  press Mula          isTrusted: true
         2646ms  unlock()            alreadyGestured: true    <- returned early
```

### 2. There was no AudioContext at the moment of the tap

Howler builds its context lazily. **[source]** `setupAudioContext()` is called
from exactly four places — `Howler.volume` (75), `Howler.mute` (123),
`Howler.unload` (182) and `Howl.init` (578) — and `_unlockAudio()` from exactly
one, inside `Howl.init` (627), which returns immediately if there is no context
(305). On a cold start the first Howl was built when the question screen
mounted, after the press.

```
[iPhone] 2678ms  Howl built q002     ctx present, SUSPENDED, autoUnlock: false
         2701ms  play() q001         ctxState: suspended, inGesture: false
         2701ms  play() returned     id 1003                  <- silent
```

Howler's own unlock listeners registered 32ms after the gesture had gone.
Confirmed the cheap way before any code was written: **[iPhone]** the *second*
tap unlocked — `ctxState: running`, `_audioUnlocked: true`, and sound.

### 3. We suspended our own audio by waiting

**[source]** `Howler.autoSuspend` defaults to `true` (52), and `_autoSuspend()`
suspends the context after 30 seconds with nothing playing (483). A start
screen a child can stare at and questions a child is meant to think about hit
that window as a matter of course.

```
[iPhone] 54894ms resumeContext()     inGesture: true, willResume: false,
                                     ctxState: "interrupted"
                 play()              returned id 1004         <- silent
```

`interrupted` is a Safari state that is not in the Web Audio spec. Our resume
test was `=== 'suspended'`, so it did not resume at all — and the context had
gone `interrupted` 54 seconds in, before a single clip had played.

### 4. Our own resume was the thing that hung

With the first three fixed, `resume()` was being called inside the gesture and
still nothing happened:

```
[iPhone] 1819ms  _autoResume()       willResume: true, inGesture: true
         1832ms  ctx suspended · Howler.state suspended
         4292ms  ctx suspended · Howler.state suspended   <- 2.4s later
```

A second run with the promise watched directly showed why:

```
[iPhone] run A — waited 34s before pressing
        34697ms  ctx.resume() called
        34832ms  RESOLVED                  <- 135ms
                 sound

         run B — pressed at 1.3s
         1323ms  ctx.resume() called
         1357ms  play() called while suspended   <- parked
         1573ms  +250ms  still suspended
         3323ms  +2s     still suspended
         3448ms  press "Jawapan 74"
         3575ms  RESOLVED                  <- only on the next gesture
```

The promise was never rejected. It simply did not settle until another gesture
arrived — and the parked play was then released, so the prompt read itself
aloud to a child who had already answered.

**[source]** Howler never issues a bare resume. `_unlockAudio` plays a silent
scratch buffer with `start(0)` first and calls `ctx.resume()` after it
(371–386). Ours skipped that ordering.

---

## What fixed it

- **Arm Howler before the first gesture.** `StartScreen` builds one Howl on
  mount, so the context exists and `_unlockAudio` registers its listeners while
  the screen is still waiting. It is a weapon, not a cache: **[source]**
  `_unlockAudio` calls `Howler.unload()` when `sampleRate !== 44100` (315), and
  an unloaded Howl still answers `play()` with a sound id while making no sound.
- **The window listener no longer arms at intro**, so the button gets its own
  gesture.
- **`Howler.autoSuspend = false`.**
- **No resume of our own.** With Howler armed in time, ours was not just
  redundant — it crowded out the tested path.

**The result, [iPhone]** — arming checked when it landed, then the final run
with our resume removed:

```
before the tap    autoUnlock: false, howls: 1          <- armed (arming round)
resume #1–8       all from unlock@…/howler             <- no player.ts frame
afterMs           2577 → 1422 → 318 → 42               <- each tap brings Safari closer
5143ms            all eight resolved together
then              _audioUnlocked: true, and sound
```

---

## Autoplay waits instead of parking a play

Fixed separately, because it stands even though the silence is gone.

**[source]** `Howl.play()` on a suspended context does not fail:

```js
// howler.js 2.2.4, line 886
if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
  playWebAudio();
} else {
  self._playLock = true;
  self.once('resume', playWebAudio);   // parked
}
```

It parks the playback, returns a sound id, and **nothing outside can cancel
it**. Run B above is the harm: a prompt speaking after the child had answered.

And it will recur. **[iPhone]** `interrupted` came back at 33763ms after a
28-second wait with `autoSuspend` already off — so that one was Safari: a call,
the lock screen, another app taking the audio session.

So autoplay now waits on our side, where it can be called off. `audible()`
reads `ctx.state === 'running'`; `whenAudible()` waits on the context's own
`statechange` and returns a cancel; the wait is withdrawn the moment the child
engages (`status === 'question' && attempts === 0`), on a question change, and
on unmount. The replay button still plays immediately — the press is itself the
gesture.

**[pane]** Checked both directions by putting the context down by hand:

| | |
|---|---|
| Context down when question 1 mounts, returns before any answer | q001 plays |
| Context down when question 2 mounts, child answers first, context returns | nothing plays |

> The gate is `ctx.state`, not `Howler._audioUnlocked`. `_audioUnlocked` is the
> more honest evidence — it is set from `source.onended` on a buffer that really
> played — but nothing fires when it flips, so a wait hung on it can be stranded,
> and **[iPhone]** it turned true a moment *after* the context started running.

---

## Also in here

- **SPEC §8** gains the five rules above, with the source quoted, and a warning
  at the top: do not amend without measuring on a real iPhone.
- **The diagnostic panel is removed** — both files, both mounts, every call,
  and the coverage exclusion that existed only for it.

## Not verified on the device

The silence fix was confirmed on the iPhone. **The last two code commits were
not re-tested there**: the autoplay gate (`9db9c03`) and the removal of the
panel (`ec89a64`) were verified in the pane only, after the device had already
confirmed sound. One pass on the phone with this branch would close that.

## Tests

142 pass, typecheck clean, `validate:content` 0 errors, production build
succeeds. New tests cover the wait firing once, never after cancel, not
re-firing on an interruption and recovery; `audible()` disagreeing with the
gesture flag; and `howlerReadiness` against every context state.

## For review

- One test changed meaning rather than being adjusted to pass. It asserted the
  unlock side effect fired once across three calls, because resuming a running
  context is waste — which was cause 1 written down as a requirement.
- `needsResume` and its regression tests were removed with the resume they
  guarded. A comment sits where it was: if any resume of ours ever comes back,
  that guard comes back with it.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
