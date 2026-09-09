# SPEC.md — Spesifikasi Teknikal

**Projek:** Explore Smart Island
**Rujukan:** PRD.md v0.1
**Versi:** 0.1

---

## 1. Timbunan teknologi

| Lapisan | Pilihan | Sebab |
|---|---|---|
| UI | React 18 + TypeScript | Ditetapkan dalam brif |
| Gaya | Tailwind CSS v3 | Ditetapkan dalam brif |
| Animasi | Framer Motion v11 | Ditetapkan dalam brif |
| Keadaan (state) | Zustand | Kecil; enjin kuiz tidak memerlukan Redux |
| Penghalaan | React Router v6 | Standard |
| Bina | Vite | Bina pantas, PWA melalui `vite-plugin-pwa` |
| Backend | Supabase (Postgres + Auth) | Auth + RLS + storan dalam satu; boleh dihoskan sendiri kemudian |
| Storan tempatan | `localStorage` | Satu sesi di bawah satu kunci; segerak, tiada upacara async. IndexedDB ialah pilihan masa depan — lihat §6 |
| Audio | Howler.js | Kumpulan bunyi, bekerja mengelilingi kunci autoplay iOS |
| Validasi | Zod | Skema kandungan disahkan semasa bina **dan** semasa jalan |
| Hos frontend | Cloudflare Pages | CDN global, bina Vite terus, tier percuma benarkan guna komersial |
| Aset (audio, SVG) | Dalam repo pada mulanya | Pindah ke Cloudflare R2 jika melebihi ~100 MB |

> **React 18 dan Framer Motion 11 ialah versi yang disengajakan, bukan yang lalai.**
> `npm install react framer-motion` tanpa julat menyelesaikan kepada **React 19 dan Framer
> Motion 13** pada hari ini, dan ia berlaku senyap. Kedua-duanya diturunkan semula secara
> eksplisit supaya sepadan jadual di atas. Kalau versi ini dinaikkan, naikkan di sini dahulu
> — jangan biarkan `npm` memutuskannya.

---

## 2. Struktur folder

```
src/
  app/                    # Penghalaan, penyedia (providers), shell
  features/
    quiz/                 # Enjin sesi, komponen soalan
    island-map/           # Peta, topik, senarai aktiviti
    rewards/              # Skrin bintang, permata, peti
    parent/               # Papan pemuka, kawalan
    avatar/               # Kedai, pembuat avatar
  components/ui/          # Butang, Kad, Bar Kemajuan (bersih daripada logik domain)
  motion/
    tokens.ts             # Konfigurasi spring, tempoh, easing
    variants.ts           # Variasi Framer Motion yang boleh diguna semula
  content/
    schema.ts             # Skema Zod
    packs/                # JSON kandungan, satu fail setiap topik
      math-y1-nombor-100.json     # satu pek contoh; selebihnya datang Fasa 3
  lib/
    scoring.ts            # Fungsi tulen (pure functions), diuji unit
    mastery.ts
    sync.ts
  i18n/
    ui.ms.json
    ui.en.json
```

**Peraturan:** `lib/scoring.ts` dan `lib/mastery.ts` mesti fungsi tulen — tiada React, tiada I/O.
Ini yang membolehkan logik pemarkahan diuji tanpa merender apa-apa.

---

## 3. Model data kandungan

### 3.1 Jenis asas

```ts
/** Setiap teks yang dilihat pengguna adalah dwibahasa. Tiada pengecualian. */
type LocalizedText = { ms: string; en: string };

/** Audio arahan wujud dalam kedua-dua bahasa; audio kandungan mungkin satu sahaja. */
type LocalizedAudio = { ms: string; en: string };

type Subject   = 'math' | 'reading' | 'science';
type Year      = 1 | 2 | 3;
type Lang      = 'ms' | 'en';
type Difficulty = 1 | 2 | 3;   // 1 = pengenalan, 2 = teras, 3 = regangan
```

### 3.2 Pek Topik (fail JSON)

Satu fail = satu topik. Ini yang dimuatkan dan dicache.

```json
{
  "packVersion": 1,
  "topicId": "math-y1-nombor-100",
  "subject": "math",
  "year": 1,
  "islandId": "pulau-nombor",
  "title": { "ms": "Nombor Hingga 100", "en": "Numbers to 100" },
  "kssr": {
    "document": "DSKP Matematik Tahun 1 (Semakan 2017)",
    "contentStandard": "1.1",
    "learningStandards": ["1.1.1", "1.1.2", "1.1.3"],
    "verified": false
  },
  "activities": [
    {
      "activityId": "math-y1-nombor-100-a1",
      "title": { "ms": "Bilang Sampai 20", "en": "Count to 20" },
      "questionCount": 10,
      "questionIds": ["q001", "q002", "q003"]
    }
  ],
  "questions": []
}
```

`kssr.verified` bermula sebagai `false`. Ia menjadi `true` hanya selepas semakan guru
(PRD §15). Papan pemuka ibu bapa **tidak** memaparkan kod SP untuk pek yang belum disahkan.

### 3.3 Skema Soalan asas

Setiap soalan berkongsi bentuk ini, kemudian menambah `payload` khusus jenis.

```ts
interface QuestionBase {
  id: string;                    // unik dalam pek
  type: QuestionType;
  difficulty: Difficulty;
  learningStandard?: string;     // cth "1.1.2"
  prompt: LocalizedText;         // teks arahan
  promptAudio: LocalizedAudio;   // WAJIB — kanak-kanak umur 7 tidak boleh baca ini
  hint?: LocalizedText;          // ditunjukkan selepas 1 kali salah
  explain?: LocalizedText;       // ditunjukkan selepas 2 kali salah, bersama jawapan
  tags?: string[];
}

type QuestionType =
  | 'mcq'            // pilihan teks
  | 'mcq-image'      // pilihan imej
  | 'listen-choose'  // audio → pilih
  | 'count-tap'      // ketuk objek untuk membilang
  | 'drag-match'     // pasangkan dua set
  | 'drag-bucket'    // isih ke dalam kategori
  | 'sequence'       // susun mengikut urutan
  | 'build-word';    // ketuk suku kata untuk membina perkataan
```

**Subset MVP:** `mcq`, `mcq-image`, `count-tap`. Tiga jenis, satu pek contoh.

Lima yang lain — `listen-choose`, `drag-match`, `drag-bucket`, `sequence`, `build-word` —
datang dalam Fasa 3. Jangan bina komponen untuk jenis yang belum mempunyai kandungan.

Ini bukan sekadar nota. `QuestionSchema` hanya mengandungi tiga jenis dalam subset, dan
satu ujian dalam `src/content/schema.test.ts` menegaskan **kelima-lima** jenis lain gagal
dihurai. Sebuah pek tidak boleh memasukkan semula jenis yang tiada komponen di belakangnya;
subset ini mesti diluaskan dengan sengaja, dalam skema, sebelum kandungan ditulis.

### 3.4 Muatan (payload) mengikut jenis — dengan contoh

#### `mcq` — Aneka pilihan (teks)
```json
{
  "id": "q001",
  "type": "mcq",
  "difficulty": 1,
  "learningStandard": "1.1.2",
  "prompt": { "ms": "Nombor manakah yang lebih besar?", "en": "Which number is bigger?" },
  "promptAudio": { "ms": "/audio/ms/q001.mp3", "en": "/audio/en/q001.mp3" },
  "hint": { "ms": "Lihat nombor di hadapan dahulu.", "en": "Look at the first digit." },
  "payload": {
    "options": [
      { "id": "a", "text": { "ms": "47", "en": "47" } },
      { "id": "b", "text": { "ms": "74", "en": "74" } },
      { "id": "c", "text": { "ms": "38", "en": "38" } }
    ],
    "correctOptionId": "b",
    "shuffle": true
  }
}
```

**Had `mcq`** — dikuatkuasakan dalam Zod dan `validate:content`, bukan sekadar garis panduan:

| Had | Nilai | Sebab |
|---|---|---|
| `options.length` | maksimum **3** | Empat butang setinggi 88px tidak muat dalam zon ibu jari (DESIGN §5.2) tanpa menatal, dan menatal semasa memilih jawapan menyebabkan salah tekan |
| `option.text` setiap bahasa | maksimum **40 aksara** | Melebihi ini teks membalut kepada tiga baris pada 320px dan tinggi butang bergerak. Had dikira setiap bahasa: BM biasanya lebih panjang daripada EN untuk maksud yang sama |

Had aksara dikira pada `ms` dan `en` secara berasingan. Satu pilihan yang muat dalam EN
tetapi melimpah dalam BM tetap gagal validasi — pek tidak boleh lulus separuh.

#### `mcq-image` — Aneka pilihan (imej)
```json
{
  "id": "q014",
  "type": "mcq-image",
  "difficulty": 1,
  "prompt": { "ms": "Yang mana bentuk segi tiga?", "en": "Which one is a triangle?" },
  "promptAudio": { "ms": "/audio/ms/q014.mp3", "en": "/audio/en/q014.mp3" },
  "payload": {
    "options": [
      { "id": "a", "image": "/img/shapes/square.svg",   "alt": { "ms": "Segi empat sama", "en": "Square" } },
      { "id": "b", "image": "/img/shapes/triangle.svg", "alt": { "ms": "Segi tiga", "en": "Triangle" } },
      { "id": "c", "image": "/img/shapes/circle.svg",   "alt": { "ms": "Bulatan", "en": "Circle" } }
    ],
    "correctOptionId": "b",
    "shuffle": true
  }
}
```

**Had `mcq-image`** — dikuatkuasakan dalam Zod dan `validate:content`:

| Had | Nilai | Sebab |
|---|---|---|
| Tinggi jubin | maksimum **142px** | Dua baris jubin dalam grid 2 lajur, ditambah jurang 16px dan padding kad, mesti muat dalam timbunan jawapan tanpa memaksa kad soalan mengecut melebihi hadnya (DESIGN §5.2) |

142px adalah tinggi jubin yang **dilukis**, bukan saiz semula jadi imej sumber. SVG diskala
untuk muat; had ini menentukan kotak susun atur.

#### `listen-choose` — Dengar & pilih (teras modul Membaca)
```json
{
  "id": "r_ms_022",
  "type": "listen-choose",
  "difficulty": 2,
  "prompt": { "ms": "Dengar, kemudian pilih perkataan.", "en": "Listen, then pick the word." },
  "promptAudio": { "ms": "/audio/ms/inst_listen.mp3", "en": "/audio/en/inst_listen.mp3" },
  "payload": {
    "contentLang": "ms",
    "targetAudio": "/audio/ms/words/bulan.mp3",
    "options": [
      { "id": "a", "text": { "ms": "bulan", "en": "bulan" } },
      { "id": "b", "text": { "ms": "bulat", "en": "bulat" } },
      { "id": "c", "text": { "ms": "bulu",  "en": "bulu" } }
    ],
    "correctOptionId": "a",
    "replayLimit": 3
  }
}
```
`contentLang` mengunci bahasa kandungan (PRD §12). Suis UI tidak menyentuhnya.

#### `count-tap` — Ketuk & bilang
```json
{
  "id": "q031",
  "type": "count-tap",
  "difficulty": 1,
  "prompt": { "ms": "Ketuk setiap buah rambutan. Berapa banyak?", "en": "Tap each rambutan. How many?" },
  "promptAudio": { "ms": "/audio/ms/q031.mp3", "en": "/audio/en/q031.mp3" },
  "payload": {
    "itemImage": "/img/fruit/rambutan.svg",
    "itemCount": 7,
    "layout": "scatter",
    "answerInput": "tap-count",
    "correctAnswer": 7
  }
}
```
`layout`: `"scatter"` (rawak, benih tetap supaya boleh diulang) atau `"grid"`.

**`answerInput: "tap-count"` — ketukan itu sendiri ialah jawapan.** Kanak-kanak mengetuk
setiap objek, dan setiap ketukan meletakkan **nombor** pada objek itu: 1, 2, 3. Butang hantar
menghantar kiraan itu sebagaimana adanya. Tiada papan nombor.

Nombor itu bukan hiasan — ia perbuatan membilang. Objek yang terlepas ialah satu-satunya yang
tiada nombor, jadi anak nampak silapnya tanpa perlu tahu jawapan dahulu. Mengetuk semula
membuang nombor itu dan nombor selepasnya dikira semula, jadi silap ketuk boleh dipulihkan
tanpa membazir percubaan.

**Had `itemCount`: maksimum 9.**

| Had | Nilai | Sebab |
|---|---|---|
| `itemCount` | maksimum **9** | 3 objek sebaris × 3 baris pada 360×780. Sasaran 72px dengan jurang 16px (DESIGN §5.1, §4) memerlukan 88px setiap satu merentas 280px lebar kad; 301px yang tinggal selepas soalan, butang audio, kiraan dan padding memuatkan tiga baris |

Objek kesepuluh tidak gagal dengan elok — ia menolak kad ke dalam skrol, iaitu pepijat yang
menyekat dua kanak-kanak dalam ujian pengguna. Had ini dikuatkuasakan dalam Zod dan
`validate:content`, bukan garis panduan.

Papan nombor dibuang selepas ujian pengguna. Ia menjadikan membilang **dua langkah** — bilang,
kemudian cari digit — dan kanak-kanak 7 tahun tidak dapat membezakan langkah mana yang gagal:
salah bilang dan salah tekan kelihatan sama sahaja kepadanya. Satu tindakan, satu kemahiran
diuji. Itu yang `count-tap` sepatutnya uji.

Ia juga menghapuskan kekunci papan 59px. Sepuluh kekunci pada minimum 64px DESIGN §5.1
memerlukan 352px melintang; baris itu hanya ada 328px pada skrin 360px. Papan 10 kekunci
**tidak boleh** memenuhi lantai sasaran sentuh pada lebar itu — pelanggaran yang tidak
disedari sehingga kerja susun atur ini.

#### `drag-bucket` — Isih ke dalam kategori
```json
{
  "id": "s012",
  "type": "drag-bucket",
  "difficulty": 2,
  "prompt": { "ms": "Isih: hidup atau bukan hidup?", "en": "Sort: living or non-living?" },
  "promptAudio": { "ms": "/audio/ms/s012.mp3", "en": "/audio/en/s012.mp3" },
  "payload": {
    "buckets": [
      { "id": "hidup", "label": { "ms": "Hidup", "en": "Living" },        "icon": "/img/ui/leaf.svg" },
      { "id": "bukan", "label": { "ms": "Bukan Hidup", "en": "Non-living" }, "icon": "/img/ui/rock.svg" }
    ],
    "items": [
      { "id": "i1", "image": "/img/sci/cat.svg",   "alt": { "ms": "Kucing", "en": "Cat" },   "bucketId": "hidup" },
      { "id": "i2", "image": "/img/sci/chair.svg", "alt": { "ms": "Kerusi", "en": "Chair" }, "bucketId": "bukan" },
      { "id": "i3", "image": "/img/sci/fern.svg",  "alt": { "ms": "Paku pakis", "en": "Fern" }, "bucketId": "hidup" }
    ]
  }
}
```
Soalan berbilang item dimarkahkan **satu**. Betul = semua item diletakkan dengan betul.

#### `build-word` — Bina perkataan daripada suku kata
```json
{
  "id": "r_ms_048",
  "type": "build-word",
  "difficulty": 2,
  "prompt": { "ms": "Susun suku kata jadi perkataan.", "en": "Arrange the syllables into a word." },
  "promptAudio": { "ms": "/audio/ms/inst_build.mp3", "en": "/audio/en/inst_build.mp3" },
  "payload": {
    "contentLang": "ms",
    "targetWord": "sekolah",
    "targetAudio": "/audio/ms/words/sekolah.mp3",
    "tiles": ["se", "ko", "lah"],
    "distractorTiles": ["la", "ku"],
    "hintImage": "/img/nouns/sekolah.svg"
  }
}
```

### 3.5 Validasi

`content/schema.ts` mendedahkan skema Zod bagi setiap jenis, digabungkan sebagai kesatuan
berdiskriminasi (discriminated union) pada `type`.

```ts
export const QuestionSchema = z.discriminatedUnion('type', [
  McqSchema, McqImageSchema, ListenChooseSchema, CountTapSchema, DragBucketSchema,
]);

export const TopicPackSchema = z.object({ /* … */ })
  .superRefine((pack, ctx) => {
    // Setiap questionId yang dirujuk aktiviti mesti wujud
    // Setiap audio & imej yang dirujuk mesti wujud pada cakera (semakan masa bina)
  });
```

**Skrip masa bina** `npm run validate:content` menjalankan skema terhadap setiap fail
dalam `content/packs/` dan **gagal dalam CI** jika ada aset hilang atau `correctOptionId`
tidak sepadan dengan mana-mana pilihan. Ini menangkap ralat kandungan sebelum sampai ke
kanak-kanak.

---

## 4. Enjin sesi kuiz

### 4.1 Mesin keadaan (state machine)

```
     ┌──────────┐
     │  LOADING │  muatkan pek, prapuat audio & imej untuk 10 soalan
     └────┬─────┘
          ▼
     ┌──────────┐   ketuk mula
     │  INTRO   │──────────────┐
     └──────────┘              ▼
                        ┌─────────────┐
                        │  QUESTION   │◀─────────────┐
                        └──────┬──────┘              │
                        jawapan dihantar             │
                               ▼                     │
                        ┌─────────────┐              │
                        │  FEEDBACK   │              │
                        └──────┬──────┘              │
                    ┌──────────┴──────────┐          │
              salah, cuba < 3        betul ATAU cuba = 3
                    │                     │          │
                    └──▶ RETRY ───────────┘          │
                                          │          │
                                masih ada soalan ────┘
                                          │
                                    soalan habis
                                          ▼
                                   ┌─────────────┐
                                   │   SUMMARY   │  kira bintang, permata, penguasaan
                                   └─────────────┘
```

### 4.2 Peraturan percubaan

- Maksimum **3 percubaan** setiap soalan.
- Percubaan 1 salah → goncang + **pancingan** muncul, pilihan yang salah dilumpuhkan.
- Percubaan 2 salah → pancingan kekal, satu lagi pilihan salah dilumpuhkan.
- Percubaan 3 salah → tunjukkan jawapan betul + `explain`, teruskan (0 markah, tiada hukuman lain).
- **Jangan sekali-kali sekat kemajuan.** Kanak-kanak sentiasa boleh sampai ke skrin ringkasan.

**Pancingan adalah automatik dan percuma.** Ia muncul sendiri selepas satu jawapan salah.
Tiada butang "minta pancingan", dan tiada potongan markah kerana melihatnya — bilangan
percubaan sudah menanggung kos kesilapan itu (§5.1). Mengenakan caj kedua bermakna
kesilapan yang sama dihukum dua kali.

`AnswerRecord.hintShown` merekod sama ada pancingan sempat dipaparkan. Ia untuk analitik
sahaja dan **tidak pernah** masuk formula pemarkahan.

### 4.3 Bentuk keadaan sesi

```ts
interface SessionState {
  activityId: string;
  questions: Question[];        // sudah dikocok jika shuffle
  index: number;
  answers: AnswerRecord[];
  status: 'loading' | 'intro' | 'question' | 'feedback' | 'summary';
}

interface AnswerRecord {
  questionId: string;
  attempts: number;             // 1–3
  correct: boolean;             // akhirnya betul?
  firstTry: boolean;            // betul pada percubaan 1?
  hintShown: boolean;           // dilog untuk analitik, TIDAK dimarkahkan
  msSpent: number;              // dilog untuk analitik, TIDAK dimarkahkan
}
```

---

## 5. Logik pemarkahan

Semua di dalam `lib/scoring.ts`. Fungsi tulen, boleh diuji unit, tiada masa dalam formula.

### 5.1 Markah setiap soalan

```ts
const POINTS_BY_ATTEMPT = { 1: 100, 2: 60, 3: 30 } as const;
const MAX_ATTEMPTS = 3;

export function scoreQuestion(a: AnswerRecord): number {
  if (!a.correct) return 0;
  // Mengindeks jadual secara terus akan menghasilkan NaN bagi nilai di luar 1–3.
  // NaN itu akan mengalir ke accuracy(), kemudian ke mastery yang disimpan, dan
  // merosakkan rekod anak tanpa sebarang tanda. Baling ralat, jangan senyap.
  if (!Number.isInteger(a.attempts) || a.attempts < 1 || a.attempts > MAX_ATTEMPTS) {
    throw new RangeError(
      `attempts must be an integer 1-${MAX_ATTEMPTS}, got ${a.attempts} (question ${a.questionId})`,
    );
  }
  return POINTS_BY_ATTEMPT[a.attempts as 1 | 2 | 3];
}
```

**Tiada penalti pancingan.** Jadual percubaan sudah menanggung kos kesilapan; pancingan
automatik dan percuma (§4.2). `hintShown` direkod untuk analitik sahaja.

### 5.2 Ketepatan & bintang

Ketepatan mengukur **kualiti percubaan pertama**, bukan sama ada akhirnya berjaya.
Jika tidak, setiap kanak-kanak akan dapat 100% dan bintang menjadi tidak bermakna.

```ts
export function accuracy(answers: AnswerRecord[]): number {
  const total = answers.reduce((sum, a) => sum + scoreQuestion(a), 0);
  const max = answers.length * 100;
  return max === 0 ? 0 : total / max;      // 0.0 – 1.0
}

export function starsFor(acc: number): 0 | 1 | 2 | 3 {
  if (acc >= 0.95) return 3;
  if (acc >= 0.80) return 2;
  if (acc >= 0.60) return 1;
  return 0;
}
```

**Bintang yang disimpan** = `Math.max(bintangSediaAda, bintangBaharu)` (PRD §10).

### 5.3 Permata

```ts
export function gemsFor(stars: 0 | 1 | 2 | 3, isFirstClear: boolean): number {
  const base = [0, 5, 10, 20][stars];
  return isFirstClear ? base + 10 : base;
}
```
Ulangan memberi permata lebih sedikit — mencegah pertanian (farming) tanpa menghukum latihan.

### 5.4 Penguasaan setiap Standard Pembelajaran

Purata bergerak eksponen. Satu nombor, mudah difahami, tiada penalaan.

```ts
const ALPHA = 0.4;                 // sesi baharu memberi 40% berat

export function updateMastery(prev: number | null, sessionAccuracy: number): number {
  if (prev === null) return sessionAccuracy;
  return prev + ALPHA * (sessionAccuracy - prev);
}

export function masteryLabel(m: number | null): 'not-started' | 'learning' | 'mastered' {
  if (m === null) return 'not-started';
  return m >= 0.85 ? 'mastered' : 'learning';
}
```

**Peraturan penurunan:** jika satu SP tidak disentuh selama 30 hari, kurangkan `mastery`
sebanyak 0.05 sekali. Ini menyebabkan topik lama muncul semula dalam "Fokus minggu ini"
tanpa menghukum kanak-kanak yang bercuti.

### 5.5 Pemilihan kesukaran

Tangga tiga aras yang sengaja bodoh. Jangan bina model IRT untuk kanak-kanak 7 tahun.

```
Mula pada difficulty 1.
Selepas satu aktiviti:
  ketepatan ≥ 0.90  →  naik satu aras (maks 3)
  ketepatan < 0.55  →  turun satu aras (min 1)
  jika tidak        →  kekal
```

Komposisi soalan bagi aktiviti pada aras `d`: 70% pada `d`, 20% pada `d-1`, 10% pada `d+1`
(dengan clamp pada sempadan). Campuran ini memberikan kemenangan mudah dan sedikit regangan.

### 5.6 Siri

```ts
// Dijalankan sekali sehari pada waktu tempatan pengguna, atau semasa mula app.
export function updateStreak(s: Streak, todayISO: string): Streak {
  const gapDays = daysBetween(s.lastActiveDate, todayISO);
  if (gapDays === 0) return s;                          // sudah dikira hari ini
  if (gapDays === 1) return { ...s, count: s.count + 1, lastActiveDate: todayISO };
  if (s.freezes > 0)  return { ...s, freezes: s.freezes - 1, lastActiveDate: todayISO };
  return { ...s, count: 1, lastActiveDate: todayISO };  // set semula, tanpa drama
}
```

**Amaran menghurai tarikh — `parseISODate`.** `Date.parse` **tidak** menolak tarikh yang
mustahil; ia menggolekkannya. `Date.parse('2026-02-30T00:00:00Z')` memulangkan 2 Mac 2026,
bukan `NaN`. Menyemak `Number.isNaN` sahaja tidak memadai: tarikh rosak diterima senyap dan
kiraan siri menjadi salah tanpa sesiapa perasan.

`daysBetween` mesti membuat **semakan pergi-balik** — hurai, format semula kepada
`YYYY-MM-DD`, dan bandingkan dengan input asal. Tidak sepadan bermakna tarikh itu palsu:

```ts
const ms = Date.parse(`${iso}T00:00:00Z`);
if (Number.isNaN(ms)) throw new RangeError(`"${iso}" is not a real date`);
if (new Date(ms).toISOString().slice(0, 10) !== iso) {
  throw new RangeError(`"${iso}" is not a real date`);
}
```

Tarikh dihurai sebagai tengah malam UTC supaya anjakan waktu jimat siang tidak menggerakkan
sempadan hari.

---

## 6. Ketekalan & penyegerakan

**Tempatan dahulu.** Sesi ditulis ke `localStorage` serta-merta, kemudian dibaris gilir untuk sync.

### Kenapa `localStorage`, bukan IndexedDB

Bahagian ini pernah menetapkan IndexedDB melalui `idb-keyval`. Kod tidak pernah
melaksanakannya, dan setelah diperiksa, kod yang betul — dokumen yang dipinda di sini,
bukan sebaliknya.

Yang disimpan ialah **satu** sesi: sepuluh soalan dan rekod jawapannya, beberapa kilobait,
di bawah satu kunci (`esi.session.v1`). `localStorage` memegang itu secara segerak, dalam
satu baris, tanpa transaksi, tanpa migrasi skema, dan tanpa menjadikan setiap pembacaan
async. IndexedDB menyelesaikan masalah yang belum kita ada.

Ia juga sudah kukuh terhadap kes yang benar-benar berlaku. Setiap akses dibalut, kerana
`localStorage` membaling terus dalam sesetengah mod privasi; `loadSession` menolak blob
rosak, sesi bagi aktiviti lain, dan indeks yang melepasi hujung senarai soalan. Anak
kehilangan tempatnya itu buruk — app yang tidak mahu bermula lebih buruk. Tingkah laku itu
diuji dalam `src/lib/persistence.test.ts`.

PRD §16 soalan 6 sudah menganggapnya begitu ketika mencatat bahawa soalan dibekukan dalam
`localStorage` sehingga sesi dikosongkan.

**IndexedDB ialah pilihan masa depan, bukan hutang.** Ia dipilih apabila saiz atau bentuk
data menuntutnya, bukan lebih awal. Tiga perkara akan menuntutnya, dan tiada satu pun wujud
hari ini:

- **Cache pek kandungan luar talian** (PRD §5). Pek berserta audio dan SVG yang dirujuknya
  melepasi had ~5 MB `localStorage` sebaik sahaja lebih daripada satu topik dicache.
- **Barisan sync yang bertahan.** `SyncQueueItem` di bawah mengandaikan berbilang entri
  yang ditulis, dibaca dan dipadam mengikut urutan. Itu jadual, bukan satu kunci.
- **Empat profil anak** (PRD §11), setiap satu dengan kemajuannya sendiri — data berstruktur
  yang perlu disoal, bukan satu blob yang dibaca sepenuhnya setiap kali.

Sehingga salah satu daripadanya wujud, menukar storan menambah kerumitan tanpa menambah
keupayaan.

```ts
interface SyncQueueItem {
  id: string;                 // uuid, idempoten
  childProfileId: string;
  type: 'session-complete';
  payload: SessionResult;
  createdAt: string;
  attempts: number;
}
```

- Pelayan menerima `id` dan **menyahduplikasi** — hantar semula selamat.
- Konflik: pelayan mengambil `max(stars)` setiap aktiviti, dan `max(gemsEarned)` bukan jumlah.
- Jika sync gagal 5 kali, tunjukkan penunjuk "luar talian" yang tenang pada skrin ibu bapa sahaja.
  Jangan sekali-kali tunjukkan ralat sync kepada kanak-kanak.

### Jadual (Supabase, ringkas)

```sql
parent_accounts (id, email, created_at)
child_profiles  (id, parent_id, first_name, year, lang_pref, avatar_json, daily_limit_min)
activity_progress (child_id, activity_id, best_stars, attempts_count, last_played_at)
mastery         (child_id, learning_standard, score, updated_at)
sessions        (id, child_id, activity_id, accuracy, stars, answers_json, created_at)
```
RLS: ibu bapa hanya boleh membaca/menulis baris di mana `parent_id = auth.uid()`.

---

## 7. Spesifikasi pergerakan Framer Motion

### 7.1 Token gerakan — `motion/tokens.ts`

```ts
export const spring = {
  /** Tindak balas ketukan butang — pantas, sedikit lantunan */
  pop:    { type: 'spring', stiffness: 500, damping: 22, mass: 0.6 },
  /** Peralihan kad & susun atur — mantap */
  settle: { type: 'spring', stiffness: 260, damping: 26, mass: 1 },
  /** Momen ganjaran — terlajak (overshoot) yang jelas */
  cheer:  { type: 'spring', stiffness: 380, damping: 12, mass: 0.8 },
  /** Item seret kembali ke tempat asal */
  snap:   { type: 'spring', stiffness: 700, damping: 35, mass: 0.5 },
} as const;

export const duration = {
  micro:  0.12,   // perubahan keadaan, tekanan
  base:   0.22,   // masuk/keluar elemen
  cheer:  0.45,   // sambutan
  ambient: 3.0,   // gelung mascot bernafas
} as const;

export const ease = {
  out:  [0.16, 1, 0.3, 1],       // expo-out, terasa pantas
  back: [0.34, 1.56, 0.64, 1],   // sedikit terlajak, mesra kanak-kanak
  in:   [0.4, 0, 1, 1],
} as const;
```

**Peraturan keras 1:** hanya animasikan `transform` dan `opacity`. Tiada `width`, `height`,
`top`, `left`, `box-shadow`, atau `filter` yang dianimasikan pada laluan panas.

**Peraturan keras 2 — kandungan mesti dipasang dan kelihatan pada bingkai 0.**
Animasi memperhalusi kemunculan; ia tidak pernah menyebabkannya. Bingkai animasi bukan
jaminan — tab latar belakang, peranti terhad, penyaji yang tidak pernah memanggil
`requestAnimationFrame`. Apa sahaja yang kelihatannya menunggu bingkai akan **hilang**
apabila bingkai itu tidak tiba, dan anak tidak diberitahu bahawa satu animasi gagal; dia
diberitahu perkara yang salah.

**Ini bukan larangan ke atas animasi masuk.** Ia menetapkan di mana animasi itu bermula.
Animasi masuk dikehendaki di mana-mana ia mempunyai tugas (DESIGN §7); yang dilarang ialah
menjadi sebab sesuatu ada pada skrin. Ujiannya mudah: bekukan animasi pada bingkai
pertamanya dan pandang. Kalau bingkai itu terbaca, lebih kurang di tempat betul, dan
menyatakan perkara yang benar — animasi itu bebas jadi seceria mana pun.

Dua corak yang lulus, kedua-duanya sudah wujud dalam kod:

| Corak | Contoh |
|---|---|
| Mula pada keadaan akhir, beranimasi keluar daripadanya dan kembali | Ikon ✓/✕: `opacity: 1` sepanjang masa, hanya `scale` bergerak. Bingkai kunci yang nilai pertamanya sama dengan `initial` — `scale: [1, 1.25, 1]` — mendarat sama: beku, elemen itu sekadar sudah siap |
| Beranimasi satu sifat tidak memudaratkan daripada ofset kecil | Pancingan meluncur `y: -8 → 0` pada legap penuh: beku, ia 8px tinggi dan terbaca sepenuhnya |

Yang dilarang, dan sebabnya:

| Larangan | Kenapa |
|---|---|
| Keadaan masuk pada `opacity: 0` atau `scale: 0` | Beku = tidak kelihatan langsung |
| Keadaan masuk jauh daripada tempat mendarat | Beku = kandungan di tempat salah |
| `AnimatePresence mode="wait"` mengelilingi kandungan | Menahan elemen masuk sehingga elemen keluar habis beranimasi. Keluar yang beku bermakna kandungan seterusnya **tidak pernah dipasang** |
| Prop `layout` pada bekas yang saiznya membawa makna | Ia mengubah saiz dengan unjuran transform merentas bingkai kemudian; tanpa bingkai, unjuran itu kekal dan kotak kekal salah bentuk. Ukur: `matrix(0.985, 0, 0, 0.59, 0, -47)` — kad dihimpit 59% menegak |
| Kaunter atau skor yang bermula pada 0 | Beku = nombor palsu tentang apa yang anak baru menang |

Untuk perubahan saiz, biarkan reflow CSS biasa melakukannya. Ia serta-merta dan betul pada
bingkai 0; prop `layout` menukar ketepatan itu dengan kehalusan yang mungkin tidak pernah
tiba.

### 7.2 Variasi boleh guna semula — `motion/variants.ts`

Keadaan dinamakan `arriving` dan `settled`, bukan `hidden` dan `visible`. Tiada apa yang
pernah tersembunyi — perkataan itulah yang membentuk pepijat lama. Tiada keadaan masuk
membawa `opacity: 0`, dan tiada keadaan keluar langsung: kad ditukar serta-merta.

```ts
/** Kad soalan masuk; anak-anaknya berperingkat */
export const questionCard = {
  arriving: { opacity: 1, scale: 0.985 },
  settled: {
    opacity: 1, scale: 1,
    transition: { ...spring.settle, staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

/** Setiap anak kad yang berperingkat */
export const optionItem = {
  arriving: { opacity: 1, scale: 0.98 },
  settled:  { opacity: 1, scale: 1, transition: spring.pop },
};

/** B5 — pancingan meluncur masuk di bawah soalan; hanya `y` bergerak */
export const hintItem = {
  arriving: { opacity: 1, y: -8 },
  settled:  { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

/** Goncang jawapan salah — pendek, mendatar, tidak menakutkan */
export const shake = {
  x: [0, -9, 9, -6, 6, -3, 0],
  transition: { duration: 0.34, ease: 'easeInOut' },
};

/** Denyut jawapan betul */
export const correctPulse = {
  scale: [1, 1.12, 1],
  transition: { duration: 0.32, ease: ease.back },
};
```

### 7.3 Spesifikasi setiap interaksi

| Interaksi | Sifat yang dianimasi | Konfigurasi | Tempoh | Nota |
|---|---|---|---|---|
| **Tekan butang** | `scale: 0.94` | `whileTap`, `spring.pop` | ~120 ms | Ditambah `y: 2` untuk butang 3D (lihat DESIGN.md) |
| **Butang lepas** | `scale: 1` | `spring.pop` | ~180 ms | Terlajak kecil terasa memuaskan |
| **Kad soalan masuk** | `scale` sahaja | `questionCard` | 0.22 s + 0.06 s berperingkat | **Tiada `AnimatePresence`, tiada animasi keluar.** Kad berkunci pada `question.id` dan ditukar serta-merta. `origin-top`, supaya skala tidak menggerakkan teks soalan |
| **Jawapan betul** | `scale` denyut + cincin | `correctPulse` | 0.32 s | Gelang hijau berkembang keluar, `scale 0.8→1.6`, `opacity 0.6→0` |
| **Jawapan salah** | `x` goncang | `shake` | 0.34 s | **Tiada kilat merah penuh skrin.** Sempadan sahaja |
| **Pancingan meluncur masuk** | `y: -8 → 0` sahaja | `hintItem` | 0.22 s | Legap penuh sepanjang masa. Kad tumbuh melalui reflow CSS biasa. **Bukan prop `layout`**, bukan animasi `height` |
| **Pilihan dilumpuhkan** | `opacity → 0.35`, `scale → 0.96` | tween, `ease.out` | 0.2 s | Berperingkat 0.05 s jika berbilang |
| **Bar kemajuan** | `scaleX` | `spring.settle` | ~0.4 s | `transformOrigin: left`. Jangan animasi `width` |
| **Anugerah bintang** | `scale: [1, 1.25, 1]`, `rotate: [0, -25, 0]` | tween `ease.back` | 0.45 s setiap satu | Berperingkat 0.18 s antara bintang. **Bingkai kunci pertama sama dengan `initial`**, jadi beku ialah bintang terisi bersaiz penuh dan legap — keputusan sebenar — sementara yang menyaji dapat kembang dan tunduk. Bintang ialah mesej skrin itu; ia tidak pernah bermula pada sifar |
| **Kiraan permata** | teks kira naik + `scale` denyut | tween 0.6 s | 0.6 s | `useState` bermula pada **nombor sebenar**; `animate(0, to, { onUpdate })` menaikkannya. `onUpdate` hanya menyala pada bingkai, jadi tanpa bingkai tiada apa menyentuh nombor itu |
| **Mula seret** | `scale: 1.08`, bayang naik | `spring.pop` | 0.15 s | `dragElastic: 0.15`, `dragMomentum: false` |
| **Jatuh betul** | petak berdenyut `scale 1→1.06→1` | `spring.cheer` | 0.3 s | Item terkunci melalui `layoutId` |
| **Jatuh salah** | kembali ke asal | `spring.snap` | ~0.35 s | Item kembali, tiada goncang — jangan hukum penerokaan |
| **Peralihan skrin** | `x: ±40`, `opacity` | `spring.settle` | 0.28 s | Ke hadapan = masuk dari kanan |
| **Peti ganjaran** | `rotate: [0,-6,6,-4,4,0]` lalu `scale` pop | goncang 0.6 s, pop `spring.cheer` | 1.0 s | Ketuk untuk buka; jangan auto-buka |
| **Mascot melahu** | `y: [0,-6,0]` | `repeat: Infinity`, `easeInOut` | 3 s | **Dimatikan pada reduced-motion** |
| **Pulau dibuka** | `scale 0.85→1`, `opacity 0→1`, riak | `spring.cheer` | 0.6 s | Satu momen setiap sesi, maksimum |

### 7.4 Kesan zarah (confetti / letupan bintang)

```ts
const PARTICLE_COUNT = { high: 24, low: 8 };   // ditentukan oleh navigator.hardwareConcurrency
```

- Zarah adalah SVG mudah, dianimasikan dengan `x`, `y`, `rotate`, `opacity` sahaja.
- Hayat 800–1200 ms, kemudian **dinyahlekap** — jangan biarkan dalam DOM.
- Hanya pada ⭐⭐⭐ dan pembukaan pulau. Confetti pada setiap jawapan betul menjadi bunyi bising.
- Jangan sekali-kali lebih daripada satu sistem zarah aktif serentak.

### 7.5 Gerakan dikurangkan (reduced motion)

```tsx
const reduce = useReducedMotion();

const enter = reduce
  ? { opacity: 1, transition: { duration: 0.15 } }
  : { opacity: 1, y: 0, scale: 1, transition: spring.settle };
```

Apabila `prefers-reduced-motion: reduce` aktif:
- **Buang animasi masuk sepenuhnya** — render terus pada keadaan `settled` (`initial={false}`)
- Matikan semua gelung `repeat: Infinity`
- Matikan zarah sepenuhnya
- **Kekalkan** perubahan warna dan ikon — maklum balas betul/salah masih perlu terbaca

Versi awal bahagian ini menetapkan silang-pudar `opacity` 150 ms sebagai ganti. Itu
bermula pada `opacity: 0`, iaitu tepat corak yang §7.1 peraturan keras 2 melarang — ia
menukar satu masalah kebolehcapaian dengan satu lagi, dan bagi pengguna yang meminta
kurang gerakan, ketiadaan animasi masuk memang jawapan yang lebih baik daripada pudar.

### 7.6 Bajet prestasi

| Metrik | Sasaran | Diukur pada |
|---|---|---|
| Kadar bingkai animasi | ≥ 55 fps | Chrome 100+ / Safari 15.4+ (peranti 2022 ke atas) |
| Masa ke soalan pertama boleh berinteraksi | < 1.5 s | 4G, cache panas |
| Aset setiap aktiviti | < 2 MB | Termasuk audio |
| Nod DOM setiap skrin kuiz | < 400 | Tidak termasuk zarah |

**Baseline peranti & pelayar:** Chrome 100+ / Safari 15.4+, iaitu peranti keluaran 2022 ke atas.
Ini menggantikan baseline lama (Android pertengahan-rendah / Chrome 87). Sebabnya: Framer Motion v11
memerlukan baseline moden. Peranti di bawah baseline ini tidak disokong secara rasmi.

(Rive pernah menjadi sebab kedua di sini. Ia ditinggalkan — §11.6 — dan baseline kekal
kerana Framer Motion sahaja sudah menuntutnya.)

Prapuat aset **satu soalan ke hadapan** semasa soalan semasa dipaparkan. Jangan prapuat
semua 10 di muka — ini mematikan sambungan yang perlahan.

---

## 8. Audio & haptik

- **Kunci autoplay iOS:** semua audio dimulakan selepas gerak isyarat pengguna pertama
  (butang "Mula"). Pratayang Howler pada gerak isyarat itu.
- Audio arahan bermain secara automatik apabila soalan muncul; butang ulang tayang sentiasa kelihatan.
- Bunyi UI: `tap`, `correct`, `wrong`, `star`, `unlock`. Jaga bunyi `wrong` sebagai
  nada lembut menurun — bukan buzzer.
- Haptik melalui `navigator.vibrate`: 10 ms pada ketukan, 30 ms pada betul. Langkau pada iOS
  (tidak disokong). Hormati suis "senyap" dalam tetapan.

---

## 9. Kebolehcapaian

- Sasaran sentuhan minimum **64 × 64 px** (lihat DESIGN.md untuk sebab; ini melebihi WCAG 44 px).
- Nisbah kontras ≥ 4.5:1 untuk semua teks, ≥ 3:1 untuk sempadan butang.
- Betul/salah **tidak pernah** disampaikan melalui warna sahaja — sentiasa ikon + gerakan + bunyi.
- Setiap imej mempunyai `alt` dwibahasa.
- Fokus papan kekunci kelihatan (cincin 3 px), untuk ibu bapa pada desktop.
- `aria-live="polite"` pada kawasan maklum balas.

---

## 10. Kriteria penerimaan (Fasa 1)

1. `npm run validate:content` lulus dengan sifar ralat pada semua pek dalam repo.
2. Ujian unit meliputi `scoring.ts` dan `mastery.ts` pada ≥ 90% baris, termasuk kes tepi:
   0 jawapan, semua salah, semua betul percubaan pertama, penggunaan pancingan.
3. Satu aktiviti penuh 10 soalan boleh disiapkan pada iPhone SE dan Android 8 tanpa ranap.
4. Bintang yang diberikan sepadan dengan jadual ambang bagi 20 sesi sintetik.
5. Menutup app di tengah aktiviti dan membuka semula memulihkan sesi daripada `localStorage`.
6. `prefers-reduced-motion: reduce` melumpuhkan semua gelung tak terhingga (disahkan dengan DevTools).
7. Kanak-kanak sebenar berumur 7 tahun menyiapkan satu aktiviti tanpa arahan lisan
   daripada orang dewasa. Ini adalah ujian yang paling penting dalam senarai ini.

---

## 11. Kontrak komponen Kancil

Maskot ialah komponen React — SVG berlapis yang digerakkan oleh Framer Motion, bukan
runtime animasi berasingan. Pelaksanaan: `src/components/ui/Kancil.tsx`. Geometri diambil
daripada `design/brief-01d/handoff/kancil-layered.svg`, viewBox `0 0 1254 1254`.

```tsx
<Kancil state="idle" | "thinking" | "happy" | "sympathy" />
```

### 11.1 Prop

| Prop | Jenis | Lalai | Peranan |
|---|---|---|---|
| `state` | `KancilState` | — (wajib) | Poz atau reaksi yang dipapar sekarang |
| `size` | `number` | `88` | Lebar dan tinggi dalam px. 88 ialah slot kad soalan (DESIGN §7); skrin ringkasan merender pada 200 |
| `strokeWidth` | `number` | `20` | Lebar strok dalam unit viewBox 1254 |
| `onDone` | `(finished: KancilState) => void` | — | Dipanggil apabila reaksi `happy` atau `sympathy` tamat |
| `className` | `string` | — | Diteruskan kepada elemen `<svg>` |

`KancilState = 'idle' | 'thinking' | 'happy' | 'sympathy'` dieksport bersama komponen.

**`strokeWidth` lalai 20, bukan 8.** Lapan ialah nilai dalam fail SVG sumber, iaitu 0.64%
lebar viewBox — pada 88px kaki menipis menjadi benang dan haiwan itu kehilangan bentuknya.
20 ialah 1.6%, kira-kira 1.4px pada 88px. Strok mulut dilukis pada 55% daripada nilai ini,
nisbah yang sama seperti fail sumber.

### 11.2 Keadaan

| Keadaan | Bila | Tempoh | Apa yang bergerak |
|---|---|---|---|
| `idle` | Rehat; skrin ganjaran selepas reaksi tamat | Gelung tak terhingga | Nafas 3.0 s, bob kepala lewat 6 bingkai daripada nafas, kedip setiap 4.2 s |
| `thinking` | Soalan dipapar, belum dijawab | Gelung tak terhingga | Nafas separuh amplitud, kepala senget −8°, kedip setiap 6 s |
| `happy` | Jawapan betul | 0.8 s (48 bingkai @60) | Badan lompat sekali, telinga naik, mata picing |
| `sympathy` | Percubaan ketiga salah | 1.6 s (96 bingkai @60) | Kepala senget +12°, telinga ikut kepala, satu kedip |

`happy` dan `sympathy` ialah **reaksi**: main sekali, kemudian `onDone`. Gelung nafas dan
kedip terus bermain di bawahnya — lapisan yang tidak disebut oleh sesuatu keadaan tidak
disentuh olehnya, sama seperti campuran aditif dalam spesifikasi handoff.

**Tiada baris gilir.** Satu trigger baharu ialah pertukaran prop `state`, bukan tolakan ke
dalam timbunan. Reaksi yang sedang bermain dipotong terus.

**`thinking` tidak dipapar oleh mana-mana skrin hari ini.** DESIGN §6 melarang maskot
muncul semasa kanak-kanak sedang berfikir tentang soalan, jadi kad soalan membiarkan slot
88×88 kosong sehingga maklum balas tiba, dan skrin ringkasan tidak pernah berfikir. Keadaan
itu kekal dalam kontrak kerana ia poz yang sah dan sudah dilaksana; di mana — dan sama ada —
ia dipapar ialah keputusan skrin, bukan keputusan komponen.

### 11.3 `onDone` dan siapa yang memiliki keadaan

Komponen tidak pernah menukar `state`nya sendiri. Ia hanya memberitahu induk bila satu
reaksi tamat; induk yang memutuskan apa seterusnya:

```tsx
const [kancil, setKancil] = useState<KancilState | null>(null);
<Kancil state={kancil} size={88} onDone={() => setKancil('idle')} />
```

Pemasa itu `setTimeout`, bukan pendengar bingkai animasi. Ini disengajakan: `onDone` mesti
tiba walaupun tiada satu pun bingkai dirender, atau induk yang menunggu untuk kembali ke
`idle` tersekat selama-lamanya pada tab latar belakang (§7.1 peraturan keras 2, CLAUDE.md
prinsip 5). Pemasa dibersihkan apabila `state` berubah atau komponen dinyahlekap, jadi
reaksi yang dipotong tidak memanggil balik lewat.

`onDone` tidak dipanggil untuk `idle` atau `thinking`. Kedua-duanya tiada penghujung.

### 11.4 Gerakan dikurangkan

Apabila `useReducedMotion()` benar, komponen beranimasi kepada varian bernama `still` —
nama yang **tidak ditakrifkan oleh mana-mana lapisan**. Tiada lapisan menemui padanan,
jadi tiada apa yang bergerak dan kancil dipapar pada poz MELAHU bingkai 0. Ini melaksanakan
§7.5 bagi maskot: setiap gelung `repeat: Infinity` mati sepenuhnya.

`onDone` tetap menyala, pada 150 ms dan bukan tempoh penuh reaksi. Pengguna yang meminta
kurang gerakan tidak sepatutnya menyebabkan induk tersekat menunggu reaksi yang tidak
pernah dimainkan.

### 11.5 Bingkai 0

`initial={false}`, dan setiap bingkai kunci pertama ialah poz neutral. Tiada keadaan
bermula pada `opacity: 0` atau `scale: 0`. Beku pada bingkai pertama, kancil ialah kancil
yang lengkap — bukan ruang kosong.

Pangsi ditulis sebagai `transformOrigin` CSS statik dalam unit viewBox, **bukan** melalui
`originX`/`originY` Framer. Sebabnya diukur: dengan `originX`/`originY`, Framer tidak
menulis apa-apa atribut style sehingga ia benar-benar merender satu transform, jadi
`transform-origin` terkira kekal `0px 0px` sehingga bingkai pertama tiba. Putaran kepala
12° akan berpangsi pada penjuru viewBox kalau bingkai itu tidak pernah datang. Sebagai CSS
statik, pangsi betul pada bingkai 0.

Nilai pangsi dikira daripada `getBBox()` geometri 1254 ini, bukan disalin daripada fail
spesifikasi handoff — nilai di sana anggaran, dan merujuk artboard 512 yang tidak pernah
dilaksanakan.

### 11.6 Kenapa bukan Rive

Dua sebab:

1. **Eksport `.riv` berbayar.** Kontrak lama memerlukan fail `.riv` daripada Rive Editor,
   dan mengeksportnya memerlukan pelan berbayar.
2. **Framer Motion sudah memandu setiap animasi lain dalam app** (§7). Satu runtime animasi
   kurang untuk dimuatkan, dan maskot tertakluk kepada peraturan bingkai 0 yang sama seperti
   selebihnya, bukan kepada mesin keadaan yang mematuhi peraturannya sendiri.

Kontrak keadaan dikekalkan hampir sebagaimana adanya; hanya mekanismenya berubah, daripada
input mesin keadaan kepada satu prop:

| Input Rive lama | Sekarang |
|---|---|
| `isThinking` Boolean | `state="thinking"` / `state="idle"` |
| `isCorrect` Trigger | `state="happy"` |
| `isWrong` Trigger | `state="sympathy"` |
| `celebrate` Trigger | **Dibuang** — lihat di bawah |

`celebrate` ialah satu-satunya kehilangan sebenar. Ia pernah menjadi reaksi ⭐⭐⭐ yang
berasingan pada skrin ringkasan; hari ini skrin itu merender `happy` pada `size={200}` bagi
setiap keputusan. Confetti yang DESIGN §7 E2 khaskan untuk ⭐⭐⭐ belum dibina, jadi buat masa
ini tiga bintang dan satu bintang mendapat maskot yang sama. Kalau reaksi raya dikehendaki
semula, ia ditambah kepada `KancilState` di sini dahulu, kemudian dalam komponen — bukan
sebaliknya.

**Tiada aset `.riv` dalam repo, dan `validate:content` tidak menyemaknya.** Geometri yang
maskot perlukan sudah tertanam dalam komponen itu sendiri.

Jika designer minta keadaan tambahan, kontrak ini kena dikemas kini dahulu sebelum kod
ditulis. Jangan tambah keadaan secara ad-hoc.
