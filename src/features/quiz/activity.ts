/**
 * The one activity this build opens into. No island map, no topic list, no
 * picker — the app starts here. (Brief 02)
 */

import rawPack from '../../content/packs/math-y1-nombor-100.json';
import { TopicPackSchema, type Question } from '../../content/schema.ts';

export const ACTIVITY_ID = 'math-y1-nombor-100-a1';

// Validated at build time by validate:content and again here at runtime, as
// SPEC section 1 requires. A pack that survived CI can still arrive broken from
// a stale cache.
const pack = TopicPackSchema.parse(rawPack);

const activity = pack.activities.find((a) => a.activityId === ACTIVITY_ID);
if (!activity) {
  throw new Error(`activity ${ACTIVITY_ID} is not in pack ${pack.topicId}`);
}

export const activityTitle = activity.title;
export const packTitle = pack.title;

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

export function loadActivityQuestions(): Question[] {
  const byId = new Map(pack.questions.map((q) => [q.id, q]));
  return activity!.questionIds.map((id) => {
    const q = byId.get(id);
    if (!q) throw new Error(`activity ${ACTIVITY_ID} references missing question ${id}`);
    return withShuffledOptions(q);
  });
}
