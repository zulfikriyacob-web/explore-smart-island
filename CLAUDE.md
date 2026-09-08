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
