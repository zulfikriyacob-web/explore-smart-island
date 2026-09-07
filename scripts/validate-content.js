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

import { TopicPackSchema, collectAssetPaths } from '../src/content/schema.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PACKS_DIR = path.join(ROOT, 'src', 'content', 'packs');
const PUBLIC_DIR = path.join(ROOT, 'public');

/** Turn "/audio/ms/q001.mp3" into an absolute path under public/. */
function resolveAsset(assetPath) {
  const relative = assetPath.replace(/^\/+/, '');
  return path.join(PUBLIC_DIR, ...relative.split('/'));
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

  // A pack's filename must match its topicId, or caches and routes disagree.
  const expected = `${pack.topicId}.json`;
  if (path.basename(file) !== expected) {
    errors.push(`filename does not match topicId: expected ${expected}`);
  }

  for (const assetPath of collectAssetPaths(pack)) {
    const onDisk = resolveAsset(assetPath);
    let info;
    try {
      info = await stat(onDisk);
    } catch {
      errors.push(`missing asset: ${assetPath}`);
      continue;
    }
    if (!info.isFile()) {
      errors.push(`asset is not a file: ${assetPath}`);
    } else if (info.size === 0) {
      // Placeholders keep the wiring honest but are not shippable audio or art.
      warnings.push(`placeholder asset (0 bytes): ${assetPath}`);
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
