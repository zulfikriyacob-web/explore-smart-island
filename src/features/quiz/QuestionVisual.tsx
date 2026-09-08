import { motion, useReducedMotion } from 'framer-motion';

import type { Question } from '../../content/schema.ts';
import { ease } from '../../motion/tokens.ts';

/**
 * The card-side visual for a question, where there is one. mcq and mcq-image
 * put everything in the answer stack; only count-tap needs objects to tap.
 *
 * Each tap numbers the object it lands on: 1, 2, 3. The number is the act of
 * counting, not a record of it — the object a child missed is the only one
 * without a number, so the mistake is visible without already knowing the
 * answer. Tapping a numbered object again removes its number and renumbers the
 * rest, so a mis-tap costs nothing.
 */
export function QuestionVisual({
  question,
  counted,
  onCount,
  lang,
}: {
  question: Question;
  /** Object indices in the order they were tapped. Position + 1 is the number shown. */
  counted: readonly number[];
  onCount: (index: number) => void;
  lang: 'ms' | 'en';
}) {
  const reduce = useReducedMotion();

  if (question.type !== 'count-tap') return null;

  const { itemImage, itemCount, layout } = question.payload;
  const items = Array.from({ length: itemCount }, (_, i) => i);

  return (
    /*
      72px tap targets with 16px gaps. DESIGN 5.1 sets 64px as the absolute
      minimum and DESIGN 4 sets 16px as the minimum gap between two tappable
      things; these objects used to sit at 64px with an 8px gap — half the gap
      floor — and children mis-tapped. 72px costs nothing horizontally: at 280px
      of card width, 64px and 72px both fit three per row.
    */
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-3 justify-items-center gap-4'
          : 'relative flex flex-wrap items-center justify-center gap-4'
      }
    >
      {items.map((i) => {
        const order = counted.indexOf(i);
        const isCounted = order !== -1;
        return (
          <motion.button
            key={i}
            type="button"
            aria-label={
              isCounted
                ? `Item ${i + 1}, dibilang nombor ${order + 1}, ketuk untuk buang`
                : `Item ${i + 1}, belum dibilang`
            }
            aria-pressed={isCounted}
            onPointerDown={() => onCount(i)}
            whileTap={reduce ? undefined : { scale: 0.9 }}
            animate={{ scale: isCounted ? 0.96 : 1 }}
            transition={{ duration: 0.15, ease: ease.out }}
            // Scatter uses a fixed offset per index, not Math.random, so the
            // layout is identical every render and after a reload. (SPEC 3.4)
            style={
              layout === 'scatter' ? { transform: `translateY(${(i % 3) * 6 - 6}px)` } : undefined
            }
            className="relative grid h-[72px] w-[72px] place-items-center rounded-sm p-1"
          >
            <img src={itemImage} alt="" className="h-16 w-16" draggable={false} />
            {isCounted && (
              <span
                aria-hidden
                // Not animated at all, in either opacity or scale. This badge is
                // the only thing telling a child which objects they have already
                // counted, and an entry animation that never runs leaves it at
                // 60% size — measured at 14px in a throttled renderer, against
                // the 24px it is meant to be. Nothing on the counting path
                // waits for a frame.
                //
                // laut-dark with white text is the pair DESIGN 2.4 validates at
                // 5.1:1. White on plain --laut fails, at 2.4:1.
                className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-laut-dark font-display text-label font-bold tabular-nums text-white"
              >
                {order + 1}
              </span>
            )}
          </motion.button>
        );
      })}
      {/*
        The tally sits with the objects it counts, not down in the answer stack.
        It used to live above the number pad, which cost the stack a whole extra
        row on a 360x780 screen.
      */}
      <span
        aria-live="polite"
        className="col-span-full w-full text-center font-sans text-label text-arang-soft"
      >
        {lang === 'ms' ? `Dibilang: ${counted.length}` : `Counted: ${counted.length}`}
      </span>
    </div>
  );
}
