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
 * about*. It is never a score. A standard at 1 of 4 means three sub-skills have
 * not been assessed; it does not mean a child failed three. Anything rendering
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
   * Did the question have exactly two options? A blind guess on it is right one
   * time in two, not one in three, which is what `guessOdds` multiplies.
   *
   * A count-tap is `false`, so it is costed as three options. **That is our
   * assumption, not the teacher's rule** — the teacher's record does not
   * mention count-tap, and costing it differently would change results that
   * are already running.
   */
  twoOptions: boolean;
  /*
    No promptForm, representation, responseMode or wordingVariant here, and that
    is a decision rather than an omission.

    A form bar lived on this interface for one merge. A teacher's marked review
    removed it: variety of question form strengthens evidence and measures the
    quality of the item bank, but it is not a universal condition for mastery
    (docs/kssr/guru-semakan-pusingan-2-bertanda.md). Holding a child's label back
    because we have only written one kind of question punishes the child for
    content we have not written.

    The axes still describe every question, and validate:content still reports
    how varied the bank is. They simply do not reach mastery.
  */
}

/**
 * Three statuses, set by the teacher who reviewed the mapping.
 *
 * `not-tested` is a statement about **us**: the app has never asked. It is not
 * a statement about the child, and must never be presented as one.
 */
export type SkillStatus = 'not-tested' | 'evaluating' | 'mastered';

/**
 * The bar, as the teacher's record states it: *"Minimum 3 item berbeza + minimum
 * 2 sesi + kebarangkalian tekaan gabungan ≤ 4%."*
 * (docs/kssr/guru-rekod-jawapan-subkemahiran-dan-semakan-soalan.md). The record
 * calls it an app design decision, not a DSKP rule.
 *
 * This is the minimum number of distinct questions answered right on the first
 * attempt. Three three-option answers are guessed right 1/27 of the time, 3.7%,
 * which is under the ceiling on its own; three two-option answers are 12.5%,
 * which is not. `GUESS_ODDS_FOR_MASTERY` decides between them.
 *
 * **3.7% and 4% are design figures and nothing else.** They are chances of blind
 * guesses all landing, under one assumption about the questions. They are
 * **not** a probability that a child has learned anything, and must never reach
 * a screen as "97% sure". SPEC §5.7 carries the prohibition next to the
 * arithmetic, deliberately, because a number left alone finds its way onto a
 * dashboard.
 */
export const EVIDENCE_FOR_MASTERY = 3;

/**
 * The 4% ceiling, as odds: blind guessing every distinct question right must
 * happen at most one time in this many.
 *
 * Kept as an integer so the check is exact. The odds are a product of 2s and 3s,
 * which never equals 25, so no evidence sits on the boundary.
 *
 * There is no "two options means four questions" rule. That figure came from a
 * summary of the teacher's answers, not from the teacher, and it let four
 * two-option answers — 1/16, 6.25% — through (PRD §16 item 22).
 *
 * **Counted from what the child answered, not from what the pack holds.** A
 * two-option question only raises the bar for the child who answered it.
 * Raising it for a whole sub-skill because one question in the bank has two
 * options would hold a child back for how the bank is written — the mistake the
 * teacher's marked review undid for question form.
 */
export const GUESS_ODDS_FOR_MASTERY = 25;

/**
 * One in how many blind guessers would get all of these questions right: the
 * product of their option counts, one flag per distinct question.
 *
 * `validate:content` asks the same function whether a bank can reach the bar,
 * so the script and the app cannot disagree about it.
 */
export function guessOdds(twoOptions: readonly boolean[]): number {
  return twoOptions.reduce((odds, two) => odds * (two ? 2 : 3), 1);
}

/**
 * And from at least two sittings.
 *
 * Three correct answers inside one activity can all rest on the same moment of
 * understanding — or on the reveal a child saw two questions earlier (SPEC §4.2
 * shows the answer once a child can no longer get it wrong). A second session
 * is the cheapest evidence that the skill survived the walk home.
 */
export const SESSIONS_FOR_MASTERY = 2;

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
}

/**
 * Enough distinct questions, from enough distinct sittings, and hard enough to
 * guess all together.
 *
 * Odds are taken once per question: answering the same one again is not a
 * second guess to multiply. A question recorded with two options in one entry
 * and three in another counts as two — if we must be wrong, be wrong towards
 * the higher bar.
 */
function meetsBar(evidence: readonly Evidence[]): boolean {
  const twoOptions = new Map<string, boolean>();
  for (const e of evidence) {
    twoOptions.set(e.questionId, (twoOptions.get(e.questionId) ?? false) || e.twoOptions);
  }
  return (
    twoOptions.size >= EVIDENCE_FOR_MASTERY &&
    new Set(evidence.map((e) => e.sessionId)).size >= SESSIONS_FOR_MASTERY &&
    guessOdds([...twoOptions.values()]) >= GUESS_ODDS_FOR_MASTERY
  );
}

export function skillState(input: SkillInput): SkillState {
  const { attempted, evidence, latestWasWrong = false, masteredOnce = false } = input;

  const barMet = meetsBar(evidence);

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
   * Returned because a ratio on its own tells a parent too little. "1 of 4" and
   * a name beside it — *Dua digit tambah dua digit, tanpa melintasi puluh* —
   * says what the child was actually asked. The caller turns ids into labels
   * from the skills file; this module holds no catalogue.
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
