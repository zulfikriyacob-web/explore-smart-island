import { motion, useReducedMotion } from 'framer-motion';

import type { Question } from '../../content/schema.ts';
import { ease } from '../../motion/tokens.ts';

/**
 * The card-side visual for a question, where there is one. mcq and mcq-image
 * put everything in the answer stack; only count-tap needs objects to tap.
 */
export function QuestionVisual({
  question,
  counted,
  onCount,
  lang,
}: {
  question: Question;
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
        const isCounted = counted.includes(i);
        return (
          <motion.button
            key={i}
            type="button"
            aria-label={`Item ${i + 1}${isCounted ? ', sudah dibilang' : ''}`}
            aria-pressed={isCounted}
            onPointerDown={() => onCount(i)}
            whileTap={reduce ? undefined : { scale: 0.9 }}
            animate={{ scale: isCounted ? 0.92 : 1, opacity: isCounted ? 0.45 : 1 }}
            transition={{ duration: 0.15, ease: ease.out }}
            // Scatter uses a fixed offset per index, not Math.random, so the
            // layout is identical every render and after a reload. (SPEC 3.4)
            style={
              layout === 'scatter'
                ? { transform: `translateY(${(i % 3) * 6 - 6}px)` }
                : undefined
            }
            className="grid h-[72px] w-[72px] place-items-center rounded-sm p-1"
          >
            <img src={itemImage} alt="" className="h-16 w-16" draggable={false} />
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
