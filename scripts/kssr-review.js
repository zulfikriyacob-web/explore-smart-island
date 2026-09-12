#!/usr/bin/env node
/**
 * Borang semakan guru bagi pemetaan KSSR, dijana daripada pek kandungan dan
 * katalog DSKP (SPEC §3.2, §3.5; PRD §15).
 *
 * `validate:content` membuktikan satu kod **wujud** dalam dokumen. Ia tidak
 * boleh membuktikan bahawa soalan itu **mengajar** kod tersebut — itu penilaian
 * seorang guru, dan `kssr.verified` tidak sepatutnya menjadi `true` tanpanya.
 * Skrip ini menyediakan bahan penilaian itu: setiap soalan bersebelahan teks
 * penuh SP yang didakwanya, disalin daripada katalog, supaya guru tidak perlu
 * membuka repo mahupun mencari semula dalam DSKP.
 *
 * **Ia mencetak; ia tidak menyimpan.** Borang yang di-commit akan menyimpang
 * daripada pek pada suntingan pertama, dan borang basi lebih buruk daripada
 * tiada borang: ia kelihatan seperti semakan. Jana semula bila diperlukan:
 *
 *   npm run kssr:review
 *   npm run kssr:review > semakan-guru.md
 *
 * Pek dihurai melalui skema Zod yang sama seperti `validate:content`, jadi
 * borang tidak boleh dibina daripada pek yang rosak.
 *
 * Cross-platform by construction: pure Node, node:fs dan node:path sahaja.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TopicPackSchema } from '../src/content/schema.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PACKS_DIR = path.join(ROOT, 'src', 'content', 'packs');
const KSSR_DIR = path.join(ROOT, 'src', 'content', 'kssr');

/** Guru membaca Bahasa Melayu; borang ini satu bahasa, bukan dua lajur. */
const LANG = 'ms';

/** A table cell must not break the row. */
const cell = (s) => String(s).replace(/\|/g, '\\|');

async function listPackFiles() {
  const entries = await readdir(PACKS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.json'))
    .map((e) => path.join(PACKS_DIR, e.name))
    .sort();
}

/**
 * Returns the parsed pack, or a list of reasons it could not be read — one line
 * each, the way validate:content does, rather than a stack trace.
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
      errors: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
    };
  }
  return { pack: parsed.data };
}

/**
 * The DSKP catalogue for a subject and year, flattened so a learning standard
 * code reaches its own text, its content standard, its topic and its area in
 * one lookup. Those four together are what tells a teacher where in the
 * document to check us.
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

  const learning = new Map();
  const content = new Map();
  for (const area of raw.areas ?? []) {
    for (const topic of area.topics ?? []) {
      const where = { area: area.area, topic: topic.topic, topicTitle: topic.title };
      for (const sk of topic.contentStandards ?? []) {
        content.set(sk.code, { ...where, code: sk.code, title: sk.title });
        for (const sp of sk.learningStandards ?? []) {
          learning.set(sp.code, { ...where, sk, sp });
        }
      }
    }
  }
  return { document: raw.document, notes: raw.notes ?? [], learning, content };
}

/**
 * What a teacher needs to see of the answer itself. A code is easy to agree
 * with in the abstract; what decides it is the actual question a child is
 * asked and the actual thing they have to do.
 */
function answerLines(q) {
  switch (q.type) {
    case 'mcq':
      return q.payload.options.map(
        (o) =>
          `  - ${o.text[LANG]}${o.id === q.payload.correctOptionId ? '  ← **jawapan betul**' : ''}`,
      );
    case 'mcq-image':
      return q.payload.options.map(
        (o) =>
          `  - gambar: ${o.alt[LANG]}${o.id === q.payload.correctOptionId ? '  ← **jawapan betul**' : ''}`,
      );
    case 'count-tap':
      return [
        `  - Anak mengetuk setiap objek sambil membilang, kemudian menghantar kiraannya.`,
        `  - Objek: **${q.payload.itemCount}** · jawapan betul: **${q.payload.correctAnswer}**`,
      ];
    default:
      return [`  - (jenis soalan \`${q.type}\` tidak dikenali borang ini)`];
  }
}

/** One numbered section per question — the thing a teacher actually reads. */
function emitQuestion(out, q, index, catalogue) {
  const entry = q.learningStandard ? catalogue.learning.get(q.learningStandard) : undefined;

  out.push(`### ${index}. \`${q.id}\``);
  out.push('');
  out.push(`**Soalan yang dilihat anak:**`);
  out.push('');
  out.push(`> ${q.prompt[LANG]}`);
  out.push('');
  out.push(...answerLines(q));
  out.push('');

  if (q.type === 'mcq' || q.type === 'mcq-image') {
    if (q.payload.shuffle) {
      out.push(`*Susunan pilihan diacak setiap kali; urutan di atas ialah urutan dalam fail.*`);
      out.push('');
    }
  }
  if (q.hint) {
    out.push(`**Pancingan** (selepas satu kali salah): ${q.hint[LANG]}`);
    out.push('');
  }
  if (q.explain) {
    out.push(`**Penerangan** (bersama jawapan didedah): ${q.explain[LANG]}`);
    out.push('');
  }

  if (!q.learningStandard) {
    out.push(`**Kami tidak mendakwa apa-apa SP untuk soalan ini.**`);
    out.push('');
    out.push(`Soalan tanpa kod tidak muncul dalam laporan kurikulum langsung. Kalau ia`);
    out.push(`sepatutnya membawa satu, tulis kodnya di bawah.`);
    out.push('');
    out.push(`**SP yang sepatutnya:** \`________\``);
    out.push('');
    return { unmapped: true, unknown: false };
  }

  if (!entry) {
    out.push(`**Kami mendakwa SP \`${q.learningStandard}\` — dan kod itu tiada dalam dokumen.**`);
    out.push('');
    out.push(`Ini ralat kami, bukan soalan untuk guru. \`npm run validate:content\` sepatutnya`);
    out.push(`menangkapnya sebelum borang ini dijana.`);
    out.push('');
    return { unmapped: false, unknown: true };
  }

  const { area, topic, topicTitle, sk, sp } = entry;

  out.push(`**Kami mendakwa soalan ini mengajar:**`);
  out.push('');
  out.push(`| | |`);
  out.push(`|---|---|`);
  out.push(`| Bidang | ${cell(area)} |`);
  out.push(`| Tajuk | ${cell(`${topic} ${topicTitle}`)} |`);
  out.push(`| Standard Kandungan | **${cell(sk.code)}** ${cell(sk.title)} |`);
  out.push(`| Standard Pembelajaran | **${cell(sp.code)}** ${cell(sp.title)} |`);
  out.push('');

  if (sp.details?.length) {
    out.push(`Teks penuh SP \`${sp.code}\`, seperti dalam DSKP:`);
    out.push('');
    out.push(`> ${sp.title}`);
    for (const d of sp.details) out.push(`> ${d}`);
    out.push('');
  }

  if (sp.catatan?.length) {
    out.push(`**CATATAN** DSKP bagi SP ini:`);
    out.push('');
    for (const c of sp.catatan) out.push(`> ${c}`);
    out.push('');
  }

  out.push(`**Adakah soalan ini benar-benar mengajar ${sp.code}?**`);
  out.push('');
  out.push(`☐ Ya    ☐ Tidak — SP yang betul: \`________\`    ☐ Tidak pasti`);
  out.push('');
  out.push(`Catatan guru: ______________________________________________`);
  out.push('');

  return { unmapped: false, unknown: false };
}

function emitHeader(out, pack, catalogue) {
  const d = catalogue.document ?? {};
  out.push(`# Semakan pemetaan KSSR — ${pack.title[LANG]}`);
  out.push('');
  out.push(
    `Borang untuk seorang guru. Dijana oleh \`npm run kssr:review\`; jangan sunting salinan ` +
      `bercetak dan jangkakan kod berubah — sunting pek, kemudian jana semula.`,
  );
  out.push('');

  out.push('## Dokumen sumber');
  out.push('');
  out.push(
    `Kami memetakan terhadap dokumen ini. Kalau salinan cikgu berbeza, berhenti di sini dan ` +
      `beritahu kami — selebihnya borang ini tidak bermakna.`,
  );
  out.push('');
  out.push('| | |');
  out.push('|---|---|');
  if (d.title) out.push(`| Dokumen | ${cell(d.title)} |`);
  if (d.curriculum) out.push(`| Kurikulum | ${cell(d.curriculum)} |`);
  if (d.publisher) out.push(`| Penerbit | ${cell(d.publisher)} |`);
  if (d.printed) out.push(`| Cetakan | ${cell(d.printed)} |`);
  if (d.isbn) out.push(`| ISBN | ${cell(d.isbn)} |`);
  out.push('');

  out.push('## Apa yang kami minta');
  out.push('');
  out.push(
    `Satu soalan sahaja, bagi setiap soalan kuiz: **adakah soalan ini benar-benar mengajar ` +
      `Standard Pembelajaran yang kami dakwakan?**`,
  );
  out.push('');
  out.push(
    `Kami sudah menyemak bahawa setiap kod **wujud** dalam DSKP — itu semakan mesin, dan ia ` +
      `berjalan pada setiap binaan. Yang mesin tidak boleh putuskan ialah sama ada soalan itu ` +
      `benar-benar mengajar perkara yang kodnya namakan. Itu sebabnya borang ini wujud.`,
  );
  out.push('');
  out.push(
    `Kami **tidak** meminta pandangan tentang mutu soalan, pilihan perkataan, atau aras ` +
      `kesukaran dalam borang ini. Kalau cikgu nampak sesuatu, tulis dalam ruang catatan — ` +
      `ia dialu-alukan, cuma bukan soalan yang borang ini tanya.`,
  );
  out.push('');
  out.push(
    `Sehingga borang ini dijawab, pek ini membawa \`verified: false\` dan papan pemuka ibu ` +
      `bapa **tidak** memaparkan satu pun kod SP (PRD §15).`,
  );
  out.push('');
}

function emitSummary(out, pack, catalogue) {
  out.push('## Ringkasan — satu baris setiap soalan');
  out.push('');
  out.push('| # | Soalan | Didakwa | Ya | Tidak |');
  out.push('|---|---|---|---|---|');
  pack.questions.forEach((q, i) => {
    const entry = q.learningStandard ? catalogue.learning.get(q.learningStandard) : undefined;
    const claim = q.learningStandard
      ? entry
        ? `\`${q.learningStandard}\``
        : `\`${q.learningStandard}\` **(tiada dalam DSKP)**`
      : '**tiada**';
    const prompt = q.prompt[LANG];
    const short = prompt.length > 52 ? `${prompt.slice(0, 51)}…` : prompt;
    out.push(`| ${i + 1} | ${cell(short)} | ${claim} | ☐ | ☐ |`);
  });
  out.push('');
}

/**
 * A pack whose questions come from more than one DSKP topic is worth saying out
 * loud on the form. The teacher is the person best placed to tell us the
 * outliers do not belong here — and they are being asked to look at each one
 * anyway.
 */
function emitSpread(out, pack, catalogue) {
  const topics = new Map();
  for (const q of pack.questions) {
    const entry = q.learningStandard ? catalogue.learning.get(q.learningStandard) : undefined;
    if (!entry) continue;
    const key = `${entry.topic} ${entry.topicTitle}`;
    topics.set(key, [...(topics.get(key) ?? []), q.id]);
  }
  if (topics.size <= 1) return;

  out.push('## Nota: pek ini merentas lebih daripada satu tajuk DSKP');
  out.push('');
  out.push(`Pek bertajuk **${pack.title[LANG]}**, tetapi soalannya datang daripada:`);
  out.push('');
  for (const [topic, ids] of topics) {
    out.push(`- **${topic}** — ${ids.map((id) => `\`${id}\``).join(', ')}`);
  }
  out.push('');
  out.push(
    `Kami sudah tahu dan sudah memutuskan untuk memindahkan yang terkeluar ke pek sendiri ` +
      `(PRD §16). Disebut di sini supaya cikgu tidak perlu melaporkannya semula — tetapi kalau ` +
      `cikgu tidak bersetuju dengan pemetaan mana-mana soalan itu, tandakan seperti biasa.`,
  );
  out.push('');
}

async function emitPack(pack, out) {
  const catalogue = await loadCatalogue(pack.subject, pack.year);
  if (catalogue === null) {
    return {
      skipped: `tiada katalog DSKP untuk ${pack.subject} tahun ${pack.year} dalam src/content/kssr/`,
    };
  }

  emitHeader(out, pack, catalogue);
  emitSummary(out, pack, catalogue);
  emitSpread(out, pack, catalogue);

  out.push('## Soalan satu per satu');
  out.push('');

  let unmapped = 0;
  let unknown = 0;
  pack.questions.forEach((q, i) => {
    const r = emitQuestion(out, q, i + 1, catalogue);
    if (r.unmapped) unmapped++;
    if (r.unknown) unknown++;
  });

  out.push('---');
  out.push('');
  out.push('## Tandatangan');
  out.push('');
  out.push('| | |');
  out.push('|---|---|');
  out.push('| Nama guru | ______________________________________ |');
  out.push('| Sekolah | ______________________________________ |');
  out.push('| Tarikh | ______________________________________ |');
  out.push('');
  out.push(
    `Borang yang ditandatangani ialah satu-satunya perkara yang menaikkan \`kssr.verified\` ` +
      `kepada \`true\`.`,
  );
  out.push('');

  return { questions: pack.questions.length, unmapped, unknown };
}

async function main() {
  const files = await listPackFiles();
  if (files.length === 0) {
    console.error(`No content packs found in ${PACKS_DIR}`);
    process.exitCode = 1;
    return;
  }

  const out = [];
  const broken = [];
  const skipped = [];
  let unknownTotal = 0;
  let emitted = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const { pack, errors } = await readPack(file);
    if (errors) {
      broken.push({ rel, errors });
      continue;
    }
    if (emitted > 0) out.push('---', '');
    const result = await emitPack(pack, out);
    if (result.skipped) {
      skipped.push({ rel, why: result.skipped });
      continue;
    }
    unknownTotal += result.unknown;
    emitted++;
  }

  if (out.length > 0) console.log(out.join('\n'));

  for (const s of skipped) {
    console.error(`\nkssr:review: ${s.rel} dilangkau — ${s.why}`);
  }
  for (const b of broken) {
    console.error(`\nkssr:review failed: ${b.rel} does not parse.`);
    for (const e of b.errors) console.error(`      ${e}`);
  }

  // A form that asks a teacher about a code we invented wastes their time and
  // teaches them to distrust the rest of it. validate:content already fails on
  // this; refusing here too means the form can never carry one.
  if (unknownTotal > 0) {
    console.error(
      `\nkssr:review failed: ${unknownTotal} question(s) cite a DSKP code that is not in the catalogue. ` +
        `Run validate:content.`,
    );
  }

  if (emitted === 0 && skipped.length > 0) {
    console.error('\nkssr:review: no pack had a catalogue to review against.');
  }

  if (broken.length > 0 || unknownTotal > 0) process.exitCode = 1;
}

await main();
