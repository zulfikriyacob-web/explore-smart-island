import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { QuestionSchema, TopicPackSchema, collectAssetPaths } from './schema.ts';

const PACKS = path.join(process.cwd(), 'src', 'content', 'packs');

async function loadPack(name: string): Promise<unknown> {
  return JSON.parse(await readFile(path.join(PACKS, name), 'utf8'));
}

function issueMessages(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return (result.error?.issues ?? []).map((i) => i.message).join(' | ');
}

describe('shipped packs', () => {
  // Brief 01 scope: one sample pack. The reading and science packs return in
  // Phase 3, from the commit that removed them.
  const names = ['math-y1-nombor-100.json'];

  for (const name of names) {
    it(`${name} parses`, async () => {
      const result = TopicPackSchema.safeParse(await loadPack(name));
      expect(issueMessages(result)).toBe('');
      expect(result.success).toBe(true);
    });
  }

  it('collects every asset the math pack references', async () => {
    const pack = TopicPackSchema.parse(await loadPack('math-y1-nombor-100.json'));
    const assets = collectAssetPaths(pack);
    expect(assets).toContain('/audio/ms/q001.mp3');
    expect(assets).toContain('/img/shapes/triangle.svg');
    expect(assets).toContain('/img/fruit/rambutan.svg');
    // Deduplicated: circle.svg appears in two questions.
    expect(assets.filter((a) => a === '/img/shapes/circle.svg')).toHaveLength(1);
  });
});

describe('question rules', () => {
  const base = {
    id: 'x1',
    type: 'mcq' as const,
    difficulty: 1 as const,
    prompt: { ms: 'a', en: 'a' },
    promptAudio: { ms: '/audio/ms/x.mp3', en: '/audio/en/x.mp3' },
  };

  it('rejects a correctOptionId that matches no option', () => {
    const result = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [
          { id: 'a', text: { ms: '1', en: '1' } },
          { id: 'b', text: { ms: '2', en: '2' } },
        ],
        correctOptionId: 'zzz',
      },
    });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('matches no option');
  });

  it('rejects duplicate option ids', () => {
    const result = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [
          { id: 'a', text: { ms: '1', en: '1' } },
          { id: 'a', text: { ms: '2', en: '2' } },
        ],
        correctOptionId: 'a',
      },
    });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('duplicate option id');
  });

  it('rejects a relative or traversing asset path', () => {
    for (const bad of ['audio/ms/x.mp3', '/audio/../../secret.mp3']) {
      const result = QuestionSchema.safeParse({
        ...base,
        promptAudio: { ms: bad, en: '/audio/en/x.mp3' },
        payload: {
          options: [
            { id: 'a', text: { ms: '1', en: '1' } },
            { id: 'b', text: { ms: '2', en: '2' } },
          ],
          correctOptionId: 'a',
        },
      });
      expect(result.success).toBe(false);
    }
  });

  it('rejects a count-tap whose answer disagrees with its item count', () => {
    const result = QuestionSchema.safeParse({
      ...base,
      type: 'count-tap',
      payload: {
        itemImage: '/img/fruit/pisang.svg',
        itemCount: 5,
        layout: 'grid',
        answerInput: 'number-pad',
        correctAnswer: 4,
      },
    });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('does not match itemCount');
  });

  it('rejects every question type that is out of scope for this brief', () => {
    // Three types are in scope: mcq, mcq-image, count-tap. Anything else must
    // fail to parse, so a pack cannot quietly reintroduce a type that has no
    // component behind it.
    for (const type of [
      'listen-choose',
      'drag-bucket',
      'drag-match',
      'sequence',
      'build-word',
    ]) {
      const result = QuestionSchema.safeParse({ ...base, type, payload: {} });
      expect(result.success, `${type} should not parse`).toBe(false);
    }
  });

  it('requires bilingual prompt audio', () => {
    const result = QuestionSchema.safeParse({
      ...base,
      promptAudio: { ms: '/audio/ms/x.mp3' },
      payload: {
        options: [
          { id: 'a', text: { ms: '1', en: '1' } },
          { id: 'b', text: { ms: '2', en: '2' } },
        ],
        correctOptionId: 'a',
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('pack rules', () => {
  async function mathPack(): Promise<Record<string, unknown>> {
    return (await loadPack('math-y1-nombor-100.json')) as Record<string, unknown>;
  }

  it('rejects an activity referencing a question that is not in the pack', async () => {
    const pack = await mathPack();
    const activities = structuredClone(pack.activities) as Array<{ questionIds: string[] }>;
    activities[0]!.questionIds[0] = 'ghost';
    const result = TopicPackSchema.safeParse({ ...pack, activities });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('references missing question');
  });

  it('rejects a questionCount that disagrees with the id list', async () => {
    const pack = await mathPack();
    const activities = structuredClone(pack.activities) as Array<{ questionCount: number }>;
    activities[0]!.questionCount = 99;
    const result = TopicPackSchema.safeParse({ ...pack, activities });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('does not match');
  });

  it('rejects an orphan question no activity uses', async () => {
    const pack = await mathPack();
    const questions = structuredClone(pack.questions) as Array<{ id: string }>;
    questions.push({ ...questions[0]!, id: 'orphan' });
    const result = TopicPackSchema.safeParse({ ...pack, questions });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('not referenced by any activity');
  });

  it('rejects a question citing a learning standard the pack never declared', async () => {
    const pack = await mathPack();
    const questions = structuredClone(pack.questions) as Array<{ learningStandard?: string }>;
    questions[0]!.learningStandard = '9.9.9';
    const result = TopicPackSchema.safeParse({ ...pack, questions });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('does not declare');
  });
});
