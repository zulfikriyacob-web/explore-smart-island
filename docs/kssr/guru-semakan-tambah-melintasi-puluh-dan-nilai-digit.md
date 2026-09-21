<!--
  DOKUMEN DITERIMA, BUKAN DOKUMEN KAMI.

  Semakan guru bagi enam soalan tambah melintasi puluh, dan satu keputusan
  tentang pengganggu soalan nilai digit. Diterima sebagai FAIL pada 22
  September 2026, bukan sebagai mesej — jadi jurang PRD 16 item 29, di mana
  jawapan guru hidup hanya dalam mesej yang tidak difailkan, tidak berulang
  untuk kelompok ini.

  Nama fail semasa diterima:
  semakan_guru_tambah_melintasi_puluh_dan_nilai_digit.md

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
  Jangan betulkan ejaan, jangan susun semula, jangan potong. Kalau ada yang
  perlu ditambah, tambah di atas garis ini.

  APA YANG DILAKSANA DARIPADANYA (PRD 16 item 49):

    - Enam soalan aras 3 ditulis: q029, q031, q035 untuk
      two_digit_plus_one_digit_bridge, dan q032, q034, q036 untuk
      two_digit_plus_two_digit_bridge. Dua contoh guru sendiri — 59 + 4 dan
      34 + 28 — menjadi q035 dan q036.
    - Pancingan dua peringkat guru dipetakan kepada dua slot yang app ada:
      peringkat pertama ("Cukupkan 40 dahulu.") menjadi `hint`, peringkat
      kedua ("Tambah 2 jadi 40. Baki 3.") diserap ke dalam `explain` yang
      dipaparkan bersama jawapan. Tiada slot pancingan kedua dibina.
    - Dua soalan situasi harian, q030 dan q033, kekal dalam bank tetapi tidak
      mendakwa 2.2.2. Ia dibawa sebagai `noEvidence: "practice"` buat
      sementara; 2.4.2 ADA dalam katalog DSKP tetapi belum mempunyai
      sub-kemahiran, dan memecahkannya ialah keputusan berasingan. Item 49.
    - Label pengganggu guru direkod dalam PRD sahaja. Tiada medan skema
      ditambah: tiada kod membacanya hari ini.
    - Keputusan "6" sebagai pengganggu yang sah untuk nilai digit direkod
      dalam SPEC 3.4 sebagai pengecualian kedua kepada peraturan pengganggu
      padanan-rentetan. Soalan nilai digit itu sendiri BELUM ditulis.
-->

# Semakan Guru — Soalan Tambah Melintasi Puluh & Nilai Digit

Saya dah semak enam soalan untuk aras tambah melintasi puluh. Secara keseluruhan, asas soalan ini **baik**. Nombor yang dipilih memang memaksa murid melintasi puluh, dan kebanyakan pengganggu datang daripada kesilapan yang munasabah.

Cuma ada beberapa perkara yang saya mahu kemaskan sebelum masuk bank akhir.

---

# 1. Pancingan untuk tambah melintasi puluh

Contoh:

> **38 tambah 5 jadi berapa?**

Pancingan yang dicadangkan:

> **“Tambah 2 dahulu, jadi 40.”**

Cara ini sesuai kerana murid belajar **cukupkan puluh dahulu**.

Untuk `38 + 5`:

```text
38 + 2 = 40
```

Masih berbaki:

```text
3
```

Jadi:

```text
40 + 3 = 43
```

Tetapi sebagai **pancingan pertama**, saya lebih suka jangan terus beri angka `2`.

Cadangan pancingan pertama:

> **Cukupkan 40 dahulu.**

Kalau murid masih salah, barulah beri pancingan kedua:

> **Tambah 2 jadi 40. Baki 3.**

Prinsip yang sama boleh digunakan untuk:

```text
27 + 6
→ cukupkan 30 dahulu

46 + 7
→ cukupkan 50 dahulu
```

Ini lebih baik kerana murid belajar strategi, bukan sekadar mengikut satu langkah yang diberi.

---

# 2. Soalan nilai digit — “Apakah nilai digit 6 dalam 63?”

Cadangan soalan:

> **Apakah nilai digit 6 dalam 63?**

Saya setuju guna pilihan:

```text
60
6
3
```

Jawapan:

```text
60
```

Pengganggu `6` sangat baik.

Sebab:

```text
6
```

menunjukkan murid tahu **digit** yang ditanya, tetapi belum membezakan antara:

```text
digit = 6
nilai digit = 60
```

Pilihan `3` pula boleh menunjukkan murid tersilap melihat digit di tempat sa.

Jadi:

```text
☑ 60 — betul
☑ 6 — pengganggu diagnostik yang baik
☑ 3 — pengganggu yang masih munasabah
```

Tak ada masalah `6` memang sudah muncul dalam nombor `63`.

Malah itu yang menjadikan pengganggu tersebut berguna.

---

# 3. Semakan enam soalan tambah

## Dua digit + satu digit

### Soalan 1

> **38 tambah 5 jadi berapa?**

Pilihan:

```text
43
33
42
```

Keputusan:

```text
☑ Sesuai
```

- `43` — betul
- `33` — boleh menunjukkan murid tidak membentuk puluh baharu dengan betul
- `42` — lebih tepat dilabel sebagai kesilapan kira baki / `off-by-one`

---

### Soalan 2

> **Ali ada 27 guli. Dia dapat 6 lagi. Berapa semua?**

Pilihan:

```text
33
23
32
```

Dari segi matematik:

```text
27 + 6 = 33
```

Soalan ini baik.

Tetapi ia ialah **situasi harian**.

Jadi saya tidak mahu ia menjadi bukti mastery utama untuk:

```text
2.2.2
two_digit_plus_one_digit_bridge
```

Lebih sesuai direkod sebagai:

```text
2.4.2
```

dengan tag operasi:

```text
addition
two_digit_plus_one_digit_bridge
```

Soalan itu boleh kekal dalam bank, cuma fungsi evidencenya berbeza.

---

### Soalan 3

> **46 tambah 7 jadi berapa?**

Pilihan:

```text
53
43
52
```

Keputusan:

```text
☑ Sesuai
```

- `53` — betul
- `43` — boleh menunjukkan murid gagal mengurus penambahan dengan betul
- `52` — lebih dekat kepada kesilapan kira baki / `off-by-one`

---

# 4. Dua digit + dua digit

### Soalan 4

> **27 tambah 16 jadi berapa?**

Pilihan:

```text
43
33
34
```

Keputusan:

```text
☑ Sesuai
```

- `43` — betul
- `33` — pengganggu yang munasabah untuk kesilapan melintasi puluh
- `34` — boleh menangkap kesilapan pada susunan atau pengendalian digit

---

### Soalan 5

> **Mei Lin ada 36 manik. Dia beli 17 lagi. Berapa semua?**

Pilihan:

```text
53
43
35
```

Dari segi matematik:

```text
36 + 17 = 53
```

Soalan ini baik.

Tetapi sama seperti soalan Ali tadi, ia ialah **masalah situasi harian**.

Jadi saya mahu rekod utama di bawah:

```text
2.4.2
```

bukan sebagai salah satu tiga bukti utama mastery:

```text
two_digit_plus_two_digit_bridge
```

---

### Soalan 6

> **48 tambah 25 jadi berapa?**

Pilihan:

```text
73
63
37
```

Keputusan:

```text
☑ Sesuai
```

- `73` — betul
- `63` — pengganggu yang munasabah untuk kesilapan tidak membentuk puluh baharu dengan betul
- `37` — boleh menunjukkan kesilapan pada susunan / pengendalian digit

---

# 5. Perkara penting untuk mastery `2.2.2`

Kalau sasaran ialah tiga bukti mastery untuk:

```text
two_digit_plus_one_digit_bridge
```

dan:

```text
two_digit_plus_two_digit_bridge
```

saya cadangkan **tiga bukti utama datang daripada soalan pengiraan terus**.

Jadi sekarang:

## `two_digit_plus_one_digit_bridge`

Bukti terus yang ada:

```text
38 + 5
46 + 7
```

Soalan Ali:

```text
27 + 6
```

boleh kekal, tetapi lebih sesuai sebagai `2.4.2`.

Maka tambah satu lagi soalan pengiraan terus.

Contoh:

> **59 tambah 4 jadi berapa?**

---

## `two_digit_plus_two_digit_bridge`

Bukti terus yang ada:

```text
27 + 16
48 + 25
```

Soalan Mei Lin:

```text
36 + 17
```

boleh kekal, tetapi lebih sesuai sebagai `2.4.2`.

Maka tambah satu lagi soalan pengiraan terus.

Contoh:

> **34 tambah 28 jadi berapa?**

---

# 6. Label diagnostik pengganggu

Untuk tiga soalan satu-digit:

```text
42
32
52
```

saya tidak akan panggil semuanya `digit_reversal`.

Label yang lebih tepat ialah seperti:

```text
off_by_one
remainder_count_error
```

Untuk jawapan seperti:

```text
33
43
63
```

boleh gunakan sesuatu seperti:

```text
missed_new_ten
no_regrouping
```

Untuk pengganggu yang benar-benar menterbalikkan digit, barulah gunakan:

```text
digit_reversal
```

Jangan beri satu label yang sama pada semua jawapan salah kalau jenis kesilapannya berbeza.

---

# 7. Keputusan akhir

```text
☑ Enam soalan secara asas sesuai
☑ Strategi cukupkan puluh sesuai untuk Tahun 1
☑ “6” ialah pengganggu yang baik untuk soalan nilai digit
☑ Soalan situasi harian boleh kekal
✗ Jangan guna soalan situasi harian sebagai bukti mastery utama 2.2.2
☑ Tambah satu lagi soalan terus bagi setiap kategori bridge
☑ Perkemas metadata pengganggu supaya diagnosis kesilapan lebih tepat
```
