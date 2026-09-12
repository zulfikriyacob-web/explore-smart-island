#!/usr/bin/env node
/**
 * Build-time content validation (SPEC section 3.5).
 *
 * Runs every pack in src/content/packs through the Zod schema and then checks
 * that every asset a pack references actually exists under public/. Fails CI on
 * the first category of problem it finds, so a broken pack cannot reach a child.
 *
 * Cross-platform by construction: pure Node, node:fs and node:path only. No
 * shell, no rm/cp/mkdir, nothing that behaves differently under cmd.exe.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TopicPackSchema, collectAssetRefs } from '../src/content/schema.ts';
import { MAX_ATTEMPTS } from '../src/lib/scoring.ts';

/**
 * Placeholder art carries this marker. A picture that is a dashed box is not a
 * rambutan, and a question that says "tap each rambutan" cannot be answered
 * from one. That is not a warning — the question is broken — so it fails the
 * build.
 */
const PLACEHOLDER_MARKER = 'PLACEHOLDER';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PACKS_DIR = path.join(ROOT, 'src', 'content', 'packs');
const KSSR_DIR = path.join(ROOT, 'src', 'content', 'kssr');
const PUBLIC_DIR = path.join(ROOT, 'public');

/** Turn "/audio/ms/q001.mp3" into an absolute path under public/. */
function resolveAsset(assetPath) {
  const relative = assetPath.replace(/^\/+/, '');
  return path.join(PUBLIC_DIR, ...relative.split('/'));
}

/**
 * Can a child reach the third attempt on this question — the one that reveals
 * the answer?
 *
 * Every wrong answer strikes out the option it used, so an option question runs
 * out of wrong options before it runs out of attempts unless it carries more
 * than MAX_ATTEMPTS of them. count-tap has nothing to strike out: its submit
 * button is never disabled, so it always can.
 */
function canReachReveal(question) {
  if (question.type === 'count-tap') return true;
  return question.payload.options.length - 1 >= MAX_ATTEMPTS;
}

/**
 * Does the screen draw a revealed answer for this question? count-tap falls back
 * to "Jawapannya N." with no `explain` written, so it always does.
 */
function showsReveal(question) {
  return question.type === 'count-tap' || question.explain !== undefined;
}

/**
 * The hint and the revealed answer share one band under the question card
 * (DESIGN §7). Two of them at once overflows it, and the overflow lands on the
 * help a stuck child needs. A question may carry a hint only when the reveal
 * cannot appear beside it.
 */
function checkHintRevealClash(pack) {
  const errors = [];
  for (const [i, q] of pack.questions.entries()) {
    if (q.hint === undefined) continue;
    if (!canReachReveal(q) || !showsReveal(q)) continue;
    const why =
      q.type === 'count-tap'
        ? `count-tap has no options to strike out, so a third miss is always reachable, and it reveals the answer even without an "explain"`
        : `${q.payload.options.length} options leaves ${q.payload.options.length - 1} wrong ones, enough to reach attempt ${MAX_ATTEMPTS}, and "explain" is set`;
    errors.push(
      `questions.${i} ("${q.id}"): carries a hint and can show a revealed answer at the same time — ${why}. ` +
        `Both are drawn in the band under the question card and would overflow it. Remove the hint, or remove what makes the reveal reachable.`,
    );
  }
  return errors;
}

/**
 * The DSKP codes that actually exist, read from `src/content/kssr/<subject>-y<year>.json`.
 *
 * This exists because a pack once claimed content standard 1.1 and learning
 * standards 1.1.1, 1.1.2 and 1.1.3, and two of those three are not in the
 * document: SK 1.1 has exactly one SP. Nothing caught it. Zod can check the
 * shape of a code but not its existence, and a code with the right shape and no
 * referent is the failure that reaches a parent's report as a curriculum claim.
 *
 * Returns null when no catalogue has been transcribed for that subject and year
 * — we only hold the Year 1 mathematics DSKP. A pack with no catalogue is
 * warned about, not failed: the absence is our gap, not the pack's error.
 */
async function loadCatalogue(subject, year) {
  const file = path.join(KSSR_DIR, `${subject}-y${year}.json`);
  let raw;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw new Error(`catalogue ${path.relative(ROOT, file)} is unreadable: ${err.message}`);
  }

  // code -> the topic it belongs to, for both kinds of code. The topic is what
  // makes a cross-topic pack visible: 1.2.2 and 7.2.1 are both real and are not
  // from the same part of the syllabus.
  const topicOf = new Map();
  for (const area of raw.areas ?? []) {
    for (const topic of area.topics ?? []) {
      const where = `${topic.topic} ${topic.title}`;
      for (const sk of topic.contentStandards ?? []) {
        topicOf.set(sk.code, where);
        for (const sp of sk.learningStandards ?? []) topicOf.set(sp.code, where);
      }
    }
  }
  return { document: raw.document, topicOf };
}

/**
 * The sub-skill list for a subject and year, from
 * `src/content/kssr/<subject>-y<year>.skills.json`.
 *
 * Separate from the catalogue on purpose. The catalogue is what the DSKP says,
 * checkable against the PDF line by line. This file is a decomposition — a
 * teacher's, for the six standards answered so far — and only four of the
 * catalogue's 56 learning standards carry sub-points the document numbered
 * itself. Merging the two would make it impossible to tell transcription from
 * judgement, which is the property the catalogue exists to have.
 *
 * Returns null when no skills file has been written for that subject and year.
 */
async function loadSkills(subject, year) {
  const file = path.join(KSSR_DIR, `${subject}-y${year}.skills.json`);
  let raw;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw new Error(`skills file ${path.relative(ROOT, file)} is unreadable: ${err.message}`);
  }

  // "1.2.2/after" -> its label, plus the standards each id hangs off.
  const ids = new Map();
  const byStandard = new Map();
  for (const [sp, entry] of Object.entries(raw.standards ?? {})) {
    byStandard.set(sp, entry);
    for (const s of entry.subSkills ?? []) ids.set(`${sp}/${s.id}`, { sp, ...s });
  }
  return { file, sourceKinds: raw.sourceKinds ?? {}, ids, byStandard };
}

/**
 * The skills file describes standards that exist, names nothing twice, and
 * declares a source kind it defined.
 *
 * A sub-skill under a standard the DSKP does not have is the same failure as an
 * invented SP code, one level down: well-formed, plausible, and referring to
 * nothing. It reaches a parent's dashboard as a curriculum claim.
 */
function checkSkillsFile(skills, catalogue) {
  const errors = [];
  const rel = path.relative(ROOT, skills.file).split(path.sep).join('/');

  for (const [sp, entry] of skills.byStandard) {
    if (!catalogue.topicOf.has(sp)) {
      errors.push(`${rel}: standard "${sp}" does not exist in the DSKP catalogue`);
    }
    const list = entry.subSkills ?? [];
    if (list.length === 0) {
      errors.push(`${rel}: standard "${sp}" declares no sub-skills`);
    }
    // Where a decomposition came from is the honest part of this file: whether
    // the DSKP numbered it, said it in a sentence, put it in a CATATAN, or
    // whether we decided it. An undeclared kind makes that unreadable.
    if (!entry.source || !skills.sourceKinds[entry.source]) {
      errors.push(
        `${rel}: standard "${sp}" declares source "${entry.source ?? '(none)'}", which is not one of: ` +
          `${Object.keys(skills.sourceKinds).join(', ')}`,
      );
    }
    const seen = new Set();
    for (const s of list) {
      if (seen.has(s.id)) errors.push(`${rel}: standard "${sp}" names sub-skill "${s.id}" twice`);
      seen.add(s.id);
    }
  }
  return errors;
}

/** Every sub-skill a pack cites must exist in the skills file. */
function checkPackSubSkills(pack, skills) {
  const errors = [];
  for (const [i, q] of pack.questions.entries()) {
    if (!q.subSkill) continue;
    if (!skills.ids.has(q.subSkill)) {
      errors.push(
        `questions.${i} ("${q.id}") cites subSkill "${q.subSkill}", which is not in ` +
          `${path.relative(ROOT, skills.file).split(path.sep).join('/')}`,
      );
    }
  }
  return errors;
}

/**
 * How much of each standard the pack actually asks about.
 *
 * Not an error at any level — a pack is allowed to be one activity out of
 * several — but it is the number that decides whether a standard can ever read
 * "Dikuasai" on the parent dashboard (SPEC §5.7), so it is printed rather than
 * left to be discovered.
 */
function subSkillCoverage(pack, skills) {
  const lines = [];
  const cited = new Map();
  for (const q of pack.questions) {
    if (!q.subSkill) continue;
    const sp = q.subSkill.slice(0, q.subSkill.indexOf('/'));
    if (!cited.has(sp)) cited.set(sp, new Set());
    cited.get(sp).add(q.subSkill);
  }
  for (const sp of [...cited.keys()].sort()) {
    const list = skills.byStandard.get(sp)?.subSkills ?? [];
    const tested = cited.get(sp);
    if (list.length === 0 || tested.size >= list.length) continue;
    // Named, not just counted — the same reason the parent dashboard names them
    // (SPEC §5.7). A ratio says how far there is to go; the names say what to
    // write next.
    const missing = list.map((s) => s.id).filter((id) => !tested.has(`${sp}/${id}`));
    lines.push(
      `${sp}: ${tested.size} of ${list.length} sub-skills tested — it cannot report as ` +
        `mastered. Untested: ${missing.join(', ')}`,
    );
  }
  const unmapped = pack.questions.filter((q) => q.learningStandard && !q.subSkill);
  if (unmapped.length > 0) {
    lines.push(
      `${unmapped.length} question(s) carry a learningStandard but no subSkill: ` +
        `${unmapped.map((q) => q.id).join(', ')}`,
    );
  }
  return lines;
}

/**
 * How many genuinely different ways each sub-skill is asked about.
 *
 * Counting distinct questions is not enough: the teacher's correction is that
 * two questions can read completely differently and still ask for the same
 * direction of thinking. "Apakah nilai digit 6 dalam 63?" and "Dalam 63, digit
 * 6 bernilai berapa?" are both `direct`; only "digit manakah yang bernilai 60?"
 * is `reverse`. (docs/kssr/guru-struktur-variasi-soalan.md.)
 *
 * Reported, not enforced. Which axis has to differ before two answers count as
 * separate evidence is an open decision — SPEC §5.7 still counts distinct
 * question ids — so this prints the shape of the problem rather than failing on
 * it. The untagged line is the one that would make the report a lie.
 */
function promptFormDiversity(pack) {
  const lines = [];
  const tagged = pack.questions.filter((q) => q.subSkill);
  const untagged = tagged.filter((q) => !q.promptForm);
  if (untagged.length > 0) {
    lines.push(
      `${untagged.length} question(s) carry a subSkill but no promptForm, so question-shape ` +
        `diversity cannot be counted for them: ${untagged.map((q) => q.id).join(', ')}`,
    );
  }

  const bySkill = new Map();
  for (const q of tagged) {
    if (!q.promptForm) continue;
    if (!bySkill.has(q.subSkill)) bySkill.set(q.subSkill, { forms: new Set(), ids: [] });
    const e = bySkill.get(q.subSkill);
    e.forms.add(q.promptForm);
    e.ids.push(q.id);
  }

  const single = [...bySkill.entries()].filter(([, e]) => e.forms.size < 2);
  for (const [skill, e] of single) {
    const shape = e.ids.length > 1 ? `${e.ids.length} questions` : '1 question';
    lines.push(
      `${skill}: ${shape} (${e.ids.join(', ')}) but only 1 promptForm (${[...e.forms][0]}) — ` +
        `asked one way only`,
    );
  }
  if (bySkill.size > 0 && single.length === bySkill.size) {
    lines.push(
      `every sub-skill this pack touches is asked in exactly one promptForm. ` +
        `Distinct question ids overstate how varied the evidence is.`,
    );
  }
  return lines;
}

/**
 * Every DSKP code a pack cites must exist in the catalogue, and the pack should
 * not straddle two topics without saying so.
 */
function checkKssrCodes(pack, catalogue) {
  const errors = [];
  const warnings = [];

  const cite = (code, where) => {
    if (catalogue.topicOf.has(code)) return true;
    errors.push(
      `${where} cites DSKP code "${code}", which does not exist in ${pack.subject} year ${pack.year}`,
    );
    return false;
  };

  for (const [i, sk] of pack.kssr.contentStandards.entries()) {
    cite(sk, `kssr.contentStandards.${i}`);
  }
  for (const [i, sp] of pack.kssr.learningStandards.entries()) {
    cite(sp, `kssr.learningStandards.${i}`);
  }
  for (const [i, q] of pack.questions.entries()) {
    if (q.learningStandard) cite(q.learningStandard, `questions.${i} ("${q.id}")`);
  }

  // One pack, one topic. A pack that reaches across topics is not wrong on its
  // face — but its title names one of them, and the child's island is coloured
  // by one of them, so it is worth saying out loud.
  const topics = new Set();
  for (const sp of pack.kssr.learningStandards) {
    const topic = catalogue.topicOf.get(sp);
    if (topic) topics.add(topic);
  }
  if (topics.size > 1) {
    warnings.push(
      `spans ${topics.size} DSKP topics: ${[...topics].join(' | ')}. ` +
        `The pack is titled for one of them — either move the outliers to their own pack, or retitle this one.`,
    );
  }

  return { errors, warnings };
}

function formatIssue(issue) {
  const where = issue.path.length > 0 ? issue.path.join('.') : '(root)';
  return `${where}: ${issue.message}`;
}

async function listPackFiles() {
  let entries;
  try {
    entries = await readdir(PACKS_DIR, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`content pack directory not found: ${PACKS_DIR}`);
    }
    throw err;
  }
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => path.join(PACKS_DIR, e.name))
    .sort();
}

async function validatePack(file) {
  const errors = [];
  const warnings = [];
  const rel = path.relative(ROOT, file).split(path.sep).join('/');

  let raw;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    return { rel, errors: [`invalid JSON: ${err.message}`], warnings, questionCount: 0 };
  }

  const parsed = TopicPackSchema.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) errors.push(formatIssue(issue));
    return { rel, errors, warnings, questionCount: 0 };
  }

  const pack = parsed.data;

  errors.push(...checkHintRevealClash(pack));

  const catalogue = await loadCatalogue(pack.subject, pack.year);
  if (catalogue === null) {
    warnings.push(
      `no DSKP catalogue for ${pack.subject} year ${pack.year} in src/content/kssr/ — ` +
        `every code in this pack is unchecked. Transcribe the DSKP before trusting them.`,
    );
  } else {
    const codes = checkKssrCodes(pack, catalogue);
    errors.push(...codes.errors);
    warnings.push(...codes.warnings);

    const skills = await loadSkills(pack.subject, pack.year);
    if (skills === null) {
      if (pack.questions.some((q) => q.subSkill)) {
        errors.push(
          `questions cite subSkill but there is no src/content/kssr/${pack.subject}-y${pack.year}.skills.json`,
        );
      }
    } else {
      errors.push(...checkSkillsFile(skills, catalogue));
      errors.push(...checkPackSubSkills(pack, skills));
      warnings.push(...subSkillCoverage(pack, skills));
      warnings.push(...promptFormDiversity(pack));
    }
  }

  // A pack's filename must match its topicId, or caches and routes disagree.
  const expected = `${pack.topicId}.json`;
  if (path.basename(file) !== expected) {
    errors.push(`filename does not match topicId: expected ${expected}`);
  }

  // Group by path so each file is read once, but keep the questions that
  // depend on it so a failure can name what it breaks.
  const refs = collectAssetRefs(pack);
  const byPath = new Map();
  for (const ref of refs) {
    const entry = byPath.get(ref.path) ?? { kind: ref.kind, questionIds: new Set() };
    entry.questionIds.add(ref.questionId);
    byPath.set(ref.path, entry);
  }

  for (const [assetPath, { kind, questionIds }] of byPath) {
    const dependents = [...questionIds].join(', ');
    const onDisk = resolveAsset(assetPath);
    let info;
    try {
      info = await stat(onDisk);
    } catch {
      errors.push(`missing asset: ${assetPath} (needed by ${dependents})`);
      continue;
    }
    if (!info.isFile()) {
      errors.push(`asset is not a file: ${assetPath}`);
      continue;
    }
    if (info.size === 0) {
      if (kind === 'image') {
        // An image a question depends on cannot degrade. Without it the
        // question is unanswerable, so this fails rather than warns.
        errors.push(`empty image: ${assetPath} (needed by ${dependents})`);
      } else {
        // Audio can degrade: the control hides itself until the file is real
        // (PRD 8), and the question still reads. Warning, not error.
        warnings.push(`placeholder asset (0 bytes): ${assetPath}`);
      }
      continue;
    }
    if (assetPath.endsWith('.svg')) {
      const svg = await readFile(onDisk, 'utf8');
      if (svg.includes(PLACEHOLDER_MARKER)) {
        errors.push(
          `placeholder image: ${assetPath} is still placeholder art, but ${dependents} needs a real picture`,
        );
      }
    }
  }

  if (!pack.kssr.verified) {
    warnings.push(
      `kssr.verified is false — SP codes stay hidden from the parent dashboard (PRD 15)`,
    );
  }

  return { rel, errors, warnings, questionCount: pack.questions.length };
}

async function main() {
  const files = await listPackFiles();
  if (files.length === 0) {
    console.error(`No content packs found in ${PACKS_DIR}`);
    process.exitCode = 1;
    return;
  }

  const results = [];
  for (const file of files) results.push(await validatePack(file));

  let errorCount = 0;
  let warningCount = 0;
  let questionCount = 0;

  for (const r of results) {
    questionCount += r.questionCount;
    errorCount += r.errors.length;
    warningCount += r.warnings.length;
    const mark = r.errors.length === 0 ? 'PASS' : 'FAIL';
    console.log(`${mark}  ${r.rel}  (${r.questionCount} questions)`);
    for (const e of r.errors) console.log(`      error:   ${e}`);
    for (const w of r.warnings) console.log(`      warning: ${w}`);
  }

  console.log('');
  console.log(
    `${files.length} pack(s), ${questionCount} question(s), ${errorCount} error(s), ${warningCount} warning(s)`,
  );

  if (errorCount > 0) {
    console.error(`\nvalidate:content failed with ${errorCount} error(s).`);
    process.exitCode = 1;
  }
}

await main();
