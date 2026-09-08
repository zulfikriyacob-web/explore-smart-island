import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { ease } from '../../motion/tokens.ts';

/**
 * A3 — the speaker icon pulses while audio plays, so a child who cannot read
 * still sees that something is being said.
 *
 * The audio files in public/ are zero-byte placeholders (PRD 8), so playback is
 * a no-op for now and the pulse runs on a fixed 900ms timer. When real
 * recordings land, drive `playing` from the Howler instance instead — that is
 * the only change this component needs.
 */
export function AudioButton({ label = 'Main audio soalan' }: { label?: string }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={label}
      onPointerDown={() => {
        if (playing) return;
        setPlaying(true);
        window.setTimeout(() => setPlaying(false), 900);
      }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      animate={playing && !reduce ? { scale: [1, 1.15, 1, 1.15, 1] } : { scale: 1 }}
      transition={playing && !reduce ? { duration: 0.9, ease: ease.out } : { duration: 0.12 }}
      className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-laut bg-white p-0 transition-colors active:bg-laut-light"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="text-arang"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </motion.button>
  );
}
