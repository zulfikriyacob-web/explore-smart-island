# Handoff — 12 September 2026

What lives only in a session transcript until it is written down. Three sessions
of iOS audio work end here, at a proven root cause with the fix chosen and not
yet written.

Environment facts from the same sessions went to CLAUDE.md "Working notes"
instead; they are facts about this machine, not about this feature.

---

## 1. Why iOS was silent after pressing Mula, in full

The short version: **the Mula button removed itself from the DOM before the
browser dispatched `touchstart`, and an event dispatched on a detached node does
not propagate to `document`, which is where Howler's unlock listeners live.** The
first gesture of the session was therefore never seen by Howler, so the
AudioContext was never unlocked, so nothing was audible.

The chain, in order:

1. A child presses **Mula**. The browser dispatches `pointerdown` on the button
   first — Pointer Events fire ahead of the compatibility touch events for the
   same contact.
2. Our `onPointerDown` handler runs and dispatches `START` to the store.
3. React 18 flushes a discrete-event update in a microtask, i.e. before the
   browser gets back to dispatching the rest of the gesture. The start screen
   unmounts and the quiz screen mounts.
4. The browser now dispatches `touchstart` — on a node whose `isConnected` is
   already `false`. A detached node has no path to `document`, so the event has
   nowhere to bubble or capture through.
5. Howler 2.2.4 registers its unlock exclusively on the document, in capture
   phase, and **not** on `pointerdown`:

   ```js
   // node_modules/howler/dist/howler.js:409-412
   document.addEventListener('touchstart', unlock, true);
   document.addEventListener('touchend', unlock, true);
   document.addEventListener('click', unlock, true);
   document.addEventListener('keydown', unlock, true);
   ```

   None of those four ever reach it for this gesture. `touchstart` and
   `touchend` are dispatched on the detached button; `click` is never dispatched
   at all, because a click requires a target still in the tree.
6. `Howler._audioUnlocked` stays `false`, `ctx.state` stays `suspended`, and the
   autoplay gate we added last (`ctx.state === 'running'`) correctly declines to
   play into silence. The gate is not the bug — it is the thing that finally
   reported the bug honestly instead of claiming `playing() === true` over a dead
   context.

What was measured in the Browser pane, not inferred: `isConnected === false` on
the button at the moment the touch events would have been delivered. What is
read from the spec and from Howler's source rather than measured on the phone:
the `pointerdown`-before-`touchstart` order, and the four listener targets above.

**This is DOM semantics, not an iOS quirk.** It reproduces anywhere. iOS is only
where it *hurts*, because iOS is the platform that requires a trusted gesture
before audio may start; on the laptop the context is already running, so the lost
gesture costs nothing and autoplay looked perfect there through every round of
this bug.

**The general rule this earns: a control that unmounts itself in its own event
handler cancels the remainder of that gesture for every listener above it.** Any
button that both handles a press and removes itself has this defect. It is not
specific to audio — it is specific to self-removal.

### The fix that was chosen and not implemented

**Option 1: do not detach the button during the gesture.** Keep the start screen
mounted for the rest of the gesture, so `touchstart`/`touchend`/`click` land on a
connected node and reach Howler normally. Implementation is a new session's job.

Options that were considered and are worse:

- Calling Howler's unlock ourselves from `pointerdown`. It reaches into a private
  function, and it competes with the same library's own bookkeeping.
- Adding our own `pointerdown` unlock. Same trusted-gesture problem — we do not
  own the context Howler created, and `_audioUnlocked` would stay false, so
  Howler's own paths keep behaving as if no gesture has happened.
- Moving `START` to `click`. It fixes the unlock by accident and makes the button
  feel slower; the reason `onPointerDown` is there in the first place is press
  latency on a 7-year-old's tap.

---

## 2. What the cause explains

Everything that was previously filed as a separate mystery:

- **Why the laptop was always perfect.** Its context is running before the child
  touches anything, so no gesture is needed and none is lost.
- **Why the four earlier fixes were all real and still left silence.** They were
  four genuine causes — gesture spent early on a non-armed source, no Howl
  existing at press time, our own `autoSuspend` suspending the context after 30s,
  and a bare `ctx.resume()` of ours that hung. Each was fixed and verified. None
  of them is this one, because this one removes the gesture itself from the chain
  before any of that code matters.
- **Why the diagnostic panel taps worked when the Mula tap did not.** The panel
  is not the start screen's button and does not unmount on press, so its taps
  arrive on a connected node and reach `document` normally. That is why a panel
  tap could unlock audio while the Mula tap never did — the same finger, the same
  screen, a different node lifetime.
- **Why the removal of the diagnostics "broke" a working build.** It did not. The
  build never worked from a cold Mula press. What worked, in the confirmed run,
  was a session in which a panel tap had already spent a gesture on Howler's
  behalf.
- **Why `resume()` was never called on the Mula tap.** It was never reached. The
  gate read `ctx.state !== 'running'` correctly; nothing had unlocked the context
  because nothing had told Howler a gesture occurred.

---

## 3. Still unexplained

Written here as unexplained, because it was expensive to observe and the next
session should not assume it has gone away.

**Hanging `resume()` promises.** In the instrumented run, six `AudioContext.resume()`
calls across three start-screen panel taps never settled — no resolve, no reject,
for the remaining life of the page. A later tap's `resume()` resolved in 112ms.
Howler's own handler had run in the hanging cases, with its scratch buffer
`start(0)` issued before the resume, so **"scratch buffer first" is not a
sufficient explanation for why a resume settles.** Whatever distinguishes the
112ms resume from the six that hung is not known.

Two consequences worth carrying forward:

- Do not build anything that depends on `resume()` settling on time. The current
  code already does not: it subscribes to `statechange` and waits for
  `ctx.state === 'running'` rather than awaiting a promise. Keep it that way.
  This is why option 1 is a layout change and not a timing change.
- Option 1 may or may not make the resume behave. It fixes the *delivery* of the
  gesture. If the resume still hangs after it, audio may still be late even
  though the unlock is correct — and that would be this unexplained thing
  resurfacing, not a new bug.

**A parked play cannot be cancelled.** `Howl.play()` on a suspended context
returns a sound id and parks the playback until the context runs, and there is no
call that un-parks it. Nothing in our code parks a play any more — `AudioButton`
waits via `whenAudible` instead — but the hazard is a property of Howler, so any
future code that calls `play()` without checking the context state inherits it.

---

## 4. Branch state

**`main` has all of it.** PRs #29 (`feat/start-screen`), #30
(`fix/ios-audio-unlock`) and #31 (`feat/island-background`) are merged;
`origin/main` is at `903a20c`. The start screen, the gesture gate, all four audio
fixes, the autoplay gate, the five iOS audio rules in SPEC §8, the diagnostics
removal, the island background and the reward screen are on `main`. The
diagnostics are *not* — they came out in `ec89a64` before the merge.

| Branch | State |
| --- | --- |
| `main` | `903a20c`. Everything above. This is the base for option 1. |
| `diag/autoplay-gate` | **Diagnostic. Do not merge.** One commit over the old `feat/island-background` tip, so it is now behind `main`'s merge commits. It re-adds `lib/diagnostics.ts` and the on-screen panel so an iPhone run can be read, and it is how the root cause above was found. Keep it until option 1 is verified on the phone, then delete it — and rebase it onto `main` before using it again. |
| `feat/start-screen`, `fix/ios-audio-unlock`, `feat/island-background` | Merged; their remotes are already pruned and the local names are stale. Safe to delete locally. |

Everything on `main` was verified on a real iPhone except the one thing this
document exists for: **a cold press of Mula on iOS is still silent.** The build
is correct in every part that was tested; the untested part was whether the
gesture reaches Howler at all, and it does not.

The five iOS audio rules are in **SPEC §8 on `main`**. They are not repeated
here; read them before touching audio. The rule this session adds — a control
must not unmount itself inside the gesture that has to reach Howler — belongs in
that list when option 1 lands.

`docs/pr/` holds the three PR bodies as merged, with the numbers measured on the
phone. They were in a session temp directory, which is the only reason they are
in the repo; they are a record, not a to-do. Note that
`docs/pr/fix-ios-audio-unlock.md` describes eight commits while PR #30 carried
ten — the two start-screen commits were written up separately in
`docs/pr/feat-start-screen.md` and then merged in the same PR.

---

## 5. Next session

Implement option 1. The behaviour that must not regress: a restored session never
passes through the start screen, and "Main lagi" plays rather than asking again
(SPEC §8). The phone is the only place the fix can be confirmed — the Browser
pane has a running context and no trusted-gesture requirement, so it cannot fail
this bug and cannot prove the fix either. It can prove the button stays connected
through the gesture, which is the part that is actually ours.
