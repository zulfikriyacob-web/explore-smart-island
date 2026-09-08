import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { BlockButton } from '../../components/ui/BlockButton.tsx';
import { ease, spring } from '../../motion/tokens.ts';
import type { SessionResult } from '../../lib/scoring.ts';
import { useQuizStore } from './store.ts';

const STAR_PATH =
  '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

/** D3 — gems count up, so the reward feels earned rather than handed over. */
function CountUp({ to }: { to: number }) {
  const value = useMotionValue(0);
  const [shown, setShown] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setShown(to);
      return;
    }
    const unsubscribe = value.on('change', (v) => setShown(Math.round(v)));
    const controls = animate(value, to, { duration: 0.6, ease: ease.out });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [to, reduce, value]);

  return <span className="tabular-nums">{shown}</span>;
}

/** E1 — stars drop in one at a time. The peak moment of the session. */
function Star({ filled, index }: { filled: boolean; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={`h-[88px] w-[88px] ${index === 1 ? '-mt-4' : ''}`}
      initial={filled && !reduce ? { scale: 0, rotate: -25, opacity: 0 } : false}
      animate={filled && !reduce ? { scale: 1, rotate: 0, opacity: 1 } : { opacity: 1 }}
      transition={{ ...spring.cheer, delay: index * 0.18 }}
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

  return (
    <main className="mx-auto flex h-[100dvh] max-w-[430px] flex-col items-center px-4 pb-6 pt-14">
      <div className="font-sans text-label font-medium text-arang-soft">Aktiviti selesai</div>
      <h1 className="mt-2 font-display text-display font-bold">Syabas!</h1>

      {/*
        Placeholder kancil. Static on purpose: the Rive mascot is out of scope
        for this brief, and its idle breathing is a Group F animation, which this
        brief also excludes.
      */}
      <svg className="mt-6 h-[180px] w-[234px] overflow-visible" viewBox="0 0 260 200" aria-hidden>
        <ellipse cx="128" cy="188" rx="76" ry="6" fill="#D3E8E3" />
        <rect x="78" y="150" width="12" height="36" rx="6" fill="#4A625B" />
        <rect x="98" y="152" width="12" height="34" rx="6" fill="#4A625B" />
        <rect x="138" y="150" width="12" height="36" rx="6" fill="#4A625B" />
        <rect x="158" y="152" width="12" height="34" rx="6" fill="#4A625B" />
        <ellipse cx="58" cy="118" rx="6" ry="10" fill="#7A958D" />
        <ellipse cx="118" cy="132" rx="60" ry="40" fill="#5C7A72" />
        <ellipse cx="168" cy="56" rx="8" ry="18" fill="#7A958D" />
        <ellipse cx="196" cy="54" rx="8" ry="18" fill="#7A958D" />
        <circle cx="182" cy="88" r="28" fill="#5C7A72" />
        <ellipse cx="206" cy="96" rx="14" ry="10" fill="#5C7A72" />
        <circle cx="216" cy="94" r="4" fill="#1F3A34" />
        <circle cx="176" cy="84" r="4" fill="#1F3A34" />
        <circle cx="194" cy="82" r="4" fill="#1F3A34" />
      </svg>

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
