/**
 * Sub-skill evidence and the learning-standard roll-up (SPEC §5.7).
 *
 * A learning standard is not one skill. 1.6.1 is "nilai tempat **dan** nilai
 * digit", and a child who can name the digit in the tens place has shown one of
 * the four things a teacher broke that standard into. Averaging answers across
 * the standard lets five correct answers to the same question report the whole
 * of it as mastered — a false claim, on the one screen a parent is asked to
 * trust (PRD §11, §15).
 *
 * So evidence attaches to a sub-skill, and the standard is a roll-up of its
 * sub-skills. Two questions, kept apart on purpose:
 *
 *   - **How well** is the child doing on what they have been asked? That is the
 *     moving average in `mastery.ts`, unchanged and untouched.
 *   - **How much** of the standard has the app actually asked? That is coverage,
 *     and it is the question this module exists for.
 *
 * Pure functions only. Nothing here reads the clock, the catalogue or storage:
 * the caller assembles the evidence and passes it in, the same discipline that
 * makes `updateStreak(s, todayISO)` testable without faking time.
 */

/**
 * One first-attempt-correct answer to one question, for one sub-skill.
 *
 * Only first attempts count. Accuracy already measures the quality of a first
 * attempt (SPEC §5.2), and a second attempt happens after a wrong option has
 * been struck out: on a three-option mcq the second guess is one-in-two, which
 * is not evidence of anything.
 */
export interface Evidence {
  /** Which question produced it. Two answers to the same question are one item. */
  questionId: string;
  /** Which run of an activity. Evidence from one sitting is weaker (see below). */
  sessionId: string;
}

export type SkillLabel = 'not-tried' | 'learning' | 'almost' | 'mastered';

/**
 * Distinct questions answered right on the first attempt before a sub-skill may
 * be called mastered.
 *
 * Three, because of what a wrong guess costs. `mcq` is capped at three options
 * (SPEC §3.4), so a child guessing blindly is right one time in three. One item
 * of evidence therefore mislabels **33%** of guessers as having mastered the
 * skill; two items, 11%; three items, **3.7%** — the first value under one in
 * twenty. count-tap and a wider `mcq-image` are both harder to guess, so three
 * is sized to the easiest question in the pack rather than the average one.
 *
 * Distinct *questions*, not distinct answers: the teacher's wording is "beri
 * beberapa soalan dengan nombor, gambar atau susunan yang berbeza". The same
 * question answered three times is one number memorised, not a skill.
 */
export const EVIDENCE_FOR_MASTERY = 3;

/**
 * And from at least two sittings.
 *
 * Three correct answers inside one activity can all rest on the same moment of
 * understanding — or on the reveal a child saw two questions earlier (SPEC §4.2
 * shows the answer after the third attempt). A second session is the cheapest
 * evidence that the skill survived the walk home.
 */
export const SESSIONS_FOR_MASTERY = 2;

/**
 * Where one sub-skill stands.
 *
 * `latestWasWrong` drops a sub-skill that would otherwise qualify back to
 * `almost`. A label is a claim about now, and the most recent thing that
 * happened is the strongest evidence about now — without this, one bad run
 * leaves "Dikuasai" on screen while the child is visibly struggling.
 */
export function skillLabel(
  evidence: readonly Evidence[],
  latestWasWrong = false,
): SkillLabel {
  if (evidence.length === 0) return 'not-tried';
  const questions = new Set(evidence.map((e) => e.questionId));
  const sessions = new Set(evidence.map((e) => e.sessionId));
  const enough =
    questions.size >= EVIDENCE_FOR_MASTERY && sessions.size >= SESSIONS_FOR_MASTERY;
  if (enough && !latestWasWrong) return 'mastered';
  return 'almost';
}

/**
 * A sub-skill that has been attempted but never answered right on a first
 * attempt is `learning`: the child is working on it and has nothing banked yet.
 * `not-tried` is reserved for a sub-skill the app has never asked about, which
 * is a statement about us, not about the child.
 */
export function skillLabelFor(
  attempted: boolean,
  evidence: readonly Evidence[],
  latestWasWrong = false,
): SkillLabel {
  if (evidence.length === 0) return attempted ? 'learning' : 'not-tried';
  return skillLabel(evidence, latestWasWrong);
}

export interface SubSkillState {
  /** `<SP>/<id>`, e.g. "1.2.2/after". */
  id: string;
  label: SkillLabel;
}

export interface StandardCoverage {
  /** Sub-skills the app has asked about at all. */
  tested: number;
  /** Sub-skills the standard has, from the skills file. */
  total: number;
  /** Sub-skills at `mastered`. */
  mastered: number;
  /** `tested / total`, 0 when the standard has no sub-skills recorded yet. */
  coverage: number;
  label: SkillLabel;
}

/**
 * Roll a standard up from its sub-skills.
 *
 * `mastered` requires **every** sub-skill mastered, not an average and not a
 * majority. That is the whole point: 1.6.1 cannot read "Dikuasai" while the app
 * has never asked about nilai digit, however many times it asked about nilai
 * tempat. A standard the app cannot fully test cannot be reported as fully
 * learned, and the pack getting a "cannot" is information about the pack.
 *
 * `almost` is where a standard sits when nothing is wrong but not everything
 * has been asked — every tested sub-skill mastered, coverage short of whole.
 * Without that rung the only options are to overclaim or to say nothing.
 */
export function standardCoverage(subSkills: readonly SubSkillState[]): StandardCoverage {
  const total = subSkills.length;
  const tested = subSkills.filter((s) => s.label !== 'not-tried').length;
  const mastered = subSkills.filter((s) => s.label === 'mastered').length;
  const coverage = total === 0 ? 0 : tested / total;

  let label: SkillLabel;
  if (tested === 0) label = 'not-tried';
  else if (total > 0 && mastered === total) label = 'mastered';
  else if (mastered === tested) label = 'almost';
  else label = 'learning';

  return { tested, total, mastered, coverage, label };
}
