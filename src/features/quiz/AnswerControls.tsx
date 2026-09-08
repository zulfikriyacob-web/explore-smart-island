import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { BlockButton, type BlockState } from '../../components/ui/BlockButton.tsx';
import type { Question } from '../../content/schema.ts';
import { ease, spring } from '../../motion/tokens.ts';
import type { Response } from './session.ts';

/**
 * mcq-image tile height cap, 142px. SPEC section 3.4 records the number; this
 * is where it is enforced, because it is a CSS constraint and not something a
 * pack's JSON can express. Two rows of tiles plus the 16px gap and the card
 * padding have to fit the answer stack without pushing the question card past
 * its floor. Raising it here without raising it in SPEC 3.4 puts the two out of
 * step again.
 */
const MCQ_IMAGE_TILE_MAX_PX = 142;

interface AnswerControlsProps {
  question: Question;
  disabledOptionIds: readonly string[];
  lastAnswerCorrect: boolean | null;
  revealed: boolean;
  locked: boolean;
  lang: 'ms' | 'en';
  onAnswer: (response: Response) => void;
}

export function AnswerControls(props: AnswerControlsProps) {
  switch (props.question.type) {
    case 'mcq':
    case 'mcq-image':
      return <OptionAnswers {...props} question={props.question} />;
    case 'count-tap':
      return <CountAnswers {...props} question={props.question} />;
  }
}

type OptionQuestion = Extract<Question, { type: 'mcq' | 'mcq-image' }>;

function optionState(
  optionId: string,
  correctId: string,
  {
    disabledOptionIds,
    lastAnswerCorrect,
    revealed,
  }: Pick<AnswerControlsProps, 'disabledOptionIds' | 'lastAnswerCorrect' | 'revealed'>,
): BlockState {
  const isCorrect = optionId === correctId;
  if (lastAnswerCorrect === true && isCorrect) return 'correct';
  // B6 — after the third miss the right answer is shown, so the loop closes and
  // the child is never left without an answer.
  if (revealed && isCorrect) return 'revealed';
  if (disabledOptionIds.includes(optionId)) {
    // The option just tapped shows the cross before it wilts.
    return disabledOptionIds[disabledOptionIds.length - 1] === optionId &&
      lastAnswerCorrect === false
      ? 'wrong'
      : 'disabled';
  }
  return 'rest';
}

function OptionAnswers({
  question,
  disabledOptionIds,
  lastAnswerCorrect,
  revealed,
  locked,
  lang,
  onAnswer,
}: AnswerControlsProps & { question: OptionQuestion }) {
  const correctId = question.payload.correctOptionId;

  if (question.type === 'mcq-image') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {question.payload.options.map((o) => (
          <BlockButton
            key={o.id}
            ariaLabel={o.alt[lang]}
            state={
              locked && optionState(o.id, correctId, { disabledOptionIds, lastAnswerCorrect, revealed }) === 'rest'
                ? 'disabled'
                : optionState(o.id, correctId, { disabledOptionIds, lastAnswerCorrect, revealed })
            }
            onPress={() => onAnswer({ kind: 'option', optionId: o.id })}
            className="!px-3"
          >
            <img
              src={o.image}
              alt=""
              draggable={false}
              style={{ maxHeight: MCQ_IMAGE_TILE_MAX_PX }}
              className="w-full object-contain py-2"
            />
          </BlockButton>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {question.payload.options.map((o) => (
        <BlockButton
          key={o.id}
          ariaLabel={`Jawapan ${o.text[lang]}`}
          state={
            locked && optionState(o.id, correctId, { disabledOptionIds, lastAnswerCorrect, revealed }) === 'rest'
              ? 'disabled'
              : optionState(o.id, correctId, { disabledOptionIds, lastAnswerCorrect, revealed })
          }
          onPress={() => onAnswer({ kind: 'option', optionId: o.id })}
        >
          {o.text[lang]}
        </BlockButton>
      ))}
    </div>
  );
}

type CountQuestion = Extract<Question, { type: 'count-tap' }>;

const PAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function CountAnswers({
  question,
  lastAnswerCorrect,
  revealed,
  locked,
  onAnswer,
}: AnswerControlsProps & { question: CountQuestion }) {
  const reduce = useReducedMotion();
  const [entry, setEntry] = useState('');

  const push = (key: string) => {
    if (locked) return;
    setEntry((e) => (e.length >= 2 ? e : e + key));
  };

  const submit = () => {
    if (locked || entry === '') return;
    onAnswer({ kind: 'count', value: Number(entry) });
    setEntry('');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-2">
        {PAD_KEYS.map((k) => (
          <motion.button
            key={k}
            type="button"
            onPointerDown={() => push(k)}
            whileTap={reduce ? undefined : { y: 3, scale: 0.97 }}
            transition={spring.pop}
            className="min-h-tap rounded-md border-4 border-laut bg-white font-display text-h2 font-semibold text-arang shadow-[0_4px_0_0_theme(colors.laut.dark)] tabular-nums"
          >
            {k}
          </motion.button>
        ))}
      </div>

      {/*
        Entry, backspace and submit share one 88px row. They used to be a
        separate 64px row plus a 12px gap above the submit button; user testing
        showed the extra 76px was enough to push the question card into its own
        scrollbar on a 360x780 screen.
      */}
      <div className="flex items-stretch gap-2">
        <span
          aria-live="polite"
          aria-label="Jawapan anda"
          className="grid min-h-answer w-[88px] shrink-0 place-items-center rounded-md border-4 border-garis bg-white font-display text-h2 tabular-nums"
        >
          {entry === '' ? '—' : entry}
        </span>
        <button
          type="button"
          aria-label="Padam satu digit"
          onPointerDown={() => setEntry((e) => e.slice(0, -1))}
          className="min-h-answer w-16 shrink-0 rounded-md border-4 border-garis bg-white font-display text-h2"
        >
          ⌫
        </button>
        <div className="flex-1">
          <BlockButton
            onPress={submit}
            state={
              lastAnswerCorrect === true
                ? 'correct'
                : revealed
                  ? 'revealed'
                  : locked
                    ? 'disabled'
                    : 'rest'
            }
            ariaLabel="Hantar jawapan"
            className="!px-3"
          >
            {revealed ? String(question.payload.correctAnswer) : 'Sedia'}
          </BlockButton>
        </div>
      </div>

      <AnimatePresence>
        {lastAnswerCorrect === false && !revealed && !reduce && (
          <motion.span
            className="text-center font-sans text-label text-arang-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: ease.out }}
          >
            Cuba bilang sekali lagi.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
