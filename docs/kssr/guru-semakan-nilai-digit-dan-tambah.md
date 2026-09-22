<!--
  DOKUMEN DITERIMA, BUKAN DOKUMEN KAMI.

  Jawapan guru kepada pakej semakan nilai digit dan kelompok tambah, iaitu
  pakej-semakan-nilai-digit-dan-tambah.md dalam folder ini. Diterima sebagai
  FAIL, bukan sebagai mesej, jadi jurang PRD 16 item 29 tidak berulang untuk
  kelompok ini.

  Nama fail semasa diterima:
  semakan-guru-nilai-digit-dan-tambah-23-september-2026.md

  Dokumen ini bertarikh 23 September 2026 dalam teksnya sendiri. Tarikh ia
  masuk ke repo diambil daripada git log commit yang menambahnya, bukan
  daripada nama failnya.

  BELUM DILAKSANA. Langkah ini merekod sahaja. Keputusan A1-A6, tiga
  pembetulan (B3, B6, B8) dan nota value_ones direkod dalam PRD 16 item 49.
  Tiada soalan ditulis atau diubah, tiada sub-kemahiran 2.4.2 ditambah kepada
  math-y1.skills.json, dan katalog DSKP math-y1.json tidak disentuh.

  Semakan yang boleh menyekat, dibuat sebelum merekod: SK 2.4 dan SP 2.4.2
  kedua-duanya ADA dalam katalog, jadi pemindahan q023 tidak tersekat di situ.

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
  Jangan betulkan ejaan, jangan susun semula, jangan potong. Kalau ada yang
  perlu ditambah, tambah di atas garis ini.
-->

# Semakan Guru — Nilai Digit dan Kelompok Tambah

**Tarikh semakan:** 23 September 2026  
**Status:** Selesai disemak untuk pembetulan bank soalan.

Saya semak Bahagian A dan semua 13 draf di Bahagian B. Saya ikut keputusan yang kita sudah tetapkan sebelum ini: `2.2.2` menilai pengiraan tambah, manakala masalah situasi harian diletakkan di bawah `2.4.2`.

---

# Bahagian A — Keputusan

## A1. q023 ke `2.4.2`?

**☑ Pindah ke `2.4.2`.**

q023:

> **Devi ada 32 pensel. Dia beli 14 lagi. Berapa semua?**

ialah masalah situasi harian. Saya tidak mahu ia menjadi bukti mastery utama `2.2.2`.

Ia boleh kekal dalam bank dan menjadi bukti di bawah `2.4.2`.

Untuk `2.2.2 / two_digit_plus_two_digit_no_bridge`, gunakan B1 sebagai pengganti supaya kelompok itu kembali mempunyai tiga soalan pengiraan terus.

Keputusan:

```text
q023
SP utama: 2.4.2
operation: addition
arithmetic_profile: two_digit_plus_two_digit_no_bridge
```

`arithmetic_profile` masih berguna untuk diagnosis dan pemilihan aras, tetapi bukan SP utama soalan itu.

---

## A2. Bagaimana `2.4.2` patut dipecahkan?

Saya **tidak cadangkan salin empat kelompok `2.2.2` sebagai empat sub-kemahiran wajib `2.4.2`**.

`2.2.2` mengukur keupayaan mengira.

`2.4.2` pula mengukur keupayaan membaca situasi, mengenal operasi yang sesuai dan menyelesaikan masalah harian.

Untuk app, saya cadangkan dua sub-kemahiran utama:

```text
solve_addition_daily_problem
solve_subtraction_daily_problem
```

Kemudian simpan struktur nombor sebagai tag diagnostik:

```text
operation: addition | subtraction

operand_profile:
- two_digit_plus_one_digit
- two_digit_plus_two_digit
- dan profil tolak apabila dibina

bridge:
- true
- false
```

Kalau kemudian kita mahu diagnosis lebih halus, boleh tambah:

```text
problem_schema
```

contohnya masalah tambah jenis “dapat lagi”, “jumlah semua” atau struktur lain.

Tetapi saya **tidak mahu `bridge/no_bridge` dan bentuk operand menjadi mastery gate berasingan untuk `2.4.2`** buat masa ini.

Jadi q030 dan q033 nanti boleh menjadi bukti untuk:

```text
solve_addition_daily_problem
```

dan pada masa sama membawa tag struktur pengiraannya.

---

## A3. Aras

**Tiada bantahan.**

Saya tidak nampak masalah pedagogi pada pembahagian aras yang kamu pilih.

Ia kekal sebagai keputusan reka bentuk app, bukan keputusan DSKP.

---

## A4. `30` sebagai pengganggu nilai digit di tempat sa

**☑ Munasabah.**

Untuk:

> **nilai digit 3 dalam 63**

jawapan `30` boleh mewakili murid yang terlalu umumkan aturan:

```text
nilai digit = digit × 10
```

atau yang menganggap setiap digit yang ditanya perlu diberi nilai puluh.

Jadi `30`, `70` dan `20` boleh digunakan untuk B11–B13.

Saya cuma mahu pengganggu lain dalam setiap soalan datang daripada salah faham yang berbeza supaya ketiga-tiga pilihan tidak menguji kesilapan yang sama.

---

## A5. Bentuk soalan nilai digit di tempat sa

Saya pilih:

**☑ Guna bentuk cadangan.**

Contoh:

> **Dalam 63, apakah nilai digit di tempat sa?**

lebih baik daripada:

> **Apakah nilai digit 3 dalam 63?**

kerana bentuk pertama memaksa murid **mencari digit di tempat sa dahulu**.

Tetapi ada satu batas yang memang tidak boleh kita hilangkan sepenuhnya:

```text
digit sa = 3
nilai digit sa = 3
```

Nilai digit di tempat sa memang sama secara nombor dengan digit itu sendiri.

Jadi satu soalan simbolik biasa tidak boleh membezakan dengan sempurna antara:

- murid yang benar-benar faham nilai digit; dan
- murid yang hanya tahu digit di sebelah kanan.

Itu bukan kecacatan pada soalan sahaja; sifat konsep itu memang begitu.

Untuk bank sekarang, B11–B13 masih boleh digunakan.

Kemudian, kalau mahu bukti yang lebih kuat, kita boleh tambah satu item visual atau item yang menggunakan bahasa seperti:

```text
3 sa
3 puluh
```

supaya murid menunjukkan makna tempat, bukan hanya menyalin digit.

---

## A6. Nombor penuh sebagai pengganggu nilai digit di tempat puluh

**☑ Setuju untuk B9 dan B10.**

Saya juga mahu:

**☑ B8 tukar `3` kepada `63`.**

Jadi B8:

```text
60 — betul
6  — digit, bukan nilai digit
63 — nombor penuh, bukan nilai digit
```

Ini lebih baik daripada:

```text
60
6
3
```

kerana dua jawapan salah mewakili dua salah faham yang jelas.

Ia juga mengurangkan corak mudah “jawapan yang dua digit mesti betul”, sebab nombor penuh juga dua digit.

Gunakan pola yang sama untuk B9 dan B10.

---

# Bahagian B — Semakan 13 draf

## B1 — `41 + 27`

> **41 tambah 27 jadi berapa?**

Pilihan:

```text
68
48
86
```

**☑ Sesuai.**

- `68` — betul.
- `48` — munasabah: tambah 7 sahaja dan abaikan 2 puluh.
- `86` — munasabah sebagai `digit_reversal` selepas mendapat 68.

Pancingan:

> **Tambah sa, kemudian puluh.**

boleh digunakan.

Saya cuma mahu penerangan dilengkapkan:

> **1 + 7 = 8. 40 + 20 = 60. Jadi 68.**

**Keputusan: kekal, tambah ayat akhir penerangan.**

---

## B2 — `32 + 5`

> **32 tambah 5 jadi berapa?**

Pilihan:

```text
37
36
82
```

**☑ Sesuai.**

- `37` — betul.
- `36` — `off_by_one`; murid mengira 32 sebagai kiraan pertama.
- `82` — tambah 5 pada tempat puluh.

Penerangan saya cadangkan:

> **2 + 5 = 7. Puluh kekal 3. Jadi 37.**

Ini menunjukkan kenapa tempat puluh tidak berubah.

---

## B3 — `83 + 6`

> **83 tambah 6 jadi berapa?**

Pilihan asal:

```text
89
99
98
```

**⚠ Ubah satu pengganggu.**

`98` boleh kekal sebagai `digit_reversal`.

`99` boleh berlaku jika murid “membawa” satu puluh tanpa sebab, tetapi bagi saya ia lebih lemah daripada kesilapan kira satu langkah.

Saya lebih suka:

```text
89 — betul
88 — off_by_one
98 — digit_reversal
```

Penerangan:

> **3 + 6 = 9. Puluh kekal 8. Jadi 89.**

---

## B4 — `54 + 4`

> **54 tambah 4 jadi berapa?**

Pilihan:

```text
58
57
94
```

**☑ Sesuai.**

- `58` — betul.
- `57` — `off_by_one`.
- `94` — tambah 4 pada tempat puluh.

Penerangan:

> **4 + 4 = 8. Puluh kekal 5. Jadi 58.**

---

## Pancingan B2–B4

> **Tambah pada tempat sa.**

**☑ Boleh.**

Kalau mahu bunyi lebih lisan untuk murid Tahun 1:

> **Tambah sa dahulu.**

Kedua-duanya boleh digunakan. Pilih satu dan kekalkan gaya yang sama untuk semua tiga soalan.

---

## B5 — digit di tempat sa dalam `49`

> **Dalam 49, apakah digit di tempat sa?**

Pilihan:

```text
9
4
49
```

**☑ Sesuai.**

- `9` — betul.
- `4` — tertukar tempat puluh dan sa.
- `49` — belum membezakan digit dengan nombor penuh.

Penerangan:

> **49 = 4 puluh dan 9 sa.**

boleh kekal.

---

## B6 — nombor yang ada `5` di tempat sa

Draf asal:

> **Nombor manakah ada 5 di tempat sa?**

Pilihan:

```text
15
51
50
```

**✗ Saya mahu tulis semula.**

Kamu betul bahawa B6 ialah item paling lemah.

`51` dan `50` terlalu dekat: kedua-duanya meletakkan 5 di tempat puluh.

Saya cadangkan ubah soalan kepada:

> **Nombor manakah ada 1 puluh dan 5 sa?**

Pilihan:

```text
15 — betul
51 — tempat puluh dan sa tertukar
5  — nampak 5 sa tetapi abaikan 1 puluh
```

Sekarang setiap pilihan salah membawa salah faham yang berbeza.

Penerangan:

> **15 = 1 puluh dan 5 sa.**

Ini masih menguji pemahaman tempat sa, tetapi pengganggunya lebih bersih.

---

## B7 — digit sa dalam `26`

> **Raju ada 26 kad. Apakah digit di tempat sa?**

Pilihan:

```text
6
2
26
```

**☑ Sesuai.**

- `6` — betul.
- `2` — tertukar tempat.
- `26` — nombor penuh, bukan digit.

Konteks Raju tidak mengubah kemahiran matematik; ia cuma membungkus soalan nilai tempat.

Penerangan:

> **26 = 2 puluh dan 6 sa.**

boleh kekal.

---

## B8 — nilai digit `6` dalam `63`

> **Apakah nilai digit 6 dalam 63?**

Tukar pilihan kepada:

```text
60 — betul
6  — digit, bukan nilai digit
63 — nombor penuh, bukan nilai digit
```

**☑ Sesuai selepas pertukaran `3` → `63`.**

Pancingan:

> **6 di tempat puluh.**

Penerangan:

> **6 puluh = 60.**

boleh kekal.

---

## B9 — nilai digit `4` dalam `47`

> **Apakah nilai digit 4 dalam 47?**

Pilihan:

```text
40
4
47
```

**☑ Sesuai.**

Tiga pilihan mewakili:

- nilai digit yang betul;
- digit tanpa nilai tempat;
- nombor penuh.

Pancingan dan penerangan sesuai.

---

## B10 — nilai digit `8` dalam `82`

> **Apakah nilai digit 8 dalam 82?**

Pilihan:

```text
80
8
82
```

**☑ Sesuai.**

Struktur pengganggu sama seperti B9 dan masih diagnostik.

---

## B11 — nilai digit di tempat sa dalam `63`

> **Dalam 63, apakah nilai digit di tempat sa?**

Pilihan:

```text
3
30
6
```

**☑ Sesuai.**

- `3` — betul.
- `30` — memberi nilai puluh kepada digit sa.
- `6` — tertukar dengan digit puluh.

Penerangan:

> **3 sa = 3.**

boleh kekal.

Saya cadangkan pancingan:

> **Cari digit sa dahulu.**

Ini lebih sesuai dengan proses soalan berbanding terus memberitahu “sebelah kanan”.

---

## B12 — nilai digit di tempat sa dalam `47`

> **Dalam 47, apakah nilai digit di tempat sa?**

Pilihan:

```text
7
70
4
```

**☑ Sesuai.**

- `7` — betul.
- `70` — memberi nilai puluh kepada digit sa.
- `4` — tertukar dengan digit puluh.

Pancingan:

> **Cari digit sa dahulu.**

Penerangan:

> **7 sa = 7.**

---

## B13 — nilai digit di tempat sa dalam `82`

> **Dalam 82, apakah nilai digit di tempat sa?**

Pilihan:

```text
2
20
8
```

**☑ Sesuai.**

- `2` — betul.
- `20` — memberi nilai puluh kepada digit sa.
- `8` — tertukar dengan digit puluh.

Pancingan:

> **Cari digit sa dahulu.**

Penerangan:

> **2 sa = 2.**

---

# Keputusan akhir

## Lulus tanpa perubahan besar

```text
B1
B2
B4
B5
B7
B9
B10
B11
B12
B13
```

B1 dan B2/B4 cuma perlu penerangan dikemaskan seperti dicadangkan.

## Perlu ubah

### B3

Tukar:

```text
99
```

kepada:

```text
88
```

supaya salah faham lebih munasabah dan mudah dibaca.

### B6

Tulis semula kepada:

> **Nombor manakah ada 1 puluh dan 5 sa?**

Pilihan:

```text
15
51
5
```

### B8

Tukar pengganggu:

```text
3
```

kepada:

```text
63
```

---

# Struktur app yang saya cadangkan selepas semakan ini

## `2.2.2`

Empat mastery gate kekal:

```text
two_digit_plus_one_digit_no_bridge
two_digit_plus_one_digit_bridge
two_digit_plus_two_digit_no_bridge
two_digit_plus_two_digit_bridge
```

Soalan situasi harian tidak digunakan sebagai bukti utama empat gate ini.

---

## `2.4.2`

Gunakan dua sub-kemahiran utama:

```text
solve_addition_daily_problem
solve_subtraction_daily_problem
```

Kemudian simpan ciri pengiraan sebagai tag:

```text
operation
operand_profile
bridge
```

Jadi soalan seperti q023, q030 dan q033 bukan lagi sekadar “latihan”.

Selepas struktur `2.4.2` dibina, ia boleh menjadi **bukti mastery `2.4.2`** sambil masih membawa tag jenis pengiraan yang digunakan.

---

# Nota tentang `value_ones`

Kita kekalkan:

```text
value_ones
```

sebagai sub-kemahiran app.

Tetapi orang yang sambung projek ini perlu faham satu perkara:

> Pada tempat sa, nilai digit secara nombor memang sama dengan digit itu sendiri.

Contoh:

```text
digit = 3
nilai digit = 3
```

Sebab itu item `value_ones` lebih sukar dipisahkan sepenuhnya daripada `place_ones` melalui pilihan nombor sahaja.

B11–B13 masih sesuai digunakan, tetapi pada masa depan elok ada sekurang-kurangnya satu item dengan perwakilan lain, contohnya kad nilai tempat atau pilihan seperti:

```text
3 sa
3 puluh
```

Ini peningkatan bank soalan, bukan blocker untuk kelompok sekarang.

---

# Status selepas semakan

```text
A1  ☑ Pindah q023 ke 2.4.2
A2  ☑ 2.4.2 pecah ikut operasi, bukan empat profil tambah
A3  ☑ Tiada bantahan pada aras
A4  ☑ 30 / 70 / 20 munasabah sebagai pengganggu
A5  ☑ Guna bentuk “nilai digit di tempat sa”
A6  ☑ Guna nombor penuh sebagai pengganggu; B8 juga tukar ke 63

B1  ☑
B2  ☑
B3  ⚠ tukar 99 → 88
B4  ☑
B5  ☑
B6  ✗ tulis semula
B7  ☑
B8  ⚠ tukar 3 → 63
B9  ☑
B10 ☑
B11 ☑
B12 ☑
B13 ☑
```

Selepas tiga pembetulan B3, B6 dan B8 dibuat, kelompok ini boleh bergerak ke penyediaan teks akhir dan rakaman BM.
