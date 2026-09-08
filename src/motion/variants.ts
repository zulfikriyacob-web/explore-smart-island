/**
 * Reusable Framer Motion variants. From docs/SPEC.md section 7.2.
 *
 * Every animation in here answers "what just changed?" or "what can I touch?".
 * DESIGN section 7 throws out any that does not.
 *
 * **No entry variant starts at `opacity: 0`, and none starts far from where it
 * lands.** An animation frame is not a guarantee — a backgrounded tab, a
 * throttled device, a renderer that never calls requestAnimationFrame — and
 * content whose appearance is caused by an animation is simply missing when the
 * frame does not arrive. Entry states here are the settled state, slightly
 * smaller: visible and correctly placed on frame 0, refined afterwards.
 * (CLAUDE.md principle 5.)
 *
 * The states are named `arriving` and `settled` rather than `hidden` and
 * `visible`. Nothing is ever hidden; that word is what the old bug was made of.
 */

import type { Variants } from 'framer-motion';

import { duration, ease, spring } from './tokens.ts';

/**
 * D2 — the question card arrives, its children a beat behind it.
 *
 * Scale carries the whole thing. Frozen at `arriving` the card is 1.5% small,
 * in the right place, fully opaque, and readable — a child cannot tell it from
 * the settled card, which is the test an entry animation has to pass.
 */
export const questionCard: Variants = {
  arriving: { opacity: 1, scale: 0.985 },
  settled: {
    opacity: 1,
    scale: 1,
    transition: { ...spring.settle, staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

/** Each staggered child of the card. */
export const optionItem: Variants = {
  arriving: { opacity: 1, scale: 0.98 },
  settled: { opacity: 1, scale: 1, transition: spring.pop },
};

/** B5 — the hint arrives under the question. Never fades in; see above. */
export const hintItem: Variants = {
  arriving: { opacity: 1, scale: 0.98 },
  settled: { opacity: 1, scale: 1, transition: { duration: duration.base, ease: ease.out } },
};

/** B3 — wrong answer shake. Short, horizontal, not frightening. */
export const shake = {
  x: [0, -9, 9, -6, 6, -3, 0],
  transition: { duration: 0.34, ease: 'easeInOut' as const },
};

/** B1 — correct answer pulse. */
export const correctPulse = {
  scale: [1, 1.12, 1],
  transition: { duration: 0.32, ease: ease.back },
};
