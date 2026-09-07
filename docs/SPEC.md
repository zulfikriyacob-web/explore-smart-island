# SPEC.md — Spesifikasi Teknikal

**Projek:** Pulau Pintar
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
| Storan tempatan | IndexedDB melalui `idb-keyval` | Barisan luar talian + cache pek kandungan |
| Audio | Howler.js | Kumpulan bunyi, bekerja mengelilingi kunci autoplay iOS |
| Validasi | Zod | Skema kandungan disahkan semasa bina **dan** semasa jalan |

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
      math-y1-nombor-100.json
      read-ms-y1-suku-kata-kv.json
      science-y1-hidup-bukan-hidup.json
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

**Subset MVP:** `mcq`, `mcq-image`, `listen-choose`, `count-tap`, `drag-bucket`.
Tiga yang lain datang dalam Fasa 3. Jangan bina komponen untuk jenis yang belum
mempunyai kandungan.

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
    "answerInput": "number-pad",
    "correctAnswer": 7
  }
}
```
`layout`: `"scatter"` (rawak, benih tetap supaya boleh diulang) atau `"grid"`.

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
  hintUsed: boolean;
  msSpent: number;              // dilog untuk analitik, TIDAK dimarkahkan
}
```

---

## 5. Logik pemarkahan

Semua di dalam `lib/scoring.ts`. Fungsi tulen, boleh diuji unit, tiada masa dalam formula.

### 5.1 Markah setiap soalan

```ts
const POINTS_BY_ATTEMPT = { 1: 100, 2: 60, 3: 30 } as const;
const HINT_PENALTY = 10;

export function scoreQuestion(a: AnswerRecord): number {
  if (!a.correct) return 0;
  const base = POINTS_BY_ATTEMPT[a.attempts as 1 | 2 | 3];
  return Math.max(0, base - (a.hintUsed ? HINT_PENALTY : 0));
}
```

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

---

## 6. Ketekalan & penyegerakan

**Tempatan dahulu.** Sesi ditulis ke IndexedDB serta-merta, kemudian dibaris gilir untuk sync.

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

**Peraturan keras:** hanya animasikan `transform` dan `opacity`. Tiada `width`, `height`,
`top`, `left`, `box-shadow`, atau `filter` yang dianimasikan pada laluan panas.
Untuk perubahan saiz, gunakan prop `layout` Framer Motion, bukan animasi `width`.

### 7.2 Variasi boleh guna semula — `motion/variants.ts`

```ts
/** Kad soalan masuk; anak-anaknya berperingkat */
export const questionCard = {
  hidden:  { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { ...spring.settle, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit:    { opacity: 0, y: -20, scale: 0.97, transition: { duration: duration.base, ease: ease.in } },
};

/** Setiap butang pilihan */
export const optionItem = {
  hidden:  { opacity: 0, y: 16, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring.pop },
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
| **Kad soalan masuk** | `opacity`, `y`, `scale` | `questionCard` | 0.22 s + 0.06 s berperingkat | `AnimatePresence mode="wait"` |
| **Jawapan betul** | `scale` denyut + cincin | `correctPulse` | 0.32 s | Gelang hijau berkembang keluar, `scale 0.8→1.6`, `opacity 0.6→0` |
| **Jawapan salah** | `x` goncang | `shake` | 0.34 s | **Tiada kilat merah penuh skrin.** Sempadan sahaja |
| **Pancingan muncul** | `opacity`, `height` | `layout` + `spring.settle` | 0.25 s | Guna prop `layout`, jangan animasi `height` secara manual |
| **Pilihan dilumpuhkan** | `opacity → 0.35`, `scale → 0.96` | tween, `ease.out` | 0.2 s | Berperingkat 0.05 s jika berbilang |
| **Bar kemajuan** | `scaleX` | `spring.settle` | ~0.4 s | `transformOrigin: left`. Jangan animasi `width` |
| **Anugerah bintang** | `scale 0→1.25→1`, `rotate -25→0` | `spring.cheer` | 0.45 s setiap satu | Berperingkat 0.18 s antara bintang |
| **Kiraan permata** | teks kira naik + `scale` denyut | tween 0.6 s | 0.6 s | Kira naik dengan `useMotionValue` + `animate()` |
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
- Gantikan semua pergerakan/skala dengan silang-pudar `opacity` 150 ms
- Matikan semua gelung `repeat: Infinity`
- Matikan zarah sepenuhnya
- **Kekalkan** perubahan warna dan ikon — maklum balas betul/salah masih perlu terbaca

### 7.6 Bajet prestasi

| Metrik | Sasaran | Diukur pada |
|---|---|---|
| Kadar bingkai animasi | ≥ 55 fps | Android pertengahan-rendah (cth. Redmi kelas RM600) |
| Masa ke soalan pertama boleh berinteraksi | < 1.5 s | 4G, cache panas |
| Aset setiap aktiviti | < 2 MB | Termasuk audio |
| Nod DOM setiap skrin kuiz | < 400 | Tidak termasuk zarah |

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
5. Menutup app di tengah aktiviti dan membuka semula memulihkan sesi daripada IndexedDB.
6. `prefers-reduced-motion: reduce` melumpuhkan semua gelung tak terhingga (disahkan dengan DevTools).
7. Kanak-kanak sebenar berumur 7 tahun menyiapkan satu aktiviti tanpa arahan lisan
   daripada orang dewasa. Ini adalah ujian yang paling penting dalam senarai ini.
