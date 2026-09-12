/**
 * Sub-skill evidence and the learning-standard roll-up (SPEC §5.7).
 *
 * A learning standard is not one skill. 1.6.1 is "nilai tempat **dan** nilai
 * digit", and a teacher broke it into four. The pack tests one of them.
 * Averaging answers across the standard lets five correct answers to that one
 * question report the whole of it as mastered — a false claim, on the one screen
 * a parent is asked to trust (PRD §11, §15).
 *
 * So evidence attaches to a sub-skill, and the standard is a roll-up of its
 * sub-skills. Two questions, kept apart on purpose:
 *
 *   - **How well** is the child doing on what they have been asked? That is the
 *     moving average in `mastery.ts`, unchanged and untouched.
 *   - **How much** of the standard has the app actually asked? That is coverage,
 *     and it is the question this module exists for.
 *
 * **Coverage is not mastery, and this module will not let it be read as such.**
 * `coverage` is `tested / total` — the share of a standard the app has *asked
 * about*. It is never a score. A standard at 1 of 6 means five sub-skills have
 * not been assessed; it does not mean a child failed five. Anything rendering
 * that ratio as a percentage of mastery is a bug, and SPEC §5.7 states it as a
 * prohibition rather than a preference.
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
  /**
   * How that question was built — `direct`, `reverse` or `contextual`.
   *
   * Counting distinct questions is not enough. "Apakah nilai digit 6 dalam 63?"
   * and "Dalam 63, digit 6 bernilai berapa?" are two question ids asking for
   * one direction of thinking; only "digit manakah yang bernilai 60?" turns it
   * around. Three of the first kind measure a memorised sentence.
   *
   * Undefined on evidence from content written before the axes existed. Such
   * evidence still counts toward the question and session bars, and simply
   * cannot help satisfy the form bar.
   */
  promptForm?: string;
  /**
   * Which wording of that form. Recorded and **never counted**.
   *
   * Two questions with the same `promptForm` and different `wordingVariant` are
   * **one** form. That is the whole reason the axis exists: the app can vary the
   * sentence so a child does not memorise it, without the variation pretending
   * to be new evidence. "Apakah nilai digit 6 dalam 63?" and "Dalam 63, digit 6
   * bernilai berapa?" read differently and ask for the same thinking.
   *
   * It is on this interface rather than absent from it so the rule is stated
   * and tested, not merely unimplemented. A field that is missing looks the
   * same as a field somebody forgot.
   */
  wordingVariant?: string;
}

/**
 * Three statuses, set by the teacher who reviewed the mapping.
 *
 * `not-tested` is a statement about **us**: the app has never asked. It is not
 * a statement about the child, and must never be presented as one.
 */
export type SkillStatus = 'not-tested' | 'evaluating' | 'mastered';

/**
 * Distinct questions answered right on the first attempt before a sub-skill may
 * be called mastered.
 *
 * Three, because of what a wrong guess costs. `mcq` is capped at three options
 * (SPEC §3.4), so a child guessing blindly is right one time in three: one item
 * of evidence mislabels 33% of guessers, two mislabels 11%, three mislabels
 * 3.7% — the first value under one in twenty. Sized to the easiest question in
 * the pack rather than the average one.
 *
 * **That 3.7% is a design figure and nothing else.** It is the chance of three
 * blind guesses all landing under one assumption about one question type. It is
 * **not** a probability that a child has learned anything, and it must never
 * reach a screen as "97% sure". SPEC §5.7 carries the prohibition next to the
 * arithmetic, deliberately, because a number left alone finds its way onto a
 * dashboard.
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
 * And asked in two different ways.
 *
 * Distinct question ids overstate how varied the evidence is: measured on the
 * shipped pack, all nine sub-skills it touches are asked in exactly one
 * `promptForm`, and the only two `reverse` questions are the two a teacher
 * already flagged as written backwards. Three ids can be one question asked
 * three times with the numbers changed.
 *
 * **This is in addition to the three distinct questions, not instead of them.**
 * The two bars measure different risks: three questions is what makes a guesser
 * unlikely (3.7%, see above), and two forms is what makes a memorised sentence
 * unlikely. Trading the first for the second would take the guesser rate back
 * to 11% — one child in nine — which is not what the form requirement was for.
 *
 * Waived for sub-skills that only have one form available, listed with reasons
 * in `<subject>-y<year>.skills.json`. A bar nobody can clear tells a parent
 * nothing, which is the same argument that retired the three-form rule.
 */
export const FORMS_FOR_MASTERY = 2;

export interface SkillState {
  status: SkillStatus;
  /**
   * The evidence bar was met at some point, even if the status has since
   * dropped back to `evaluating`.
   *
   * Sticky on purpose. A Year 1 child mis-taps, gets tired, rushes. The app
   * should notice a slip without erasing what came before it — a child who
   * reached mastery and slipped is in a different place from one who never
   * reached it, and deleting the difference loses the more useful half.
   *
   * Data, not display. A parent sees three statuses; see SPEC §5.7 for what
   * this is allowed to change in the words around them.
   */
  masteredOnce: boolean;
}

export interface SkillInput {
  /** Has the app ever asked about this sub-skill? */
  attempted: boolean;
  /** First-attempt-correct answers banked for it. */
  evidence: readonly Evidence[];
  /**
   * Was the most recent answer wrong? A status is a claim about now, and the
   * most recent thing that happened is the strongest evidence about now.
   */
  latestWasWrong?: boolean;
  /** Carried in from storage; never reset here. */
  masteredOnce?: boolean;
  /**
   * This sub-skill only supports one `promptForm`, so the form bar is waived
   * for it. From the skills file, where each exemption carries its reason and
   * is marked as awaiting a teacher's review.
   */
  formExempt?: boolean;
}

export function skillState(input: SkillInput): SkillState {
  const {
    attempted,
    evidence,
    latestWasWrong = false,
    masteredOnce = false,
    formExempt = false,
  } = input;

  const questions = new Set(evidence.map((e) => e.questionId));
  const sessions = new Set(evidence.map((e) => e.sessionId));
  const forms = new Set(evidence.map((e) => e.promptForm).filter(Boolean));
  const barMet =
    questions.size >= EVIDENCE_FOR_MASTERY &&
    sessions.size >= SESSIONS_FOR_MASTERY &&
    (formExempt || forms.size >= FORMS_FOR_MASTERY);

  const banked = masteredOnce || barMet;

  if (!attempted && evidence.length === 0) {
    return { status: 'not-tested', masteredOnce: banked };
  }
  return { status: barMet && !latestWasWrong ? 'mastered' : 'evaluating', masteredOnce: banked };
}

export interface SubSkillState {
  /** `<SP>/<id>`, e.g. "1.2.2/after". */
  id: string;
  status: SkillStatus;
  masteredOnce?: boolean;
}

export interface StandardCoverage {
  /** Sub-skills the app has asked about at all. */
  tested: number;
  /** Sub-skills the standard has, from the skills file. */
  total: number;
  /** Sub-skills currently at `mastered`. */
  mastered: number;
  /**
   * `tested / total`. **The share asked about, not a score.** Rendering this as
   * a percentage of mastery is the thing SPEC §5.7 forbids outright.
   */
  coverage: number;
  status: SkillStatus;
  /**
   * Which sub-skills have been tested, and which have not — by id, in the order
   * the skills file lists them.
   *
   * Returned because a ratio on its own tells a parent too little. "1 of 6" and
   * a name beside it — *Tambah gandaan 10* — says what the child was actually
   * asked. The caller turns ids into labels; this module holds no catalogue.
   */
  testedIds: string[];
  untestedIds: string[];
  /** Tested, banked the bar before, and currently back at `evaluating`. */
  slippedIds: string[];
}

/**
 * Roll a standard up from its sub-skills.
 *
 * `mastered` requires **every** sub-skill mastered, not an average and not a
 * majority. That is the whole point: 1.6.1 cannot read "Dikuasai" while the app
 * has never asked about nilai digit, however many times it asked about nilai
 * tempat. A standard the app cannot fully test cannot be reported as fully
 * learned, and the pack getting a "cannot" is information about the pack.
 */
export function standardCoverage(subSkills: readonly SubSkillState[]): StandardCoverage {
  const total = subSkills.length;
  const testedIds = subSkills.filter((s) => s.status !== 'not-tested').map((s) => s.id);
  const untestedIds = subSkills.filter((s) => s.status === 'not-tested').map((s) => s.id);
  const mastered = subSkills.filter((s) => s.status === 'mastered').length;
  const slippedIds = subSkills
    .filter((s) => s.status === 'evaluating' && s.masteredOnce === true)
    .map((s) => s.id);

  const status: SkillStatus =
    testedIds.length === 0 ? 'not-tested' : total > 0 && mastered === total ? 'mastered' : 'evaluating';

  return {
    tested: testedIds.length,
    total,
    mastered,
    coverage: total === 0 ? 0 : testedIds.length / total,
    status,
    testedIds,
    untestedIds,
    slippedIds,
  };
}
