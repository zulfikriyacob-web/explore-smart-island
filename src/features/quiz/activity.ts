/**
 * The pack this build opens into, and the questions one session asks of it.
 *
 * No island map, no topic list, no picker — the app starts here. (Brief 02)
 *
 * The fixed ten-question activity that used to live here is gone. A session is
 * now chosen from the whole pack by `selectSession` (SPEC 5.5, PRD 16 item 27);
 * the activities in the pack file are authoring groups that no screen plays, and
 * they stay because the schema requires every question to belong to one and
 * because a1 is the only thing holding q005 and q009 (PRD 16 item 10).
 */

import rawPack from '../../content/packs/math-y1-nombor-100.json';
import { TopicPackSchema, type Question } from '../../content/schema.ts';
import {
  firstTryQuestionIds,
  packProgress,
  skillRank,
  type Progress,
} from '../../lib/progress.ts';
import { selectSession, type Selection } from '../../lib/selection.ts';

// Validated at build time by validate:content and again here at runtime, as
// SPEC section 1 requires. A pack that survived CI can still arrive broken from
// a stale cache.
const pack = TopicPackSchema.parse(rawPack);

/**
 * What a saved session belongs to, and what the store asks storage for.
 *
 * The pack, not an activity: the selector draws from the whole pack, so that is
 * the scope a run is a run *of*. It also invalidates every session saved under
 * `math-y1-nombor-100-a1` exactly once, because `loadSession` already refuses a
 * session saved for something else — which is the one-time invalidation the
 * project owner asked for (PRD 16 item 27, decision 3).
 */
export const PRACTICE_ID = pack.topicId;

/** Questions per session. (PRD 10, SPEC 4.1) */
export const SESSION_LENGTH = 10;

export const packTitle = pack.title;

const byId = new Map(pack.questions.map((q) => [q.id, q]));

/**
 * A question as the pack holds it now, not as a saved session froze it.
 * Evidence is banked under the sub-skill read from here (SPEC 6, rule 4): a
 * frozen copy still carries whatever `subSkill` the pack had when the run began.
 */
export function liveQuestion(id: string): Question | undefined {
  return byId.get(id);
}

function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/**
 * Options are shuffled once, here, before the session starts — the engine takes
 * its question list already in the order it will be shown (SPEC 4.3). The
 * shuffled list is what gets persisted, so reopening shows the same screen the
 * child left, not a reshuffled one.
 *
 * This is the only chance left in a session. Which questions are asked, and in
 * what order, is decided without any (`selection.ts`); which button holds the
 * answer is not, because a fixed position is a pattern a child can learn
 * instead of the arithmetic.
 */
function withShuffledOptions(q: Question): Question {
  switch (q.type) {
    case 'mcq':
      if (!q.payload.shuffle) return q;
      return { ...q, payload: { ...q.payload, options: shuffled(q.payload.options) } };
    case 'mcq-image':
      if (!q.payload.shuffle) return q;
      return { ...q, payload: { ...q.payload, options: shuffled(q.payload.options) } };
    case 'count-tap':
      return q;
  }
}

/**
 * The questions for one run, and any level that could not fill its share.
 *
 * Everything the selector needs comes from the progress store: the child's
 * level, where each sub-skill stands, which questions have already produced
 * first-attempt evidence, and when each question was last asked.
 */
export function buildSession(progress: Progress): Selection {
  const state = packProgress(progress, PRACTICE_ID);
  const banked = firstTryQuestionIds(progress);
  const selection = selectSession({
    bank: pack.questions,
    level: state.level,
    total: SESSION_LENGTH,
    rank: (subSkillId) => skillRank(progress, subSkillId),
    banked: (questionId) => banked.has(questionId),
    lastAsked: (questionId) => state.lastAsked[questionId] ?? 0,
  });
  return { ...selection, questions: selection.questions.map(withShuffledOptions) };
}
