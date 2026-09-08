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
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-4 gap-2'
          : 'relative flex flex-wrap items-center justify-center gap-2'
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
            className="grid h-16 w-16 place-items-center rounded-sm"
          >
            <img src={itemImage} alt="" className="h-14 w-14" draggable={false} />
          </motion.button>
        );
      })}
      <span className="sr-only">{lang === 'ms' ? 'Ketuk untuk membilang' : 'Tap to count'}</span>
    </div>
  );
}
