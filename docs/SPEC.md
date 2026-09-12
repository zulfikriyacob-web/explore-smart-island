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
    "document": "DSKP KSSR (Semakan) Matematik Tahun 1, Bahagian Pembangunan Kurikulum KPM, cetakan pertama Mei 2015",
    "contentStandards": ["1.2", "1.5", "1.6"],
    "learningStandards": ["1.2.1", "1.2.2", "1.5.1", "1.6.1"],
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

`contentStandards` ialah **jamak**. Satu pek topik meliputi satu tajuk DSKP, dan satu tajuk
memegang beberapa Standard Kandungan — pek matematik hari ini menyentuh 1.2, 1.5 dan 1.6.
Medan tunggal yang pernah ada di sini hanya boleh betul dengan menjadi kabur, dan ia memang
begitu: ia mengaku "1.1" untuk pek yang tidak mengandungi satu pun soalan 1.1.

Setiap SP mesti berada di bawah salah satu SK yang diisytiharkan — 1.2.2 di bawah 1.2 —
dan skema menguatkuasakannya. Ini semakan bentuk, bukan semakan kewujudan; untuk yang kedua
lihat §3.5.

`kssr.verified` bermula sebagai `false`. Ia menjadi `true` hanya selepas semakan guru
(PRD §15). Papan pemuka ibu bapa **tidak** memaparkan kod SP untuk pek yang belum disahkan.
**Kod yang sah bukan kod yang disahkan.** Katalog §3.5 membuktikan satu kod itu wujud dalam
dokumen; ia tidak membuktikan soalan itu mengajarnya. Hanya seorang guru boleh.

### 3.3 Skema Soalan asas

Setiap soalan berkongsi bentuk ini, kemudian menambah `payload` khusus jenis.

```ts
interface QuestionBase {
  id: string;                    // unik dalam pek
  type: QuestionType;
  difficulty: Difficulty;
  learningStandard?: string;     // cth "1.2.2"
  subSkill?: string;             // cth "1.2.2/after" — §5.7
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
  "learningStandard": "1.2.2",
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

**Had pancingan lawan jawapan didedah** — dikuatkuasakan dalam `validate:content`:

Pancingan dan jawapan didedah dilukis dalam **satu jalur** di bawah kad soalan (DESIGN §7).
Dua blok dalam satu jalur melimpahkannya pada telefon, dan yang terpotong ialah bantuan untuk
anak yang tersekat. Jadi satu soalan tidak boleh membawa pancingan **jika** ia boleh mencapai
percubaan ketiga **dan** akan melukis dedahan pada percubaan itu.

| Jenis | Boleh capai percubaan ketiga? | Melukis dedahan? | Kesan |
|---|---|---|---|
| `count-tap` | Sentiasa — butang hantar tidak pernah dilumpuhkan | Sentiasa — ia jatuh balik kepada `Jawapannya N.` walaupun tanpa `explain` | **Tidak boleh ada `hint` langsung** |
| `mcq`, `mcq-image` dengan ≤ 3 pilihan | Tidak — setiap salah melumpuhkan pilihan yang digunakan, jadi pilihan terakhir semestinya betul | — | `hint` dan `explain` kedua-duanya dibenarkan |
| `mcq-image` dengan ≥ 4 pilihan | Ya — tiga pilihan salah cukup untuk sampai ke sana | Ya, jika `explain` ditetapkan | **Tidak boleh ada kedua-dua** |

`mcq` terhad kepada 3 pilihan oleh skema, jadi ia tidak akan mencapai percubaan ketiga.
`mcq-image` **tiada had pilihan** — itu yang menjadikan barisan ketiga mungkin.

> Peraturan ini dikira daripada soalan, bukan daripada jenisnya sahaja. Menambah had pilihan
> kepada `mcq-image`, atau melumpuhkan butang hantar count-tap, akan mengubah apa yang
> dibenarkan — kemas kini jadual ini bersama-sama.

**Katalog DSKP — kod yang didakwa mesti wujud.** Dikuatkuasakan dalam `validate:content`.

Zod boleh menyemak *bentuk* satu kod (`1.2.2` lulus, `abc` gagal). Ia tidak boleh menyemak
sama ada kod itu ada dalam dokumen KPM, dan kod berbentuk betul tanpa rujukan ialah
kegagalan yang paling senyap dalam projek ini: ia berakhir dalam laporan ibu bapa sebagai
dakwaan kurikulum. Ia sudah berlaku — satu pek mengaku SK 1.1 dengan SP 1.1.1, 1.1.2 dan
1.1.3, sedangkan SK 1.1 mempunyai **satu** SP. Dua daripada tiga tidak wujud, dan tiada apa
menangkapnya.

`src/content/kssr/<subject>-y<year>.json` menyimpan salinan senarai SK/SP dokumen itu.
`validate:content` menyemak setiap `kssr.contentStandards`, setiap `kssr.learningStandards`
dan setiap `learningStandard` soalan terhadapnya:

| Keadaan | Kesan |
|---|---|
| Kod tiada dalam katalog | **Ralat** — gagal CI |
| Tiada katalog untuk subjek/tahun itu | **Amaran** — kod tidak disemak langsung. Ini jurang kami, bukan ralat pek |
| SP pek merentas lebih satu tajuk DSKP | **Amaran** — pek bertajuk untuk satu tajuk sahaja |
| `subSkill` tiada dalam fail kemahiran | **Ralat** — sub-kemahiran rekaan ialah kod rekaan, satu tingkat ke bawah |
| Fail kemahiran menamakan SP yang tiada dalam katalog, atau `source` yang tidak diisytiharkan | **Ralat** |
| SP diuji sebahagian sahaja | **Amaran** — mencetak `n of m sub-skills tested`, kerana itu yang menghalangnya daripada melaporkan *Dikuasai* (§5.7) |

Katalog hari ini: **matematik Tahun 1 sahaja.** Itu satu-satunya DSKP yang kami ada.

**Skrip masa bina** `npm run validate:content` menjalankan skema terhadap setiap fail
dalam `content/packs/` dan **gagal dalam CI** jika ada aset hilang, `correctOptionId`
tidak sepadan dengan mana-mana pilihan, atau satu kod DSKP tidak wujud. Ini menangkap ralat
kandungan sebelum sampai ke kanak-kanak.

### 3.6 Skrip yang menjana kerja untuk orang di luar repo

Dua skrip mengubah pek menjadi dokumen yang dipegang seseorang yang tidak akan membuka repo
ini. Kedua-duanya **mencetak ke stdout dan tidak menyimpan apa-apa**: jadual yang di-commit
menyimpang daripada pek pada suntingan kandungan pertama, dan salinan basi lebih buruk
daripada tiada salinan kerana ia kelihatan semasa.

| Skrip | Menjana | Untuk siapa |
|---|---|---|
| `npm run audio:script` | Skrip rakaman audio arahan — satu baris setiap fail, dengan ayat yang perlu dibaca dan keadaan fail dalam `public/` | Pelakon suara (§8) |
| `npm run kssr:review` | Borang semakan pemetaan KSSR — setiap soalan bersebelahan teks penuh SP yang didakwanya dan CATATAN DSKP, dengan satu soalan Ya/Tidak setiap satu | Guru yang menaikkan `kssr.verified` (§3.2, PRD §15) |

```
npm run audio:script > skrip-rakaman.md
npm run kssr:review  > semakan-guru.md
```

Kedua-duanya menghurai pek melalui skema §3.5 yang sama, jadi tiada satu pun boleh dibina
daripada pek yang rosak. `kssr:review` pergi lebih jauh dan **enggan** menjana borang yang
memetik kod DSKP yang tiada dalam katalog — bertanya kepada guru tentang kod yang kita reka
membuang masanya dan mengajarnya untuk tidak mempercayai baki borang itu.

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

### 5.7 Sub-kemahiran, liputan, dan tiga status

Satu bahagian, bukan tersebar. Hujah peneka, kedua-dua larangan, dan bentuk paparan hidup
bersama di sini dengan sengaja: **nombor yang dibiarkan sendirian akan berakhir di papan
pemuka.** 3.7% di bawah adalah tepat itu — angka yang, dipetik tanpa ayat di sebelahnya,
menjadi dakwaan tentang seorang anak yang ia tidak pernah buat.

**Satu Standard Pembelajaran bukan satu kemahiran.** SP 1.6.1 ialah *"nilai tempat **dan**
nilai digit"*, dan seorang guru memecahkannya kepada empat. Pek hari ini menguji **satu**.
§5.4 purata jawapan merentas SP; dengan itu, lima jawapan betul kepada soalan yang sama akan
melaporkan 1.6.1 sebagai dikuasai. Jadi bukti melekat pada **sub-kemahiran**, dan SP ialah
gulungan sub-kemahirannya.

Dua soalan berbeza, sengaja diasingkan:

| Soalan | Dijawab oleh |
|---|---|
| **Berapa baik** anak pada apa yang sudah ditanya? | Purata bergerak §5.4, `mastery.ts` |
| **Berapa banyak** SP itu app sebenarnya tanya? | Liputan, `lib/coverage.ts` |

#### Di mana sub-kemahiran hidup

`src/content/kssr/<subject>-y<year>.skills.json`, **berasingan** daripada katalog DSKP.
Katalog ialah apa yang dokumen kata, boleh disemak baris demi baris terhadap PDF. Fail
kemahiran ialah **pecahan** — hanya 4 daripada 56 SP membawa sub-titik yang DSKP sendiri
nomborkan. Mencampurkan kedua-duanya memusnahkan keupayaan membezakan transkripsi daripada
pertimbangan.

Setiap SP mengisytiharkan asal pecahannya:

| Asal | Maksud |
|---|---|
| `dskp-detail` | DSKP menomborkannya sendiri. Senarai tertutup |
| `dskp-sentence` | Ayat SP menamakannya, DSKP tidak menomborkannya. Bacaan kita |
| `dskp-catatan` | CATATAN memperincikannya. Perkataan dokumen, bukan sub-titik rasmi |
| `editorial` | Keputusan reka bentuk app. DSKP tidak memecahkannya |

Soalan membawa `subSkill: "<SP>/<id>"` di samping `learningStandard`, yang dikekalkan — itu
yang papan pemuka namakan dan yang guru tandatangan.

#### Tiga status

Ditetapkan oleh guru yang menyemak pemetaan. **Tiga, bukan empat.**

```
Belum diuji  ->  Sedang dinilai  ->  Dikuasai
                        ^                |
                        +----------------+
                         kesilapan baharu
```

| Status | Bila |
|---|---|
| **Belum diuji** | App tidak pernah bertanya. Kenyataan tentang **kita**, bukan tentang anak |
| **Sedang dinilai** | Ditanya, bukti belum cukup — atau pernah cukup dan jawapan terakhir salah |
| **Dikuasai** | Ambang di bawah dipenuhi, dan jawapan terakhir betul |

Versi terdahulu bahagian ini membawa empat, dengan *Hampir menguasai* di antara. Guru
menolaknya: sistem status mudah sudah memadai, dan kerja yang label keempat itu buat
dilakukan dengan lebih baik oleh baris liputan di bawah — yang **menamakan** kemahiran, bukan
sekadar mengira.

#### Ambang: 3 soalan berbeza, percubaan pertama, merentas 2 sesi

**Tiga, kerana inilah kos tekaan.** `mcq` terhad kepada tiga pilihan (§3.4), jadi anak yang
meneka membuta betul satu daripada tiga kali:

| Bukti | Kadar tersalah label seorang peneka |
|---|---|
| 1 soalan | **33%** |
| 2 soalan | 11% |
| **3 soalan** | **3.7%** |

3.7% ialah nilai pertama di bawah satu daripada dua puluh. `count-tap` dan `mcq-image` yang
lebih luas kedua-duanya lebih sukar diteka, jadi tiga disaiz mengikut soalan **paling mudah**
dalam pek, bukan yang purata.

> ### LARANGAN 1 — 3.7% bukan keyakinan
>
> **Jangan sekali-kali memaparkan 3.7% sebagai keyakinan.** Ayat *"97% pasti anak menguasai
> kemahiran ini"* tidak boleh ditulis, di mana-mana, kepada sesiapa.
>
> 3.7% ialah peluang **tiga tekaan rawak semuanya betul**, di bawah satu andaian tentang satu
> jenis soalan. Ia bukan kebarangkalian bahawa seorang anak menguasai sesuatu. Kedua-duanya
> tidak berkaitan: seorang anak yang benar-benar tahu tidak meneka langsung, dan seorang anak
> yang keliru secara sistematik boleh salah 100% daripada masa tanpa pernah meneka.
>
> Nombor itu ialah **alasan reka bentuk dalaman** untuk memilih tiga dan bukan dua. Itu
> keseluruhan kerjanya. Ia hidup dalam SPEC dan dalam komen `coverage.ts`; ia tidak pernah
> keluar ke UI.

**Soalan berbeza, bukan jawapan berbeza.** Soalan yang sama dijawab tiga kali ialah satu
nombor dihafal. Bukti dikira mengikut `questionId` berbeza.

> **Belum mencukupi, dan diketahui.** Guru menetapkan bahawa tiga soalan itu mesti berbeza
> **bentuk**, bukan sekadar berbeza nombor — tiga soalan berbentuk sama mengukur hafalan
> bentuk. Hari ini enjin hanya boleh menuntut tiga `questionId` berbeza, jadi ambang ini
> lebih longgar daripada yang guru minta.
>
**Dan ditanya dalam dua cara berbeza: `promptForm` mesti berbeza.**

Tiga id boleh menjadi satu soalan ditanya tiga kali dengan nombor ditukar. Paksi yang dikira
ialah `promptForm` — `direct`, `reverse`, `contextual` — dan hanya itu:

| Paksi | Dikira? | Sebab |
|---|---|---|
| `promptForm` | **Ya** | Arah pemikiran berubah. Anak yang boleh `direct` tetapi tidak `reverse` belum faham sepenuhnya |
| `responseMode` | Tidak | Di mana ia benar-benar menguji perkara lain, **senarai sub-kemahiran sudah memisahkannya** — mengetuk untuk membilang lawan memilih nombor ialah dua sub-kemahiran. Mengiranya lagi mengira satu pembezaan dua kali pada dua tingkat. Di mana ia tidak, bezanya pada mekanik menjawab: kotak input untuk anak Tahun 1 mengukur menaip sebanyak matematik |
| `representation` | Tidak | Ia mengubah **kesukaran**, bukan arah pemikiran, dan kesukaran sudah ada medannya (`difficulty`, §5.5). Dua medan mengukur benda sama bermakna satu akan menyimpang |
| `wordingVariant` | Tidak | Itu sebab ia diasingkan |

> **Tambahan kepada ambang soalan, bukan ganti.** Dua bar mengukur risiko berbeza: tiga soalan
> ialah yang menjadikan peneka tidak mungkin (3.7%), dua bentuk ialah yang menjadikan ayat
> terhafal tidak mungkin. Menukar yang pertama dengan yang kedua membawa kadar peneka kembali
> ke **11%** — satu anak daripada sembilan — dan itu bukan tugas syarat bentuk.

**Pengecualian: sub-kemahiran yang hanya menyokong satu bentuk.** Disenaraikan dengan sebabnya
dalam `<subject>-y<year>.skills.json`, dan **ditanda belum disemak guru**. Yang dikecualikan
kekal pada tiga `questionId` berbeza sahaja. Alasannya sama seperti yang menjatuhkan peraturan
tiga-bentuk: **bar yang tiada siapa boleh lepasi tidak memberitahu ibu bapa apa-apa.**

Yang mengecilkan senarai itu kepada sepuluh entri ialah satu peraturan: apabila `reverse` bagi
satu sub-kemahiran ialah sub-kemahiran **sebelah** dalam senarai yang sama, `reverse` bukan
tidak wujud — buktinya cuma milik yang sebelah. `reverse` bagi *before* ialah *after*; bagi
*count_objects* ialah *number_to_quantity*. Sub-kemahiran begitu masih ada `direct` dan
`contextual`, jadi ia tidak dikecualikan. Yang tinggal ialah sepuluh sub-kemahiran membilang
1.5.1, di mana `contextual` menjadikannya masalah berayat yang anak mesti **baca** sebelum dia
boleh membilang.

> **Perbendaharaan lima nama sudah mati.** `direct`, `inverted`, `select`, `story`, `visual`
> ditolak guru kerana ia mencampurkan tiga perkara berbeza. Tiga paksi menggantikannya
> (docs/kssr/guru-struktur-variasi-soalan.md), dan pembetulannya pada `reverse` menjatuhkan
> contohnya sendiri: *"Apakah nilai digit 6 dalam 63?"* dan *"Dalam 63, digit 6 bernilai
> berapa?"* kedua-duanya `direct`.

**Percubaan pertama sahaja.** Ketepatan sudah mengukur kualiti percubaan pertama (§5.2), dan
percubaan kedua berlaku selepas satu pilihan salah dilumpuhkan — pada mcq tiga pilihan, tekaan
kedua ialah satu daripada dua.

**Sekurang-kurangnya dua sesi.** Tiga jawapan betul dalam satu duduk boleh bersandar pada satu
detik kefahaman yang sama, atau pada jawapan yang didedahkan dua soalan sebelumnya (§4.2).

**Jawapan terakhir salah menurunkan semula kepada *Sedang dinilai*.** Status ialah dakwaan
tentang sekarang.

#### `masteredOnce` — turun tanpa memadam

Dua medan, bukan satu:

```
masteredOnce:  true          // ambang pernah dipenuhi
currentStatus: 'evaluating'  // dan jawapan terakhir salah
```

Murid Tahun 1 tersalah tekan, penat, tergesa-gesa. App patut peka kepada kemerosotan **tanpa
memadam pembelajaran sebelumnya**: anak yang pernah sampai dan tergelincir berada di tempat
berbeza daripada anak yang tidak pernah sampai, dan memadam beza itu membuang separuh yang
lebih berguna.

**`masteredOnce` ialah data, bukan paparan.** Ibu bapa tetap nampak tiga status. Ia mengubah
**dua** perkara, kedua-duanya diluluskan, dan tiada satu pun daripadanya label baharu:

**1. Ayat sokongan di bawah status.** Teks yang diluluskan, verbatim:

```
Sedang dinilai — sudah pernah tunjuk kemahiran ini;
                 app sedang semak semula
```

Perkataannya ialah keseluruhan keputusan. Dua calon terdahulu ditolak dan sebabnya patut
kekal di sini, kerana ayat ini akan ditulis semula suatu hari oleh seseorang yang tidak
tahu apa yang sudah cuba:

| Calon | Kenapa ditolak |
|---|---|
| "belum cukup bukti" | Betul, dan membuang maklumat: ia sama bagi anak yang tidak pernah sampai |
| "pernah dikuasai, sedang disemak semula" | Masih berbunyi seperti **audit**. Pasif, dan anak tiada dalam ayat |

Yang diluluskan meletakkan **anak sebagai subjek separuh pertama** — *sudah pernah tunjuk
kemahiran ini* — dan **app sebagai subjek separuh kedua** — *app sedang semak semula*. Tiada
apa yang hilang; app yang sedang bekerja. Itu bezanya antara laporan dan notis penurunan
pangkat.

> **Belum dikunci.** Ayat ini akan diuji pada seorang ibu bapa sebenar sebelum ia dihantar.
> Sehingga itu ia teks yang diluluskan, bukan teks yang disahkan.

**2. Susunan "Fokus minggu ini"** (PRD §11). Kemahiran yang tergelincir mendahului kemahiran
yang belum pernah dimulakan, kerana ia lebih dekat untuk dipulihkan. `standardCoverage()`
memulangkan `slippedIds` untuk kedua-dua keputusan ini.

#### Gulungan SP

- **Dikuasai** hanya apabila **setiap** sub-kemahiran dikuasai. Bukan purata, bukan majoriti.
  1.6.1 tidak boleh membaca *Dikuasai* selagi app tidak pernah bertanya tentang nilai digit.
- **Sedang dinilai** apabila sekurang-kurangnya satu sub-kemahiran diuji tetapi belum semua
  dikuasai.
- **Belum diuji** apabila tiada satu pun diuji.

Akibatnya SP tidak boleh dilaporkan dikuasai selagi kandungan untuk mengujinya belum wujud.
Dengan pek hari ini, **tiada satu pun daripada enam SP boleh mencapai Dikuasai**;
`validate:content` mencetaknya setiap binaan.

#### Bentuk paparan liputan

> ### LARANGAN 2 — liputan bukan penguasaan
>
> **"1 daripada 6 diuji" tidak boleh dipaparkan sebagai "17% dikuasai".** Lima kemahiran lain
> **belum diuji**; anak tidak gagal lima kemahiran. Nisbah itu mengukur apa yang **app**
> sudah tanya, bukan apa yang anak boleh buat.
>
> `StandardCoverage.coverage` ialah `tested / total` dan tidak pernah skor. Apa-apa yang
> merendernya sebagai peratusan penguasaan ialah pepijat.

Dan nisbah sendirian pun tidak memadai — ia memberitahu ibu bapa terlalu sedikit. Bentuk yang
guru berikan, dan yang ini ikut:

```
Liputan kemahiran: 1/6 diuji
Kemahiran yang sudah diuji: Tambah gandaan 10
Kemahiran lain belum dinilai.
```

**Namakan kemahiran yang sudah diuji.** "1/6" memberitahu ibu bapa bahawa ada lima perkara
lain; namanya memberitahu mereka apa yang anak sebenarnya **ditanya**, dan itu yang boleh
ditindaklanjuti. `standardCoverage()` memulangkan `testedIds` dan `untestedIds` dalam susunan
fail kemahiran atas sebab ini; lapisan paparan menukar id kepada label.

Ayat ketiga melekatkan baki kepada kita: *"Kemahiran lain belum dinilai"* — bukan apa-apa yang
berbunyi seperti jurang anak. §15 menyenaraikan hilang kepercayaan ibu bapa sebagai risiko,
dan baris yang menyalahkan anak untuk kandungan yang kami belum tulis ialah jalan terpantas ke
situ.

#### Yang tidak dibina

`lib/coverage.ts` tulen: tiada jam, tiada katalog, tiada storan. Pemanggil himpunkan bukti dan
menghulurkannya, disiplin sama seperti `updateStreak(s, todayISO)`.

> `mastery.ts` **tidak disentuh**. `masteryLabel()` tiga-labelnya bukan tiga status ini —
> namanya berbeza dan peraturannya berbeza — dan ia patut ditarik balik apabila stor kemajuan
> mendarat. Ia tidak mempunyai pemanggil produksi hari ini.

**Tiada skor keyakinan.** Pembezaan antara bukti penguasaan dan keyakinan semasa itu betul,
tetapi skor yang tidak dipaparkan ialah kerja tanpa pengguna. `masteredOnce` menanggung
perbezaan itu dengan satu boolean, dan itu memadai sehingga ada skrin yang memerlukan lebih.

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

### Stor kemajuan — `esi.progress.v1`, bentuknya diputuskan, belum dibina

**Tiada data penguasaan wujud hari ini pada mana-mana peranti.** `mastery.ts` tiada pemanggil
produksi; satu-satunya kunci yang app tulis ialah `esi.session.v1`, iaitu sesi dalam terbang.
Itu menjadikan bentuk kunci percuma untuk dipilih **sekarang**. Selepas stor kemajuan dihantar,
perubahan yang sama berharga satu migrasi.

Empat peraturan, diputuskan lebih awal supaya ia tidak diputuskan tergesa-gesa kemudian:

1. **Kunci berversi sendiri, `esi.progress.v1`**, berasingan daripada kunci sesi. Sesi dibuang
   apabila aktiviti tamat; kemajuan tidak.
2. **Simpan bukti per id sub-kemahiran sahaja. Jangan sekali-kali simpan nombor peringkat SP.**
   Gulungan §5.7 dikira semasa baca. Gulungan yang disimpan menjadi basi saat senarai
   sub-kemahiran berubah — dan ia akan berubah: guru membetulkan pemetaan kami tiga daripada
   sepuluh kali pada pusingan pertama.
3. **Id yang hilang daripada senarai diabaikan semasa baca, tidak dipadam.** Kalau id kembali —
   dan pembetulan guru boleh diterbalikkan — buktinya kembali bersamanya. Memadam ialah
   kehilangan data untuk keputusan yang belum muktamad.
4. **Rekod sub-kemahiran pada masa pemarkahan daripada pek hidup, bukan daripada sesi beku.**
   Sesi tersimpan membekukan soalan (PRD §16 soalan 6), jadi salinan beku membawa `subSkill`
   lama kalau pek berubah di tengah sesi.

Preseden tingkah laku sudah ada: `loadSession` menolak blob rosak dan tidak pernah menghalang
app daripada bermula. Stor kemajuan mengambil pendirian yang sama.

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
| **Pancingan meluncur masuk** | `y: -8 → 0` sahaja | `hintItem` | 0.22 s | Legap penuh sepanjang masa. Dilukis dalam jalur **di luar** kad soalan, jadi kad tidak tumbuh langsung (DESIGN §7). **Bukan prop `layout`**, bukan animasi `height` |
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

  **Sesi yang dipulihkan tidak melihat butang "Mula".** Ia kembali pada `question`, jadi
  gerbang gerak isyarat menerima **ketukan pertama di mana-mana** sebagai ganti. Ketukan itu
  membuka kunci tetapi **tidak** memainkan soalan yang sudah ada di skrin: selepas menyambung
  semula, ketukan pertama selalunya jawapan, dan membacakan soalan selepas ia dijawab lebih
  buruk daripada senyap. Soalan **seterusnya** bermain sendiri seperti biasa. (PRD §16.8)

  **"Main lagi" juga tidak melihatnya.** Ulangan menghantar `START` serta-merta dan membuka
  soalan pertama. Audio sudah dibuka kunci jauh sebelum butang itu boleh ditekan, jadi skrin
  mula tiada tugas yang tinggal di situ — ia hanya akan menjadi satu ketukan tambahan antara
  anak yang baru sahaja minta bermain dan permainan itu.

  Skrin mula muncul pada **satu keadaan sahaja**: permulaan sejuk tanpa sesi tersimpan. Itu
  satu-satunya masa gerak isyarat itu belum wujud.

  Main automatik dan butang ulang berkongsi satu pemanggil pemain, jadi menekan butang semasa
  audio automatik sedang berjalan **menggantikan** klip itu, bukan menindihnya — satu klip
  boleh didengar pada satu masa, tidak pernah dua.
### Buka kunci audio iOS — enam peraturan, semuanya diperoleh dengan susah payah

Bunyi tidak keluar langsung pada iPhone selama empat pusingan, dengan empat punca berlainan.
Ini yang tinggal selepas semuanya. **Jangan pinda tanpa mengukur pada iPhone sebenar** — mesin
pembangunan dan Browser pane kedua-duanya melaporkan `navigator.vendor` bukan-Apple dan
membenarkan audio bermula tanpa gerak isyarat dipercayai, jadi laluan ini tidak pernah
dijalankan di sana. Semua nombor di bawah datang daripada peranti.

**1. Jangan keluarkan `resume()` sendiri.** Howler yang mengendalikannya, dan laluannya —
buffer senyap `start(0)` **dahulu**, kemudian `ctx.resume()` — yang berfungsi pada iOS.
`resume()` telanjang kita bukan sahaja berlebihan; ia **menghalang** laluan yang teruji.
Selepas ia dibuang, setiap resume dalam log datang daripada `unlock@howler` dan bunyi keluar
pada ketukan pertama.

**2. Senjatakan Howler dengan satu Howl sebelum gerak isyarat pertama.** `_unlockAudio()`
mendaftar pendengarnya hanya dari dalam `Howl.init`, dan hanya kalau context sudah wujud.
Permulaan sejuk tidak membina Howl sehingga skrin soalan dipasang — 32 ms **selepas** ketukan
Mula — jadi pendengar itu didaftar lewat dan ketukan pertama senyap.

Howl senjata itu **bukan cache**: `_unlockAudio` memanggil `Howler.unload()` apabila
`sampleRate !== 44100` (48000 pada iPhone), dan Howl yang di-`unload` masih menjawab `play()`
dengan id bunyi sambil tidak berbunyi. Jangan prapuat melaluinya.

**3. `Howler.autoSuspend = false`.** Ia menggantung context sendiri selepas 30 saat tanpa
bunyi, dan pada iOS itu muncul sebagai `ctx.state === 'interrupted'`. App dengan skrin mula
dan masa berfikir kena tingkap itu sebagai perkara biasa — diukur `interrupted` pada 54 saat,
sebelum satu klip pun dimainkan. **Kita menggantung audio kita sendiri semasa menunggu.**

**4. `resume()` pada iOS boleh tergantung berbilang saat, dan selesai hanya pada gerak isyarat
kemudian.** Ia tidak ditolak dan tidak gagal — ia tidak selesai. Diukur, `afterMs` merentas
ketukan berturutan: **2577 → 1422 → 318 → 42**. Setiap gerak isyarat membawa Safari lebih
dekat. **Jangan jangka ia selesai tepat pada masa**, dan jangan andaikan gerak isyarat
bermakna audio sedia.

**5. `Howl.play()` pada context tergantung memarkir main balik dan memulangkan id bunyi.**
Ia **tidak boleh dibatalkan**:

```js
// howler.js 2.2.4, baris 886
if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
  playWebAudio();
} else {
  self._playLock = true;
  self.once('resume', playWebAudio);   // diparkir, selama-lamanya kalau perlu
}
```

Main terparkir dilepaskan bila-bila context kembali — yang mungkin selepas anak sudah
menjawab dan pergi. Sebab itu autoplay **menunggu** di pihak kita dan tidak pernah memanggil
`play()` pada context yang tidak berjalan: gerbangnya `ctx.state === 'running'`, menunggu pada
`statechange`, dan ditarik balik sebaik anak melibatkan diri.

> **Gerbang mana.** `Howler._audioUnlocked` ialah bukti paling jujur bahawa audio benar-benar
> berbunyi — ia ditetapkan daripada `source.onended` pada buffer senyap. Ia **bukan** gerbang
> kerana tiada apa menyala apabila ia bertukar, jadi menunggu padanya boleh terkandas, dan
> pada peranti ia menjadi `true` sesaat **selepas** context mula berjalan. `ctx.state` ada
> peristiwa, menentukan kebolehdengaran sekarang, dan menjadi `false` semula pada gangguan.

**6. Satu kawalan tidak boleh menanggalkan dirinya di dalam gerak isyarat yang perlu sampai
kepada Howler.** Peristiwa yang dihantar pada nod yang sudah tertanggal tidak merambat, jadi ia
tidak pernah sampai ke `document` — dan di situ sahaja Howler mendaftar pembuka kuncinya, dalam
fasa capture, untuk `touchstart`, `touchend`, `click` dan `keydown`, dan **bukan** untuk
sebarang peristiwa pointer (`howler.js` 2.2.4, baris 409-412).

Butang Mula mengendalikan `pointerdown`, menghantar `START`, dan React 18 membuang pemasangan
skrin mula dalam satu mikrotugas — sebelum pelayar sempat menghantar `touchstart`. Diukur pada
butang itu: `isConnected === false` selepas pembuangan itu, dan **tiada satu pun** daripada
empat peristiwa itu sampai ke `document`. `click` tidak dihantar langsung, kerana click
memerlukan sasaran yang masih ada dalam pokok DOM. Gerak isyarat pertama sesi hilang, context
tidak pernah dibuka kunci, dan tekanan Mula pada permulaan sejuk senyap.

Jadi skrin mula kekal terpasang sehingga gerak isyarat yang menekannya tamat — ia bertukar pada
`click`, peristiwa terakhir satu ketukan, dengan pemasa 1000 ms sebagai sandaran untuk jari yang
tergelincir keluar. `START` tetap keluar pada `pointerdown`: kependaman tekanan itu sebabnya ia
di situ. **Ini perubahan susun atur, bukan perubahan masa** — tiada apa di sini menunggu janji,
bingkai atau jam untuk menentukan apa yang anak lihat.

Ini semantik DOM, bukan kerenah iOS; ia berlaku di mana-mana. iOS sahaja tempat ia berharga,
kerana iOS yang menuntut gerak isyarat dipercayai — pada komputer riba context sudah berjalan,
jadi gerak isyarat yang hilang tidak berkos apa-apa dan pepijat ini kelihatan sempurna di sana
melalui tiga sesi. Peraturannya am: mana-mana butang yang mengendalikan tekanan **dan**
mengeluarkan dirinya mempunyai kecacatan ini, sama ada audio terlibat atau tidak.

### Klip TTS tiba dengan tag ID3 — buang sebelum commit

**Alat TTS sentiasa menambah tag ID3v2.4 sebanyak 16,648 bait di hadapan setiap fail.**
Sepuluh rakaman BM yang pertama membawanya; ia dibuang sebelum ia sampai ke repo. Empat klip
gelombang kedua membawanya juga, dengan saiz tag yang sama tepat. Ini akan berulang setiap
kali rakaman baharu masuk, jadi ia langkah tetap, bukan kejadian.

Ia **tidak** memecahkan apa-apa — pelayar main fail bertag dengan baik. Yang ia kos ialah
saiz dan ketekalan: 16,648 bait setiap klip, dan empat klip ialah 66,592 bait, iaitu 8%
daripada keseluruhan audio aktiviti. Belanjawan §7.6 longgar hari ini; ia tidak akan kekal
longgar apabila trek EN masuk.

**Langkah:** jatuhkan `n` bait pertama, dengan `n` diambil daripada pengepala tag itu
sendiri — 10 bait, campur saiz syncsafe dalam bait 6–9, campur 10 lagi kalau bendera footer
(bit 4 bait 5) ditetapkan. Jangan andaikan 16,648; sahkan.

**Sahkan selepas membuang, tiga perkara, semuanya daripada bait:**

| Semakan | Lulus bermaksud |
|---|---|
| Bait pertama | `ff fb …` — sync bingkai. Sepadan dengan klip yang sudah bersih |
| Kiraan bingkai dan tempoh | **Tidak berubah** daripada sebelum. Kalau ia berubah, potongan masuk ke dalam audio |
| Bait ekor selepas bingkai terakhir | `0` |

Semakan paling jujur ialah penyahkod pelayar, bukan penghurai kita sendiri: `fetch` fail itu
dan `decodeAudioData` ia, kemudian bandingkan `duration`. Pengepala boleh berbohong; penyahkod
yang memutuskan sama ada anak mendengar sesuatu.

Panjang tag yang diisytiharkan mesti mendarat **tepat** pada bingkai sah pertama. Kalau
kedua-duanya tidak sepadan, fail itu bukan apa yang anda sangka — berhenti, jangan potong.

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

### Ikon + gerakan + bunyi memberi pembaca skrin sifar

Tiga saluran di atas ialah tiga saluran **visual dan audio**. Diukur pada halaman berjalan:
ikon ✓/✕ duduk dalam slot `aria-hidden`, gerakan tidak wujud bagi pembaca skrin, dan bunyi
ialah nada marimba tanpa padanan teks. Jawapan salah mengumumkan **pancingan sahaja**; jawapan
betul mengumumkan **tiada apa-apa**. "Salah" boleh disimpulkan secara tidak sengaja daripada
bantuan yang tiba; "betul" senyap sepenuhnya.

Jadi kawasan `aria-live` membawa **verdict**, bukan hanya bantuan:

| | BM | EN |
|---|---|---|
| Betul | `Betul!` | `Correct!` |
| Salah | `Belum betul. Cuba lagi.` | `Not yet. Try again.` |

**Nadanya terikat.** Bukan "Salah!". DESIGN §9 menjadikan bunyi jawapan salah satu nada lembut
menurun dan **bukan** buzzer; ayat ini ialah apa yang anak dengar **menggantikan** nada itu, dan
ia mesti membawa kelembutan yang sama. Kita tidak menghukum pada skrin dan tidak mendapat hak
menghukum dalam audio.

> **Jangan guna `aria-label` sebagai saluran pengumuman.** Menukar label butang apabila jawapan
> disemak nampak berfungsi dalam ujian dan **senyap pada peranti sebenar**: banyak pembaca skrin
> tidak membacakan semula label yang berubah semasa fokus sudah berada padanya.
>
> Itu kelas kegagalan yang repo ini sudah bayar mahal — geometri betul sambil piksel kosong
> (CLAUDE.md prinsip 5), `playing() === true` atas context tergantung. Ujian bersetuju dengan
> kita; peranti tidak. Pengumuman ialah kerja kawasan `aria-live`; label ialah tempat keadaan
> **dibaca semula** oleh seseorang yang menyemak senarai, bukan tempat ia diumumkan.

### `aria-disabled`, bukan `disabled`, pada butang jawapan

Butang `disabled` asli keluar daripada susunan tab — dan ia keluar **semasa fokus masih
padanya**. Diukur: jawapan betul memindahkan fokus daripada butang yang anak baru tekan ke
`BODY`, jadi pengguna papan kekunci terpaksa menavigasi semula dari atas dokumen untuk mencapai
"Seterusnya".

Pengendali tekan sudah pulang awal apabila butang terkunci, jadi tindakan disekat tanpa atribut
asli itu. `aria-disabled` mengekalkan butang di tempat anak meninggalkannya dan tetap
mengumumkan keadaannya.

**Membaiki kehilangan fokus tanpa memindahkan fokus.** Memindahkannya ke "Seterusnya" akan
merampas kawalan daripada seseorang yang tidak memintanya.

### Papan kekunci: `click` dengan `detail === 0`

Butang blok mengendali `pointerdown` untuk kependaman tekanan, dan papan kekunci tidak pernah
menghasilkan satu. Tanpa laluan kedua, butang boleh difokus, melukis cincin 3px, dan **tidak
melakukan apa-apa** — janji yang tidak wujud, dan itu lebih teruk daripada tiada cincin.

`detail === 0` memisahkan kedua-dua laluan: click daripada Enter, Space, atau teknologi bantuan
tidak membawa kiraan click; click daripada tetikus atau jari membawa sekurang-kurangnya satu dan
sudah dikendalikan oleh `pointerdown`. Tanpa penjaga itu satu ketukan akan mencetuskan
kedua-duanya.

**Laluan papan kekunci tidak menggunakan pegangan gerak isyarat §8 peraturan 6, dan itu bukan
terlupa.** Susunan peristiwanya bertentangan:

```
pointer:  pointerdown (kita bertindak, nod tanggal)  ->  touchstart (terlewat)
papan kekunci: keydown (Howler buka kunci)           ->  click (kita bertindak)
```

Howler mendengar `keydown` antara empat peristiwa pembuka kuncinya, jadi pada laluan papan
kekunci pembukaan kunci sudah berlaku sebelum click itu wujud. Memegang skrin di situ bukan
sahaja tidak berguna — pendengar pelepas dipasang oleh satu effect yang berjalan **selepas**
render, jadi ia tidak wujud semasa click itu, dan skrin mula akan berlengah sehingga pemasa
1000 ms.

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
