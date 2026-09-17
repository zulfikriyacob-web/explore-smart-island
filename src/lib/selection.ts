/**
 * Choosing the questions a session asks. (SPEC 5.5, PRD 16 item 27)
 *
 * Pure: no pack, no storage, no clock — and **no randomness at all**. The caller
 * hands in the bank and what the child has done with it, and the same input
 * always gives the same questions in the same order.
 *
 * That is a decision, not an omission. A selection with a coin in it cannot be
 * explained to a parent: "why did it ask that again" has no answer. Every
 * question here is picked for a reason that can be read back.
 *
 * The level mix of SPEC 5.5 is a target, not a guarantee. Where a level cannot
 * fill its share, the nearest level fills the rest and the shortfall is
 * reported rather than hidden (PRD 16 item 27).
 */

import type { Difficulty, Question } from '../content/schema.ts';
import { questionMix } from './mastery.ts';

const LEVELS: readonly Difficulty[] = [1, 2, 3];

/**
 * Where a sub-skill stands, for ordering only. Lower is asked sooner.
 *
 * 0 is a sub-skill that was mastered and slipped: SPEC 5.7 puts it ahead of one
 * never started, because it is closer to being recovered. 2 is mastered, which
 * still gets asked — it is practice, and it is what fills a session when a
 * child has met the bar on everything the bank can test.
 */
export type SkillRank = 0 | 1 | 2;

export interface SelectionInput {
  /**
   * The bank, in pack order. A question with a `subSkill` or `noEvidence:
   * "practice"` can be picked; a `parked` one never is (SPEC 3.3).
   */
  bank: readonly Question[];
  /** The child's level in this pack. */
  level: Difficulty;
  /** How many questions the session holds. */
  total: number;
  rank: (subSkillId: string) => SkillRank;
  /** Has this question already been answered right on a first attempt? */
  banked: (questionId: string) => boolean;
  /** The run this question was last asked in; 0 for never asked. */
  lastAsked: (questionId: string) => number;
}

/** One level that could not fill its share of the mix. */
export interface LevelGap {
  level: Difficulty;
  wanted: number;
  taken: number;
  /** Levels the remainder came from, nearest first. Empty if nothing could fill it. */
  filledFrom: Difficulty[];
}

export interface Selection {
  questions: Question[];
  gaps: LevelGap[];
}

/**
 * The order questions are asked in: easiest level first.
 *
 * SPEC 5.5 buys "easy wins and a little stretch" with the mix; putting the
 * stretch last is the same argument as refusing a timer. A seven-year-old who
 * fails the first question stops trying.
 */
function byLevelThenPriority(a: Question, b: Question): number {
  return a.difficulty - b.difficulty;
}

export function selectSession(input: SelectionInput): Selection {
  const eligible = input.bank.filter(
    (q) => q.subSkill !== undefined || q.noEvidence === 'practice',
  );
  const order = new Map(eligible.map((q, i) => [q.id, i]));

  /**
   * A practice question ranks with the mastered ones. It can never become
   * evidence, so it waits behind every question that still can.
   */
  const rank = (q: Question): SkillRank =>
    q.subSkill === undefined ? 2 : input.rank(q.subSkill);

  /**
   * For the next tiebreak, a practice question counts as already banked.
   *
   * That tiebreak exists to collect distinct questions for mastery, and a
   * practice question can never be evidence — so there is nothing to put it
   * first for. Without this it wins the tiebreak against every mastered
   * question for ever and takes the same place in every session, which is what
   * it did: measured, q022 took the one level-3 place in six of eight runs
   * (PRD 16 item 39).
   */
  const banked = (q: Question): boolean => q.subSkill === undefined || input.banked(q.id);

  /**
   * Slipped sub-skills first, then ones not mastered, then mastered and
   * practice. Inside a group: questions that have never been answered right on
   * a first attempt first, because mastery counts distinct questions (SPEC 5.7)
   * — then whatever the child has not seen for longest, then pack order as the
   * last tiebreak.
   */
  const compare = (a: Question, b: Question): number =>
    rank(a) - rank(b) ||
    Number(banked(a)) - Number(banked(b)) ||
    input.lastAsked(a.id) - input.lastAsked(b.id) ||
    (order.get(a.id) as number) - (order.get(b.id) as number);

  const pools = new Map<Difficulty, Question[]>(LEVELS.map((d) => [d, [] as Question[]]));
  for (const q of eligible) pools.get(q.difficulty)?.push(q);
  for (const pool of pools.values()) pool.sort(compare);

  const picked: Question[] = [];
  const taken = new Set<string>();
  const gaps: LevelGap[] = [];

  const takeFrom = (level: Difficulty, count: number): number => {
    const pool = pools.get(level) ?? [];
    let got = 0;
    for (const q of pool) {
      if (got === count) break;
      if (taken.has(q.id)) continue;
      taken.add(q.id);
      picked.push(q);
      got++;
    }
    return got;
  };

  const mix = questionMix(input.level, input.total);
  for (const level of LEVELS) {
    const wanted = mix[level];
    if (wanted === 0) continue;

    const got = takeFrom(level, wanted);
    if (got === wanted) continue;

    // Short. Fill from the nearest level outwards, and say where from.
    let missing = wanted - got;
    const filledFrom: Difficulty[] = [];
    for (let step = 1; step <= 2 && missing > 0; step++) {
      for (const near of [level - step, level + step] as Difficulty[]) {
        if (missing === 0 || near < 1 || near > 3) continue;
        const filled = takeFrom(near, missing);
        if (filled > 0) {
          missing -= filled;
          filledFrom.push(near);
        }
      }
    }
    gaps.push({ level, wanted, taken: got, filledFrom });
  }

  // Stable sort: inside one level the priority order above is kept.
  picked.sort(byLevelThenPriority);
  return { questions: picked, gaps };
}
