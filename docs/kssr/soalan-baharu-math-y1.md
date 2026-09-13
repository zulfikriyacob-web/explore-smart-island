<!--
  DOKUMEN PEMILIK PROJEK, BUKAN DOKUMEN GURU.

  Spesifikasi penuh tiga belas soalan baharu pek math-y1-nombor-100, q011
  hingga q023. Pemilik projek menulisnya dan guru menyemaknya; guru tidak
  menulisnya. Diserahkan pada 13 September 2026, dan difailkan di sini atas
  permintaan pemilik projek.

  DUA PERKARA DALAM TEKSNYA SENDIRI YANG PERLU DIBACA BERSAMA:

  - Baris pertamanya berkata "Ditulis oleh Claude". Pemilik projek berkata
    dia yang menulisnya. Kedua-duanya direkod di sini. Yang pasti: ia bukan
    tulisan guru.
  - Nota statusnya berkata "Belum disemak guru". Itu benar bagi versi ini:
    ia versi SEBELUM tiga pusingan semakan. Selepas semakan,
    pembetulan-akhir-soalan-math-y1.md dalam folder ini menang di mana
    kedua-duanya bercanggah.

  Ia menyebut epal sebagai aset baharu yang diperlukan. Epal sudah ada:
  public/img/fruit/epal.svg, disahkan kanak-kanak (DESIGN §8).

  Apa yang pek bawa, dan dari mana setiap butiran datang: PRD §16 item 29.

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
  Kalau ada yang perlu ditambah, tambah di atas garis ini.
-->

# 13 soalan baharu — math-y1-nombor-100

Ditulis oleh Claude, dikalibrasi terhadap buku teks KPM Matematik Tahun 1
(© 2016, hak cipta terpelihara). **Tiada soalan disalin.** Kalibrasi yang
digunakan: ayat 3–7 perkataan, julat kerja yang sepadan dengan setiap kemahiran,
watak bernama dan pelbagai kaum untuk bentuk `contextual`.

**Belum disemak guru.** Setiap soalan perlu melalui `kssr:review` sebelum
ia dianggap sah.

Semua soalan ditulis untuk melengkapkan ambang tiga-soalan pada tujuh
sub-kemahiran yang pek sudah sentuh. Tiada sub-kemahiran baharu diperkenalkan.

---

## 1.2.1 / count_objects — 1 soalan

Sedia ada: `q003` direct, `q006` direct. Kedua-duanya `count-tap`.

### q011
```
promptForm: contextual · representation: visual · responseMode: tap
```
| | |
|---|---|
| **ms** | Devi kutip epal. Ketuk sambil mengira, kemudian tekan Sedia. |
| **en** | Devi picks apples. Tap as you count, then press Sedia. |

- `itemCount`: 8, `itemImage`: epal *(aset baharu diperlukan)*
- **Pancingan** — ms: Ketuk satu-satu, jangan terlepas. · en: Tap one at a time, do not miss any.
- **Penerangan** — ms: Ada 8 biji epal. · en: There are 8 apples.

> Ayat ini 9 perkataan, melebihi julat 3–7. Format `count-tap` sedia ada
> sudah begitu (`q003`, `q006`). Kalau guru mahu lebih pendek, arahan
> "kemudian tekan Sedia" perlu dipindahkan ke butang, bukan ke ayat.

---

## 1.2.2 / compare_greater — 2 soalan

Sedia ada: `q001` direct.

### q012
```
promptForm: reverse · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Nombor manakah lebih besar daripada 58? |
| **en** | Which number is bigger than 58? |

- Pilihan: `52` · **`61`** · `55`
- **Pancingan** — ms: Bandingkan puluh dahulu. · en: Compare the tens first.
- **Penerangan** — ms: 61 ada 6 puluh. 58 ada 5 puluh. · en: 61 has 6 tens. 58 has 5 tens.

### q013
```
promptForm: contextual · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Guli Ali 45. Guli Kumar 52. Siapa lebih banyak? |
| **en** | Ali has 45 marbles. Kumar has 52. Who has more? |

- Pilihan: `Ali` · **`Kumar`** · `Sama banyak`
- **Pancingan** — ms: Nombor mana lebih besar? · en: Which number is bigger?
- **Penerangan** — ms: 52 lebih besar daripada 45. · en: 52 is bigger than 45.

---

## 1.2.2 / compare_smaller — 2 soalan

Sedia ada: `q010` direct.

### q014
```
promptForm: reverse · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Nombor manakah lebih kecil daripada 34? |
| **en** | Which number is smaller than 34? |

- Pilihan: `41` · **`29`** · `37`
- **Pancingan** — ms: Bandingkan puluh dahulu. · en: Compare the tens first.
- **Penerangan** — ms: 29 ada 2 puluh. 34 ada 3 puluh. · en: 29 has 2 tens. 34 has 3 tens.

### q015
```
promptForm: contextual · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Setem Muaz 17. Setem Faris 23. Siapa kurang? |
| **en** | Muaz has 17 stamps. Faris has 23. Who has fewer? |

- Pilihan: **`Muaz`** · `Faris` · `Sama banyak`
- **Pancingan** — ms: Nombor mana lebih kecil? · en: Which number is smaller?
- **Penerangan** — ms: 17 lebih kecil daripada 23. · en: 17 is smaller than 23.

---

## 1.2.2 / after — 2 soalan

Sedia ada: `q002` direct.

### q016
```
promptForm: reverse · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Nombor 30 datang selepas nombor apa? |
| **en** | The number 30 comes after what number? |

- Pilihan: `28` · **`29`** · `31`
- **Pancingan** — ms: Kira menurun satu langkah. · en: Count back one step.
- **Penerangan** — ms: 29, kemudian 30. · en: 29, then 30.

### q017
```
promptForm: contextual · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Mei Lin bilang 24, 25, 26. Apa selepasnya? |
| **en** | Mei Lin counts 24, 25, 26. What comes next? |

- Pilihan: **`27`** · `23` · `28`
- **Pancingan** — ms: Tambah satu pada nombor akhir. · en: Add one to the last number.
- **Penerangan** — ms: Selepas 26 ialah 27. · en: After 26 comes 27.

---

## 1.2.2 / order_ascending — 2 soalan

Sedia ada: `q007` direct.

### q018
```
promptForm: reverse · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | 12, __, 18, 21. Apakah nombor yang tertinggal? |
| **en** | 12, __, 18, 21. What number is missing? |

- Pilihan: `14` · **`15`** · `16`
- **Pancingan** — ms: Naik tiga-tiga. · en: Count up in threes.
- **Penerangan** — ms: 12, 15, 18, 21. Naik tiga-tiga. · en: 12, 15, 18, 21. Up in threes.

### q019
```
promptForm: contextual · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Kad Raju: 18, 9, 14. Susun dari kecil ke besar. |
| **en** | Raju's cards: 18, 9, 14. Order from small to big. |

- Pilihan: **`9, 14, 18`** · `18, 14, 9` · `14, 9, 18`
- **Pancingan** — ms: Cari nombor paling kecil dahulu. · en: Find the smallest number first.
- **Penerangan** — ms: 9 paling kecil, 18 paling besar. · en: 9 is smallest, 18 is biggest.

---

## 1.6.1 / digit_at_tens — 2 soalan

Sedia ada: `q004` direct, dua pilihan.

### q020
```
promptForm: reverse · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Nombor manakah ada 4 di tempat puluh? |
| **en** | Which number has 4 in the tens place? |

- Pilihan: `24` · **`42`** · `14`
- **Pancingan** — ms: Lihat digit di hadapan. · en: Look at the first digit.
- **Penerangan** — ms: 42 ada 4 puluh dan 2 sa. · en: 42 has 4 tens and 2 ones.

### q021
```
promptForm: contextual · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Muaz ada 17 setem. Apakah digit di tempat puluh? |
| **en** | Muaz has 17 stamps. What digit is in the tens place? |

- Pilihan: **`1`** · `7` · `17`
- **Pancingan** — ms: Lihat digit di hadapan. · en: Look at the first digit.
- **Penerangan** — ms: 17 ada 1 puluh dan 7 sa. · en: 17 has 1 ten and 7 ones.

---

## 2.2.2 / two_digit_plus_two_digit_no_bridge — 2 soalan

Sedia ada: `q008` direct.

### q022
```
promptForm: direct · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | 23 tambah 15 jadi berapa? |
| **en** | What is 23 plus 15? |

- Pilihan: **`38`** · `28` · `48`
- **Pancingan** — ms: Tambah sa dahulu, kemudian puluh. · en: Add the ones first, then the tens.
- **Penerangan** — ms: 3 + 5 = 8. 20 + 10 = 30. Jadi 38. · en: 3 + 5 = 8. 20 + 10 = 30. So 38.

> Ini `direct` seperti `q008`. Sub-kemahiran ini ialah `editorial`, dan
> bentuk `reverse` untuknya — "Apakah dua nombor yang hasilnya 38?" —
> menguji kemahiran berbeza, bukan bentuk berbeza. Guru patut sahkan.

### q023
```
promptForm: contextual · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Devi ada 32 pensel. Dia beli 14 lagi. Berapa semua? |
| **en** | Devi has 32 pencils. She buys 14 more. How many in all? |

- Pilihan: **`46`** · `36` · `18`
- **Pancingan** — ms: Tambah dua nombor itu. · en: Add the two numbers.
- **Penerangan** — ms: 32 + 14 = 46. · en: 32 + 14 = 46.

---

## Kesan pada liputan

| Sub-kemahiran | Sebelum | Selepas |
|---|---|---|
| `count_objects` | 2 | 3 ✓ |
| `compare_greater` | 1 | 3 ✓ |
| `compare_smaller` | 1 | 3 ✓ |
| `after` | 1 | 3 ✓ |
| `order_ascending` | 1 | 3 ✓ |
| `digit_at_tens` | 1 | 3 ✓ |
| `two_digit_plus_two_digit_no_bridge` | 1 | 3 ✓ |

Tujuh sub-kemahiran boleh mencapai **Dikuasai** selepas anak menjawab
betul pada cubaan pertama merentas dua sesi.

Kepelbagaian bentuk juga naik: setiap sub-kemahiran kecuali
`two_digit_plus_two_digit_no_bridge` akan ada sekurang-kurangnya dua
`promptForm` berbeza.

---

## Yang diperlukan sebelum ini boleh digunakan

**Semakan guru.** Tiga belas soalan melalui `kssr:review`, dengan soalan
tambahan: adakah bentuk `reverse` yang saya tulis benar-benar `reverse`
mengikut definisi cikgu, atau sebahagiannya masih `direct` dengan ayat
berbeza?

**Tiga belas rakaman BM.** Teks tepat ada di atas.

**Satu aset baharu.** Epal untuk `q011`. Ia mesti lulus ujian yang sama
seperti rambutan: tunjuk kepada kanak-kanak, tanya "ini apa?", tanpa
petunjuk.

**Satu keputusan terbuka.** `q013` dan `q015` menggunakan "Sama banyak"
sebagai pilihan ketiga. Ia pengganggu yang munasabah untuk Tahun 1 —
tetapi ia juga jawapan yang betul bagi soalan lain (SK 1.1, kuantiti
secara intuitif). Guru patut sahkan ia tidak mengelirukan.
