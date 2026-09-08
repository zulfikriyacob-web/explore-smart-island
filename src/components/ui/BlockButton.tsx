import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useRef, useState, type ReactNode } from 'react';

import { correctPulse, shake } from '../../motion/variants.ts';
import { ease, spring } from '../../motion/tokens.ts';

export type BlockState = 'rest' | 'correct' | 'wrong' | 'disabled' | 'revealed';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface BlockButtonProps {
  children: ReactNode;
  onPress: () => void;
  state?: BlockState;
  /** DESIGN 5.1: 88 for a primary answer, 72 for a secondary action. */
  minHeight?: 88 | 72;
  ariaLabel?: string;
  className?: string;
}

const FACE: Record<BlockState, string> = {
  rest: 'bg-white border-laut shadow-[0_4px_0_0_theme(colors.laut.dark)]',
  correct: 'bg-daun-light border-daun shadow-[0_4px_0_0_theme(colors.daun.DEFAULT)]',
  wrong: 'bg-white border-bunga shadow-[0_4px_0_0_theme(colors.bunga.DEFAULT)]',
  disabled: 'bg-white border-garis shadow-[0_4px_0_0_theme(colors.garis)]',
  revealed: 'bg-white border-mangga shadow-[0_4px_0_0_theme(colors.mangga)]',
};

/**
 * The toy-block button from DESIGN 5.3. Pressing pushes it down onto its solid
 * bottom edge, which reads as pressable without any text.
 *
 * Animations: A1 press, A2 tap ripple, B1 correct pulse, B3 wrong shake,
 * B4 wilt, B6 reveal. Transform and opacity only — the colour changes are CSS
 * classes, not animated properties.
 *
 * The check/cross icon sits in an absolutely positioned slot that is always
 * present, so feedback never reflows the label. Nothing shifts between rest and
 * feedback. (DESIGN 7, "slot yang ditempah")
 */
export function BlockButton({
  children,
  onPress,
  state = 'rest',
  minHeight = 88,
  ariaLabel,
  className = '',
}: BlockButtonProps) {
  const reduce = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRipple = useRef(0);

  const isLocked = state === 'disabled' || state === 'correct';

  const handlePress = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (isLocked) return;
      if (!reduce) {
        // A2 — show where the finger actually landed. Useful when a child misses.
        const box = event.currentTarget.getBoundingClientRect();
        const id = nextRipple.current++;
        setRipples((r) => [...r, { id, x: event.clientX - box.left, y: event.clientY - box.top }]);
        window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 500);
      }
      onPress();
    },
    [isLocked, onPress, reduce],
  );

  // B1 / B3 — the feedback animation for this state, or nothing under reduced
  // motion, where colour and icon carry the message instead. (SPEC 7.5)
  const feedback =
    reduce || state === 'rest' || state === 'disabled'
      ? undefined
      : state === 'correct'
        ? correctPulse
        : state === 'wrong'
          ? shake
          : state === 'revealed'
            ? { scale: [1, 1.06, 1, 1.06, 1], transition: { duration: 1.2, ease: ease.out } }
            : undefined;

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      disabled={isLocked}
      onPointerDown={handlePress}
      // B4 — a struck-out option wilts rather than vanishing, so the list does
      // not reflow underneath a child's finger.
      animate={{
        opacity: state === 'disabled' ? 0.35 : 1,
        scale: state === 'disabled' ? 0.96 : 1,
        ...(feedback ?? {}),
      }}
      transition={feedback?.transition ?? { duration: 0.2, ease: ease.out }}
      whileTap={isLocked || reduce ? undefined : { y: 4, scale: 0.98 }}
      style={{ minHeight }}
      className={`relative w-full overflow-hidden rounded-md border-4 px-6 font-display text-h2 font-semibold text-arang tabular-nums transition-colors duration-150 ${FACE[state]} ${className}`}
    >
      {/* B2 — correct ring, expanding outward. Cheaper than particles. */}
      <AnimatePresence>
        {state === 'correct' && !reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-1 rounded-[24px] border-[3px] border-daun"
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.out }}
          />
        )}
      </AnimatePresence>

      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute h-6 w-6 rounded-full bg-laut"
          style={{ left: r.x - 12, top: r.y - 12 }}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.45, ease: ease.out }}
        />
      ))}

      <span className="flex items-center justify-center">{children}</span>

      {/* Reserved icon slot: always in the layout, only its contents change. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center"
      >
        <AnimatePresence>
          {(state === 'correct' || state === 'wrong') && (
            <motion.span
              className={`grid h-9 w-9 place-items-center rounded-full ${
                state === 'correct' ? 'bg-daun' : 'bg-bunga'
              }`}
              // Opacity starts at 1 and only scale animates. SPEC section 9
              // forbids conveying right/wrong by colour alone, so the icon has
              // to be legible even if the animation never runs — a throttled
              // device, a backgrounded tab.
              initial={reduce ? { opacity: 1 } : { scale: 0.6, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0.15 } : spring.pop}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[22px] w-[22px] fill-none stroke-white"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {state === 'correct' ? <path d="M20 6 9 17l-5-5" /> : <path d="M18 6 6 18M6 6l12 12" />}
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
