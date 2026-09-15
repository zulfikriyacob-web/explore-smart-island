/**
 * The progress store's rules (SPEC 6): what a finished run leaves behind, per
 * sub-skill, for every run after it.
 *
 * Pure functions only, like `coverage.ts` beside it. Nothing here touches
 * storage or the pack: `persistence.ts` reads and writes the key, and the caller
 * hands the live pack in as a lookup.
 *
 * What is kept is evidence per sub-skill id, and nothing rolled up. A standard's
 * status is computed when it is read (`standardCoverage`); a stored roll-up goes
 * stale the moment the sub-skill list changes, and it will change — a teacher
 * corrected three of our first ten mappings.
 */

import type { Question } from '../content/schema.ts';
import { skillState, type Evidence, type SkillInput } from './coverage.ts';
import type { AnswerRecord } from './scoring.ts';

/** One sub-skill's record. */
export interface SubSkillProgress {
  /** First-attempt-correct answers only, at most one per question per run. */
  evidence: Evidence[];
  /**
   * Was the most recent question for this sub-skill missed on its first
   * attempt? "First attempt only" governs evidence (SPEC 5.7), so it governs
   * what counts as wrong as well: an answer found on the second try says nothing
   * about now.
   */
  latestWasWrong: boolean;
  /** The bar was met at some point. Written from `skillState`, and never cleared. */
  masteredOnce: boolean;
}

/**
 * The value stored under `esi.progress.v1`.
 *
 * `subSkills` is keyed `<SP>/<id>` and typed `unknown` on purpose: entries are
 * carried from one write to the next without having to be understood. An id the
 * skills file no longer lists is ignored when read and kept when written, so a
 * teacher's correction that is later reversed brings its evidence back with it
 * (SPEC 6, rule 3).
 *
 * An object rather than a bare map, so that a later field — the child's level,
 * when the question selector lands — is an addition and not a new key.
 */
export interface Progress {
  subSkills: Record<string, unknown>;
}

export function emptyProgress(): Progress {
  return { subSkills: {} };
}

/** A stored sub-skill entry, or null if this build cannot read it. */
export function readSubSkill(raw: unknown): SubSkillProgress | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.latestWasWrong !== 'boolean' || typeof r.masteredOnce !== 'boolean') return null;
  if (!Array.isArray(r.evidence) || !r.evidence.every(isEvidence)) return null;
  return { evidence: r.evidence, latestWasWrong: r.latestWasWrong, masteredOnce: r.masteredOnce };
}

function isEvidence(v: unknown): v is Evidence {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.questionId === 'string' &&
    typeof e.sessionId === 'string' &&
    typeof e.twoOptions === 'boolean'
  );
}

/**
 * Did the child face exactly two options? Read from the question as it was
 * answered — the frozen copy — because a guess costs what the child saw, not
 * what the pack holds today (SPEC 5.7). A count-tap has nothing to guess between.
 */
function hadTwoOptions(q: Question): boolean {
  return q.type !== 'count-tap' && q.payload.options.length === 2;
}

/**
 * Bank one finished run.
 *
 * - The sub-skill comes from the live pack (SPEC 6, rule 4). A question with no
 *   sub-skill there — q005 and q009 today, or one gone from the pack — leaves
 *   nothing behind.
 * - Only a first-attempt-correct answer becomes evidence. Every answer marks its
 *   sub-skill as asked about and sets `latestWasWrong`, in the order the run
 *   asked them.
 * - Entries for sub-skills this run did not touch are carried as they are,
 *   readable or not.
 *
 * Recording the same run twice changes nothing, and that case is real: progress
 * is written before the session, so an app killed between the two restores the
 * run at its last question, and finishing it again records it again under the
 * same `sessionId`.
 */
export function recordSession(
  progress: Progress,
  sessionId: string,
  answers: readonly AnswerRecord[],
  answered: readonly Question[],
  liveQuestion: (id: string) => Question | undefined,
): Progress {
  const asked = new Map(answered.map((q) => [q.id, q]));
  const subSkills = { ...progress.subSkills };

  for (const a of answers) {
    const subSkill = liveQuestion(a.questionId)?.subSkill;
    const question = asked.get(a.questionId);
    if (!subSkill || !question) continue;

    const before = readSubSkill(subSkills[subSkill]) ?? {
      evidence: [],
      latestWasWrong: false,
      masteredOnce: false,
    };
    const banked = before.evidence.some(
      (e) => e.questionId === a.questionId && e.sessionId === sessionId,
    );
    const evidence =
      a.firstTry && !banked
        ? [...before.evidence, { questionId: a.questionId, sessionId, twoOptions: hadTwoOptions(question) }]
        : before.evidence;
    const latestWasWrong = !a.firstTry;
    const { masteredOnce } = skillState({
      attempted: true,
      evidence,
      latestWasWrong,
      masteredOnce: before.masteredOnce,
    });

    subSkills[subSkill] = { evidence, latestWasWrong, masteredOnce };
  }

  return { ...progress, subSkills };
}

/**
 * What `skillState` needs for one sub-skill.
 *
 * The caller asks by the ids the skills file lists, so an id it no longer lists
 * is never read — ignored, not deleted. An entry this build cannot read counts
 * as never asked about.
 */
export function skillInput(progress: Progress, subSkillId: string): SkillInput {
  const entry = readSubSkill(progress.subSkills[subSkillId]);
  if (!entry) return { attempted: false, evidence: [] };
  return { attempted: true, ...entry };
}
