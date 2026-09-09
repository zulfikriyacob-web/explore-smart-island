import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { AudioButton } from '../../components/ui/AudioButton.tsx';
import { BlockButton } from '../../components/ui/BlockButton.tsx';
import { Kancil, type KancilState } from '../../components/ui/Kancil.tsx';
import { ProgressBar } from '../../components/ui/ProgressBar.tsx';
import { hintItem, optionItem, questionCard } from '../../motion/variants.ts';
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

  /*
    The kancil appears during feedback and at no other time. DESIGN 6 is
    explicit that it is never on screen while a child is thinking about the
    question, so it is not rendered at all outside the feedback state — the
    88x88 slot stays reserved and empty, which is what the slot is for.

    Consequence worth knowing: the reducer only reaches `feedback` on a correct
    answer or a third miss, so `sympathy` needs three wrong attempts. A
    three-option mcq strikes out an option per miss and leaves only the right
    one, so it can never produce a third miss — in practice sympathy shows on
    count-tap questions.
  */
  const [kancil, setKancil] = useState<KancilState | null>(null);
  useEffect(() => {
    if (session.status !== 'feedback') {
      setKancil(null);
      return;
    }
    setKancil(session.lastAnswerCorrect === true ? 'happy' : 'sympathy');
  }, [session.status, session.lastAnswerCorrect, session.index]);

  if (!question) return null;

  const locked = session.status === 'feedback';
  const showHint = session.hintShown && question.hint !== undefined;

  // One source for the revealed answer, so the paragraph a child reads and the
  // text a screen reader hears cannot drift apart.
  const revealText =
    session.revealed && (question.explain || question.type === 'count-tap')
      ? (question.explain?.[LANG] ??
        `Jawapannya ${question.type === 'count-tap' ? question.payload.correctAnswer : ''}.`)
      : null;

  // Everything the feedback area has to say right now, in the order it appears
  // on screen. Empty between questions, which announces nothing.
  const spokenFeedback = [showHint ? question.hint?.[LANG] : null, revealText]
    .filter(Boolean)
    .join(' ');

  return (
    <main className="mx-auto flex h-[100dvh] max-w-[430px] flex-col">
      {/* Read / watch. No answer buttons up here. (DESIGN 5.2) */}
      <section className="flex min-h-0 flex-1 flex-col gap-5 px-4 pt-6">
        <ProgressBar current={session.index + 1} total={session.questions.length} />

        {/*
          D2 — the next question replaces this one.

          No AnimatePresence, and no exit animation. `mode="wait"` withheld the
          incoming card until the outgoing one finished animating away, so when
          no animation frame arrived the exit never finished and the next card
          never mounted at all: the child sat looking at the previous question
          while the engine had already moved on. Not a missing animation — the
          wrong content, which is worse. The swap is instant on purpose, the
          same decision already made for the Seterusnya slot below.

          The card is still keyed on the question id, so React replaces it, and
          `arriving` is a visible state. (CLAUDE.md principle 5.)
        */}
        <motion.div
          key={question.id}
          /*
            No `layout` prop. It resizes by projecting a transform and settling
            it over the next frames, so with no frames the card stays projected:
            measured at matrix(0.985, 0, 0, 0.59, 0, -47) the moment a hint
            appeared — the card squashed to 59% of its height with the prompt
            pulled 10px up the screen, off the Y a child builds muscle memory
            for (DESIGN 5.2). Growing by plain reflow is instant and correct on
            frame 0. B5's smooth grow is what this costs; the card being the
            right shape is worth more.
          */
          variants={questionCard}
          initial={reduce ? false : 'arriving'}
          animate="settled"
          /*
            The card is its content's height, not the height left over.

            It used to be flex-1, so it took whatever the answer stack did not
            want — 284px to hold 59px of text on an mcq, 596px on a count-tap.
            The stack's height decided the card's, and the question had nothing
            to do with it. Centring the content inside only split that excess
            between top and bottom; the white was the same and now it was in
            two places.

            With flex-1 gone the card sizes to its content and the leftover
            space lives between the card and the stack, as background rather
            than as blank white card. flex-shrink stays at its default, so a
            card too tall for the screen still gives way and overflow-y-auto
            catches the remainder.

            Anchored to the top, not centred: the prompt then starts at the
            same Y on every question. A child builds muscle memory for where
            to read, the same way they do for where the buttons are, and
            centring hands back the movement we just removed.
          */
          /*
            origin-top, because the arriving scale is 1.5% and a centred origin
            spends half of that pushing the prompt down — by more on a tall card
            than a short one. Measured frozen at `arriving`: the prompt sat at Y
            89.9 on an mcq and 92.6 on a count-tap, and DESIGN 5.2 asks for the
            same Y on every question. Anchored to the top the card scales about
            its own top edge and the difference goes away.
          */
          className="flex min-h-0 origin-top flex-col gap-4 overflow-y-auto rounded-lg bg-white p-6 shadow-float"
        >
          <motion.p
            variants={optionItem}
            lang={LANG}
            className="m-0 text-left font-sans text-prompt font-medium"
          >
            {/*
              Reserved kancil slot, 88x88, in the card's top-right corner. It
              floats, so the prompt wraps around it for the first 88px and then
              reflows to full width — the corner stays clear without the slot
              costing the card a whole 88px row of its own. Nothing moves when
              the mascot arrives. (DESIGN 7)

              No min-height here. This paragraph is a flex item, and a flex item
              is a block formatting context, so it already contains its own
              float — measured: with the float present and min-height forced to
              0, the paragraph is still 88px. The rule that used to sit here did
              nothing, and its comment claimed otherwise.
            */}
            <span aria-hidden data-slot="kancil" className="float-right ml-4 block h-[88px] w-[88px]">
              {kancil !== null && (
                <Kancil state={kancil} size={88} onDone={() => setKancil('idle')} />
              )}
            </span>
            {/*
              The audio button floats in the prompt's left corner rather than
              sitting on a row of its own above it. As a row it cost the card 80px
              — 64 of button and a 16 gap — and that is what pushed the card past
              the space the answer stack leaves on a phone: a hint arriving after
              a wrong answer overflowed by 66px at 390x740, and the help a stuck
              child needs was the thing below the fold.

              Floated it costs 45px less. The kancil slot opposite it already
              proved the pattern (DESIGN 7): the text wraps around it for the
              first lines and then reflows full width. Two floats narrow those
              first lines further, and that wrapping is already counted in the
              45 — it was measured on this arrangement, not estimated from it.

              It disappears entirely when a language has no recordings, and the
              prompt reflows to full width, which is the same behaviour as before.
            */}
            <AudioButton src={question.promptAudio[LANG]} className="float-left mr-4" />
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

        </motion.div>

        {/*
          The hint and the revealed answer live OUTSIDE the question card, as a
          band between it and the answer stack. They are not part of the
          question; they are help that arrives after a mistake.

          Inside the card they grew it, and on a phone that pushed it past the
          space the answer stack leaves: the card scrolled and the help landed
          below the fold, which is the one thing that must never happen to the
          one thing a stuck child gets. Out here the card keeps its resting
          height and the band uses the background that was already empty.

          It is not simply the same pixels in a new place. Measured at 390x740,
          the hint is 78px inside the card and 51px out here — 27px back. A float
          taller than its own paragraph overhangs into the block below it, and
          the kancil (88) and audio (64) floats are both taller than a two-line
          prompt, so inside the card they squeezed the hint into two lines. Full
          width it is one. Anyone moving these back into the card pays that again.

          `shrink-0`: the card gives way first. Below the threshold the child
          sees a clipped question and a whole hint, rather than a whole question
          and no hint — and a child who has already answered wrong has read the
          question.

          Never both at once: a question that can reach a third attempt must not
          carry a hint alongside a revealed answer, and `validate:content`
          enforces it rather than leaving it to pack authors to remember.
        */}
        {showHint && (
          <motion.p
            variants={hintItem}
            initial={reduce ? false : 'arriving'}
            animate="settled"
            className="m-0 shrink-0 rounded-md bg-laut-light px-4 py-3 font-sans text-body text-arang"
          >
            {question.hint?.[LANG]}
          </motion.p>
        )}

        {revealText !== null && (
          <p className="m-0 shrink-0 rounded-md bg-pasir px-4 py-3 font-sans text-body text-arang">
            {revealText}
          </p>
        )}

        {/*
          The feedback area's live region (SPEC 9). The hint and the revealed
          answer are what this area says, and until now neither was announced:
          aria-live sat on the answer stack below, where the only thing that
          changes is a button's disabled state, which a live region does not
          report anyway.

          It sits out here rather than inside the card because the card is keyed
          on the question id, so AnimatePresence remounts it on every question.
          A live region that enters the accessibility tree together with its
          text is announced unreliably or not at all; this one is mounted once
          and only its text changes, which is the case screen readers handle.

          Visually hidden and out of flow, so it costs the layout nothing. An
          always-present visible wrapper around the hint would instead add a
          16px flex gap to every question that has no hint — exactly the dead
          space DESIGN 5.2 exists to keep out of the card.
        */}
        <p className="sr-only" aria-live="polite">
          {spokenFeedback}
        </p>
      </section>

      {/*
        Thumb zone. Anchored to the bottom, natural height, never shrinks.
        max() matters: env() is 0px on a device with no home bar, and env()
        alone would glue the buttons to the screen edge. (DESIGN 5.2)
      */}
      <section
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
          Reserved 72px slot. Seterusnya always appears here, and for count-tap
          so does its submit button — same place, same size, so the muscle memory
          a child builds keeps working. (DESIGN 5.2, DESIGN 7)

          72 rather than 88: DESIGN 5.1 puts "seterusnya" among the secondary
          actions at 72, and the answer floor of 88 is for the buttons a child
          chooses between. The slot is reserved whether or not it holds anything,
          so those 16px were being spent on empty space on every question — and
          the slot has to stay one size, so its submit button moves to 72 with it
          rather than the two drifting apart. Still well above the 64px absolute
          floor.
        */}
        {/*
          No AnimatePresence here, and no entry animation. This slot is the
          child's only route forward, and an exit-then-enter swap makes that
          route wait for an animation frame that may never arrive — a
          backgrounded tab, a throttled device. The swap is instant on purpose.
        */}
        <div className="min-h-btn" data-slot="seterusnya">
          {locked ? (
            <BlockButton onPress={next} minHeight={72} ariaLabel="Soalan seterusnya">
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
              minHeight={72}
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
