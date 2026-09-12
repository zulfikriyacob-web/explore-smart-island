import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  MCQ_MAX_OPTION_CHARS,
  QuestionSchema,
  TopicPackSchema,
  collectAssetPaths,
} from './schema.ts';

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
        answerInput: 'tap-count',
        correctAnswer: 4,
      },
    });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('does not match itemCount');
  });

  const textOption = (id: string, text: string) => ({ id, text: { ms: text, en: text } });

  it('accepts an mcq at exactly the option limit', () => {
    const result = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [textOption('a', '1'), textOption('b', '2'), textOption('c', '3')],
        correctOptionId: 'a',
      },
    });
    expect(issueMessages(result)).toBe('');
    expect(result.success).toBe(true);
  });

  it('rejects an mcq with a fourth option', () => {
    const result = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [
          textOption('a', '1'),
          textOption('b', '2'),
          textOption('c', '3'),
          textOption('d', '4'),
        ],
        correctOptionId: 'a',
      },
    });
    expect(result.success).toBe(false);
  });

  it('accepts option text at exactly 40 characters', () => {
    const forty = 'x'.repeat(MCQ_MAX_OPTION_CHARS);
    expect(forty).toHaveLength(40);
    const result = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [textOption('a', forty), textOption('b', 'short')],
        correctOptionId: 'a',
      },
    });
    expect(issueMessages(result)).toBe('');
    expect(result.success).toBe(true);
  });

  it('rejects option text at 41 characters, in either language alone', () => {
    const long = 'x'.repeat(MCQ_MAX_OPTION_CHARS + 1);
    const shortOne = { id: 'b', text: { ms: 'pendek', en: 'short' } };

    // Too long in Malay, fine in English.
    const msOnly = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [{ id: 'a', text: { ms: long, en: 'short' } }, shortOne],
        correctOptionId: 'a',
      },
    });
    expect(msOnly.success).toBe(false);

    // Too long in English, fine in Malay.
    const enOnly = QuestionSchema.safeParse({
      ...base,
      payload: {
        options: [{ id: 'a', text: { ms: 'pendek', en: long } }, shortOne],
        correctOptionId: 'a',
      },
    });
    expect(enOnly.success).toBe(false);
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

  /*
    The two declared lists have to agree. This is the shape of the bug that put
    shape questions in a numbers pack: the learning standard was from 7.2 while
    every content standard named was 1.x, and nothing looked at the numbers.
  */
  it('rejects a learning standard whose content standard is not declared', async () => {
    const pack = await mathPack();
    const kssr = structuredClone(pack.kssr) as { contentStandards: string[] };
    kssr.contentStandards = kssr.contentStandards.filter((sk) => sk !== '2.2');
    const result = TopicPackSchema.safeParse({ ...pack, kssr });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('sits under content standard "2.2"');
  });

  /*
    A sub-skill names the standard it belongs to. Under the wrong one it is a
    question claiming evidence for a standard it is not about — the same shape
    of error as an SP cited under the wrong SK, and decidable from the strings.
  */
  it('rejects a subSkill that belongs to another learning standard', async () => {
    const pack = await mathPack();
    const questions = structuredClone(pack.questions) as Array<{ subSkill?: string }>;
    questions[0]!.subSkill = '1.6.1/digit_at_tens';
    const result = TopicPackSchema.safeParse({ ...pack, questions });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('does not belong to its learningStandard');
  });

  it('rejects a subSkill on a question that cites no learning standard', async () => {
    const pack = await mathPack();
    const questions = structuredClone(pack.questions) as Array<{
      subSkill?: string;
      learningStandard?: string;
    }>;
    delete questions[0]!.learningStandard;
    const result = TopicPackSchema.safeParse({ ...pack, questions });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('cites no learningStandard');
  });

  it('rejects a subSkill that is not shaped like one', async () => {
    const pack = await mathPack();
    const questions = structuredClone(pack.questions) as Array<{ subSkill?: string }>;
    questions[0]!.subSkill = 'compare_greater';
    const result = TopicPackSchema.safeParse({ ...pack, questions });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('subSkill must look like');
  });

  it('rejects a DSKP code that is not shaped like one', async () => {
    const pack = await mathPack();
    const kssr = structuredClone(pack.kssr) as { contentStandards: string[] };
    kssr.contentStandards = ['satu koma dua'];
    const result = TopicPackSchema.safeParse({ ...pack, kssr });
    expect(result.success).toBe(false);
    expect(issueMessages(result)).toContain('DSKP code must look like');
  });
});
