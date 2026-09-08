# Spesifikasi gerakan kancil — Rive

Fail: /public/rive/kancil.riv · Artboard "Kancil" · State Machine "KancilSM" · 60 fps
Rujukan: SPEC.md §11 (kontrak), DESIGN.md §6–7.

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

## 5. Lapisan SVG yang ilustrator perlu hantar

| Lapisan (id) | Pangsi & nota |
|---|---|
| telinga-kiri | Pangsi pangkal. Bentuk penuh hingga ke dalam kepala supaya putaran 22° tidak menampakkan celah. |
| telinga-kanan | Sama; lapisan berasingan, bukan salinan cermin dalam satu kumpulan. |
| kepala | Termasuk muncung dan hidung. Pangsi di leher. Bertindih 8–10 px ke dalam badan. |
| mata-kiri, mata-kanan | Setiap satu: putih-mata, anak-mata, kelopak (warna kulit kepala, di atas mata, tersembunyi di luar bentuk mata pada rehat). Kedip = kelopak turun, bukan skala mata. |
| badan | Pangsi bawah-tengah. Tanpa bayang terbakar. |
| kaki-depan-kiri, kaki-depan-kanan, kaki-belakang-kiri, kaki-belakang-kanan | Pangsi atas (bahu/pinggul). Pegun dalam v1 tetapi berasingan untuk lompatan kemas dan gerakan masa depan. |
| ekor | Pangsi pangkal. Pilihan. |
| bayang-tanah | Elips berasingan di luar kumpulan badan — kekal di tanah semasa lompatan, mengecil 15 % pada puncak. |

Syarat fail:
- Satu SVG, setiap lapisan `<g id="…">` dengan nama di atas. Susunan Z (bawah→atas): bayang-tanah, kaki belakang, ekor, badan, kaki depan, telinga, kepala, mata.
- Pose neutral menghadap kanan, kepala 3/4, sesuai untuk putaran ±12°.
- Laluan (path) sahaja — tiada teks, raster, kecerunan, topeng.
- Strok 4 px pada 100 px, hujung bulat (DESIGN §8). Palet: token §2 + dua neutral.
- Artboard 240 × 200 pada 1×; kancil ~70 % tinggi supaya lompatan −30 px tidak terpotong.
