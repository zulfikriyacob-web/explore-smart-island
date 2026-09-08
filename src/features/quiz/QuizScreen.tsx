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
            /*
              Content is centred vertically. The card is flex-1 and fills the
              height left over, so left-aligned to the top it left 124px of dead
              white below the objects on a 7-object question and more on a
              5-object one.

              `safe center` rather than plain `center`: if content ever does
              overflow, safe alignment falls back to flex-start so the top stays
              reachable, instead of being clipped above the scroll origin.
              Supported from Chrome 93 and Safari 15.4, inside the SPEC 7.6
              baseline.
            */
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg bg-white p-6 shadow-float [justify-content:safe_center]"
          >
            <AudioButton src={question.promptAudio[LANG]} />

            <motion.p
              variants={reduce ? reducedItem : optionItem}
              lang={LANG}
              className="m-0 min-h-[88px] text-left font-sans text-prompt font-medium"
            >
              {/*
                Reserved kancil slot, 88x88, in the card's top-right corner.
                It floats, so the prompt wraps around it for the first 88px and
                then reflows to full width — the corner stays clear without the
                slot costing the card a whole 88px row of its own. min-h-[88px]
                on the paragraph keeps the float contained even when the prompt
                is one line. Nothing moves when the mascot arrives.
                (DESIGN 7, "slot yang ditempah")
              */}
              <span aria-hidden data-slot="kancil" className="float-right ml-4 h-[88px] w-[88px]" />
              {question.prompt[LANG]}
            </motion.p>

            <QuestionVisual
              question={question}
              counted={counted}
              lang={LANG}
              // Tapping toggles: a numbered object taps back off, and the ones
              // after it renumber themselves because the number is just the
              // position in this array.
              onCount={(i) =>
                setCounted((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))
              }
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

            {session.revealed && (question.explain || question.type === 'count-tap') && (
              <p className="m-0 rounded-md bg-pasir px-4 py-3 font-sans text-body text-arang">
                {question.explain?.[LANG] ??
                  `Jawapannya ${question.type === 'count-tap' ? question.payload.correctAnswer : ''}.`}
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
          Reserved 88px slot. Seterusnya always appears here, and for count-tap
          so does its submit button — same place, same size, so the muscle memory
          a child builds keeps working. (DESIGN 5.2, DESIGN 7)
        */}
        {/*
          No AnimatePresence here, and no entry animation. This slot is the
          child's only route forward, and an exit-then-enter swap makes that
          route wait for an animation frame that may never arrive — a
          backgrounded tab, a throttled device. The swap is instant on purpose.
        */}
        <div className="min-h-answer" data-slot="seterusnya">
          {locked ? (
            <BlockButton onPress={next} ariaLabel="Soalan seterusnya">
              Seterusnya
            </BlockButton>
          ) : question.type === 'count-tap' ? (
            /*
              Tapping the objects is the answer. There is no number pad: user
              testing showed the pad made counting two steps — count, then find
              the digit — and a 7-year-old could not tell which step had failed.
              One action, one skill tested.
            */
            <BlockButton
              onPress={() => answer({ kind: 'count', value: counted.length })}
              // Never disabled, not even at a count of zero. Disabling it made
              // the only way to reveal the button the very thing the button is
              // for, and at 35% opacity on the pale ground it was invisible:
              // 1.04:1 against the background, where DESIGN 5.1 asks for 3:1.
              // A stray press with nothing counted is just a wrong answer, and
              // wrong answers already have feedback a child understands.
              state={session.lastAnswerCorrect === false ? 'wrong' : 'rest'}
              ariaLabel={`Hantar jawapan, ${counted.length} dibilang`}
            >
              Sedia
            </BlockButton>
          ) : null}
        </div>
      </section>
    </main>
  );
}
