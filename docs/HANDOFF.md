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

### The fix that was chosen, and what it looks like now it is written

**Option 1: do not detach the button during the gesture.** Keep the start screen
mounted for the rest of the gesture, so `touchstart`/`touchend`/`click` land on a
connected node and reach Howler normally.

Implemented on `fix/start-button-unmount`. `START` still goes out on
`pointerdown`; `App` holds the start screen mounted from that press until the
`click` that ends the tap, with a 1000ms timer as the backstop for a finger that
slides off the button and never produces a click. The rule is written into
SPEC §8 as rule 6.

Measured in the Browser pane, the same build with and without the change, by
registering capture-phase listeners on `document` exactly where Howler registers
its own:

| | button `isConnected` after React's flush | of touchstart/touchend/click reaching `document` |
| --- | --- | --- |
| before | `false` | 0 of 3 |
| after | `true` | 3 of 3, each with a connected target |

That is the part of this that is ours and can be proved from here. The phone is
still the only place the audio itself can be confirmed.

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
| ~~`diag/autoplay-gate`~~ | **Deleted**, local and remote, once option 1 was confirmed on the phone. It re-added `lib/diagnostics.ts` and the on-screen panel, and it is how the root cause above was found. Its commit was `c5453a0`. |
| `feat/start-screen`, `fix/ios-audio-unlock`, `feat/island-background` | Merged; their remotes are already pruned and the local names are stale. Safe to delete locally. |

~~Everything on `main` was verified on a real iPhone except the one thing this
document exists for: **a cold press of Mula on iOS is still silent.**~~

**Closed on the device.** A cold press of Mula on a real iPhone now produces
sound on the **first** press. Option 1 landed in PR #33 and was confirmed on
hardware afterwards, with the second batch of recordings on the same run. Four
rounds of iOS silence, four real causes, and this was the fifth and last of
them: the gesture never reached Howler because the button removed itself from
the DOM inside its own handler.

`diag/autoplay-gate` was deleted, local and remote, once the cause was proved
and written down. If iOS audio ever needs reading again, the panel is
reconstructible from `lib/diagnostics.ts` in this repo's history — it is not
waiting on a branch.

The iOS audio rules are in **SPEC §8 on `main`**. They are not repeated here;
read them before touching audio. The rule this session added — a control must not
unmount itself inside the gesture that has to reach Howler — landed there as
rule 6 with option 1.

`docs/pr/` holds the three PR bodies as merged, with the numbers measured on the
phone. They were in a session temp directory, which is the only reason they are
in the repo; they are a record, not a to-do. Note that
`docs/pr/fix-ios-audio-unlock.md` describes eight commits while PR #30 carried
ten — the two start-screen commits were written up separately in
`docs/pr/feat-start-screen.md` and then merged in the same PR.

---

## 5. How it ended

The phone answered with the first of the three outcomes this section used to
list: **sound on the first press.** The fix worked, and the iOS audio thread that
ran through three sessions is closed.

What the Browser pane could and could not do is worth keeping, because it was
right both times. It has a running context and no trusted-gesture requirement, so
it could not fail this bug and could not prove the fix. What it *could* prove was
that the button stays connected through the gesture — 0 of 3 events reaching
`document` before the change, 3 of 3 after. That is the part that was ours, and
it turned out to be the whole of it.

The hanging `resume()` in section 3 stays unexplained and stays written down. It
did not surface on the confirming run, which is not the same as being gone.

Still true, and checked again: a restored session never passes through the start
screen, and "Main lagi" goes straight into the first question (SPEC §8,
`store.test.ts`).

---

## 6. Counts and names carried forward without a check — 13 September 2026

Not audio. Written here because otherwise it lives only in a session.

The class, as the project owner named it: **a name that sounds right, copied
forward, and nobody checked it against the file.** Three instances were found on
13 September and corrected on `feat/review-status`. Times are from `git log`.

| What the prose said | Where | What the file said |
| --- | --- | --- |
| Coverage example *"1/6 diuji"*, tested skill *"Tambah gandaan 10"* | SPEC §5.7, PRD §11, `coverage.ts` | The skills file never held that name. The label for `2.2.2/add_multiple_of_10` was *"Menambah gandaan sepuluh"*; *"Tambah gandaan 10"* is heading E of `docs/kssr/guru-sub-kemahiran-math-y1.md`, and the display layer renders labels, not headings. Written that way in `8dce0fe` (12 Sep, 17:50). The sub-skill was removed in `a6f780e` (13 Sep, 07:16) and 2.2.2 went from six to four; the example kept both the name and the six |
| *"36 sub-kemahiran"* | Provenance header of `docs/kssr/guru-sub-kemahiran-math-y1.md` | 36 when written (`c139f23`, 12 Sep, 17:33). 34 from `a6f780e` |
| *"Kesemua 9"* sub-skills fail the three-question bar, in the present tense | PRD §16 item 12 | 7. Written in `a6f780e`, the same commit that took `name_triangle` and `name_circle` off q005 and q009, so it was never true of the pack after that commit |

All three were written, or went stale, between 12 September 17:33 and
13 September 07:16.

**Checked, and not instances:**

- **`count_objects`.** Its id, its label, and its mapping to q003 and q006 are
  unchanged since `c139f23`; the only other commits to touch the string added and
  then removed an example inside the withdrawn exemption rule. Its sentence in
  item 12 — the ninth sub-skill, the one with two questions — was right. The
  error was the total beside it.
- **`digit_at_tens`.** `15da14e` searched files, commit messages and session
  transcripts for a finding of a wrong mapping under that name, and found none.
  What exists is the note in PRD §16 item 18: a different name in the teacher's
  document (`place_tens`) for a mapping both teacher documents confirm.

**What would have caught each one.** A count or a label in prose is a copy of a
file. Derive it from the file when writing it — `validate:content` prints the
counts, `math-y1.skills.json` holds the labels — and when the file changes,
search the docs for the old value. SPEC §3.6 already refuses to commit generated
tables because copies drift. Hand-written prose has no such guard, only the
habit.
