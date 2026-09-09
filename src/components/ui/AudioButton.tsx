import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { isAudioAvailable } from '../../lib/audio.ts';
import { promptPlayer } from '../../lib/player.ts';
import { ease } from '../../motion/tokens.ts';
// TEMPORARY — iOS audio diagnostics. Delete with the branch.
import { duringGesture, inGesture, record } from '../../lib/diagnostics.ts';

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
 * again restarts it; leaving the question cuts it off.
 *
 * With `autoPlay`, the prompt reads itself when the question appears (SPEC 8) —
 * the whole point of Phase 1 exit criterion 7, since a child who cannot read has
 * no way to know a speaker button is there. Autoplay runs through this same
 * component rather than from the screen above it, for two reasons: the player
 * assumes a single caller, and the pulse that shows a child something is being
 * said belongs to the same state either way. Pressing during autoplay restarts
 * the clip instead of layering a second one, because `play` stops whatever was
 * going first.
 */
export function AudioButton({
  src,
  label = 'Main audio soalan',
  autoPlay = false,
  className = '',
}: {
  src: string;
  label?: string;
  /** Play once when this prompt appears, if a gesture has unlocked audio. */
  autoPlay?: boolean;
  /** Lets the caller place the button — it floats inside the prompt (DESIGN 5.2). */
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let live = true;
    setAvailable(false);
    void isAudioAvailable(src).then((ok) => {
      if (!live || !ok) return;
      setAvailable(true);
      // Autoplay waits for the availability probe, so a placeholder file is
      // never "played" silently. It is fired once per src: this effect is keyed
      // on src, and `live` closes it the moment the question changes.
      //
      // `unlocked()` is the iOS gate. Before the first gesture a play() would be
      // refused by the browser and the child would be told nothing, so we simply
      // do not try — the button is still there to press, and pressing it is
      // itself the gesture.
      // TEMPORARY diagnostics: record the autoplay decision either way, so a
      // prompt that stays silent says which of the two gates stopped it.
      record('autoplay decision', {
        src: src.replace('/audio/ms/', ''),
        autoPlay,
        unlocked: promptPlayer.unlocked(),
        willPlay: autoPlay && promptPlayer.unlocked(),
        inGesture: inGesture(),
      });
      if (autoPlay && promptPlayer.unlocked()) {
        setPlaying(true);
        promptPlayer.play(src, () => setPlaying(false));
      }
    });
    return () => {
      live = false;
      // Moving to the next question cuts this prompt off. Without this the
      // previous question keeps talking over the new one.
      if (promptPlayer.playing() === src) promptPlayer.stop();
    };
    // `autoPlay` is read at fire time and never changes for a mounted prompt;
    // keying on src alone is what keeps this to one play per question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!available) return null;

  return (
    <motion.button
      type="button"
      aria-label={label}
      onPointerDown={(event) => {
        // TEMPORARY diagnostics — see BlockButton.
        record('press', { button: 'audio', isTrusted: event.isTrusted, type: event.type });
        duringGesture(() => {
          // Pressing during playback restarts the clip rather than being
          // ignored. A button that does nothing when pressed is a button a child
          // reads as broken, which is the same reason it hides itself when the
          // file is a placeholder. `play` halts whatever was going, so a press
          // during autoplay replaces it — one clip is audible at a time.
          promptPlayer.unlock();
          setPlaying(true);
          promptPlayer.play(src, () => setPlaying(false));
        });
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
      className={`grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] border-laut bg-white p-0 transition-colors active:bg-laut-light ${className}`}
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
