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

### Verifying visual work

- **The Browser pane runs the page with `document.hidden === true`, so
  `requestAnimationFrame` never fires** — measured at 0 frames in 400ms. Framer
  Motion animations do not run at all. An element with `initial={{ opacity: 0 }}`
  stays invisible, a CSS `transition` freezes at its start value, and an entry
  `scale` stays at its starting size.
- **Measure with `getBoundingClientRect` and `getComputedStyle`, not
  screenshots.** Screenshots from the pane time out, come back tiled, or return a
  cropped view.
- This is not only an obstacle. It is a free adversarial test for principle 5:
  anything that has to be legible without an animation frame fails loudly here.
  Three real bugs were found this way — a first card that rendered blank, a
  correct/wrong icon that only appeared once its animation ran, and a Next button
  that never mounted because `AnimatePresence mode="wait"` was waiting for an exit
  animation to finish.
- **Node 22+ defines a global `localStorage`**, so `globalThis.localStorage`
  exists in tests. Do not write a test that assumes it is absent.
- A saved session in localStorage freezes the questions, so **content edits do not
  appear until the session is cleared**. Clear site data before testing new prompt
  text. See PRD section 16.
- **Tailwind only compiles the classes it finds in the source.** A class that
  exists in `tailwind.config.js` but is used nowhere is not in the stylesheet, so
  adding it to an element at runtime to measure its effect measures nothing. Doing
  that with `min-h-btn` collapsed the slot to zero and produced an 88px saving
  where the real number was 16. Change the source and reload, or measure with an
  inline style.
- **The pane is not the device.** `navigator.vendor` is `"Google Inc."` and the UA
  is a Pixel 8 on Android Chrome, so anything a library gates on Apple never runs
  here — Howler branches on `vendor.indexOf('Apple')` inside the function `stop()`
  calls. The pane also lets audio play with no trusted gesture, so the iOS unlock
  path is never exercised either. Both are reasons an audio or Safari claim from
  this pane is about the pane.
