<!--
  DOKUMEN DITERIMA, BUKAN DOKUMEN KAMI.

  Jawapan guru kepada pakej semakan kedua, iaitu
  pakej-semakan-baki-audit-48-soalan.md dalam folder ini: 15 soalan yang
  belum pernah disemak, 5 yang berubah selepas disemak, dan 3 yang disemak
  separa (PRD 16 item 52). Diterima sebagai FAIL, bukan sebagai mesej.

  Nama fail semasa diterima:
  semakan-guru-2-baki-48-soalan-27-september-2026.md

  Dokumen ini bertarikh 27 September 2026 dalam teksnya sendiri. Tarikh ia
  masuk ke repo diambil daripada git log commit yang menambahnya, bukan
  daripada nama failnya.

  BELUM DILAKSANA. Langkah ini merekod sahaja. Keputusan guru direkod dalam
  PRD 16 item 52. Tiada soalan ditulis atau diubah, dan skema serta
  math-y1.skills.json tidak disentuh.

  Semakan yang boleh menyekat, dibuat sebelum merekod: SP 1.5.2 ADA dalam
  katalog DSKP math-y1.json, bertajuk "Melengkapkan sebarang rangkaian
  nombor.", jadi pemindahan q018 tidak tersekat di katalog. Tetapi
  math-y1.skills.json belum mempunyai sebarang sub-kemahiran 1.5.2, dan pek
  tidak mendakwa SK 1.5 atau SP 1.5.2.

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
  Jangan betulkan ejaan, jangan susun semula, jangan potong. Kalau ada yang
  perlu ditambah, tambah di atas garis ini.
-->

# Semakan Guru — Baki Audit 48 Soalan

**Tarikh semakan:** 27 September 2026  
**Dokumen sumber:** `pakej-semakan-guru-2-baki-48-soalan.md`  
**Status:** Semakan selesai untuk Bahagian A, B dan C.

Saya semak pakej ini dengan prinsip yang sama seperti semakan sebelum ini:

> **Kelulusan hanya terpakai pada teks, pilihan, pancingan dan penerangan yang memang sudah dilihat. Kalau sesuatu berubah selepas semakan, versi baharu perlu dinilai semula.**

Untuk pengganggu pula:

> **Setiap pengganggu sebaiknya mewakili salah faham yang munasabah. Tetapi jangan cipta salah faham palsu semata-mata mahu dua pengganggu yang berbeza.**

---

# Keputusan tiga perkara di hadapan

## 1. q012, q014 dan q020 — pengganggu terlalu serupa

Saya **tidak mahu kekalkan ketiga-tiganya tanpa perubahan**.

B6 yang kita baiki sebelum ini memang menunjukkan masalah sebenar: kalau dua pengganggu cuma mengulang kesilapan yang sama, kita hilang nilai diagnostik.

Namun saya juga tidak mahu memaksa pengganggu pelik. Untuk soalan perbandingan, satu pengganggu boleh mewakili arah terbalik dan satu lagi boleh menguji sama ada murid faham bahawa “lebih besar/kecil” tidak termasuk nombor yang sama.

### q012

> **58 lebih kecil daripada nombor yang mana?**

Cadangan pilihan:

```text
61 — betul
52 — memilih nombor yang lebih kecil / arah terbalik
58 — menganggap nombor yang sama sebagai “lebih besar”
```

**Tukar `55` → `58`.**

Pemetaan kekal:

```text
compare_greater
promptForm: direct
```

### q014

> **34 lebih besar daripada nombor yang mana?**

Cadangan pilihan:

```text
29 — betul
41 — memilih nombor yang lebih besar / arah terbalik
34 — menganggap nombor yang sama sebagai “lebih kecil”
```

**Tukar `37` → `34`.**

Pemetaan kekal:

```text
compare_smaller
promptForm: direct
```

### q020

> **Nombor manakah ada 4 di tempat puluh?**

Pilihan sekarang `24` dan `14` terlalu dekat: kedua-duanya meletakkan 4 di tempat sa.

Cadangan:

```text
42 — betul
24 — tempat puluh dan sa tertukar
4  — nampak digit 4 tetapi belum faham bahawa soalan meminta 4 di tempat puluh
```

**Tukar `14` → `4`.**

Untuk metadata app, gunakan nama kanonik:

```text
place_tens
```

Jika `digit_at_tens` masih wujud dalam kod lama, anggap ia alias lama, bukan sub-kemahiran baharu.

---

## 2. q018 bukan `order_ascending`

**☑ Pindah. Jangan kekalkan sebagai `order_ascending`.**

q018:

> **12, __, 18, 21. Apakah nombor yang tertinggal?**

Murid tidak menyusun nombor. Murid melengkapkan satu rangkaian nombor.

Pemetaan yang lebih tepat:

```text
1.5.2
complete_number_sequence
```

Kalau `1.5.2` belum dibina dalam app, ada dua pilihan yang jujur:

1. simpan q018 sebagai latihan sehingga `1.5.2` dilaksanakan; atau
2. tulis semula q018 menjadi soalan susunan sebenar.

**Jangan guna jawapan q018 sebagai bukti mastery `order_ascending`.**

Pengganggu `14` dan `16` masih boleh digunakan untuk q018 sebagai soalan rangkaian.

---

## 3. q026, q035 dan q036

Arahan ketiga-tiganya memang datang daripada contoh yang saya beri. Dalam semakan ini saya hanya menilai pilihan, pancingan dan penerangan yang ditambah selepas itu.

Keputusan terperinci ada di Bahagian A.

---

# Bahagian A — 15 soalan yang belum pernah disemak

## q012 — `compare_greater`

> **58 lebih kecil daripada nombor yang mana?**

**☑ Mengajar `compare_greater`.**

Ayat ini masih `direct`. Susunan bahasa berubah, tetapi murid masih mencari nombor yang lebih besar daripada 58.

### Pengganggu

**⚠ Ubah satu.**

Gunakan:

```text
61 — betul
52 — arah terbalik
58 — menyamakan “sama dengan” dengan “lebih besar”
```

Pancingan **“Bandingkan puluh dahulu.”** boleh kekal.

Penerangan **“61 ada 6 puluh. 58 ada 5 puluh.”** boleh kekal.

---

## q013 — `compare_greater`

Teks sekarang:

> **Guli Ali 45. Guli Kumar 52. Siapa lebih banyak?**

**☑ Kemahiran betul.**  
**⚠ Bahasa perlu dilicinkan.**

Saya lebih suka:

> **Ali ada 45 guli. Kumar ada 52. Siapa ada lebih banyak?**

Pilihan:

```text
Kumar — betul
Ali — membandingkan digit sa sahaja / memilih 45 kerana 5 > 2
Sama banyak — menganggap kedua-duanya sama
```

**☑ Pengganggu sesuai.**

Pancingan dan penerangan boleh kekal.

---

## q014 — `compare_smaller`

> **34 lebih besar daripada nombor yang mana?**

**☑ Mengajar `compare_smaller`.**

Ia juga kekal `direct`.

### Pengganggu

**⚠ Ubah satu.**

Gunakan:

```text
29 — betul
41 — arah terbalik; memilih nombor lebih besar
34 — menganggap nombor yang sama sebagai “lebih kecil”
```

Pancingan dan penerangan boleh kekal.

---

## q015 — `compare_smaller`

Teks sekarang:

> **Setem Muaz 17. Setem Faris 23. Siapa kurang?**

**☑ Kemahiran betul.**  
**⚠ Bahasa perlu dilicinkan.**

Saya lebih suka:

> **Muaz ada 17 setem. Faris ada 23. Siapa ada kurang setem?**

Pilihan:

```text
Muaz — betul
Faris — arah terbalik; memilih yang lebih banyak
Sama banyak — menganggap kedua-duanya sama
```

**☑ Pengganggu sesuai.**

---

## q016 — `after`

> **Apakah nombor selepas 39?**

Pilihan:

```text
40
38
49
```

**☑ Mengajar `after`.**  
**☑ Pengganggu sesuai.**

- `38` — bergerak ke arah sebelum.
- `49` — mengubah tempat puluh dan mengekalkan 9.

Pancingan **“Kira satu lagi selepas 39.”** sesuai.

Penerangan **“39, kemudian 40.”** sesuai.

---

## q017 — `after`

> **Mei Lin bilang 24, 25, 26. Apa selepasnya?**

**☑ Mengajar `after`.**

Pilihan:

```text
27 — betul
23 — bergerak ke belakang daripada permulaan urutan
28 — melangkau satu nombor
```

**☑ Pengganggu boleh digunakan.**

Kalau mahu bahasa lebih jelas:

> **Mei Lin bilang 24, 25, 26. Nombor seterusnya?**

Perubahan ini tidak wajib.

---

## q018 — rangkaian nombor

> **12, __, 18, 21. Apakah nombor yang tertinggal?**

**✗ Bukan `order_ascending`.**

Pindah kepada:

```text
1.5.2
complete_number_sequence
```

Pilihan:

```text
15 — betul
14 — cuba pola lain / hanya melihat langkah awal
16 — cuba pola lain / hanya melihat langkah awal
```

**☑ Pengganggu boleh digunakan untuk soalan rangkaian.**

Pancingan **“Naik tiga-tiga.”** dan penerangan **“12, 15, 18, 21. Naik tiga-tiga.”** sesuai untuk item rangkaian, bukan untuk `order_ascending`.

---

## q026 — `before`

> **Apakah nombor sebelum 30?**

Arahan ini memang contoh yang saya beri.

Pilihan:

```text
29 — betul
31 — bergerak ke arah selepas
20 — mengurangkan satu puluh
```

**☑ Pengganggu sesuai.**

Pancingan **“Kira satu kurang dari 30.”** boleh digunakan. Kalau mahu bahasa lebih natural: **“Kira satu kurang daripada 30.”**

Penerangan **“29, kemudian 30.”** sesuai.

---

## q027 — `before`

> **Kumar bilang 46, 47, 48. Apa sebelum 46?**

**☑ Mengajar `before`.**

Pilihan:

```text
45 — betul
49 — meneruskan urutan ke hadapan
36 — menolak satu pada tempat puluh
```

**☑ Pengganggu sesuai.**

Pancingan **“Bilang turun dari 46.”** sesuai.

---

## q028 — `before`

> **Apakah nombor sebelum 71?**

**☑ Mengajar `before`.**

Pilihan:

```text
70 — betul
72 — bergerak ke arah selepas
61 — menolak satu pada tempat puluh
```

**☑ Pengganggu sesuai.**

Pancingan dan penerangan boleh kekal.

---

## q020 — `place_tens`

> **Nombor manakah ada 4 di tempat puluh?**

**☑ Mengajar `place_tens`.**

Gunakan:

```text
42 — betul
24 — tempat puluh dan sa tertukar
4  — mengenal digit 4 tetapi tidak memahami “di tempat puluh”
```

**Tukar `14` → `4`.**

Pancingan **“Lihat digit di hadapan.”** boleh kekal untuk nombor dua digit.

Penerangan **“42 ada 4 puluh dan 2 sa.”** sesuai.

---

## q021 — `place_tens`

> **Muaz ada 17 setem. Apakah digit di tempat puluh?**

**☑ Mengajar `place_tens`.**  
**☑ Pengganggu sesuai.**

```text
1 — betul
7 — tertukar dengan tempat sa
17 — nombor penuh, bukan digit
```

Pancingan dan penerangan boleh kekal.

---

## q025 — `two_digit_plus_two_digit_no_bridge`

> **34 tambah 25 jadi berapa?**

**☑ Mengajar kemahiran yang didakwa.**

Pilihan:

```text
59 — betul
69 — membawa 1 puluh walaupun tidak perlu
95 — digit terbalik
```

**☑ Pengganggu sesuai.**

Pancingan **“Tambah sa, kemudian puluh.”** sesuai.

Lengkapkan penerangan kepada:

> **4 + 5 = 9. 30 + 20 = 50. Jadi 59.**

---

## q035 — `two_digit_plus_one_digit_bridge`

> **59 tambah 4 jadi berapa?**

Pilihan:

```text
63 — betul
53 — gagal membentuk puluh baharu
62 — off-by-one / salah kira baki
```

**☑ Pengganggu sesuai.**

Pancingan **“Cukupkan 60 dahulu.”** sangat sesuai dengan strategi melintasi puluh yang kita sudah gunakan.

Penerangan **“59 + 1 = 60. 60 + 3 = 63.”** sesuai.

---

## q036 — `two_digit_plus_two_digit_bridge`

> **34 tambah 28 jadi berapa?**

Pilihan:

```text
62 — betul
52 — tidak membawa puluh baharu
26 — digit terbalik
```

**☑ Pengganggu sesuai.**

Pancingan sekarang **“4 + 8 = 12. Bawa 1 puluh.”** boleh difahami, tetapi saya lebih suka bahasa nilai tempat:

> **4 + 8 = 12. Jadi 1 puluh 2 sa.**

Penerangan **“30 + 20 + 12 = 62.”** boleh kekal.

---

# Bahagian B — 5 soalan yang berubah selepas semakan

## q004

Versi sekarang:

> **Dalam 63, apakah digit di tempat puluh?**

Pilihan:

```text
6
3
63
```

**☑ Kekalkan versi sekarang.**

`63` ialah pengganggu yang baik kerana ia mewakili murid yang belum membezakan nombor penuh dengan digit.

Tiga pilihan juga lebih baik untuk evidence berbanding dua pilihan, selagi pengganggu ketiga memang bermakna — dan di sini ia bermakna.

---

## q001

Penerangan sekarang:

> **74: 7 puluh. 47: 4 puluh.**

**☑ Kekalkan.**

Versi pendek masih menyampaikan sebab utama kenapa 74 lebih besar, iaitu perbandingan tempat puluh.

Ini juga versi yang saya sudah setuju apabila kita semak had 28 aksara.

---

## q002

Pancingan sekarang:

> **Kira satu lagi selepas 29.**

**☑ Kekalkan.**

Ia ringkas, natural dan masih memberi strategi yang betul tanpa terus menyebut jawapan 30.

---

## q010

Arahan sekarang:

> **Apakah nombor paling kecil?**

**☑ Kekalkan.**

Maksud matematik tidak berubah dan ayat ini natural untuk murid Tahun 1.

---

## q019

Arahan:

> **Kad Raju: 14, 9, 18. Susun dari kecil ke besar.**

Pilihan sekarang:

```text
9, 14, 18 — betul
18, 14, 9 — susunan menurun
14, 18, 9 — membandingkan digit sa sahaja dan meletakkan 9 paling besar
```

**☑ Kekalkan pilihan ketiga baharu `14, 18, 9`.**

Saya setuju dengan sebab perubahan itu.

Pilihan lama `14, 9, 18` terlalu mudah ditolak hanya kerana ia menyalin urutan yang diberi dalam soalan.

Pilihan baharu lebih diagnostik.

Pancingan **“Nombor paling kecil dahulu.”** sesuai.

Saya cadangkan penerangan:

> **9 paling kecil, kemudian 14, 18.**

---

# Bahagian C — 3 soalan yang disemak separa

## q011 — `count_objects`

> **Devi kutip epal. Ketuk sambil mengira.**

Audio:

> **Devi kutip epal. Ketuk sambil mengira. Kemudian tekan Sedia.**

### Bilangan objek

**☑ 8 biji epal sesuai.**

Untuk Tahun 1, lapan objek masih sesuai untuk aktiviti membilang awal, dengan syarat:

- objek tidak bertindih;
- setiap epal jelas berasingan;
- susun atur bertabur tetapi tidak terlalu rapat;
- setiap objek mudah diketuk.

### Sub-kemahiran

Oleh sebab **ketukan itu sendiri ialah jawapan** dan tiada nombor akhir yang perlu dipilih atau ditaip:

```text
count_objects
```

sah sebagai bukti.

Saya **tidak** akan kira q011 sebagai bukti `name_number_for_quantity` dalam bentuk UI sekarang.

### Penerangan

> **Ada 8 biji epal.**

**☑ Sesuai.**

### Aras

**☑ Aras 1 munasabah** sebagai keputusan reka bentuk app.

Audio mesti terus menyebut **“Kemudian tekan Sedia.”** selagi belum ada petunjuk bukan teks yang benar-benar jelas.

---

## q022 — latihan hubungan nombor

> **Saya tambah 15 jadi 38. Apakah nombor saya?**

Pilihan:

```text
23 — betul
28 — menolak 10 sahaja
53 — menambah 15 kepada 38
```

**☑ Pengganggu sesuai.**

Pancingan **“Tolak 15 daripada 38.”** sesuai untuk item latihan ini, kerana q022 memang tidak digunakan sebagai bukti mastery `2.2.2`.

Penerangan **“23 + 15 = 38.”** sesuai.

### Aras

**☑ Aras 3 munasabah** sebagai keputusan reka bentuk app.

Metadata perlu terus jelas:

```text
practice_only: true
mastery_evidence_2_2_2: false
```

Tag tambahan yang sesuai:

```text
missing_addend
inverse_addition_subtraction_relation
```

---

## q023 — `2.4.2 / solve_addition_daily_problem`

> **Devi ada 32 pensel. Dia beli 14 lagi. Berapa semua?**

Pilihan:

```text
46 — betul
36 — tambah 4 sahaja; 1 puluh daripada 14 tertinggal
18 — menolak, bukan menambah
```

**☑ Pengganggu sesuai.**

Pancingan **“Tambah dua nombor itu.”** sesuai selepas murid membuat satu kesilapan kerana ia membantu murid mengenal operasi yang diperlukan.

Penerangan **“32 + 14 = 46.”** sesuai.

### Pemetaan

Kekal:

```text
2.4.2
solve_addition_daily_problem
```

Tag diagnostik:

```text
operation: addition
arithmetic_profile: two_digit_plus_two_digit_no_bridge
```

### Aras

**☑ Aras 3 munasabah** sebagai keputusan reka bentuk app.

---

# Ringkasan tindakan

## Wajib ubah

```text
q012
- pilihan 55 → 58

q014
- pilihan 37 → 34

q018
- keluarkan daripada order_ascending
- pindah ke 1.5.2 / complete_number_sequence
  ATAU tulis semula sebagai soalan susunan sebenar

q020
- pilihan 14 → 4
- gunakan kemahiran kanonik place_tens
```

## Ubah bahasa / penerangan yang saya cadangkan

```text
q013
Ali ada 45 guli. Kumar ada 52. Siapa ada lebih banyak?

q015
Muaz ada 17 setem. Faris ada 23. Siapa ada kurang setem?

q025
Tambah “Jadi 59.” pada penerangan.

q036
Pancingan:
4 + 8 = 12. Jadi 1 puluh 2 sa.

q019
Penerangan:
9 paling kecil, kemudian 14, 18.
```

## Kekalkan versi semasa

```text
q004
q001
q002
q010
q019 — termasuk pilihan ketiga baharu
```

## Bahagian C

```text
q011
☑ count_objects
☑ 8 objek
☑ aras 1
✗ bukan name_number_for_quantity dalam UI semasa

q022
☑ pilihan
☑ pancingan
☑ penerangan
☑ aras 3
✗ bukan bukti mastery 2.2.2

q023
☑ pilihan
☑ pancingan
☑ penerangan
☑ 2.4.2 / solve_addition_daily_problem
☑ aras 3
```

---

# Status audit selepas semakan ini

Daripada pakej ini, isu yang masih perlu tindakan sebelum dianggap selesai ialah:

1. q012 — satu pengganggu;
2. q014 — satu pengganggu;
3. q018 — pemetaan;
4. q020 — satu pengganggu;
5. q013/q015 — bahasa, jika mahu ikut versi yang lebih natural;
6. q025/q036/q019 — kemasan penerangan/pancingan.

Selepas perkara ini dikemas kini, baki 23 soalan dalam pakej ini boleh dianggap sudah melalui semakan untuk versi teks yang dinyatakan di sini.
