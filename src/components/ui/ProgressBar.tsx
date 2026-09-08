import { motion, useReducedMotion } from 'framer-motion';

import { spring } from '../../motion/tokens.ts';

interface ProgressBarProps {
  current: number;
  total: number;
}

/**
 * D1 — progress grows. Animated with scaleX and transformOrigin: left, never
 * width. (SPEC 7.3, DESIGN 6)
 */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const reduce = useReducedMotion();
  const ratio = total === 0 ? 0 : current / total;

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Kemajuan"
        className="h-3 flex-1 overflow-hidden rounded-full bg-garis"
      >
        <motion.div
          className="h-full origin-left rounded-full bg-laut"
          initial={false}
          animate={{ scaleX: ratio }}
          transition={reduce ? { duration: 0.15 } : spring.settle}
        />
      </div>
      <span className="font-sans text-label font-semibold tabular-nums text-arang-soft">
        {current} / {total}
      </span>
    </div>
  );
}
