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

/** How a sub-skill list came to exist, in the words the form shows a teacher. */
const SOURCE_LABEL = {
  'dskp-detail': 'DSKP menyenaraikannya sendiri',
  'dskp-sentence': 'dibaca daripada ayat SP',
  'dskp-catatan': 'daripada CATATAN DSKP',
  editorial: 'keputusan app, bukan DSKP',
};

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

/** The sub-skill decomposition, keyed by standard. Null when none is written. */
async function loadSkills(subject, year) {
  const file = path.join(KSSR_DIR, `${subject}-y${year}.skills.json`);
  let raw;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw new Error(`skills file ${path.relative(ROOT, file)} is unreadable: ${err.message}`);
  }
  return { byStandard: new Map(Object.entries(raw.standards ?? {})) };
}

/**
 * What a teacher needs to see of the answer itself, on one line. A code is easy
 * to agree with in the abstract; what decides it is the actual question a child
 * is asked and the actual thing they have to do.
 */
function answerLine(q) {
  const mark = (o, label) =>
    o.id === q.payload.correctOptionId ? `**${label} ← betul**` : label;
  switch (q.type) {
    case 'mcq':
      return `Pilihan: ${q.payload.options.map((o) => mark(o, o.text[LANG])).join(' · ')}`;
    case 'mcq-image':
      return `Pilihan (gambar): ${q.payload.options.map((o) => mark(o, o.alt[LANG])).join(' · ')}`;
    case 'count-tap':
      return (
        `Anak mengetuk setiap objek sambil membilang, kemudian menghantar kiraannya. ` +
        `Objek: **${q.payload.itemCount}** · betul: **${q.payload.correctAnswer}**`
      );
    default:
      return `(jenis soalan \`${q.type}\` tidak dikenali borang ini)`;
  }
}

/**
 * One block per question, sized to a phone screen.
 *
 * The SP text and its CATATAN are **not** here. Four questions share 1.2.2, and
 * repeating its four sub-points and three notes beside each of them was most of
 * a form that a teacher reads as a favour. They live once, at the end, and each
 * question cites the code.
 */
function emitQuestion(out, q, index, catalogue) {
  const entry = q.learningStandard ? catalogue.learning.get(q.learningStandard) : undefined;

  out.push(`### ${index}. \`${q.id}\` — ${q.prompt[LANG]}`);
  out.push('');
  out.push(`- ${answerLine(q)}`);
  if (q.hint) out.push(`- Pancingan (selepas satu kali salah): ${q.hint[LANG]}`);
  if (q.explain) out.push(`- Penerangan (bersama jawapan didedah): ${q.explain[LANG]}`);

  if (!q.learningStandard) {
    out.push(`- **Kami tidak mendakwa apa-apa SP untuk soalan ini.** Kalau ia sepatutnya`);
    out.push(`  membawa satu, tulis kodnya di sini: \`______\``);
    out.push('');
    return { unmapped: true, unknown: false };
  }

  if (!entry) {
    out.push(
      `- **Kami mendakwa \`${q.learningStandard}\` — kod itu tiada dalam dokumen.** Ralat kami,` +
        ` bukan soalan untuk guru; \`validate:content\` sepatutnya menangkapnya.`,
    );
    out.push('');
    return { unmapped: false, unknown: true };
  }

  const { sp } = entry;
  out.push(`- **Didakwa: \`${sp.code}\` — ${sp.title}**`);
  out.push('');
  out.push(
    `Mengajar \`${sp.code}\`? ☐ Ya ☐ Tidak → SP betul \`____\` ☐ Tidak pasti · ` +
      `Catatan: \`______________________\``,
  );
  out.push('');

  return { unmapped: false, unknown: false };
}

/**
 * The sub-skill list, and the second question this form asks.
 *
 * The first question — does this question teach this SP — is about one row at a
 * time. This one is about a list we wrote: is it complete? Nobody inside this
 * repo can answer it. Four of the catalogue's 56 standards carry sub-points the
 * DSKP numbered; the rest were decomposed by reading, and a decomposition that
 * is missing a skill silently caps what a child can ever be shown as mastering.
 */
function emitSubSkills(out, pack, skills) {
  const cited = new Map();
  for (const q of pack.questions) {
    if (!q.subSkill) continue;
    const sp = q.subSkill.slice(0, q.subSkill.indexOf('/'));
    if (!cited.has(sp)) cited.set(sp, new Set());
    cited.get(sp).add(q.subSkill);
  }
  const standards = [...skills.byStandard.keys()].filter((sp) => cited.has(sp)).sort();
  if (standards.length === 0) return;

  out.push('## Sub-kemahiran — adakah senarai ini lengkap?');
  out.push('');
  out.push(
    `Setiap SP di bawah dipecahkan kepada sub-kemahiran, dan app merekod bukti bagi setiap ` +
      `satu **secara berasingan**. Satu SP hanya boleh dilaporkan "Dikuasai" apabila setiap ` +
      `sub-kemahirannya dikuasai — jadi kalau satu kemahiran hilang daripada senarai, anak ` +
      `tidak akan pernah ditanya mengenainya, dan kalau ada yang lebih daripada sepatutnya, ` +
      `anak tidak akan pernah sampai ke hujung.`,
  );
  out.push('');
  out.push(
    `Lajur **Asal** kata dari mana pecahan itu datang. Yang bertanda *keputusan app* ialah ` +
      `bacaan kami, bukan DSKP — itu yang paling perlu mata cikgu.`,
  );
  out.push('');

  for (const sp of standards) {
    const entry = skills.byStandard.get(sp);
    const list = entry.subSkills ?? [];
    const tested = cited.get(sp);
    out.push(`### \`${sp}\` — ${cell(entry.title ?? '')}`);
    out.push('');
    out.push(`Asal: **${SOURCE_LABEL[entry.source] ?? entry.source ?? 'tidak dinyatakan'}**`);
    out.push('');
    out.push('| Sub-kemahiran | Diuji oleh pek ini? |');
    out.push('|---|---|');
    for (const s of list) {
      const asked = tested.has(`${sp}/${s.id}`);
      out.push(`| ${cell(s.label?.[LANG] ?? s.id)} | ${asked ? 'ya' : '—'} |`);
    }
    out.push('');
    out.push(
      `**Ada kemahiran yang hilang daripada senarai ${sp} ini?** ☐ Tidak, lengkap  ` +
        `☐ Ada — yang hilang: \`________________________\``,
    );
    out.push('');
    out.push(
      `**Ada yang tidak sepatutnya di situ?** ☐ Tidak  ☐ Ada: \`________________________\``,
    );
    out.push('');
  }
}

/**
 * The three axes, the tagging we did with them, and the third thing this form
 * asks a teacher.
 *
 * The previous version of this section offered five flat names — direct,
 * inverted, select, story, visual — and asked whether they were enough. The
 * answer was no: they mixed how a question is built with how information is
 * shown and with what the child does. Those five are gone. What is asked now is
 * narrower and harder: we tagged ten questions using the teacher's own axes, and
 * one of those taggings contradicts something the same teacher told us earlier.
 */
function emitAxes(out, pack) {
  const tagged = pack.questions.filter((q) => q.promptForm);
  if (tagged.length === 0) return;

  const FORM = { direct: 'Terus', reverse: 'Terbalik', contextual: 'Situasi' };
  const REP = { symbolic: 'Simbolik', visual: 'Visual', mixed: 'Campuran' };
  const MODE = { select: 'Pilih', input: 'Taip', tap: 'Ketuk', match: 'Padan', order: 'Susun' };

  out.push('## Bentuk soalan — adakah penandaan kami betul?');
  out.push('');
  out.push(
    `Cikgu memecahkan variasi soalan kepada tiga paksi, dan kami menerimanya bulat-bulat. ` +
      `Kami kemudian menanda kesepuluh-sepuluh soalan pek ini dengannya. Yang kami minta di ` +
      `sini ialah sama ada penandaan itu betul — bukan sama ada paksinya betul.`,
  );
  out.push('');
  out.push('| # | Soalan | Bentuk | Persembahan | Cara jawab |');
  out.push('|---|---|---|---|---|');
  tagged.forEach((q, i) => {
    const prompt = q.prompt[LANG];
    const short = prompt.length > 40 ? `${prompt.slice(0, 39)}…` : prompt;
    out.push(
      `| ${i + 1} | ${cell(short)} | ${FORM[q.promptForm] ?? q.promptForm} | ` +
        `${REP[q.representation] ?? q.representation} | ${MODE[q.responseMode] ?? q.responseMode} |`,
    );
  });
  out.push('');
  out.push(
    `**Ada penandaan yang salah?** ☐ Tidak  ☐ Ada — yang mana dan sepatutnya apa: ` +
      `\`____________________________________\``,
  );
  out.push('');

  /*
    The question that matters most, and the only one that can undo a decision
    already recorded. Worth its own heading so it is not read past.
  */
  const reversed = tagged.filter((q) => q.promptForm === 'reverse');
  if (reversed.length > 0) {
    out.push('### Soalan bentuk — `terbalik`, atau kemahiran lain?');
    out.push('');
    out.push(
      `Kami menanda ${reversed.map((q) => `**"${cell(q.prompt[LANG])}"**`).join(' dan ')} sebagai ` +
        `**terbalik**: anak diberi nama, dan perlu mencari bentuknya. Itu definisi cikgu ` +
        `sendiri — diberi nilai, cari benda.`,
    );
    out.push('');
    out.push(
      `Tetapi cikgu juga pernah berkata soalan ini **ditulis terbalik** bagi SP 7.2.1, kerana ` +
        `7.2.1 ialah *"menamakan"* dan soalan ini meminta pengecaman. Kami merekod itu sebagai ` +
        `kerja yang perlu dibuat: tukar kepada "Apakah nama bentuk ini?", yang memerlukan ` +
        `perubahan skema untuk meletakkan gambar dalam arahan.`,
    );
    out.push('');
    out.push(
      `**Kami rasa dua nasihat cikgu bertembung di sini, dan mungkin cikgu tidak perasan** — ` +
        `ia diberi dalam dua surat berasingan, beberapa minggu berbeza. Yang pertama kata ` +
        `soalan ini salah bentuk. Yang kedua memberi definisi \`reverse\` yang menjadikan ` +
        `soalan ini **betul**, cuma bukan satu-satunya bentuk yang diperlukan. Kami tidak ` +
        `memilih antara keduanya; itu keputusan cikgu.`,
    );
    out.push('');
    out.push('Kedua-duanya tidak boleh betul serentak, dan jawapannya mengubah kerja:');
    out.push('');
    out.push('| Kalau | Maka |');
    out.push('|---|---|');
    out.push(
      `| Ia **terbalik** bagi kemahiran yang sama | Soalan sedia ada kekal. Kami cuma perlu ` +
        `menulis pasangan **terus** untuk setiap bentuk — soalan biasa, tiada perubahan skema |`,
    );
    out.push(
      `| Ia **kemahiran lain** | Soalan sedia ada perlu ditulis semula, gambar mesti masuk ke ` +
        `dalam arahan, dan skema perlu berubah dahulu |`,
    );
    out.push('');
    out.push(
      `**Yang mana?** ☐ Terbalik, kemahiran sama  ☐ Kemahiran lain, tulis semula  ` +
        `☐ Lain: \`__________________\``,
    );
    out.push('');
  }

  /*
    The number the teacher should have before answering the threshold question.
    Put ahead of it, not after: it is the difference between "which axis counts"
    read as theory and read as a decision with a visible consequence.
  */
  const bySkill = new Map();
  for (const q of tagged) {
    if (!q.subSkill) continue;
    if (!bySkill.has(q.subSkill)) bySkill.set(q.subSkill, new Set());
    bySkill.get(q.subSkill).add(q.promptForm);
  }
  const single = [...bySkill.values()].filter((f) => f.size < 2).length;
  if (bySkill.size > 0 && single === bySkill.size) {
    out.push('### Sebelum cikgu jawab: pek ini tiada kepelbagaian bentuk langsung');
    out.push('');
    out.push(
      `Kami mengira selepas menanda. **Kesemua ${bySkill.size} sub-kemahiran yang pek ini ` +
        `sentuh ditanya dalam satu bentuk sahaja.** Lapan daripada sepuluh soalan ialah ` +
        `*terus*, dan dua *terbalik* itu ialah dua soalan yang cikgu sendiri kata ditulis ` +
        `terbalik.`,
    );
    out.push('');
    out.push(
      `Maksudnya seluruh bekalan kepelbagaian bentuk kami datang daripada satu kesilapan — ` +
        `dan kalau cikgu jawab "tulis semula" pada soalan sebelum ini, kami akan tinggal ` +
        `dengan **sifar**.`,
    );
    out.push('');
    out.push(
      `Kesannya kalau bentuk dikira: **tiada satu pun kemahiran boleh mencapai "Dikuasai" hari ` +
        `ini.** Bukan kerana anak, dan bukan kerana kemahiran yang belum diuji — kerana setiap ` +
        `soalan yang kami tulis bertanya dengan cara yang sama. Itu jurang penulisan, dan kami ` +
        `rasa betul untuk app berkata begitu daripada berpura-pura sebaliknya. Tetapi cikgu ` +
        `patut tahu harganya sebelum menjawab soalan seterusnya.`,
    );
    out.push('');
  }

  out.push('### Paksi mana yang dikira sebagai bukti berasingan?');
  out.push('');
  out.push(
    `Untuk mengira satu kemahiran sebagai *Dikuasai*, app perlu beberapa jawapan betul yang ` +
      `benar-benar berlainan. Persoalannya: berlainan pada paksi yang mana?`,
  );
  out.push('');
  out.push('| Paksi | Cadangan kami | Sebab |');
  out.push('|---|---|---|');
  out.push(
    `| **Bentuk** (terus / terbalik / situasi) | **Dikira** | Arah pemikiran berubah. Anak ` +
      `yang boleh buat terus tetapi tidak terbalik belum faham sepenuhnya |`,
  );
  out.push(
    `| **Cara jawab** (pilih / ketuk / …) | **Tidak dikira** | Di mana ia benar-benar menguji ` +
      `perkara berlainan, senarai sub-kemahiran sudah memisahkannya — cth. mengetuk untuk ` +
      `membilang lawan memilih nombor ialah dua sub-kemahiran, bukan dua bentuk |`,
  );
  out.push(
    `| **Persembahan** (simbolik / visual / campuran) | **Tidak dikira** | Ia mengubah ` +
      `kesukaran, bukan arah pemikiran. Kesukaran sudah ada medannya sendiri |`,
  );
  out.push(
    `| **Variasi ayat** (A / B / C) | **Tidak dikira** | Itu sebab cikgu mengasingkannya |`,
  );
  out.push('');
  out.push(`**Setuju?** ☐ Ya  ☐ Tidak — sepatutnya: \`____________________________________\``);
  out.push('');
  out.push(
    `> Kesan pada pek hari ini, kalau **bentuk** yang dikira: kesepuluh-sepuluh soalan ` +
      `menyentuh sembilan sub-kemahiran, dan **setiap satu daripada sembilan itu ditanya dalam ` +
      `satu bentuk sahaja**. Tiada satu pun boleh mencapai *Dikuasai* sehingga soalan bentuk ` +
      `kedua ditulis. Kami rasa itu betul dan bukan masalah — tetapi cikgu yang tahu.`,
  );
  out.push('');
}

/**
 * Every SP the form cites, once, at the end — full text, sub-points, CATATAN,
 * and the content standard, topic and area it sits under.
 *
 * This is the reference a teacher checks us against, so nothing is abbreviated
 * in it. Deduplicating is what buys the room to leave it whole.
 */
function emitReference(out, pack, catalogue) {
  const cited = [];
  for (const q of pack.questions) {
    if (q.learningStandard && !cited.includes(q.learningStandard)) cited.push(q.learningStandard);
  }
  cited.sort();

  out.push('## Rujukan — teks penuh setiap SP yang didakwa');
  out.push('');
  out.push(`Disalin daripada dokumen di atas. Ini yang borang ini minta cikgu semak kami terhadapnya.`);
  out.push('');

  for (const code of cited) {
    const entry = catalogue.learning.get(code);
    if (!entry) continue;
    const { area, topic, topicTitle, sk, sp } = entry;
    out.push(`### \`${sp.code}\` — ${sp.title}`);
    out.push('');
    out.push(`${area} · ${topic} ${topicTitle} · SK **${sk.code}** ${sk.title}`);
    out.push('');
    if (sp.details?.length) {
      for (const d of sp.details) out.push(`> ${d}`);
      out.push('');
    }
    if (sp.catatan?.length) {
      out.push(`CATATAN DSKP:`);
      out.push('');
      for (const c of sp.catatan) out.push(`> ${c}`);
      out.push('');
    }
  }
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
      `Standard Pembelajaran yang kami dakwakan?** Mesin sudah menyemak bahawa setiap kod ` +
      `**wujud** dalam DSKP; yang ia tidak boleh putuskan ialah sama ada soalan itu mengajarnya. ` +
      `Teks penuh setiap SP ada dalam **Rujukan** di hujung borang. Sehingga borang ini dijawab, ` +
      `pek membawa \`verified: false\` dan papan pemuka ibu bapa tidak memaparkan satu pun kod ` +
      `SP (PRD §15).`,
  );
  out.push('');
  out.push(
    `*Pilihan bertanda ← betul. Susunannya diacak setiap kali anak bermain; urutan di sini ` +
      `ialah urutan dalam fail.*`,
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

  const skills = await loadSkills(pack.subject, pack.year);
  if (skills !== null) {
    emitSubSkills(out, pack, skills);
    emitAxes(out, pack);
  }

  emitReference(out, pack, catalogue);

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
