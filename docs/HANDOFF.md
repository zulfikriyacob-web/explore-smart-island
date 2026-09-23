# Handoff — 22 September 2026

Start here. Section 0 is where the project stands now. Sections 1–6 below it are the
record of 12–13 September — the iOS audio root cause and the names copied forward
without a check — kept because their rules still hold, not because they describe today.

Environment facts go to CLAUDE.md "Working notes", not here: they are facts about this
machine, not about the product.

Every date below is from `git log`, not from memory (CLAUDE.md, "This machine").

---

## 0. Where the project stands — 24 September 2026

`main` is at `7a1ca2c`. **`feat/digit-value-batch` merged in PR #98 on 23 September 2026**
and the branch is deleted, local and remote: the digit-value batch, its recordings, and the
measurements below are all on `main` now. 373 tests pass and `validate:content` reports 0
errors on 48 questions. One pack, `math-y1-nombor-100`, `reviewStatus: teacher-reviewed` —
and that status still covers only the ten questions of 12 September.

### What the merged branch carried, in the order it landed

| Commit | What |
|---|---|
| `ef447a2` | **2.4.2 in the skills file**, split by operation as the teacher asked, and q023 moves to it with flat tags |
| `5dcd728` | **Thirteen questions, q037–q049**, from the 23 September review, with its three corrections |
| `14e680e` | Thirteen 0-byte English placeholders |
| `14093e8` | The batch measured in the pane at 393×695 |
| `3f6a703` | **The thirteen Malay recordings**, ID3 stripped, three SPEC §8 checks |
| `0d50874` | **Loudness levelled across the whole bank**: spread 9.37 → 2.56 LU |
| `d8b817f` | The recordings, the loudness pass, and the owner's listen |

Everything in PRD §16 item 49. The layout record for the five three-line prompts is the phone
measurement, not the pane's.

### What changed since 13 September, in the order it landed

| When (git) | What | Where it is written |
|---|---|---|
| 15 Sep | **Progress store**, `esi.progress.v1` — evidence per sub-skill, never a rolled-up SP number | SPEC §6 |
| 16 Sep | **Question selector** replaces the fixed ten-question activity; level ladder, no randomness | SPEC §5.5, PRD 16 item 27 |
| 17–18 Sep | `noEvidence: practice \| parked`; 4% combined-guess ceiling replaces "four two-option questions" | SPEC §3.3, §5.7, items 22, 37 |
| 20 Sep | **The test viewport is 393×695**, read off the owner's iPhone. Every earlier "no clipping" was measured on a viewport the phone never had | CLAUDE.md, items 44–45 |
| 20 Sep | **The kancil left the question card.** The audio button was cut in half on every question; the mascot now lives on the reward screen only | DESIGN §6–7, items 44–45 |
| 20 Sep | Reward screen: kancil 150 → 104, Seterusnya no longer below the fold | item 46 |
| 21 Sep | **Sedia step cue** — filled face and forward arrow on the first tap. A seven-year-old pressed it unprompted, twice | DESIGN §5.4, SPEC §9, item 26 |
| 21 Sep | `promptAudioText`, so `audio:script` keeps printing a spoken line that the screen no longer shows | SPEC §3.3, §3.6 |
| 21 Sep | "Kemudian tekan Sedia." off the screen for q003, q006, q011 — audio untouched | item 26 |
| 21 Sep | Tally shows nothing until the first tap, in a box already its height | item 48 |
| 21 Sep | **`timesAsked` tiebreak** — no question now appears in every run at any level | SPEC §5.5, §6, item 38 |
| 21 Sep | **Six level-3 bridging questions** from a teacher review that arrived as a file, plus two everyday-situation ones as practice | `docs/kssr/`, item 49 |
| 21–22 Sep | Their eight Malay recordings, ID3 stripped and verified | item 49 |
| 22 Sep | **Every Malay clip at −17 LUFS** by `global_gain`, and `npm run audio:gain` makes it a fixed step | SPEC §8, item 50 |
| 22 Sep | The iOS decoder applies that gain; the ±0.1 LU condition was not met, and why | item 50 |
| 23 Sep | **The digit-value batch**, merged into `main` in PR #98 | item 49 |

Items closed in that stretch, all with numbers in PRD §16: **31, 38, 44, 46, 48**.

### The bank on `main`

| Level | Playable | Evidence | Practice |
|---|---|---|---|
| 1 | 12 | 12 | — |
| 2 | 18 | 18 | — |
| 3 | 16 | 15 | 1 (q022) |

48 questions. q005 and q009 are `parked` for a 7.0 Ruang pack (item 10). **Every Malay clip is
recorded and levelled**; every English clip is still 0 bytes, and `LANG` is `'ms'` in
`QuizScreen.tsx`. q030 and q033 are no longer practice: they are 2.4.2 evidence, and they now
count towards accuracy, stars and the level ladder.

Coverage after the batch: 1.6.1 is 4 of 4 sub-skills tested and 2.2.2 is 4 of 4. What is still
untested: `2.4.2/solve_subtraction_daily_problem`, four of 1.2.2, and two of 1.2.1.

### Waiting on someone else

~~**On the teacher** — the owner is asking: q023 to 2.4.2, and breaking 2.4.2 into
sub-skills.~~ **Both answered 23 September 2026** in
`docs/kssr/guru-semakan-nilai-digit-dan-tambah.md`: q023 moves to 2.4.2, 2.4.2 splits by
operation rather than by the four 2.2.2 profiles, and q037 replaces q023 in
`two_digit_plus_two_digit_no_bridge`. Both are built on the branch. Item 49.

**On the teacher, still open** — the thirteen new questions have not been through a review
round. `kssr.review` in the pack still names the round-2 form and the ten questions of
12 September, and `reviewStatus` is unchanged. The pack now holds 48 questions, and three
teacher documents have been filed since that form: `guru-semakan-pusingan-2-bertanda.md`
(12 Sep), `guru-semakan-tambah-melintasi-puluh-dan-nilai-digit.md` (21 Sep) and
`guru-semakan-nilai-digit-dan-tambah.md` (23 Sep). The review block describes the first of
those three documents and ten of the 48 questions.

**On a child** — **open, and now larger:** a child playing level 3 with the evened-out clips,
and a child meeting the thirteen new questions at all. The bank's spread is 2.56 LU after this
batch, not the 1.41 LU a child last heard, because q041 is peak-limited at −18.83 LUFS. PRD
§16 items 49 and 50.

~~**On a child** — the loudness of the level-3 clips falls into two groups, peaks about
0.38–0.40 and 0.82–0.90. Recorded as an observation, not a defect: peak is not perceived
loudness, and nobody has heard them through a phone speaker in a child's hands. Item 49.~~
**Answered 22 September 2026, item 50.** A child played level 3 and noticed the loudness
difference, so it is now a defect. Integrated LUFS across all 35 Malay clips spans 8.79 LU in
three groups, and q027 is the quietest in the bank. Fixed in PR #95, merged 22 September
2026: every clip is brought to −17 LUFS by editing `global_gain` inside the MP3, which is
lossless, and the measured spread is now 1.41 LU. This is a fixed step for every new recording
(SPEC §8, `npm run audio:gain`). iOS Safari's decoder has since been tested on the iPhone and
applies the edited gain. The owner listened once, through the test page rather than the app.
What was measured, the condition that was not met and why are in PRD §16 item 50. The child
test with the evened-out clips is still open; see above.
The child test that found the difference also showed the "Cukupkan 40 dahulu." hint helping,
and q030/q033 understood. One child.

### Next work, by who it waits on

**On a child — nothing here has been played by one.** Levels 2 and 3 with the thirteen new
questions, and the bank at a 2.56 LU spread rather than the 1.41 LU a child last heard
(q041 is peak-limited at −18.83 LUFS). Items 49 and 50.

**On us — self-host the font, as its own PR.** `index.html` fetches both faces from
`fonts.googleapis.com` with `display=swap` and no font file is in the repo, so a phone that
cannot reach the CDN draws the prompts 9.5% narrower than the band limits assume (CLAUDE.md,
item 49). The next session does not start from nothing: on 23 September the test page served
Lexend itself from `public/fonts-ujian/` — three woff2 subsets from `fonts.gstatic.com`,
`wlpwgwvFAVdoq2_v9KQU4Wc.woff2` 13,840 bytes, `wlpwgwvFAVdoq2_v9aQU4Wc.woff2` 34,476 bytes
and `wlpwgwvFAVdoq2_v-6QU.woff2` 39,680 bytes, with a rewritten `lexend.css` of 3,429 bytes
holding 9 `@font-face` blocks that point at those three files. **Those files are not on disk
now** — they were untracked and deleted with the test page, and a search of the repo and the
profile on 24 September finds no woff2 anywhere. What survives is the recipe: fetch the
`css2` URL with a browser user-agent, pull every `url(https://fonts.gstatic.com/….woff2)`
out of the returned CSS, save each one and rewrite the `src` to the local path. A real PR
has to cover **Baloo 2 as well** — `index.html` asks for `Baloo+2:wght@600;700` in the same
link — and decide licence and placement, which the test page never had to.

Three smaller things are still open, all on us:

1. **Item 47 is open for a decision** — the space between a short card and the answer
   stack. q006 is now 223px, the widest in the pack, on the screen with the fewest objects.
   Numbers first was the owner's rule; the numbers are in.
2. **UI sound** is deferred with three recorded constraints: a second player channel, SPEC
   §8's one-clip rule, and skip-not-park on a suspended context. Item 26.
3. **A subtraction question for 2.4.2** is the only sub-skill of the two new ones with
   nothing in it.

**On the owner — the pack's `kssr.review` is out of date.** It names the round-2 form and
the ten questions of 12 September; the bank is 48 questions and three teacher documents on.
Nothing enforces that block, so it stays wrong until someone rewrites it. See "Waiting on
someone else" above.

### Still true, and still not fixed

- **No CI.** `validate:content` blocks nothing unless someone runs it. Item 34.
- **The app fetches Lexend from Google Fonts at first paint**, and no font file is in the
  repo. A phone that cannot reach the CDN draws the prompts in the system fallback, which is
  9.5% narrower — and the 28/37-character band limits are calibrated on Lexend. It happened
  on the owner's phone on 23 September and it voided a whole measurement run. Self-hosting
  the font is an undecided product question, not only a test one. Item 49.
- **A hanging `resume()`** on iOS remains unexplained. Section 3 below.
- **The reward screen can scroll** only if its content ever outgrows 695px again; at 104px
  the kancil leaves 7px. Whether a 39px overflow was ever enough to make Safari retract its
  bars was never checked on the phone, and no longer needs to be.

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
