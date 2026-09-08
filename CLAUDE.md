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
