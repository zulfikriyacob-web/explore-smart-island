import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { isAudioAvailable } from '../../lib/audio.ts';
import { ease } from '../../motion/tokens.ts';

/**
 * A3 — the speaker icon pulses while audio plays, so a child who cannot read
 * still sees that something is being said.
 *
 * The button renders nothing until the file behind `src` has real bytes. The
 * recordings in public/ are still zero-byte placeholders (PRD 8), and user
 * testing showed a 7-year-old pressing this first, before anything else: a
 * button that plays nothing teaches a child that buttons do nothing. When real
 * recordings land the button reappears on its own — no code change, because the
 * check is the file itself.
 */
export function AudioButton({ src, label = 'Main audio soalan' }: { src: string; label?: string }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let live = true;
    setAvailable(false);
    void isAudioAvailable(src).then((ok) => {
      if (live) setAvailable(ok);
    });
    return () => {
      live = false;
    };
  }, [src]);

  if (!available) return null;

  return (
    <motion.button
      type="button"
      aria-label={label}
      onPointerDown={() => {
        if (playing) return;
        setPlaying(true);
        // Playback itself still has to be wired to Howler (SPEC 8); the pulse
        // is driven by a timer until then.
        window.setTimeout(() => setPlaying(false), 900);
      }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      animate={playing && !reduce ? { scale: [1, 1.15, 1, 1.15, 1] } : { scale: 1 }}
      transition={playing && !reduce ? { duration: 0.9, ease: ease.out } : { duration: 0.12 }}
      className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] border-laut bg-white p-0 transition-colors active:bg-laut-light"
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
