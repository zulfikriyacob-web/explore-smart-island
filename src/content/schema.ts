import { z } from 'zod';

/**
 * Content schemas (SPEC section 3).
 *
 * These are structural only: they never touch the filesystem, so the same
 * schemas run in the browser at load time and in CI at build time. Asset
 * existence on disk is checked by scripts/validate-content.js, which has fs
 * access; everything that can be decided from the JSON alone is decided here.
 */

/** Every user-visible string is bilingual. No exceptions. (SPEC 3.1) */
export const LocalizedTextSchema = z.object({
  ms: z.string().min(1),
  en: z.string().min(1),
});

/** A path under public/, e.g. "/audio/ms/q001.mp3". */
export const AssetPathSchema = z
  .string()
  .min(2)
  .refine((p) => p.startsWith('/'), { message: 'asset path must start with "/"' })
  .refine((p) => !p.includes('..'), { message: 'asset path must not contain ".."' });

/** Instruction audio exists in both languages. (SPEC 3.1) */
export const LocalizedAudioSchema = z.object({
  ms: AssetPathSchema,
  en: AssetPathSchema,
});

export const SubjectSchema = z.enum(['math', 'reading', 'science']);
export const YearSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const LangSchema = z.enum(['ms', 'en']);
export const DifficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
export type LocalizedAudio = z.infer<typeof LocalizedAudioSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type Year = z.infer<typeof YearSchema>;
export type Lang = z.infer<typeof LangSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;

/** Fields every question carries before its type-specific payload. (SPEC 3.3) */
const questionBaseShape = {
  id: z.string().min(1),
  difficulty: DifficultySchema,
  learningStandard: z.string().min(1).optional(),
  prompt: LocalizedTextSchema,
  /** Mandatory: a 7-year-old cannot read the prompt. (SPEC 3.3) */
  promptAudio: LocalizedAudioSchema,
  hint: LocalizedTextSchema.optional(),
  explain: LocalizedTextSchema.optional(),
  tags: z.array(z.string().min(1)).optional(),
};

/** SPEC 3.4: at most 3 options, at most 40 characters per language. */
export const MCQ_MAX_OPTIONS = 3;
export const MCQ_MAX_OPTION_CHARS = 40;

/**
 * Text option, mcq only. The character cap is per language and applied to each
 * separately: an option that fits in English but overflows in Malay still
 * fails, because the pack has to be shippable in both. (SPEC 3.4)
 */
const TextOptionSchema = z.object({
  id: z.string().min(1),
  text: z.object({
    ms: z.string().min(1).max(MCQ_MAX_OPTION_CHARS),
    en: z.string().min(1).max(MCQ_MAX_OPTION_CHARS),
  }),
});

const ImageOptionSchema = z.object({
  id: z.string().min(1),
  image: AssetPathSchema,
  alt: LocalizedTextSchema,
});

/** Shared rule: correctOptionId must name one of the options, and ids are unique. */
function checkOptions(
  options: ReadonlyArray<{ id: string }>,
  correctOptionId: string,
  ctx: z.RefinementCtx,
): void {
  const ids = options.map((o) => o.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length > 0) {
    ctx.addIssue({
      code: 'custom',
      path: ['payload', 'options'],
      message: `duplicate option id(s): ${[...new Set(duplicates)].join(', ')}`,
    });
  }
  if (!ids.includes(correctOptionId)) {
    ctx.addIssue({
      code: 'custom',
      path: ['payload', 'correctOptionId'],
      message: `correctOptionId "${correctOptionId}" matches no option (have: ${ids.join(', ')})`,
    });
  }
}

export const McqSchema = z
  .object({
    ...questionBaseShape,
    type: z.literal('mcq'),
    payload: z.object({
      // Four 88px buttons do not fit the thumb zone without scrolling, and
      // scrolling while choosing an answer causes mis-taps. (SPEC 3.4)
      options: z.array(TextOptionSchema).min(2).max(MCQ_MAX_OPTIONS),
      correctOptionId: z.string().min(1),
      shuffle: z.boolean().default(true),
    }),
  })
  .superRefine((q, ctx) => checkOptions(q.payload.options, q.payload.correctOptionId, ctx));

export const McqImageSchema = z
  .object({
    ...questionBaseShape,
    type: z.literal('mcq-image'),
    payload: z.object({
      options: z.array(ImageOptionSchema).min(2),
      correctOptionId: z.string().min(1),
      shuffle: z.boolean().default(true),
    }),
  })
  .superRefine((q, ctx) => checkOptions(q.payload.options, q.payload.correctOptionId, ctx));

export const CountTapSchema = z
  .object({
    ...questionBaseShape,
    type: z.literal('count-tap'),
    payload: z.object({
      itemImage: AssetPathSchema,
      itemCount: z.number().int().min(1).max(20),
      layout: z.enum(['scatter', 'grid']),
      /**
       * Tapping the objects is the answer; the tally is submitted as-is. The
       * number pad this used to name is gone — user testing showed it made
       * counting two steps, and a 7-year-old could not tell which step had
       * failed. (SPEC 3.4)
       */
      answerInput: z.literal('tap-count'),
      correctAnswer: z.number().int().min(0),
    }),
  })
  .superRefine((q, ctx) => {
    if (q.payload.correctAnswer !== q.payload.itemCount) {
      ctx.addIssue({
        code: 'custom',
        path: ['payload', 'correctAnswer'],
        message: `correctAnswer ${q.payload.correctAnswer} does not match itemCount ${q.payload.itemCount}`,
      });
    }
  });

/**
 * Brief 01 scope: three question types, one sample pack. Every other type named
 * in SPEC 3.3 — listen-choose, drag-bucket, drag-match, sequence, build-word —
 * arrives in Phase 3 and is deliberately absent, so no component gets built
 * ahead of its content. Their schemas and packs are in git history, at the
 * commit that removed them.
 */
export const QuestionSchema = z.discriminatedUnion('type', [
  McqSchema,
  McqImageSchema,
  CountTapSchema,
]);

export type Question = z.infer<typeof QuestionSchema>;
export type QuestionType = Question['type'];

export const ActivitySchema = z.object({
  activityId: z.string().min(1),
  title: LocalizedTextSchema,
  questionCount: z.number().int().min(1),
  questionIds: z.array(z.string().min(1)).min(1),
});

export const KssrSchema = z.object({
  document: z.string().min(1),
  contentStandard: z.string().min(1),
  learningStandards: z.array(z.string().min(1)).min(1),
  /** Starts false; only a teacher review flips it. (SPEC 3.2, PRD 15) */
  verified: z.boolean(),
});

export const TopicPackSchema = z
  .object({
    packVersion: z.number().int().min(1),
    topicId: z.string().min(1),
    subject: SubjectSchema,
    year: YearSchema,
    islandId: z.string().min(1),
    title: LocalizedTextSchema,
    kssr: KssrSchema,
    activities: z.array(ActivitySchema).min(1),
    questions: z.array(QuestionSchema).min(1),
  })
  .superRefine((pack, ctx) => {
    const questionIds = pack.questions.map((q) => q.id);
    const duplicateQuestions = questionIds.filter((id, i) => questionIds.indexOf(id) !== i);
    if (duplicateQuestions.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['questions'],
        message: `duplicate question id(s): ${[...new Set(duplicateQuestions)].join(', ')}`,
      });
    }

    const activityIds = pack.activities.map((a) => a.activityId);
    const duplicateActivities = activityIds.filter((id, i) => activityIds.indexOf(id) !== i);
    if (duplicateActivities.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['activities'],
        message: `duplicate activity id(s): ${[...new Set(duplicateActivities)].join(', ')}`,
      });
    }

    const referenced = new Set<string>();
    for (const [i, activity] of pack.activities.entries()) {
      if (activity.questionIds.length !== activity.questionCount) {
        ctx.addIssue({
          code: 'custom',
          path: ['activities', i, 'questionCount'],
          message: `questionCount ${activity.questionCount} does not match ${activity.questionIds.length} questionIds`,
        });
      }
      for (const [j, qid] of activity.questionIds.entries()) {
        referenced.add(qid);
        // Every questionId an activity references must exist. (SPEC 3.5)
        if (!questionIds.includes(qid)) {
          ctx.addIssue({
            code: 'custom',
            path: ['activities', i, 'questionIds', j],
            message: `activity "${activity.activityId}" references missing question "${qid}"`,
          });
        }
      }
    }

    for (const [i, q] of pack.questions.entries()) {
      if (!referenced.has(q.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['questions', i, 'id'],
          message: `question "${q.id}" is not referenced by any activity`,
        });
      }
    }

    // A pack may only claim a learning standard it declared up front.
    for (const [i, q] of pack.questions.entries()) {
      if (q.learningStandard && !pack.kssr.learningStandards.includes(q.learningStandard)) {
        ctx.addIssue({
          code: 'custom',
          path: ['questions', i, 'learningStandard'],
          message: `question "${q.id}" cites learningStandard "${q.learningStandard}" which the pack does not declare`,
        });
      }
    }
  });

export type TopicPack = z.infer<typeof TopicPackSchema>;
export type Activity = z.infer<typeof ActivitySchema>;

/**
 * Collect every asset path a pack references, so the build-time validator can
 * check each one exists on disk. (SPEC 3.5)
 */
export function collectAssetPaths(pack: TopicPack): string[] {
  const paths: string[] = [];
  for (const q of pack.questions) {
    paths.push(q.promptAudio.ms, q.promptAudio.en);
    switch (q.type) {
      case 'mcq':
        break;
      case 'mcq-image':
        paths.push(...q.payload.options.map((o) => o.image));
        break;
      case 'count-tap':
        paths.push(q.payload.itemImage);
        break;
    }
  }
  return [...new Set(paths)];
}
