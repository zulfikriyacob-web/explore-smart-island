import { animate, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { BlockButton } from '../../components/ui/BlockButton.tsx';
import { Kancil, type KancilState } from '../../components/ui/Kancil.tsx';
import { duration, ease } from '../../motion/tokens.ts';
import type { SessionResult } from '../../lib/scoring.ts';
import { useQuizStore } from './store.ts';

const STAR_PATH =
  '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

/**
 * D3 — gems count up, so the reward feels earned rather than handed over.
 *
 * State starts at the real number, and the count-up runs from zero up to it.
 * `onUpdate` only ever fires on an animation frame, so with no frames nothing
 * touches `shown` and the child reads the true total; with frames it rewinds on
 * the first one and climbs. The number is the reward and the climb is the
 * flourish, in that order. (CLAUDE.md principle 5.)
 */
function CountUp({ to }: { to: number }) {
  const [shown, setShown] = useState(to);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setShown(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 0.6,
      ease: ease.out,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);

  return <span className="tabular-nums">{shown}</span>;
}

/**
 * E1 — stars land one at a time, staggered. The peak moment of the session.
 *
 * The trick is the one the tick and cross icons already use: start at the final
 * state and animate away from it and back, rather than starting at nothing. The
 * first keyframe of each track equals `initial`, so a frozen render is three
 * filled stars at full size and full opacity — the true result — while a
 * rendering one gets the swell and the tip, 180ms apart.
 *
 * Starting at `scale: 0, opacity: 0` meant a child who got no frame reached the
 * end of an activity and was shown three empty outlines: told they had won
 * nothing. (CLAUDE.md principle 5.)
 */
function Star({ filled, index }: { filled: boolean; index: number }) {
  const reduce = useReducedMotion();
  const animated = filled && !reduce;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={`h-[88px] w-[88px] ${index === 1 ? '-mt-4' : ''}`}
      initial={animated ? { opacity: 1, scale: 1, rotate: 0 } : false}
      animate={
        animated
          ? { opacity: 1, scale: [1, 1.25, 1], rotate: [0, -25, 0] }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: duration.cheer, ease: ease.back, delay: index * 0.18 }}
      aria-hidden
    >
      <polygon
        points={STAR_PATH}
        className={filled ? 'fill-mangga' : 'fill-none stroke-garis'}
        strokeWidth={filled ? 0 : 1.6}
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function SummaryScreen({ result }: { result: SessionResult }) {
  const restart = useQuizStore((s) => s.restart);
  const session = useQuizStore((s) => s.session);
  const total = session.questions.length;
  const [kancil, setKancil] = useState<KancilState>('happy');

  return (
    <main className="mx-auto flex h-[100dvh] max-w-[430px] flex-col items-center px-4 pb-6 pt-14">
      <div className="font-sans text-label font-medium text-arang-soft">Aktiviti selesai</div>
      <h1 className="mt-2 font-display text-display font-bold">Syabas!</h1>

      {/*
        The real kancil, replacing the grey placeholder blob. It lands on
        `happy` — one jump, ears up, eyes squeezed — and settles into idle
        breathing when that finishes. DESIGN 6 puts the mascot on the reward
        screen; this is the screen it was drawn for.
      */}
      <Kancil state={kancil} size={200} onDone={() => setKancil('idle')} className="mt-6" />

      <div
        className="mt-6 flex gap-4"
        role="img"
        aria-label={`${result.stars} daripada 3 bintang`}
      >
        {[0, 1, 2].map((i) => (
          <Star key={i} index={i} filled={i < result.stars} />
        ))}
      </div>

      <div className="mt-3 font-display text-h2 font-semibold">
        {result.stars} daripada 3 bintang
      </div>
      <div className="mt-1.5 text-center font-sans text-label text-arang-soft">
        {result.firstTryCount} daripada {total} betul pada cubaan pertama
      </div>

      <div className="mt-5 flex items-center gap-2.5 rounded-full border-2 border-garis bg-white px-[18px] py-2.5 font-sans font-semibold">
        <i aria-hidden className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-pirus" />+
        <CountUp to={result.gems} /> permata
      </div>

      <div className="mt-auto flex w-full flex-col gap-4 pt-6">
        <BlockButton onPress={restart} minHeight={72} ariaLabel="Main aktiviti ini lagi">
          Main lagi
        </BlockButton>
        {/* Same slot as the quiz screen's Next, so the button does not move. */}
        <div className="min-h-answer">
          <BlockButton onPress={restart} ariaLabel="Seterusnya">
            Seterusnya
          </BlockButton>
        </div>
      </div>
    </main>
  );
}
