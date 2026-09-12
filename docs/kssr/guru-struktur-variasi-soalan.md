<!--
  DOKUMEN DITERIMA, BUKAN DOKUMEN KAMI.

  Ditulis oleh guru yang menyemak pemetaan KSSR. Jawapan kepada soalan ketiga
  borang kssr:review: adakah lima nama bentuk soalan kami memadai.

  Jawapannya tidak. Lima nama itu mencampurkan tiga perkara berbeza, dan
  dokumen ini memecahkannya kepada tiga paksi. Ia juga membetulkan contoh
  guru sendiri yang terdahulu: dua daripada tiga "bentuk" dalam contoh itu
  sebenarnya prompt_form yang sama.

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.

  Derivatif yang boleh dibaca mesin: medan promptForm, representation,
  responseMode dan wordingVariant dalam src/content/schema.ts, dengan nilai
  yang disalin verbatim daripada dokumen ini.
-->

# Struktur Variasi Soalan untuk App Matematik Tahun 1

Saya cadangkan jangan kunci lima kategori asal sebagai satu senarai rata.

Sebabnya, kategori seperti `direct`, `visual`, `select` dan `story` sebenarnya datang daripada perkara yang berbeza:

- ada yang menerangkan **cara soalan dibentuk**;
- ada yang menerangkan **cara maklumat dipersembahkan**;
- ada yang menerangkan **cara murid menjawab**.

Satu soalan boleh serentak menjadi `contextual + visual + select`.

Jadi lebih kemas kalau app pecahkan variasi soalan kepada tiga paksi berasingan.

---

# 1. `prompt_form`

Ini menerangkan cara soalan dibentuk.

Nilai yang dicadangkan:

- `direct`
- `reverse`
- `contextual`

## `direct`

Soalan terus kepada kemahiran yang hendak diuji.

Contoh:

> Apakah nilai digit 6 dalam 63?

Contoh metadata:

```text
prompt_form: direct
representation: symbolic
response_mode: select
```

---

## `reverse`

Arah pemikiran dibalikkan.

Contoh biasa:

> Apakah nilai digit 6 dalam 63?

Murid diberi digit dan perlu mencari nilainya.

Contoh `reverse` yang betul-betul berbeza:

> Dalam nombor 63, digit manakah yang bernilai 60?

Di sini murid diberi nilai digit dan perlu mencari digit.

Contoh metadata:

```text
prompt_form: reverse
representation: symbolic
response_mode: select
```

### Catatan

Ayat seperti:

> Apakah nilai digit 6 dalam 63?

dan

> Dalam 63, digit 6 bernilai berapa?

masih dianggap `direct`.

Struktur ayat berubah, tetapi arah pemikiran matematik masih sama.

---

## `contextual`

Soalan menggunakan situasi harian atau konteks yang dekat dengan murid.

Contoh:

> Siti ada 23 pelekat. Ibunya beri 5 lagi. Berapa semuanya?

Contoh metadata:

```text
prompt_form: contextual
representation: symbolic
response_mode: select
```

Kalau ada gambar pelekat bersama soalan:

```text
prompt_form: contextual
representation: mixed
response_mode: select
```

Saya lebih suka nama `contextual` daripada `story` kerana tidak semua soalan situasi harian perlu berbentuk cerita panjang.

---

# 2. `representation`

Ini menerangkan bagaimana maklumat dipersembahkan kepada murid.

Nilai yang dicadangkan:

- `symbolic`
- `visual`
- `mixed`

---

## `symbolic`

Maklumat diberi menggunakan nombor, simbol atau teks matematik.

Contoh:

> 45 + 10 = ?

atau:

> Apakah nombor selepas 29?

---

## `visual`

Maklumat utama datang daripada gambar, objek atau bentuk.

Contoh:

> [gambar 8 biji epal]  
> Berapa biji epal?

Contoh metadata:

```text
prompt_form: direct
representation: visual
response_mode: select
```

---

## `mixed`

Menggunakan nombor atau teks bersama visual.

Contoh:

> Pilih kumpulan yang menunjukkan nombor 7.

Paparan mengandungi nombor `7` dan beberapa kumpulan objek.

---

# 3. `response_mode`

Ini menerangkan apa yang murid perlu lakukan untuk memberi jawapan.

Nilai yang dicadangkan:

- `select`
- `input`
- `tap`
- `match`
- `order`

---

## `select`

Murid memilih satu jawapan daripada beberapa pilihan.

Contoh:

> Apakah nombor selepas 29?

Pilihan:

- 28
- 30
- 39

---

## `input`

Murid menghasilkan jawapan sendiri.

Contoh:

> 45 + 10 = ___

Murid memasukkan jawapan `55`.

Untuk murid Tahun 1, cara input perlu mudah digunakan.

---

## `tap`

Murid mengetuk objek satu demi satu.

Contoh:

> Ketuk setiap rambutan sambil membilang.

Ini sangat berguna untuk kemahiran seperti `1.2.1` kerana app boleh melihat proses murid membilang, bukan hanya jawapan akhirnya.

---

## `match`

Murid memadankan dua perkara.

Contoh:

> Padankan nombor 7 dengan kumpulan objek yang betul.

Ini sesuai untuk kemahiran seperti nombor kepada kuantiti atau kuantiti kepada nombor.

---

## `order`

Murid menyusun nombor atau objek dalam urutan.

Contoh:

> Susun 18, 42, 27 dari kecil ke besar.

Sesuai untuk:

- susunan menaik;
- susunan menurun;
- rangkaian nombor tertentu.

---

# 4. `wording_variant`

Saya cadangkan tambah satu medan berasingan untuk variasi bahasa.

Contoh:

```text
wording_variant: A
wording_variant: B
wording_variant: C
```

Tujuannya ialah supaya app boleh menggunakan ayat yang berbeza tanpa menganggap setiap ayat itu sebagai bentuk pedagogi yang berlainan.

Contoh:

### Variant A

> Apakah nilai digit 6 dalam 63?

### Variant B

> Dalam 63, digit 6 bernilai berapa?

Kedua-duanya masih:

```text
prompt_form: direct
representation: symbolic
```

Tetapi `wording_variant` berbeza.

Ini membantu mengurangkan kemungkinan murid hanya menghafal bentuk ayat.

---

# Struktur Minimum yang Dicadangkan

Saya cadangkan bekukan struktur berikut sebelum 108 soalan ditulis:

```text
prompt_form
- direct
- reverse
- contextual

representation
- symbolic
- visual
- mixed

response_mode
- select
- input
- tap
- match
- order
```

Dan tambah:

```text
wording_variant
- A
- B
- C
```

mengikut keperluan.

---

# Contoh Metadata

## Contoh 1 — Nilai Digit

Soalan:

> Dalam nombor 63, digit manakah yang bernilai 60?

```json
{
  "sp": "1.6.1",
  "subskill": "value_tens",
  "prompt_form": "reverse",
  "representation": "symbolic",
  "response_mode": "select",
  "wording_variant": "A"
}
```

---

## Contoh 2 — Membilang Objek

Soalan:

> Ketuk setiap pisang sambil membilang.

```json
{
  "sp": "1.2.1",
  "subskill": "count_objects",
  "prompt_form": "direct",
  "representation": "visual",
  "response_mode": "tap",
  "wording_variant": "A"
}
```

---

## Contoh 3 — Situasi Harian

Soalan:

> Ali ada 23 guli. Ayah beri 5 lagi. Berapa jumlah guli Ali sekarang?

```json
{
  "sp": "2.2.2",
  "subskill": "two_digit_plus_one_digit_no_bridge",
  "prompt_form": "contextual",
  "representation": "symbolic",
  "response_mode": "select",
  "wording_variant": "A"
}
```

---

## Contoh 4 — Susunan Nombor

Soalan:

> Susun 18, 42, 27 dari besar ke kecil.

```json
{
  "sp": "1.2.2",
  "subskill": "order_descending",
  "prompt_form": "direct",
  "representation": "symbolic",
  "response_mode": "order",
  "wording_variant": "A"
}
```

---

# Kenapa Jangan Guna Satu Senarai Rata

Kalau semua kategori dicampur dalam satu medan seperti:

```text
direct
inverted
select
story
visual
```

app akan susah membezakan perkara berikut:

- bentuk soalan;
- bentuk maklumat;
- cara murid menjawab.

Contohnya satu soalan boleh serentak menjadi:

```text
contextual
visual
select
```

Jadi tiga paksi berasingan memberi data yang lebih bersih dan lebih berguna untuk analisis nanti.

---

# Cadangan Akhir

Saya cadangkan guna struktur:

```text
SP
→ subskill
→ prompt_form
→ representation
→ response_mode
→ wording_variant
→ evidence
```

Contoh lengkap:

```json
{
  "sp": "1.6.1",
  "subskill": "value_tens",
  "prompt_form": "reverse",
  "representation": "symbolic",
  "response_mode": "select",
  "wording_variant": "B",
  "evidence": {
    "first_attempt_correct": true,
    "session_id": "session_02"
  }
}
```

Dengan struktur ini, app boleh bezakan:

- kemahiran apa yang diuji;
- cara soalan dibentuk;
- cara maklumat dipersembahkan;
- cara murid menjawab;
- variasi bahasa;
- bukti penguasaan.

Ini lebih kukuh untuk digunakan sebagai asas penulisan 108 soalan nanti.
