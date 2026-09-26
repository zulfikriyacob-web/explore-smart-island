# CLAUDE.md

## Core Principles
1. Think Before Coding: If an instruction is vague, do not assume or
   guess. Ask for clarification first before generating code.
2. Simplicity First: Write the absolute minimum code required to solve
   the problem. Do not add unrequested features or speculative abstractions.
3. Surgical Changes: Perform targeted, precise edits. Do not rewrite
   entire files or modify unrelated parts of the codebase.
4. Goal-Driven Execution: Establish clear success criteria and run tests
   to verify results before completing.
5. Verify What a Person Sees: A geometry check cannot detect invisibility.
   An element can sit at the right rect, in the DOM, findable by selector,
   and still be a blank space to the user. When verifying anything visual:
   start from the user's ARRIVAL STATE, before any interaction — bugs hide
   in the state you skip past on your way to the one you meant to test;
   measure composited opacity and contrast, not rects alone — an element
   faded to nothing has the same rect as one at full strength; and say
   plainly which values the environment did not compute — a frozen renderer
   suppresses the very animation whose end state you are claiming to check.
   Passing your own test is not evidence. Ask what the test cannot see.

   **The rule this earns: content must be mounted and visible on frame 0.
   Animation refines an appearance; it never causes one.** An animation frame
   is not a guarantee — a backgrounded tab, a throttled device, a renderer that
   never calls `requestAnimationFrame`. Anything whose visibility waits on a
   frame is simply missing when the frame does not come, and the child is not
   told that an animation failed. They are told the wrong thing.

   **This does not ban entry animations. It constrains where they start.** An
   entry animation is wanted wherever it does a job (DESIGN §7); what it may not
   do is be the reason something is on screen. The test is simple: freeze the
   animation at its first frame and look. If that frame is legible, in roughly
   the right place, and tells the truth, the animation is free to be as lively
   as it likes.

   Two patterns satisfy it, and both are already in the codebase:

   - **Start at the settled state and animate away from it and back.** The
     tick and cross icons do this — `opacity: 1` throughout, only `scale`
     moves. Keyframes whose first value equals `initial` (`scale: [1, 1.25, 1]`)
     land the same way: frozen, the element is simply finished.
   - **Animate one harmless property from a small offset.** The hint slides
     `y: -8 → 0` at full opacity: frozen, it is 8px high and completely
     readable.

   Concretely, what is not allowed:

   - No entry animation starts at `opacity: 0`, `scale: 0`, or far enough from
     where it lands to read as misplaced.
   - No `AnimatePresence mode="wait"` around content. It withholds the incoming
     element until the outgoing one finishes animating away, so a frameless exit
     means the next thing never mounts at all.
   - No `layout` prop on a container whose size carries meaning. It resizes by
     projecting a transform over later frames; with no frames the projection
     stays, and the box keeps the wrong shape. Reflow instead.
   - A counter, score or tally renders its real value first. The count-up may
     rewind it only once the animation is actually producing frames — drive it
     from an `onUpdate` callback, which fires on a frame or not at all.
   - Feedback that must be legible — a tick, a cross, a number badge — is never
     drawn by an animation alone.

   This has been the same bug five times: a blank first card, a correct/wrong
   icon that only appeared once animated, a Next button that never mounted, a
   hint at `opacity: 0`, and a question card that showed the previous question
   while the engine had moved on. The last one is the shape of the harm — not a
   missing flourish, but wrong content presented as current.

   The Browser pane here runs with `document.hidden === true` and fires no
   animation frames, so it is a free test for all of this. Drive the screen in
   it and measure; anything that depends on a frame fails loudly.

   **Verify the output, not the library's model of it.** A library's own
   bookkeeping is not evidence about the thing it controls. Howler reported
   `playing() === true` and a `seek()` that advanced while its AudioContext was
   suspended and nothing was audible; a rect is not a pixel, and `playing()` is
   not a sound. Both numbers were honest — they describe what the library had
   decided, which is a different question from what the device did.

   This is a distinct failure from geometry-versus-pixels, and it fails the same
   way: the number agrees with you. Ask what layer you are reading. Prefer the
   one closest to the person — the decoded duration the browser reports over the
   library's, `getComputedStyle` over a prop you passed in, the audio context's
   state over the player's flag. When the closest layer is not reachable from
   here — a real speaker, a real screen reader, iOS Safari — say so, and say
   which layer you actually checked.

   A second trap sits next to it. `await import('/src/lib/player.ts')` from the
   pane gave a **second module instance**: my instrumentation logged nothing and
   the singleton I inspected reported `null` while the app's own instance was
   playing. Measuring through a module you imported yourself can measure a
   different object than the one running. Reach for something the page can only
   have one of — here, `window.Howler._howls` — or drive the real UI and read
   the result.

## Working notes

Things that cost a session real time to discover. Not principles — facts.

### Run the work yourself

**Do not fan out to sub-agents for work in this repo.** Run tasks sequentially in
the main session.

The reason is token cost. The work here is surgical edits to a small codebase
with repeated verification between them — measure, change one thing, measure
again. That loop does not divide across agents: each one has to be given the same
context, and each returns a report the main session has to read and reconcile
before it can take the next step. The coordination overhead is larger than the
work, and it burns through usage limits fast.

This holds when the session says ultracode is on. On 16 September 2026 a system
reminder said to run a workflow for every substantive task; this rule won, and the
work ran in the main session.

### This machine

- **The Bash tool does not work here.** It fails with
  `fork: Resource temporarily unavailable`. Use PowerShell for everything,
  including git.
- **`git commit -m` with a here-string containing quotes breaks the PowerShell
  parser**, and git receives the message as stray pathspecs. Write the message to
  a file and use `git commit -F <file>`.
- **Do not pipe a native command through `2>&1` in PowerShell.** stderr lines
  become ErrorRecords and `$LASTEXITCODE` reads as failure even when the command
  succeeded — a fully passing test run reported `-1` this way. stderr is captured
  for you already.
- **No `gh` CLI, no `GITHUB_TOKEN`, no connected Chrome.** Pull requests cannot be
  opened from here. Push the branch and hand over the `.../pull/new/<branch>` URL
  with a title and a body.
- **Do not read `$LASTEXITCODE` after a truncating pipeline.** `npm run x |
  Select-Object -First 3` closes the pipe early, the upstream process is killed,
  and the exit code comes back `-1` on a command that succeeded. This produced two
  wrong conclusions in one session — a passing script reported as failing, and a
  missing-asset case reported as an error when it was designed to be a warning.
  Capture first, then filter: `$out = npm run x; $code = $LASTEXITCODE`.
- **A label containing a bare drive letter can trip the path guard.** A line as
  innocent as `"=== A: something ==="` next to a `Remove-Item` was refused with
  "Remove-Item on system path 'A:' is blocked". Rename the label, not the command.
- **`-AsByteStream` is PowerShell 7.** This is 5.1. For bytes use
  `[System.IO.File]::ReadAllBytes(path)`.
- **`Set-Content -Encoding utf8` writes a BOM on 5.1**, and a commit message file
  written that way puts an invisible U+FEFF at the front of the subject line.
  Write message files with a tool that does not add one, or
  `[System.IO.File]::WriteAllText(path, text, (New-Object System.Text.UTF8Encoding($false)))`.
- **Do not rewrite source files through PowerShell string operations.**
  `Get-Content` on 5.1 reads a BOM-less UTF-8 file as ANSI, so an em-dash comes
  back as `â€"`; write that string back and the file is now genuinely broken. It
  happened twice in one session, to `player.ts` and `player.test.ts`. Use the Edit
  tool for source edits. To repair a file already damaged, re-encode Latin-1 to
  UTF-8 rather than hand-fixing characters.
- **That misread also lies about undamaged files.** `Get-Content` showed `â€"`
  and `â†’` in three files that were correct UTF-8 on disk, which nearly bought a
  "repair" of files that needed none. Check with
  `[System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes(path))`
  before believing an encoding problem exists.
- **No image encoder on this machine.** No ImageMagick, no `sharp`, no `cwebp`.
  JPEG encoding is available through GDI+: `Add-Type -AssemblyName System.Drawing`,
  then `Save()` with an `EncoderParameter` for quality. PSNR between two images
  needs the same route plus `LockBits`; there is no tool that reports it.
- **No audio tools either.** No `ffmpeg`, `mp3gain`, `sox` or `lame`; Python 3.14 has
  `numpy` and no MP3 decoder. Decode in the Browser pane instead:
  `new OfflineAudioContext(1, 1, rate).decodeAudioData(buf)` settles there, and a rate of
  44100 decodes the clips without resampling. `Math.max(...samples)` on a decoded clip
  overflows the call stack — loop instead. `scripts/loudness.html` does all of this for
  every clip; start there. (PRD 16 item 50.)
- **The dev server's Network URL changes.** The DHCP lease moves, so an address
  that worked yesterday may belong to another device today. Re-read the IP before
  handing a URL to a phone, and start the server with `--host` or the phone gets
  nothing.
- **A new LAN address is a new origin.** Whatever the phone stored under the old
  address — a saved session, progress — is not there under the new one, so a
  device test that needs existing storage has to seed it first. The `-a1` saved-
  session rejection was tested that way: a temporary seeding page in `public/`,
  opened on the phone, then deleted. Do not commit a seeding page.
- **Port 5173 can belong to another project.** On 16 September 2026 it was held by
  the Vite server of `C:\dev\aap-mes-project-Claude`, so the `quiz` configuration
  in `.claude/launch.json` could not start (`autoPort` is false). Check the owner
  with `Get-NetTCPConnection -LocalPort 5173 -State Listen` before assuming this
  project's server is running. The workaround used: a temporary `quiz-5174` entry
  (`npm run dev -- --host --port 5174 --strictPort`), added before `preview_start`
  and removed right after, so `launch.json` is never committed with it. Do not stop
  the other project's server.
- **Prettier has no config in this repo — do not run it.** `npx prettier --write` on
  `BlockButton.tsx` applied its defaults, double quotes and 80 columns, and turned a
  ten-line change into a whole-file diff. Reverted with `git checkout -- <file>` and the
  edits redone by hand. Match the file's existing style with the Edit tool instead.
- **Vitest here is v5, and two habits from older versions fail.** `--reporter=basic`
  stops with "Failed to load custom Reporter from basic"; use the default reporter. And
  `console.log` from inside a test did not reach the captured output of a passing run, so
  a simulation that printed its results returned nothing. Write results to a file with
  `node:fs` and read the file.
- **A throwaway simulation goes in `src/` and leaves before `git add`.** Vitest only
  imports modules from the project, so a harness that drives `buildSession` and
  `recordSession` has to live there as a `*.test.ts`. Delete it and its output file before
  staging, and check "never committed" against git rather than memory:
  `git rev-list --all --objects | Select-String 'sim|__'` returns nothing when no object in
  any branch ever held one. (PRD 16 item 38.)
- **A dev server started from here does not reliably survive between turns.** When the
  Browser pane reports that navigation "was denied or failed", the server is usually
  gone — check `Get-NetTCPConnection -LocalPort 5174 -State Listen` before anything
  else, then start it again with the `quiz-5174` workaround below.
- **Take today's date from `Get-Date` and a commit's date from `git log`.** Work done on
  21 September 2026 was written as "22 September 2026" in thirteen places across PRD and
  SPEC before anyone checked (PRD 16 item 49). The rule in "Received documents" below
  already says to read `git log` before stating when something merged; it holds for
  today's date as well.
- **The permission classifier refuses history rewrites.** `git commit --amend`
  followed by `git push --force-with-lease`, to drop a stray file from a pushed
  commit, was refused. Undo with a follow-up commit instead (`git rm --cached`,
  then commit). Nothing already pushed gets rewritten.
- **Session transcripts can be searched, with care.** They live at
  `C:\Users\zulfi\.claude\projects\C--dev-explore-smart-island\<session-id>.jsonl`,
  one JSON record per line, so a single line can be a whole tool result. Grep with
  `-o` and a wide context window returns `[Omitted long matching line]`:
  `.{0,150}` before and `.{0,400}` after did, and `.{0,200}` either side did not.
  Keep the window small, or parse the file with a short node script and keep only
  the `text` blocks. Compaction summaries sit in the same file as user messages
  beginning "This session is being continued". They are summaries, and see below.
- **Past tool calls and their raw output are in the transcript too.** A
  `tool_use` block holds the input — a whole measuring script — and the
  `tool_result` with the same `tool_use_id` holds what it returned. After a
  compaction, re-read a number from its result, not from the summary, and re-run
  a measurement from its recorded script instead of rewriting it. That is how two
  wrong claims about the help-band limits were caught (PRD §16 item 33).

### Localhost is a secure context; the phone on the LAN is not

**A test that passes on `localhost` has not tested the path the phone takes.** Browsers
treat `http://localhost` as a potentially trustworthy origin and `http://192.168.x.x` as
not, and a surprising amount of behaviour is gated on exactly that. The Browser pane runs
on localhost, so it cannot fail any of it. This is the same shape as "the pane is not the
device", one layer down: not a different browser, a different **origin**.

Twice so far, and the second one cost a phone test:

- **`crypto.randomUUID()` exists only in a secure context.** The store generates session
  ids from `crypto.getRandomValues` for this reason (SPEC §6). The pane proves nothing
  about that path; the iPhone over plain http did.
- **Vite's dev server serves `.json` as an ES module only when the request carries
  `Sec-Fetch-Dest: script`,** and browsers attach `Sec-Fetch-*` headers only to trustworthy
  origins. A temporary page that imported a JSON module worked on localhost and hung for
  ever on the phone. Measured on the same URL: `application/json` without the header,
  `text/javascript` with it. `.ts` modules are served as JavaScript either way, so only the
  JSON import broke. (PRD §16 item 41.)

Behind the same gate, so the list is not learned one at a time: `navigator.clipboard`,
service workers, `crypto.subtle`, camera and geolocation permissions, and fetch metadata
headers.

**Before claiming a device path verified, ask which origin the test ran on.** If the code
touches anything above, open the LAN address from the phone, or say plainly that only
localhost was checked.

Two lessons came with it, both cheap:

- **A failed static import takes the whole script with it.** Nothing runs, nothing is
  logged on screen, and a page sits on its placeholder text for ever. In a throwaway page,
  import dynamically inside `try/catch` and render every failure — including from `error`
  and `unhandledrejection` handlers.
- **Print the raw data too.** The page's job was to read `esi.progress.v1`; dumping the raw
  string at the end means even a half-broken page returns something worth pasting.

### The test viewport has to come from the phone

**390×740 and 360×780 were our numbers, not the device's.** They came from our own
documents, were never checked against a phone, and every layout measurement taken in
the pane used them. On a real iPhone the same screen gives the card about 53px less
height: the audio button — the lowest thing in the card — is cut in half, on every
question, and the pane reported no cut at all. Reproduced by setting the pane to
390×620, which matches the phone's card to within 3px. (PRD §16 item 44.)

Why the pane cannot find this on its own: it has no status bar, no browser chrome and
no safe-area insets, so the height we type in is the height the layout gets. On the
phone the same page starts 58px lower and ends above Safari's toolbar.

**The test viewport is 393 × 695**, measured on the project owner's iPhone on 20
September 2026 (iOS 18.7, Safari 26.6.1), with the address bar on screen:

| | |
|---|---|
| `innerWidth × innerHeight` | **393 × 695** — use this |
| `100dvh` and `100svh` | 695px |
| `100lvh` and `100vh` | 735px — the bars take 40px |
| `screen` | 414 × 896 at dpr 3, which does not match the 393 width and is not explained |

**Measure at 695.** 390×740 is 45px taller than the real thing and 3px narrower.

**`dvh` does move — and the question screen cannot make it move.** Third reading, 20
September 2026, the page scrolled until Safari's bars hid:

| | `innerH` | `clientH` | `dvh` | `svh` | `lvh` |
|---|---|---|---|---|---|
| bars on screen | 695 | 695 | **695** | 695 | 735 |
| bars hidden | 735 | 695 | **735** | 695 | 735 |

`clientHeight` is 695 in both, and every inset is 0 in both. So `innerHeight` and `dvh`
move together and `clientHeight` does not — which is why `dvh` is the field to read: our
screens are `h-[100dvh]`.

**But the bars only hide when the _page_ scrolls, and on the question screen it never
does.** `main` is exactly `100dvh`, the card is the part that gives way (`min-h-0`,
`overflow-y-auto`), and the card's own scrolling is not the page's. Measured in the pane
at 393×695, driving the real UI: `scrollHeight === clientHeight === 695` on arrival, with
the hint band, with the reveal, and on every count-tap including q011's eight objects. The
start screen fits exactly too. **One height on the question screen, 695, and that is where
a fix is measured.**

**The reward screen is the exception** — its button block is `shrink-0` and runs 39px past
the fold, so that screen is scrollable and `dvh` can reach 735 there. PRD §16 item 46.
Whether 39px is enough to make Safari retract has not been checked on the phone.

- **Take the real numbers from the device once, and use them everywhere after that.**
  `public/viewport.html` in this repo's history prints `innerHeight`, `innerWidth`,
  `visualViewport`, `100dvh/svh/lvh/vh` read back from real elements, and
  `env(safe-area-inset-*)` read back from padding. It is a throwaway page: untracked,
  deleted once the numbers are written down.
- **Treat any figure taken at a different height as void rather than approximate.**
- **`env(safe-area-inset-*)` is 0 on that phone, in every state.** Measured across 36
  distinct states, bars visible and bars hidden, from a static element and a fixed one:
  every side reads 0px. **The 34px this repo assumed for the home indicator never existed
  here.** Drop it from measurements rather than carrying it as an estimate; it was a
  number we wrote down, not one the device ever reported.
- **How to measure a viewport on the phone, so the reading is worth having.** A page that
  cannot scroll can only ever report one state, and the insets — if a device has any —
  appear only once the browser's bars hide. So: make the page taller than the screen,
  record **every state it sees** rather than a snapshot, read `env()` back from the
  padding of both a static and a fixed element, and print `innerHeight`, `clientHeight`,
  `dvh`, `svh` and `lvh` side by side in each row. The first version of ours did none of
  that and reported a confident set of zeros.
- **A screenshot from the phone is measurable.** `System.Drawing` is available here, so a
  screenshot can be scanned column by column for the edge of a card or a control:
  `scale = image width / CSS width`, then divide. That is how the clipped audio button was
  turned into numbers — card bottom at image row 401, CSS 265 — without guessing from the
  picture.
- **A card that shrinks is the thing to watch.** The question card is `flex: 0 1 auto`
  with `min-h-0` and `overflow-y: auto`, so it is sized by leftover space, not by its
  content, and it clips from the bottom. ~~Its content — the kancil slot above the audio
  button — is about 196px~~ Since the kancil left the card (20 September 2026) its content
  is 110px for a two-line prompt and 140px for a three-line one, and the worst three-line
  prompt leaves **4px** in the column with a one-line band showing. A two-line band adds
  27px and clips again — which is why the 28/37-character band limits now hold the layout
  up, not only the reading (SPEC §3.5).

### Received documents, and what is said about them

**A description of a document is not the document.** `docs/kssr/` holds what
teachers and a parent actually sent, byte-identical under a provenance header — six
of its nine files. The other three are not received documents: two were written by
Claude (`soalan-baharu-math-y1.md`, `pembetulan-akhir-soalan-math-y1.md`) and one is
the project owner's textbook notes (`pemilik-kalibrasi-buku-teks-kpm-tahun-1.md`).
Each header says which it is; read it before quoting the file as anyone's words. A
message that relays one can misquote it, and has. A compaction summary is a relay
too.

On 12–13 September 2026, around the marked round-2 review form:

- The message that delivered it attributed two sentences to the teacher: *"Nisbah
  1/6 tidak boleh dianggap murid gagal 5 kemahiran lain"*, and a requirement for
  one direct plus one reverse question per sub-skill. Neither is in the file. A
  cross-reference from SPEC §5.7 to the form was requested on the strength of the
  first. It was not written, because a false attribution is worse than none.
- The same message called the form signed, and treated `kssr.verified` as able to
  rise on it. The form's own status note says the name and school are blank on
  purpose, that it is not a certified teacher's signature, and that it must not by
  itself raise `kssr.verified`. It stayed `false`. On 13 September 2026 the boolean
  was replaced by a three-level `kssr.reviewStatus`, and on the owner's decision the
  form now supports `teacher-reviewed` — never `certified`. The error above is still
  an error: the form is not signed. PRD §16 item 20.
- The record of those two errors was first written with a third: it said PR #43
  merged "the day before" the form. `git log` says the same day. That date came
  from memory, not from git.

The project owner asked for both of their errors to be recorded. The full record
is PRD §16 item 18.

Before attributing words to a document, search the file for the exact string.
Before stating when something merged, or in what order, read `git log`. Before
acting on a status — verified, signed, approved — read the document's own status
note. When a summary and a file disagree, the file is right.

**The same holds for a file said to be in place.** On 21 September 2026 the owner
reported eight recordings installed in `public/audio/ms/`. Six were. q029 and q030
were still 0 bytes there, and the recorded files were sitting in `Downloads\Chrome\`.
The byte check before stripping the ID3 tags is what caught it — the owner's word was
honest and wrong, which is the usual shape. **Verify an asset by its size at the repo
path, not by the report that it is there.** "Installed" and "in the repo" are two
claims, and only the second one ships. (PRD 16 item 49.)

### Verifying visual work

- **The Browser pane runs the page with `document.hidden === true`, so
  `requestAnimationFrame` never fires** — measured at 0 frames in 400ms. Framer
  Motion animations do not run at all. An element with `initial={{ opacity: 0 }}`
  stays invisible, a CSS `transition` freezes at its start value, and an entry
  `scale` stays at its starting size.
- **Measure with `getBoundingClientRect` and `getComputedStyle`, not
  screenshots.** Screenshots from the pane time out, come back tiled, or return a
  cropped view. A timeout is often transient — the same screenshot succeeds on a
  retry, and `scale: 0.6` is more reliable than full size. `computer` with
  `action: "zoom"` ignores its `region` and gives back the whole viewport, so it
  cannot be used to inspect a detail.
- **`javascript_tool` gives up at 45 seconds.** A loop that drives the UI through
  several questions exceeds it. Split the drive into bursts, or fire the call
  without awaiting the result and read the state back afterwards.
- **`img.decode()` never settles in the pane**, because decoding waits on a frame
  that never comes. To get at an image's pixels use `fetch` then
  `createImageBitmap`, draw to an `OffscreenCanvas`, and read `getImageData`.
  That is also how to check text contrast against a photographic background: sample
  the actual pixels under the text's rect, not the token the background was
  supposed to be. A background image makes the token a guess.
- **Font loading does settle in the pane.** `await document.fonts.load('400 18px
  Lexend')` and `await document.fonts.ready` both resolve, and
  `document.fonts.check('18px Lexend')` then returns `true`. Await one of them
  before measuring text width, or the width is the fallback font's.
- **And settling in the pane proves nothing about the device: check that Lexend is
  the face that drew the text, from a measured width.** The fallback, `system-ui`, is
  narrower, and by how much depends on the layer. The same test sentence at Lexend 500
  22px, 23 September 2026: **in the pane, 461px in Lexend and 417px in the fallback,
  9.5% narrower; on the owner's phone, 461px and 402px, 12.8% narrower.** Never pair
  one layer's number with the other's — an earlier version of this note did, and wrote
  the pane's 9.5% next to the phone's 402px. The 28/37-character band limits are
  calibrated on Lexend (SPEC §3.5, item 33), so a fallback layout is a different
  layout, not a rounding error. So compute the same sentence in Lexend and in the fallback, print the verdict
  on every line, and refuse to record a number unless the measured width says Lexend.

  **Why the rule exists, from before the fonts were self-hosted.** Lexend used to be
  fetched from `fonts.googleapis.com` in `index.html`, with no font file in the repo,
  so a phone that could not reach the CDN drew the prompts in `system-ui`. On 23
  September 2026 that voided a whole run before anyone noticed: four of the five
  three-line prompts wrapped to **two** lines and the card read 112px instead of
  138px, and the first diagnosis blamed the audio-button probe instead. A local
  stylesheet injected by the test page to supply the font was not ready the moment it
  was injected either — measuring straight after gave 371px, the previous face, not
  461px — so a test page that brings its own sheet waits for that sheet's `load`
  event. (PRD §16 item 49.)

  **Now both faces are served from the app's own origin** (`public/fonts/`, PRD §16
  item 51), so that original failure — the CDN out of reach — is gone. The rule stays,
  because the fallback has not gone with it: `font-display: swap` draws `system-ui`
  until a face has loaded, and on the phone Baloo 2 arrived 10ms after first paint
  while Safari downloaded each file twice. Whether a frame was drawn in Lexend is
  still something to measure, not assume.
- **A rounded share is not "every one".** A measurement reported 100% of
  41-character sentences wrapping at 326px, and it was written down as "every one".
  The same output gave the narrowest 41-character sentence as 321px, which fits.
  Before writing "all" or "none", check the extreme value against the threshold,
  or report the count.
- **A colour test has to be specific enough to fail.** "Any green pixel" passed a
  kancil standing waist-deep in bushes, because bushes are green too. The test
  that worked was low blue — meadow grass is, foliage shadow is not.
- ~~**The pane reports `env(safe-area-inset-bottom)` as `0`.** With
  `viewport-fit=cover` an iPhone's home indicator reports 34px, so anything laid
  out against that inset is measured here at its most generous. Substitute 34px
  in the computation to see what the phone will do; two real layout defects hid in
  that difference.~~ **The pane does report 0 — and so does the phone.** Measured on
  the device across 36 states, bars up and bars hidden, static element and fixed:
  every inset is 0px. The 34px was ours, never the device's, and substituting it
  put a phantom number into five sets of measurements (PRD §16 item 44). Do not
  substitute anything; measure at 393×695.
- This is not only an obstacle. It is a free adversarial test for principle 5:
  anything that has to be legible without an animation frame fails loudly here.
  Three real bugs were found this way — a first card that rendered blank, a
  correct/wrong icon that only appeared once its animation ran, and a Next button
  that never mounted because `AnimatePresence mode="wait"` was waiting for an exit
  animation to finish.
- **Node 22+ defines a global `localStorage`**, so `globalThis.localStorage`
  exists in tests. Do not write a test that assumes it is absent. `npm test` prints
  `ExperimentalWarning: localStorage is not available because
  --localstorage-file was not provided` on stderr, twice. It is noise: the run
  still passes and exits 0.
- A saved session in localStorage freezes the questions, so **content edits do not
  appear until the session is cleared**. Clear site data before testing new prompt
  text. See PRD section 16.
- **Tailwind only compiles the classes it finds in the source.** A class that
  exists in `tailwind.config.js` but is used nowhere is not in the stylesheet, so
  adding it to an element at runtime to measure its effect measures nothing. Doing
  that with `min-h-btn` collapsed the slot to zero and produced an 88px saving
  where the real number was 16. Change the source and reload, or measure with an
  inline style.
- **Restart the dev server after editing `tailwind.config.js`.** A server started
  before the edit keeps serving the old theme, and a new colour class falls back to
  Tailwind's default palette — `border-bunga-dark` measured as grey
  `rgb(229, 231, 235)` and every contrast number taken that way was wrong. Check
  a new token's computed value before trusting anything measured against it.
- **The pane is not the device.** `navigator.vendor` is `"Google Inc."` and the UA
  is a Pixel 8 on Android Chrome, so anything a library gates on Apple never runs
  here — Howler branches on `vendor.indexOf('Apple')` inside the function `stop()`
  calls. The pane also lets audio play with no trusted gesture, so the iOS unlock
  path is never exercised either. Both are reasons an audio or Safari claim from
  this pane is about the pane. One thing the pane does share with an iPhone: its
  AudioContext `sampleRate` is 48000, so Howler's `Howler.unload()` branch for a
  rate other than 44100 is live in both.
- **A hidden pane reports `innerHeight` and `clientHeight` as `0`.** When the Browser pane
  is not on screen — the tab exists, the page is loaded — the viewport numbers come back
  zero, and anything derived from them is silently zero too. A measuring page recorded a
  state of all zeros this way. Set a viewport with `resize_window` before measuring, and
  treat a zero height as "not laid out", not as a measurement.
- **The pane draws about 3% small.** The 88px kancil slot measured 85px and the
  64px audio button 62px. Pixel figures taken here are good to about ±3px; a
  margin smaller than that is not a margin you have measured.
- **`focus()` from a script does not trigger `:focus-visible` in the pane.**
  `outline-style` reads `none` on a focused button, so the keyboard focus ring
  cannot be verified from here. Check that the element is focusable and first in
  order, and say the ring itself was not seen.
- **Importing the pack's JSON from the pane is safe.** The second-module-instance
  trap in principle 5 applies to modules with state, such as the player. The pack
  is read-only data, so a second copy holds the same text as the app's.
- **Floats sit side by side unless one is given `clear`.** Two floats on the same
  side stack only with `clear`; without it the second floats next to the first,
  and the text band is as narrow as it was with one on each side. That is why
  "both on one side" first measured the same as the original layout.
- **The quiz screen can carry two `aria-live` regions.** On a count-tap question
  the tally in `QuestionVisual.tsx` is one, so `document.querySelector('[aria-live]')`
  can return the tally instead of the feedback region. Select the feedback region
  as `p.sr-only[aria-live]` (`QuizScreen.tsx`).
- **The prompt's audio button mounts only after an async probe, and measuring
  before it lands measures a layout no child sees.** `AudioButton` returns `null`
  until `isAudioAvailable(src)` resolves, so a measurement taken the moment a
  question renders finds one float in the prompt instead of two: the narrow band
  reads 199px where the settled value is 121px, and the wrap is a different
  shape. Wait for `button[aria-label="Main audio soalan"]` inside the paragraph
  before measuring anything about it. This cost a whole finding in one session —
  the numbers were wrong, and a comment in `QuizScreen.tsx` that was right was
  reported as wrong on the strength of them. (PRD §16 item 26.)

  **A document-wide check for that button is not enough when walking a session.**
  The previous question's button is still mounted while the next card renders, so
  `document.querySelector(...)` returns true immediately and the measurement is
  taken before this question's float lands. It reported a three-line prompt as two
  lines, 30px short (PRD §16 item 47). Wait for the button **inside the current
  card's paragraph** — `document.querySelector('.shadow-float p button[aria-label=
  "Main audio soalan"]')` — not anywhere on the page.

  **And a 0-byte clip means the button never mounts at all.** New questions ship with
  placeholder recordings, `isAudioAvailable` fails on them, and `AudioButton` stays
  `null` — so a question measured before its recording lands has one float fewer than
  the one a child will see. q030 measured as a two-line card that way; with the button
  present it is three lines and 30px taller. To measure the real layout, point the
  frozen session's `promptAudio` at an existing clip and reload. Paid three times:
  PRD §16 items 40, 43 and 49.
- **A paragraph clone has to be a block formatting context.** The live prompt
  paragraph is a flex item, so it contains its floats and its height includes the
  float column. A plain `<p>` clone does not, and reports the text's height instead —
  62px where the live paragraph was 146. Give the clone `display: flow-root`, then
  check it against a few live cards before trusting it for the rest (it agreed to
  within 2px once it had it). (PRD §16 item 45.)
- **Measuring how wide the lines are is not measuring where they are.** A
  proposed layout put the audio button out of the text flow and reserved its
  space with `text-indent`. Every check passed: the card did not scroll, the
  button was pressable, the focus ring was right, frame 0 was legible, the line
  widths were even. The text ran straight through the button, because
  `text-indent` reserves the **first line only** and a 64px button covers 2.08
  lines at a 30.8px line-height. Whenever an element is out of flow — absolute,
  fixed, a negative margin — take each line's `x` and compare it against that
  element's box, not just the line's width. Ranges give both:
  `range.getClientRects()` per text node. (PRD §16 item 33.)

### Loudness only shows when clips are heard one after another

**A clip checked on its own cannot fail a loudness check.** q027 passed the project
owner's ear alone when it was recorded (PRD 16 item 43). A child playing level 3 heard
clips back to back and noticed the difference. Measured afterwards, q027 was the quietest
clip in the bank: −23.64 LUFS, 8.8 LU under the loudest (item 50). Nobody's ear was wrong.
Loudness is a comparison, and a single clip gives the ear nothing to compare against.

So a new recording is never checked on its own. `scripts/loudness.html` measures every
clip in the bank each time, and SPEC 8 makes that a fixed step after the ID3 strip. When a
clip is checked by ear, play it next to the clips around it in a session, not alone. The
peak figures taken first ("0.38–0.40 and 0.82–0.90", item 49) put q027 in the quiet group
and still could not say how quiet it was. Peak is one sample; measure integrated LUFS.

**On a short clip, integrated LUFS depends on where the 400 ms block grid starts.** Two
decoders that produced the same samples, shifted by ~529 samples, read up to 0.324 LU
apart: q009, 11 blocks. That was Chromium against iOS Safari 26.6.1: the same bytes,
durations and peaks. The shift is inferred from a model that reproduces all 35 of the
phone's readings within 0.0005 LU; no iOS samples were read. To compare decoders, compare peaks or samples, or align the
signals first. Do not set a cross-decoder LUFS tolerance tighter than that. (PRD 16 item
50.)

### Controls that unmount themselves

**A control that removes itself from the DOM inside its own event handler cancels
the rest of that gesture for every listener above it.** Events dispatched on a
detached node do not propagate, so a `document`-level listener never sees them.

Concretely, and measured: the start screen's Mula button handled `pointerdown`,
dispatched `START`, React 18 flushed that discrete update in a microtask, and the
button was `isConnected: false` before the browser dispatched `touchstart`.
Howler registers its audio unlock on `document` in capture phase for
`touchstart`, `touchend`, `click` and `keydown` and for no pointer event
(`node_modules/howler/dist/howler.js:409-412`), so the first gesture of the
session never reached it, the AudioContext was never unlocked, and iOS was
silent. `click` was not dispatched at all — a click needs a target still in the
tree.

This is DOM semantics, not an iOS quirk; iOS is only where it costs something,
because iOS is what demands a trusted gesture. The laptop looked perfect through
three sessions of this bug. Before letting a button both act and unmount, ask
what else was waiting for the rest of that gesture. See docs/HANDOFF.md.
