<!--
  DOKUMEN DITERIMA, BUKAN DOKUMEN KAMI.

  Dibina semula oleh guru daripada rekod projeknya. BUKAN chat asal: jawapan
  asal guru diberi dalam chat, dan chat itu tiada dalam repo. Diserahkan oleh
  pemilik projek pada 16 September 2026. Nama fail semasa diterima:
  rekod_jawapan_cikgu_subkemahiran_dan_semakan_soalan.md.

  BACA NOTA STATUSNYA SENDIRI. Dokumen ini berkata ia "rekod semakan projek,
  bukan tandatangan atau pengesahan rasmi guru sekolah". Ia tidak menaikkan
  kssr.reviewStatus, dan kssr.review pek tidak diubah kerananya.

  Empat fail sumber yang disenaraikan di hujungnya tiada dalam repo.

  IA MEMBETULKAN EMPAT PERKARA YANG SUDAH DIBINA. Di mana ia bercanggah dengan
  pembetulan-akhir-soalan-math-y1.md atau soalan-baharu-math-y1.md, kedua-duanya
  ditulis Claude, dokumen ini menang: ini perkataan guru, dan yang dua itu
  ringkasan.

    - Ambang. Guru tidak menetapkan "dua pilihan = mesti empat soalan" secara
      mutlak. Peraturannya: minimum 3 item berbeza, minimum 2 sesi, cubaan
      pertama betul, kebarangkalian tekaan gabungan <= 4%. Semasa difailkan,
      coverage.ts melabel empat item dua pilihan (6.25%) sebagai Dikuasai.
      Dibetulkan 17 September 2026 (PRD 16 item 22).
    - q022. Bahasanya boleh, sebagai teka-teki atau latihan hubungan nombor.
      Ia bukan bukti mastery two_digit_plus_two_digit_no_bridge. Sub-kemahiran
      itu perlukan satu lagi soalan penambahan terus.
    - q019. Tiga nombor, tiga pilihan. Dua nombor terlalu hampir kepada
      compare_smaller. "Sokongan visual" tidak semestinya bermaksud gambar
      atau animasi; yang dimaksudkan ialah paparan yang bersih.
    - Sedia. Teks skrin boleh ringkas; audio mesti menyebut "tekan Sedia"
      selagi UI tiada petunjuk bukan teks yang jelas kepada murid yang belum
      membaca.

  Dan satu prinsip untuk semua soalan: setiap pengganggu mesti mewakili
  kesilapan yang munasabah.

  Pada tarikh difailkan, tiada satu pun daripada empat pembetulan itu
  dilaksana.

  Id sub-kemahiran dalam dokumen ini (name_number_for_quantity,
  compare_object_groups, show_quantity_for_number, match_quantity_to_number,
  place_tens, place_ones, value_tens, value_ones) berbeza daripada id dalam
  src/content/kssr/math-y1.skills.json. Pecahannya sama. Belum diputuskan
  sama ada id kita ditukar (PRD 16 item 18).

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
  Kalau ada yang perlu ditambah, tambah di atas garis ini.
-->

# Rekod Jawapan Cikgu — Pecahan Sub-kemahiran & Semakan Soalan Baharu

> **Tujuan dokumen:** menyimpan semula keputusan semakan pedagogi yang pernah diberi dalam chat, supaya orang yang sambung projek ini boleh baca keputusan asal dengan konteks yang betul.
>
> Ini ialah **rekod semakan projek**, bukan tandatangan atau pengesahan rasmi guru sekolah.

---

# 1. Pecahan sub-kemahiran

## 1.2.1 — Menamakan nombor hingga 100

Untuk app, saya mahu tiga perkara ini direkod berasingan:

```text
count_objects
name_number_for_quantity
compare_object_groups
```

### `count_objects`

Murid membilang objek satu demi satu dengan betul.

Contoh:

> Ada 7 rambutan. Ketuk setiap rambutan sambil membilang.

### `name_number_for_quantity`

Selepas membilang, murid menyebut atau memilih nombor yang mewakili kuantiti kumpulan itu.

Contoh:

> Ada 7 rambutan. Berapakah bilangannya?

Catatan penting: perkataan **“memilih”** ialah cara murid menjawab, bukan nama kemahiran. Sebab itu saya lebih suka nama:

> **Menamakan nombor bagi kumpulan objek sebagai mewakili kuantiti.**

Kalau satu aktiviti merekod dua perkara secara berasingan — ketukan semasa membilang dan nombor akhir yang dihantar — aktiviti yang sama boleh memberi bukti kepada:

```text
count_objects
name_number_for_quantity
```

### `compare_object_groups`

Murid membandingkan kuantiti dua kumpulan objek.

Contoh:

> Kumpulan mana lebih banyak: 6 epal atau 4 oren?

---

## 1.2.2 — Menentukan nilai nombor hingga 100

Pecahan yang saya mahu app simpan ialah:

```text
show_quantity_for_number
match_quantity_to_number
compare_greater
compare_smaller
before
after
between
order_ascending
order_descending
```

### `show_quantity_for_number`

Murid diberi nombor dan menunjukkan kuantitinya.

Contoh:

> Tunjukkan 8 biji epal.

### `match_quantity_to_number`

Murid melihat kumpulan objek dan menentukan nombor yang mewakili kuantitinya.

Contoh:

> Ada 9 bintang. Pilih nombor yang betul.

### `compare_greater`

Murid menentukan nombor yang lebih besar.

Contoh:

> Mana lebih besar, 47 atau 74?

### `compare_smaller`

Murid menentukan nombor yang lebih kecil.

Contoh:

> Mana lebih kecil, 18 atau 81?

Saya mahu `compare_greater` dan `compare_smaller` disimpan berasingan. Jangan anggap seorang murid sudah menguasai kedua-duanya hanya kerana dia berjaya pada satu arah perbandingan.

### `before`

Contoh:

> Apakah nombor sebelum 30?

### `after`

Contoh:

> Apakah nombor selepas 29?

### `between`

Contoh:

> Apakah nombor di antara 41 dan 43?

`before`, `after` dan `between` sesuai disimpan sebagai kemahiran dalaman app. Ia datang daripada penerangan/catatan DSKP tentang hubungan nombor, bukan nama sub-titik rasmi yang berasingan.

### `order_ascending`

Contoh:

> Susun 12, 45, 78 dari kecil ke besar.

### `order_descending`

Contoh:

> Susun 12, 45, 78 dari besar ke kecil.

Saya mahu `order_ascending` dan `order_descending` direkod berasingan.

> Jangan anggap murid sudah menguasai susunan nombor hanya kerana dia berjaya menyusun secara menaik. Menaik dan menurun patut diuji kedua-duanya.

---

## 1.6.1 — Menyatakan nilai tempat dan nilai digit

Untuk app, saya mahu empat sub-kemahiran:

```text
place_tens
place_ones
value_tens
value_ones
```

### `place_tens`

Murid mengenal digit di tempat puluh.

Contoh:

> Dalam nombor 63, digit mana di tempat puluh?

Jawapan:

```text
6
```

### `place_ones`

Murid mengenal digit di tempat sa.

Contoh:

> Dalam nombor 63, digit mana di tempat sa?

Jawapan:

```text
3
```

### `value_tens`

Murid menyatakan **nilai digit** di tempat puluh.

Contoh:

> Dalam nombor 63, apakah nilai digit 6?

Jawapan:

```text
60
```

### `value_ones`

Murid menyatakan **nilai digit** di tempat sa.

Contoh:

> Dalam nombor 63, apakah nilai digit 3?

Jawapan:

```text
3
```

Nombor yang sama boleh digunakan untuk keempat-empat soalan, tetapi keputusannya perlu direkod berasingan.

Jangan simpan semuanya sebagai:

```text
1.6.1 = betul
```

Lebih berguna kalau app tahu dengan tepat bahagian mana yang sudah diuji dan bahagian mana yang belum.

---

# 2. Semakan soalan baharu — keputusan yang perlu dikekalkan

## q022 — “Saya tambah 15 jadi 38. Apakah nombor saya?”

Dari segi bahasa:

> **Saya setuju guna ayat ini.**

Ayatnya pendek, mudah didengar dan bentuk teka-teki sesuai untuk murid Tahun 1.

Tetapi saya **tidak mahu ia dikira sebagai `reverse` untuk mastery `two_digit_plus_two_digit_no_bridge`**.

Soalan biasa:

```text
23 + 15 = ?
```

mengukur penambahan.

Tetapi:

```text
? + 15 = 38
```

mendorong murid menggunakan hubungan songsang, contohnya:

```text
38 - 15
```

Jadi proses matematik yang diperlukan sudah berubah.

Keputusan:

```text
Bahasa q022: ☑ boleh
Sebagai teka-teki / latihan hubungan nombor: ☑ boleh
Sebagai reverse untuk mastery 2.2.2: ✗ jangan
```

Untuk melengkapkan bukti `two_digit_plus_two_digit_no_bridge`, gunakan satu lagi soalan penambahan terus. Tidak mengapa kalau bentuknya `direct` lagi.

---

## Soalan dua pilihan — jangan jadikan “empat soalan” sebagai peraturan mutlak

Ini bahagian yang perlu disimpan dengan tepat.

Saya **tidak menetapkan**:

```text
dua pilihan = mesti empat soalan
```

secara mutlak.

Saya mahu app melihat **kebarangkalian tekaan gabungan** semua bukti yang sah.

Peraturan yang saya cadangkan:

> **Minimum 3 item berbeza + minimum 2 sesi + kebarangkalian tekaan gabungan ≤ 4%.**

Tiga item yang semuanya mempunyai tiga pilihan:

```text
1/3 × 1/3 × 1/3
= 1/27
≈ 3.7%
```

cukup.

Tiga item yang semuanya mempunyai dua pilihan:

```text
1/2 × 1/2 × 1/2
= 1/8
= 12.5%
```

belum cukup.

Contoh dua item tiga-pilihan + satu item dua-pilihan:

```text
1/3 × 1/3 × 1/2
= 1/18
≈ 5.56%
```

masih belum cukup.

Kalau ditambah satu lagi item tiga-pilihan:

```text
1/3 × 1/3 × 1/3 × 1/2
= 1/54
≈ 1.85%
```

barulah cukup.

Jadi dalam set campuran, **item keempat boleh menjadi bukti yang mencukupi**. Tetapi kalau semua item dua-pilihan, empat item pun masih:

```text
1/16
= 6.25%
```

dan masih melebihi 4%.

Ini keputusan reka bentuk app, bukan peraturan rasmi DSKP.

---

## Butang `Sedia` — murid yang belum membaca perlukan petunjuk yang boleh difahami

Kalau teks pada skrin hanya:

> Devi kutip epal. Ketuk sambil mengira.

dan butang cuma tertulis:

> Sedia

murid yang belum boleh membaca mungkin tidak tahu apa langkah seterusnya.

Sebab itu saya bezakan **teks pada skrin** dengan **audio**.

Teks boleh ringkas:

> **Devi kutip epal. Ketuk sambil mengira.**

Tetapi audio perlu menyebut langkah seterusnya:

> **Devi kutip epal. Ketuk satu-satu sambil mengira. Bila sudah habis, tekan Sedia.**

Kalau suatu hari UI mempunyai petunjuk **bukan teks** yang benar-benar jelas kepada murid yang belum membaca, arahan audio boleh dinilai semula.

Selagi petunjuk seperti itu belum ada:

```text
☑ arahan “tekan Sedia” mesti disebut dalam audio
```

Jangan pendekkan arahan sampai murid hilang langkah yang perlu dibuat.

---

## q019 — dua nombor atau tiga nombor?

Saya pernah terlalu berhati-hati apabila kata tiga nombor terlalu berat untuk murid Tahun 1.

Keputusan yang saya betulkan kemudian ialah:

> **Tiga nombor masih munasabah untuk Tahun 1**, asalkan nombornya mudah, susunan visual bersih dan soalan tidak sarat dengan maklumat lain.

Contoh:

> **Kad Raju: 14, 9, 18. Susun dari kecil ke besar.**

Pilihan:

```text
9, 14, 18
18, 14, 9
14, 9, 18
```

Dengan dua nombor sahaja:

```text
14, 9
```

tugas itu terlalu hampir kepada `compare_smaller`, kerana murid hanya perlu tahu nombor mana yang lebih kecil.

Jadi untuk mengukur `order_ascending`, tiga nombor memberi bukti yang lebih kuat.

“Sokongan visual” di sini tidak semestinya bermaksud perlu gambar atau animasi. Yang saya maksudkan ialah **paparan yang bersih dan mudah dilihat** — contohnya nombor dipersembahkan sebagai kad yang jelas dan tidak bercampur dengan terlalu banyak maklumat lain.

---

## Kad boleh diseret — lebih baik untuk kemahiran menyusun, tetapi bukan blocker

Untuk kemahiran menyusun, `responseMode: order` memang lebih kuat.

Sebabnya:

> **Murid menghasilkan sendiri susunan, bukan memilih satu jawapan yang sudah disediakan.**

Contohnya tiga kad:

```text
14
9
18
```

murid seret menjadi:

```text
9 → 14 → 18
```

Itu lebih dekat dengan kemahiran sebenar “menyusun”.

Tetapi saya tidak mahu komponen baharu ini menghalang pembangunan sekarang.

Kalau drag-and-drop memerlukan:

- jenis soalan baharu;
- skema baharu;
- komponen UI baharu;
- ujian baharu;

simpan sebagai peningkatan Fasa 3.

Untuk sekarang:

```text
☑ guna tiga nombor
☑ guna tiga pilihan
☑ responseMode: select
```

Kemudian apabila komponen siap:

```text
responseMode: order
```

boleh menggantikan atau melengkapkan soalan pilihan.

---

# 3. Prinsip yang saya mahu kekal dalam bank soalan

## Jangan cipta pengganggu semata-mata untuk cukup tiga pilihan

Kalau hanya ada dua susunan yang sah, jangan cipta pilihan pelik seperti:

```text
9, 9
14, 14
```

semata-mata mahu cukup tiga pilihan.

Murid mungkin menolaknya kerana pilihan itu nampak pelik, bukan kerana dia faham konsep.

Prinsip yang saya mahu untuk semua soalan:

> **Setiap pengganggu mesti mewakili kesilapan yang munasabah, bukan sekadar menjadi pilihan tambahan untuk mencukupkan UI.**

Kalau kita tidak boleh terangkan salah faham apa yang diwakili oleh sesuatu pengganggu, besar kemungkinan pengganggu itu tidak patut ada.

---

# 4. Ringkasan keputusan untuk orang yang sambung projek

```text
1.2.2
- show_quantity_for_number
- match_quantity_to_number
- compare_greater
- compare_smaller
- before
- after
- between
- order_ascending
- order_descending

1.6.1
- place_tens
- place_ones
- value_tens
- value_ones

q022
- bahasa teka-teki boleh
- bukan reverse mastery 2.2.2

Mastery
- minimum 3 item berbeza
- minimum 2 sesi
- first-attempt correct
- kebarangkalian tekaan gabungan ≤ 4%
- jangan hard-code “dua pilihan = empat soalan”

Sedia
- audio sebut langkah “tekan Sedia”
- kecuali UI sudah ada petunjuk bukan teks yang jelas untuk murid belum membaca

q019
- tiga nombor munasabah
- nombor mudah
- paparan visual bersih
- tiga nombor lebih kuat daripada dua nombor untuk order_ascending

Drag/order
- pedagogi lebih kuat kerana murid menghasilkan susunan
- bagus sebagai Fasa 3
- bukan blocker untuk bank soalan sekarang
```

---

## Rekod sumber projek yang dirujuk semula

Dokumen ini dibina semula daripada rekod projek yang masih ada:

- `pecahan_sub_kemahiran_sp_matematik_tahun1.md`
- `semakan_guru_pusingan_2_keputusan_muktamad.md`
- `semakan_guru_pembetulan_q022_q019_sedia.md`
- `semakan_guru_q019_dua_pilihan_tertib_menaik.md`

Bahagian di atas mengekalkan keputusan akhir yang lebih baru apabila ada nasihat awal yang kemudian saya betulkan.
