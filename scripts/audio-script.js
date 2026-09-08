#!/usr/bin/env node
/**
 * Skrip rakaman audio arahan, dijana daripada pek kandungan (SPEC §3.3, §8).
 *
 * Setiap soalan memerlukan `promptAudio` dalam kedua-dua bahasa — kanak-kanak
 * berumur 7 tahun tidak boleh membaca arahan itu sendiri. Skrip ini menyenaraikan
 * fail mana yang perlu wujud dan ayat mana yang perlu dibaca ke dalam setiap satu,
 * dengan teks diambil terus daripada pek.
 *
 * **Ia mencetak; ia tidak menyimpan.** Jadual yang di-commit akan menyimpang
 * daripada pek pada suntingan kandungan pertama dan tiada apa yang akan berbunyi
 * — kegagalan senyap yang sama seperti dokumen yang menyebut IndexedDB sedangkan
 * kod menggunakan localStorage. Jana semula bila diperlukan:
 *
 *   npm run audio:script
 *   npm run audio:script > skrip.md
 *
 * Pek dihurai melalui skema Zod yang sama seperti `validate:content`, jadi jadual
 * tidak boleh dibina daripada pek yang rosak.
 *
 * Cross-platform by construction: pure Node, node:fs dan node:path sahaja.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TopicPackSchema } from '../src/content/schema.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PACKS_DIR = path.join(ROOT, 'src', 'content', 'packs');
const PUBLIC_DIR = path.join(ROOT, 'public');

const LANGS = /** @type {const} */ (['ms', 'en']);

/** Turn "/audio/ms/q001.mp3" into an absolute path under public/. */
function resolveAsset(assetPath) {
  return path.join(PUBLIC_DIR, ...assetPath.replace(/^\/+/, '').split('/'));
}

/** Bytes on disk, or null when the file is not there at all. */
async function sizeOf(assetPath) {
  try {
    const info = await stat(resolveAsset(assetPath));
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
}

/** A table cell must not break the row. */
const cell = (s) => s.replace(/\|/g, '\\|');

async function listPackFiles() {
  const entries = await readdir(PACKS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => path.join(PACKS_DIR, e.name))
    .sort();
}

/**
 * Returns the parsed pack, or a list of reasons it could not be read. A broken
 * pack must say what is wrong on one line each, the way validate:content does —
 * not arrive as a stack trace.
 */
async function readPack(file) {
  let raw;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    return { errors: [`invalid JSON: ${err.message}`] };
  }
  const parsed = TopicPackSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.issues.map(
        (i) => `${i.path.join('.') || '(root)'}: ${i.message}`,
      ),
    };
  }
  return { pack: parsed.data };
}

/**
 * One row per file, not per question: a file is what gets recorded, and two
 * questions are allowed to point at the same shared instruction.
 */
function rowsFor(pack) {
  const rows = [];
  const byPath = new Map();
  for (const q of pack.questions) {
    for (const lang of LANGS) {
      const file = q.promptAudio[lang];
      const text = q.prompt[lang];
      rows.push({ questionId: q.id, type: q.type, lang, file, text });
      if (!byPath.has(file)) byPath.set(file, []);
      byPath.get(file).push({ questionId: q.id, lang, text });
    }
  }
  return { rows, byPath };
}

async function emitPack(pack, out) {
  const { rows, byPath } = rowsFor(pack);
  const shared = [...byPath.entries()].filter(([, uses]) => uses.length > 1);
  const conflicting = shared.filter(([, uses]) => new Set(uses.map((u) => u.text)).size > 1);

  const byType = {};
  for (const q of pack.questions) byType[q.type] = (byType[q.type] ?? 0) + 1;

  out.push(`## ${pack.topicId}`);
  out.push('');
  out.push(`${pack.title.ms} · ${pack.title.en} · packVersion ${pack.packVersion}`);
  out.push('');
  out.push(`- Soalan: **${pack.questions.length}**`);
  out.push(`- Bahasa setiap soalan: **${LANGS.length}** (${LANGS.join(', ')})`);
  out.push(`- Laluan fail unik: **${byPath.size}**`);
  out.push(`- Fail dikongsi lebih daripada satu soalan: **${shared.length}**`);
  out.push(
    `- Jenis soalan: ${Object.entries(byType)
      .map(([t, n]) => `\`${t}\` ${n}`)
      .join(' · ')}`,
  );
  out.push('');

  if (shared.length === 0) {
    out.push(
      `Tiada arahan dikongsi: ${byPath.size} fail ialah ${pack.questions.length} soalan × ` +
        `${LANGS.length} bahasa, bukan angka bulat.`,
    );
  } else {
    out.push('Arahan dikongsi — satu rakaman melayani lebih daripada satu soalan:');
    out.push('');
    out.push('| Fail | Dirujuk oleh | Teks sama? |');
    out.push('|---|---|---|');
    for (const [file, uses] of shared) {
      const same = new Set(uses.map((u) => u.text)).size === 1;
      out.push(
        `| \`${file}\` | ${uses.map((u) => u.questionId).join(', ')} | ${same ? 'ya' : '**TIDAK**'} |`,
      );
    }
  }
  out.push('');

  out.push('### Skrip — satu baris setiap fail');
  out.push('');
  out.push('| # | Fail | questionId | Bahasa | Teks untuk dibaca |');
  out.push('|---|---|---|---|---|');
  rows.forEach((r, i) => {
    out.push(
      `| ${i + 1} | \`${r.file}\` | \`${r.questionId}\` | ${r.lang} | ${cell(r.text)} |`,
    );
  });
  out.push('');

  out.push('### Keadaan fail dalam `public/`');
  out.push('');
  out.push('| Fail | Keadaan |');
  out.push('|---|---|');
  let missing = 0;
  let placeholder = 0;
  let real = 0;
  for (const file of byPath.keys()) {
    const size = await sizeOf(file);
    let state;
    if (size === null) {
      state = '**TIADA** — `validate:content` gagal';
      missing++;
    } else if (size === 0) {
      state = 'placeholder 0 bait — butang audio menyembunyikan diri';
      placeholder++;
    } else {
      state = `${size} bait`;
      real++;
    }
    out.push(`| \`${file}\` | ${state} |`);
  }
  out.push('');
  out.push(`Belum dirakam: **${placeholder + missing}** daripada **${byPath.size}**.`);
  out.push('');

  return { files: byPath.size, rows: rows.length, missing, placeholder, real, conflicting };
}

async function main() {
  const files = await listPackFiles();
  if (files.length === 0) {
    console.error(`No content packs found in ${PACKS_DIR}`);
    process.exitCode = 1;
    return;
  }

  const out = [];
  out.push('# Skrip rakaman audio arahan');
  out.push('');
  out.push('Dijana oleh `npm run audio:script` daripada `src/content/packs/`.');
  out.push('Jangan sunting fail ini — sunting pek, kemudian jana semula.');
  out.push('');

  const totals = { files: 0, rows: 0, missing: 0, placeholder: 0, real: 0, conflicting: 0 };
  const broken = [];
  for (const file of files) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const { pack, errors } = await readPack(file);
    if (errors) {
      broken.push({ rel, errors });
      out.push(`## ${rel}`);
      out.push('');
      out.push('Pek ini tidak boleh dihurai, jadi tiada skrip dijana untuknya.');
      out.push('');
      continue;
    }
    const t = await emitPack(pack, out);
    totals.files += t.files;
    totals.rows += t.rows;
    totals.missing += t.missing;
    totals.placeholder += t.placeholder;
    totals.real += t.real;
    totals.conflicting += t.conflicting.length;
  }

  if (files.length > 1) {
    out.push('## Jumlah');
    out.push('');
    out.push(`- Pek: **${files.length}**`);
    out.push(`- Fail unik: **${totals.files}**`);
    out.push(`- Sudah dirakam: **${totals.real}** · placeholder: **${totals.placeholder}** · tiada: **${totals.missing}**`);
    out.push('');
  }

  console.log(out.join('\n'));

  for (const b of broken) {
    console.error(`\naudio:script failed: ${b.rel} does not parse.`);
    for (const e of b.errors) console.error(`      ${e}`);
  }

  // A shared path whose questions ask different things cannot be recorded at
  // all: one file, two sentences. That is a broken pack, not a warning.
  if (totals.conflicting > 0) {
    console.error(
      `\naudio:script failed: ${totals.conflicting} shared audio path(s) carry conflicting prompt text.`,
    );
  }

  if (broken.length > 0 || totals.conflicting > 0) process.exitCode = 1;
}

await main();
