/**
 * Reusable Framer Motion variants. From docs/SPEC.md section 7.2, plus the
 * reduced-motion counterparts SPEC 7.5 requires.
 *
 * Every animation in here answers "what just changed?" or "what can I touch?".
 * DESIGN section 7 throws out any that does not.
 */

import type { Variants } from 'framer-motion';

import { duration, ease, spring } from './tokens.ts';

/** D2 — the question card enters, its children staggered behind it. */
export const questionCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring.settle, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.97,
    transition: { duration: duration.base, ease: ease.in },
  },
};

/** Each answer option. */
export const optionItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring.pop },
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

/** SPEC 7.5: motion and scale become a plain fade; colour and icons stay. */
export const reducedCard: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, staggerChildren: 0 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const reducedItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};
