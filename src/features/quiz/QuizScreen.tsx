import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { AudioButton } from '../../components/ui/AudioButton.tsx';
import { BlockButton } from '../../components/ui/BlockButton.tsx';
import { ProgressBar } from '../../components/ui/ProgressBar.tsx';
import { ease } from '../../motion/tokens.ts';
import { questionCard, reducedCard, reducedItem, optionItem } from '../../motion/variants.ts';
import { AnswerControls } from './AnswerControls.tsx';
import { QuestionVisual } from './QuestionVisual.tsx';
import { currentQuestion } from './session.ts';
import { useQuizStore } from './store.ts';

/**
 * Instruction language. PRD section 12 wants a quick switch on this screen;
 * Brief 02 does not ask for it, so this build is Malay and the switch is a
 * later change. Every string still comes from the pack's bilingual fields, so
 * flipping this constant is all it takes.
 */
const LANG = 'ms' as const;

/**
 * Layout follows DESIGN section 5.2, not the handoff prototype.
 *
 * The prototype pins `.atas` and `.bawah` to a hard 55% split with absolute
 * positioning. DESIGN 5.2 replaced that: the answer stack anchors to the bottom
 * at its natural height and never shrinks, the question card takes what is left
 * with flex-1 and min-h-0 so it shrinks first, and 55% is only the target where
 * the stack starts on an ordinary screen. design/README.md says docs/ wins, so
 * docs/ won. Everything else — colours, sizes, shadows, icons — is the
 * prototype's.
 */
export function QuizScreen() {
  const session = useQuizStore((s) => s.session);
  const answer = useQuizStore((s) => s.answer);
  const next = useQuizStore((s) => s.next);
  const reduce = useReducedMotion();

  const question = currentQuestion(session);
  const [counted, setCounted] = useState<number[]>([]);

  // Counting state belongs to one question only.
  useEffect(() => setCounted([]), [session.index]);

  // The very first card renders at its final state instead of animating in.
  // D2 is about swapping one question for the next; there is nothing to swap
  // from on load, and starting at opacity 0 means a child sees a blank card
  // whenever the animation frame does not arrive — a backgrounded tab, a
  // throttled device. Later cards animate normally.
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  if (!question) return null;

  const locked = session.status === 'feedback';
  const showHint = session.hintShown && question.hint !== undefined;

  return (
    <main className="mx-auto flex h-[100dvh] max-w-[430px] flex-col">
      {/* Read / watch. No answer buttons up here. (DESIGN 5.2) */}
      <section className="flex min-h-0 flex-1 flex-col gap-5 px-4 pt-6">
        <ProgressBar current={session.index + 1} total={session.questions.length} />

        <AnimatePresence mode="wait">
          {/* D2 — one card out, the next in. */}
          <motion.div
            key={question.id}
            layout={!reduce}
            variants={reduce ? reducedCard : questionCard}
            initial={firstRender.current ? false : 'hidden'}
            animate="visible"
            exit="exit"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg bg-white p-6 shadow-float"
          >
            <div className="flex items-start justify-between gap-4">
              <AudioButton src={question.promptAudio[LANG]} />
              {/*
                Reserved kancil slot, 88x88, empty for now. It holds real layout
                space so the mascot's arrival will not move anything.
                (DESIGN 7, "slot yang ditempah")
              */}
              <div aria-hidden className="h-[88px] w-[88px] shrink-0" data-slot="kancil" />
            </div>

            <motion.p
              variants={reduce ? reducedItem : optionItem}
              lang={LANG}
              className="m-0 text-left font-sans text-prompt font-medium"
            >
              {question.prompt[LANG]}
            </motion.p>

            <QuestionVisual
              question={question}
              counted={counted}
              lang={LANG}
              onCount={(i) => setCounted((c) => (c.includes(i) ? c : [...c, i]))}
            />

            {/* B5 — the hint grows in under the question. The card's `layout`
                prop does the resizing; height is never animated directly. */}
            <AnimatePresence>
              {showHint && (
                <motion.p
                  key="hint"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: ease.out }}
                  className="m-0 rounded-md bg-laut-light px-4 py-3 font-sans text-body text-arang"
                >
                  {question.hint?.[LANG]}
                </motion.p>
              )}
            </AnimatePresence>

            {session.revealed && question.explain && (
              <p className="m-0 rounded-md bg-pasir px-4 py-3 font-sans text-body text-arang">
                {question.explain[LANG]}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/*
        Thumb zone. Anchored to the bottom, natural height, never shrinks.
        max() matters: env() is 0px on a device with no home bar, and env()
        alone would glue the buttons to the screen edge. (DESIGN 5.2)
      */}
      <section
        aria-live="polite"
        className="flex flex-col gap-4 px-4 pt-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <AnswerControls
          question={question}
          disabledOptionIds={session.disabledOptionIds}
          lastAnswerCorrect={session.lastAnswerCorrect}
          revealed={session.revealed}
          locked={locked}
          lang={LANG}
          onAnswer={answer}
        />

        {/*
          Reserved Next slot, 88px, empty at rest. Next always appears in exactly
          the same place, so the muscle memory a child builds keeps working.
          (DESIGN 5.2, DESIGN 7)
        */}
        <div className="min-h-answer" data-slot="seterusnya">
          <AnimatePresence>
            {locked && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: ease.out }}
              >
                <BlockButton onPress={next} ariaLabel="Soalan seterusnya">
                  Seterusnya
                </BlockButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
