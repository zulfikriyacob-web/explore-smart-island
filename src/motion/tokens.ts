/**
 * Motion tokens. Values copied from docs/SPEC.md section 7.1 — if one is wrong,
 * it is wrong in SPEC.md first.
 *
 * Hard rule (SPEC 7.1): animate `transform` and `opacity` only. No width,
 * height, top, left, box-shadow or filter on a hot path. For size changes use
 * Framer Motion's `layout` prop, never an animated width.
 */

import type { Transition } from 'framer-motion';

export const spring = {
  /** Button tap response — fast, slight bounce */
  pop: { type: 'spring', stiffness: 500, damping: 22, mass: 0.6 },
  /** Card and layout transitions — steady */
  settle: { type: 'spring', stiffness: 260, damping: 26, mass: 1 },
  /** Reward moments — deliberate overshoot */
  cheer: { type: 'spring', stiffness: 380, damping: 12, mass: 0.8 },
  /** A dragged item returning home */
  snap: { type: 'spring', stiffness: 700, damping: 35, mass: 0.5 },
} satisfies Record<string, Transition>;

export const duration = {
  micro: 0.12, // state changes, presses
  base: 0.22, // element in/out
  cheer: 0.45, // celebration
  ambient: 3.0, // mascot breathing loop
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1], // expo-out, reads as fast
  back: [0.34, 1.56, 0.64, 1], // slight overshoot, child-friendly
  in: [0.4, 0, 1, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** Reduced motion collapses everything to a 150ms opacity cross-fade. (SPEC 7.5) */
export const REDUCED_FADE: Transition = { duration: 0.15 };
