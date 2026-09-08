import { BlockButton, type BlockState } from '../../components/ui/BlockButton.tsx';
import type { Question } from '../../content/schema.ts';
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
      // count-tap has no controls of its own. Tapping the objects is the
      // answer, and the submit button lives in the shared bottom slot next to
      // where Seterusnya appears. See QuizScreen.
      return null;
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

