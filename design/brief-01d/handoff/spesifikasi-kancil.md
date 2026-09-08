# Spesifikasi gerakan kancil

Dilaksana sebagai `src/components/ui/Kancil.tsx` — SVG berlapis + Framer Motion.
Geometri: `kancil-layered.svg`, viewBox 1254 · 60 fps.
Rujukan: SPEC.md §11 (kontrak keadaan), DESIGN.md §6–7.

> **Rive ditinggalkan.** Eksport `.riv` berbayar, dan Framer Motion sudah memandu setiap
> animasi lain dalam app. Kontrak keadaan §1 dikekalkan sebagaimana adanya — ia kini
> dipandu oleh prop `state` dan bukan oleh input state machine. Bahagian yang bercakap
> tentang artboard, lapisan Rive dan blend masih berguna sebagai niat gerakan;
> mekanismenya sahaja yang berubah.
>
> SPEC.md §11 masih menerangkan kontrak Rive dan belum dikemas kini.

**Anjakan px dalam §3 ditulis untuk artboard 512.** Komponen mendarabkannya dengan
1254/512 = 2.449 supaya gerakan kekal pada saiz berkadar yang sama; putaran dan skala
tidak berunit dan tidak disentuh.

## 1. Input (tepat, case-sensitive — dari SPEC.md §11, tiada tambahan)

| Input      | Jenis   | Peranan dalam KancilSM |
|------------|---------|------------------------|
| isCorrect  | Trigger | Lapisan Reaksi: KOSONG → GEMBIRA |
| isWrong    | Trigger | Lapisan Reaksi: KOSONG → SIMPATI |
| celebrate  | Trigger | Lapisan Reaksi: KOSONG → RAYA (skrin ringkasan 3 bintang sahaja) |
| mood       | Number  | 0 melahu · 1 fikir · 2 gembira · 3 simpati. Lapisan Mood membaca 0/1 sahaja; 2/3 diset kod semasa reaksi dan dilayan seperti 0. |
| isThinking | Boolean | Lapisan Mood: MELAHU ⇄ FIKIR |

## 2. Struktur: dua lapisan, bermain serentak (campuran aditif)

Lapisan Mood   : MELAHU (gelung) · FIKIR (gelung)
Lapisan Reaksi : KOSONG (tiada keyframe) · GEMBIRA · SIMPATI · RAYA (masing-masing sekali)

KOSONG tiada keyframe supaya nafas lapisan Mood terus kelihatan semasa tiada reaksi.

## 3. Keadaan

### MELAHU — mood 0 · gelung 180 bingkai (3.0 s) · ping-pong · easeInOut
- Badan: skala Y 100→103 %, X 100→101.5 %, pangsi bawah-tengah.
- Kepala: Y 0→−2 px, lewat 6 bingkai daripada badan.
- Telinga: putar 0→−3°, pangsi pangkal; telinga kanan beza fasa 90 bingkai.
- Mata: kedip dalam gelung berasingan 252 bingkai (4.2 s) — kelopak turun 4 bingkai, naik 5. Tempoh 3.0 & 4.2 tidak berkongsi faktor supaya corak tidak berulang setiap kitaran.
- Kaki, ekor, hidung pegun. Amplitud maksimum 3 px / 3°. Ditonton beratus kali: jika ia menarik mata, kurangkan lagi.

### FIKIR — mood 1, isThinking true · masuk 18 bingkai (0.3 s) easeOut (0.16, 1, 0.3, 1), kemudian gelung
- Kepala: putar −8° ke arah soalan (atas skrin), Y −2 px, kekal. Tiada bob.
- Badan: nafas separuh amplitud (Y 101.2 %, X 100.6 %), tempoh 3.0 s.
- Telinga: pegun.
- Mata: kedip setiap 360 bingkai (6 s). Anak mata anjak 1.5 px ke arah soalan jika lapisan anak-mata ada.
- Mesti selesa ditonton 30 s tanpa apa-apa berubah. Anak sedang membaca.

### GEMBIRA — mood 2, isCorrect · 48 bingkai (0.8 s) · sekali · backOut (0.34, 1.56, 0.64, 1)
- Seluruh badan (kumpulan induk):
  0–9   mencangkung: Y +4 px, skala X 104 % Y 96 %
  9–22  lompat: Y −30 px, X 98 % Y 104 %
  22–35 mendarat: Y 0, X 103 % Y 97 %
  35–41 lantunan −5 px · 41–48 rehat
- Telinga: 0–10 naik (kiri −22°, kanan +18°) · tahan hingga 31 · kembali 0° pada 48.
- Mata: 10–17 picing (skala Y 35 %) · tahan hingga 34 · buka pada 48.
- Kepala ikut badan, tidak diputar berasingan. Satu lompat sahaja.

### SIMPATI — mood 3, isWrong · 96 bingkai (1.6 s) · sekali · easeOut masuk, easeInOut keluar
- Kepala: 0–15 putar +12° (senget ke arah anak, pangsi leher) · tahan 15–77 · 77–96 kembali 0°.
- Telinga: 0–15 putar +8° mengikut kepala (bukan layu). Kembali bersama kepala.
- Mata: satu kedip perlahan pada bingkai 27–35. Buka penuh sebelum dan selepas.
- Badan: nafas MELAHU diteruskan tanpa perubahan.
- JANGAN: turunkan kepala (Y), bongkokkan badan, kecilkan mata > 1 kedip, jatuhkan telinga > 8°. Setiap satu membaca sebagai "kecewa". Nada: "tak apa, cuba lagi."

### RAYA — celebrate · 96 bingkai (1.6 s) · sekali · backOut
- Dua lompat GEMBIRA berturut (0–30, 30–60, tinggi −28 px) + lantunan kecil 60–75.
- Telinga bergoyang −16°/+14° setiap 8 bingkai, reda 70–96. Mata picing 10–70.
- Hanya pada skrin ringkasan ⭐⭐⭐ bersama E2 confetti. Tidak pernah dalam sesi soalan.

## 4. Peralihan

| Peralihan                          | Syarat              | Blend |
|------------------------------------|---------------------|-------|
| MELAHU → FIKIR                     | isThinking = true   | 18 bingkai (0.3 s) easeOut |
| FIKIR → MELAHU                     | isThinking = false  | 18 bingkai (0.3 s) easeOut |
| KOSONG → GEMBIRA                   | isCorrect           | 0 — potong terus; maklum balas serta-merta dengan bunyi `correct` |
| KOSONG → SIMPATI                   | isWrong             | 6 bingkai (0.1 s) |
| KOSONG → RAYA                      | celebrate           | 0 |
| GEMBIRA / SIMPATI / RAYA → KOSONG  | exit time 100 %     | 12 bingkai (0.2 s); kod set mood kembali 0/1 pada masa sama |
| Trigger baharu semasa reaksi       | mana-mana trigger   | Mula semula dari bingkai 0 (peralihan ke diri sendiri, blend 0). Jangan beratur. |

prefers-reduced-motion: dikawal kod, bukan Rive — hentikan state machine, papar bingkai 0 MELAHU. Betul/salah kekal disampaikan oleh ikon + bunyi (DESIGN §7.5).

## 5. Lapisan dan pangsi — geometri 1254

Geometri yang dilaksana ialah `kancil-layered.svg`, viewBox **1254**, bukan artboard 512
yang bahagian ini pernah andaikan. Setiap pangsi di bawah dikira daripada `getBBox()`
geometri itu dalam pelayar; **jangan salin nilai daripada versi lama dokumen ini** — ia
anggaran untuk lukisan yang berbeza.

Nama dalam kod ialah `data-part`, bukan `id`. Dua kancil boleh dirender serentak (slot kad
soalan dan skrin ringkasan), jadi `id` diberi awalan `useId()` setiap instance dan tidak
boleh diharapkan sebagai pemilih; `data-part` yang stabil.

| Lapisan (`data-part`) | Pangsi (unit viewBox) | Asal ukuran |
|---|---|---|
| `bayang-tanah` | **624, 1154** | pusat elips; kekal di tanah semasa lompatan, mengecil 15 % pada puncak |
| `kancil-tubuh` | **624, 1103** | bawah-tengah pada paras kaki; kuku terendah pada y 1103.3 |
| `badan` | **529, 784** | bawah-tengah badan; bbox 181.9–877.0 × 412.1–783.6 |
| `ekor` | **191, 583** | pangkal, tempat bertemu badan. Tiada animasi dalam v1 |
| `kepala-rig` | **802, 736** | pangkal leher, tempat leher bertemu badan — bukan sendi kepala/leher di atas |
| `telinga-kanan` | **940, 272** | pangkal, tepi bawah telinga jauh (891,257)–(959,282)–(987,252) |
| `telinga-kiri` | **888, 296** | pangkal, hujung telinga dekat yang bertemu kepala |
| `mata-kiri` | **986, 368** | tengah mata; elips cx/cy |
| `mata-kedip` | **986, 332** | tepi atas mata |
| `kaki-belakang-kiri` | 309, 581 | atas (pinggul). Pegun dalam v1 |
| `kaki-belakang-kanan` | 373, 695 | atas (pinggul). Pegun dalam v1 |
| `kaki-depan-kiri` | 716, 672 | atas (bahu). Pegun dalam v1 |
| `kaki-depan-kanan` | 809, 693 | atas (bahu). Pegun dalam v1 |

**Kenapa pangsi kepala di pangkal leher dan bukan di atas.** Geometri ini melukis leher
sebagai sebahagian kumpulan kepala, memanjang ke bawah hingga y 774, jauh ke dalam dada.
Berpangsi di sendi atas akan mengayunkan hujung bawah leher paling jauh dan mengoyakkannya
daripada badan. Berpangsi di pangkal, hujung bawah kekal dan kepala yang berayun.

Diukur pada putaran SIMPATI +12°: isian leher terpisah daripada isian badan sebanyak
849 unit², purata lebar 3.09 unit (0.22 px pada 88 px). Strok 20 unit yang dibawa
kedua-dua bentuk menutup hampir kesemuanya — **49 unit² kekal terdedah**, di bahu, bukan
di sendi. Pose FIKIR −8° lebih teruk (1293 unit² kekal terdedah); ia belum dirender di
mana-mana skrin dan patut diukur semula sebelum digunakan.

### Bahagian baharu dalam geometri ini

| `data-part` | Nota |
|---|---|
| `leher` | Dalam kumpulan kepala. Menentukan pangsi kepala (lihat atas) |
| `kening` | Tiada dalam spesifikasi asal. Dikekalkan; bahagian muka, tidak dianimasikan, tidak picing bersama mata |
| `hidung` | Bentuk berasingan, bukan sebahagian `kepala` |
| `mulut` | Satu-satunya garis halus: strok 55 % daripada strok utama (11 pada lalai 20) |

### Kedip tanpa lapisan kelopak

Geometri ini **tiada** kelopak berasingan, jadi peraturan lama "kedip = kelopak turun,
bukan skala mata" tidak boleh dilaksana sebagaimana ditulis. Kedip kini skala Y pada
kumpulan mata itu sendiri: rehat pada `scaleY: 1`, menghimpit ke `0.06` selama 4 bingkai,
berpangsi pada **tepi atas mata (986, 332)** — nilai pangsi kelopak yang asal dikekalkan,
supaya tepi yang bersendi pada kening kekal dan bahagian bawah naik.

Ia hidup dalam kumpulannya sendiri di dalam `mata-kiri`, kerana `mata-kiri` sudah memandu
`scaleY` untuk picing GEMBIRA. Dua kumpulan bersarang mendarab skala masing-masing, jadi
kedip dan picing tidak berebut sifat yang sama.

Bingkai kunci pertama ialah **1, bukan 0**: mata terbuka pada bingkai 0 (CLAUDE.md
prinsip 5).

### Syarat fail

- Satu SVG, setiap lapisan `<g data-part="…">` dengan nama di atas. Susunan Z (bawah→atas):
  bayang-tanah, kaki jauh, ekor, badan, kepala, kaki dekat. Kaki dekat di ATAS kepala —
  kaki depan menutup hujung bawah leher.
- Pose neutral menghadap kanan, kepala 3/4, sesuai untuk putaran ±12°.
- Laluan (path) sahaja — tiada teks, raster, kecerunan, topeng.
- Strok **20 unit pada viewBox 1254** (1.595 % lebar, 1.40 px pada 88 px), hujung bulat
  (DESIGN §8). Lapan — nilai dalam fail sumber — ialah 0.638 %, iaitu 0.56 px pada 88 px,
  dan kaki hilang jadi benang.
