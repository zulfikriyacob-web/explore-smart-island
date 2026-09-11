# Brief 03 — the start screen, and the gesture that lets audio speak

Closes Phase 1 exit criterion 7: a child who cannot yet read finishes an
activity with no adult. It failed for one reason — the prompt never read
itself, so the child had to already know a speaker button existed and press
it. iOS will not start audio without a gesture, and there was no gesture to
give.

Ten commits. Two build the screen; six chase four separate causes of total
silence on iPhone; one records what was learned; one takes the diagnostics
back out.

---

## The screen

A 44px name slot reserved at Y 24, empty until child profiles arrive in
Phase 2. The kancil idle at 200px, the activity title, and a 96px **Mula**
button anchored to the bottom.

96 rather than 88 because it is the only target on the screen, so the floor
that exists to stop a child hitting the button next door does not apply.

The button takes a filled `--laut` face with a `--laut-dark` border — the one
place a module colour is used as a face. Text is `--arang` at **4.78:1**;
white would be 2.57:1, the mistake DESIGN 2.4 calls out by name.

> **Recorded, not fixed:** against its own `--laut` face the border is
> **2.03:1**, below the 3:1 floor. Every other button in the app has a white
> face, so this is the first time the inner side of a border has been visible
> at all. The border still separates the button from the background, which is
> what the floor is for; the inner edge reads as a darker rim of the same
> colour rather than as the button's boundary.

### Where it appears

Exactly one case: **a cold start with no saved session.** That is the only
moment the gesture does not yet exist.

- A **restored** session comes back at `question` and never sees it. The first
  tap anywhere counts as the gesture instead.
- **"Main lagi"** sends `START` immediately. Audio was unlocked long before
  that button could be pressed, so the screen has no job left there — it would
  only be one more tap between a child who just asked to play and playing.

There is no speaker icon and no audio setting on it, deliberately. Half the
ways in never see it, so any promise about sound made there would be untrue
for them.

---

## Four causes of silence on iPhone

None of this was reproducible on the development machine. Both it and the
Browser pane report a non-Apple `navigator.vendor` and let audio start with no
trusted gesture, so the unlock path never runs there. Every number below came
off the device, through a temporary on-screen readout that was removed once
the fix was confirmed.

**1. The gesture was spent before the button's own handler ran.** A
capture-phase `window` listener — added so a restored session could unlock on
its first tap — fired a few milliseconds earlier and took the gesture with it.
Measured: `unlock()` at 2641ms with `alreadyGestured:false`, the press at
2646ms with it `true`. The button's handler was the one call stack iOS would
have honoured, and it was the one that did nothing.

**2. There was no AudioContext to resume at the moment of the tap.** Howler
builds it lazily, and registers its own unlock listeners from exactly one
place — inside `Howl.init`, and only when a context already exists. On a cold
start nothing built a Howl until the question screen mounted, 32ms after the
press, so those listeners registered after the gesture had gone.

**3. We suspended our own audio by waiting.** `Howler.autoSuspend` defaults on
and suspends the context after 30 seconds of silence, which iOS reports as
`interrupted`. An app with a start screen a child can stare at and questions a
child is meant to think about hits that as a matter of course — measured at 54
seconds, before a single clip had played.

**4. Our own resume was the thing that hung.** A bare `ctx.resume()` issued
1.3s into the page did not settle for 2.2 seconds — never rejected, simply
unsettled — and resolved only when the *next* gesture arrived. Howler never
issues a bare resume: `_unlockAudio` plays a silent scratch buffer, starts it,
and resumes after. That ordering is not decoration.

### What fixed it

- **Arm Howler before the first gesture.** `StartScreen` builds one Howl on
  mount, which creates the context and lets `_unlockAudio` register its
  listeners while the screen is still waiting for a tap. It is a **weapon, not
  a cache**: `_unlockAudio` calls `Howler.unload()` when the sample rate is not
  44100 (48000 on an iPhone), and an unloaded Howl still answers `play()` with
  a sound id while making no sound.
- **The window listener no longer arms at intro**, so the button gets its own
  gesture.
- **`Howler.autoSuspend = false`.** The battery saving is not worth silence in
  an app built around thinking time.
- **Our resume is gone entirely.** With Howler's listeners armed, it was not
  only redundant — it crowded out the tested path. After removing it, every
  resume in the log comes from `unlock@howler` and sound arrives on the first
  tap.

Global instrumentation went in alongside that last change, so the result would
be readable either way: with our resume gone, sound coming back would
otherwise not tell us *whose* path fixed it. It named them —
`HowlerGlobal._autoResume <- HTMLDocument.unlock`, with no `player.ts` frame
anywhere.

---

## Autoplay waits rather than parking a play

Fixed separately, and it stands even though the silence is gone.

`Howl.play()` on a suspended context parks the playback and returns a sound id:

```js
// howler.js 2.2.4, line 886
if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
  playWebAudio();
} else {
  self._playLock = true;
  self.once('resume', playWebAudio);   // parked
}
```

**Nothing outside can cancel that park.** It is released whenever the context
next returns — which can be after the child has answered and gone. Measured:
a resume issued at 1.3s settled at 3.5s, on the tap that answered the
question, and the prompt then read itself aloud to a child who had already
answered.

It will happen again: `interrupted` returned 28 seconds into a session with
`autoSuspend` already off, so that one was Safari — a call, the lock screen,
another app taking the audio session.

So autoplay no longer hands a play to a context that cannot make sound. It
waits on the context's own `statechange`, and the wait is **cancellable** —
withdrawn as soon as the child engages (`status === 'question' && attempts === 0`),
on a question change, and on unmount. The replay button is unaffected: pressing
it plays whatever the context is doing, because the press is itself the
gesture and a button that waited would be the broken button again.

> **A deviation, with its reason.** The gate reads `ctx.state === 'running'`,
> not `Howler._audioUnlocked`. `_audioUnlocked` is the more honest evidence —
> it is set from `source.onended` on a scratch buffer that really played — but
> nothing fires when it flips, so a wait hung on it can be stranded, and on the
> device it turned true a moment *after* the context started running. Gating on
> it would have made the first prompt less likely to play, not more.

---

## Also in here

- **Autoplay and one-ahead prefetch** (SPEC 7.6) — audio and images for the
  next question only, never all ten.
- **SPEC section 8** gains the five iOS audio rules, with the source quoted so
  nobody has to take the parked-play claim on trust, and a warning at the top:
  do not amend without measuring on a real iPhone.
- **PRD section 16 question 8** is marked resolved, with the restore decision
  recorded alongside it.
- **The diagnostics are gone** — both files, both mounts, every call, and the
  coverage exclusion that existed only for the throwaway file. Coverage went
  **up**: `player.ts` at 97.18% statements, 100% lines.

---

## Verification

Measured in a renderer that fires **no animation frames** and reports
`document.hidden === true`, which is the house adversarial test for
CLAUDE.md principle 5.

**Frame 0** — 0 frames in 450ms with the whole start screen painted: name slot
at Y 24 height 44, kancil 200, title, button 96, every one at composited
opacity 1 with no transform, and the button works. No overflow on either axis
at 390×740 or 360×780.

**Audio**, read through `window.Howler._howls` rather than a second import of
the player module:

| | |
|---|---|
| Before the tap | context present, `autoUnlock` false, one arming Howl |
| After the tap | `ctx.state` **and** `Howler.state` both running, q001 playing, q002 prefetched, arming Howl inert |
| Replay hammered during autoplay | exactly one clip playing, one running sound |
| Advancing mid-clip | old question stops, new one starts |

**Autoplay gate**, with the context put down by hand:

| | |
|---|---|
| Context down at mount, returns with no answer given | q001 plays |
| Context down at mount, child answers first, context returns | nothing plays |

**Restore** — reloaded mid-activity: comes back at question 2 of 10 with no
Mula screen and nothing playing; the first tap, an answer, stays silent;
question 3 then autoplays; q004 prefetched.

**"Main lagi"** — straight to question 1 of 10, no Mula screen, stored session
`question` / index 0 / `isFirstClear` false, question clock running, q001
autoplays.

**What the pane cannot show, and is not claimed:** it lets audio start with no
trusted gesture and its UA is Android, so the iOS unlock path is never
exercised there. Everything about iOS in this PR was measured on the phone.

142 tests pass, typecheck clean, `validate:content` 0 errors, production build
succeeds.

---

## Notes for review

- **Open the PR from `fix/ios-audio-unlock`**, not `feat/start-screen` — the
  latter is its ancestor and carries only the first two of the ten commits.
- One test changed meaning rather than being adjusted to pass: it asserted
  `onUnlock` fired once across three `unlock()` calls, on the reasoning that
  resuming a running context is waste. That assertion *was* the bug written
  down. It was corrected, and later removed with the code it covered.
- `needsResume` and its regression tests went with the resume they guarded. A
  comment sits where that code was: **if any resume of ours ever comes back,
  the guard comes back with it.** The bug it caught was a state test narrower
  than reality (`=== 'suspended'` against Safari's `'interrupted'`), and
  nothing about that mistake has stopped being easy to make.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
