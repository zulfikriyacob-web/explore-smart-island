import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { isAudioAvailable } from '../../lib/audio.ts';
import { promptPlayer } from '../../lib/player.ts';
import { ease } from '../../motion/tokens.ts';

/**
 * A3 — the speaker icon pulses while audio plays, so a child who cannot read
 * still sees that something is being said.
 *
 * The button renders nothing until the file behind `src` has real bytes, so a
 * language whose recordings have not been made yet shows no control at all
 * (PRD 8). User testing showed a 7-year-old pressing this first, before anything
 * else: a button that plays nothing teaches a child that buttons do nothing.
 * The check is the file itself, so a recording appearing is all it takes.
 *
 * Playback goes through `lib/player.ts`. Pressing plays the prompt; pressing
 * again restarts it; leaving the question cuts it off. There is no autoplay and
 * no gesture unlock yet (SPEC 8) — both need the intro screen the store
 * currently skips, and that is a design decision before it is code.
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
      // Moving to the next question cuts this prompt off. Without this the
      // previous question keeps talking over the new one.
      if (promptPlayer.playing() === src) promptPlayer.stop();
    };
  }, [src]);

  if (!available) return null;

  return (
    <motion.button
      type="button"
      aria-label={label}
      onPointerDown={() => {
        // Pressing during playback restarts the clip rather than being ignored.
        // A button that does nothing when pressed is a button a child reads as
        // broken, which is the same reason it hides itself when the file is a
        // placeholder.
        setPlaying(true);
        promptPlayer.play(src, () => setPlaying(false));
      }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      // The pulse repeats for as long as audio is actually playing and stops on
      // the player's settle callback — the real `end` event, or a load failure.
      // It is no longer a fixed timer that guesses at the length of the clip.
      animate={playing && !reduce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={
        playing && !reduce
          ? { duration: 0.7, repeat: Infinity, ease: ease.out }
          : { duration: 0.12 }
      }
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
