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

import { isScored, type Difficulty, type Question } from '../content/schema.ts';
import { skillState, type Evidence, type SkillInput } from './coverage.ts';
import { nextDifficulty } from './mastery.ts';
import { accuracy, type AnswerRecord } from './scoring.ts';
import type { SkillRank } from './selection.ts';

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
  /**
   * Per pack: the child's level on the SPEC 5.5 ladder, how many runs they have
   * finished, and when each question was last asked.
   *
   * Keyed by `topicId`, because a question id is only unique inside its pack,
   * and the ladder is climbed on the accuracy of a whole run drawn from one
   * pack. A level per sub-skill would mean nothing: in this bank every question
   * in a sub-skill carries the same difficulty (PRD 16 item 31).
   */
  packs?: Record<string, unknown>;
}

/** One pack's state. `lastAsked` maps a question id to the run it was last in. */
export interface PackProgress {
  level: Difficulty;
  runs: number;
  /** The run banked most recently, so banking it again changes nothing. */
  lastSessionId: string | null;
  lastAsked: Record<string, number>;
  /**
   * How many runs each question has been in. `lastAsked` answers *when*;
   * this answers *how often*, and that is the question the selector is really
   * asking when it decides what a child has seen too much of (SPEC 5.5).
   *
   * Missing reads as 0, which is what a store written before this field gives:
   * every question then looks never-asked for one run. Recorded rather than
   * hidden — SPEC 6, and PRD 16 item 38.
   */
  timesAsked: Record<string, number>;
}

export function emptyProgress(): Progress {
  return { subSkills: {} };
}

const FIRST_RUN: PackProgress = {
  level: 1,
  runs: 0,
  lastSessionId: null,
  lastAsked: {},
  timesAsked: {},
};

/** A stored `{ questionId: count }` map, keeping only the entries that read. */
function readCounts(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (typeof raw !== 'object' || raw === null) return out;
  for (const [id, n] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof n === 'number' && Number.isInteger(n) && n >= 0) out[id] = n;
  }
  return out;
}

/** A pack's state, or a child's first run at it. Unreadable counts as first. */
export function packProgress(progress: Progress, topicId: string): PackProgress {
  const raw = progress.packs?.[topicId];
  if (typeof raw !== 'object' || raw === null) return FIRST_RUN;
  const p = raw as Record<string, unknown>;
  const level = p.level;
  const runs = p.runs;
  if (level !== 1 && level !== 2 && level !== 3) return FIRST_RUN;
  if (typeof runs !== 'number' || !Number.isInteger(runs) || runs < 0) return FIRST_RUN;
  return {
    level,
    runs,
    lastSessionId: typeof p.lastSessionId === 'string' ? p.lastSessionId : null,
    lastAsked: readCounts(p.lastAsked),
    timesAsked: readCounts(p.timesAsked),
  };
}

/**
 * Where a sub-skill stands, for the selector's ordering. (SPEC 5.7)
 *
 * 0 slipped — mastered once and now evaluating again; 1 not mastered; 2
 * mastered. Slipped first matches "Fokus minggu ini": a skill that was there
 * and slipped is closer to being recovered than one never started.
 */
export function skillRank(progress: Progress, subSkillId: string): SkillRank {
  const state = skillState(skillInput(progress, subSkillId));
  if (state.status === 'mastered') return 2;
  return state.masteredOnce ? 0 : 1;
}

/** Every question that has ever been answered right on a first attempt. */
export function firstTryQuestionIds(progress: Progress): Set<string> {
  const ids = new Set<string>();
  for (const raw of Object.values(progress.subSkills)) {
    const entry = readSubSkill(raw);
    if (!entry) continue;
    for (const e of entry.evidence) ids.add(e.questionId);
  }
  return ids;
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
export interface RunRecord {
  /** The pack the run was drawn from: where its level and recency are kept. */
  topicId: string;
  sessionId: string;
  answers: readonly AnswerRecord[];
  /** The questions as the child answered them, for `twoOptions`. */
  answered: readonly Question[];
  liveQuestion: (id: string) => Question | undefined;
}

export function recordSession(progress: Progress, run: RunRecord): Progress {
  const { topicId, sessionId, answers, answered, liveQuestion } = run;
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

  return { ...progress, subSkills, packs: packsAfter(progress, run) };
}

/**
 * The pack's state after this run: one rung of the SPEC 5.5 ladder, one more
 * run, and every question it asked stamped with that run number.
 *
 * `lastAsked` stamps every answer, not only the ones that became evidence — it
 * answers "when did the child last see this question". `timesAsked` counts the
 * same answers, and answers "how often", which is the one that actually rotates
 * the bank: every question in a run gets the same `lastAsked`, so after the
 * never-asked ones are used up that term ties and pack order decided the rest —
 * measured, the same five level-2 questions in all five runs (PRD 16 item 38).
 *
 * Banking the same run twice changes nothing here either: `lastSessionId` says
 * this run has already been counted, so the level does not climb twice on one
 * set of answers.
 *
 * The ladder moves on scored answers only, judged by the question as the child
 * answered it. A practice question is not part of the ladder, and a run with
 * nothing scored leaves the level where it was.
 */
function packsAfter(progress: Progress, run: RunRecord): Record<string, unknown> {
  const packs = { ...progress.packs };
  const before = packProgress(progress, run.topicId);
  if (before.lastSessionId === run.sessionId) return packs;

  const runs = before.runs + 1;
  const lastAsked = { ...before.lastAsked };
  const timesAsked = { ...before.timesAsked };
  for (const a of run.answers) {
    lastAsked[a.questionId] = runs;
    timesAsked[a.questionId] = (timesAsked[a.questionId] ?? 0) + 1;
  }

  const asked = new Map(run.answered.map((q) => [q.id, q]));
  const scored = run.answers.filter((a) => {
    const q = asked.get(a.questionId);
    return q === undefined || isScored(q);
  });

  packs[run.topicId] = {
    level: scored.length === 0 ? before.level : nextDifficulty(before.level, accuracy(scored)),
    runs,
    lastSessionId: run.sessionId,
    lastAsked,
    timesAsked,
  };
  return packs;
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
