<!--
  DITULIS OLEH CLAUDE, BUKAN DOKUMEN GURU.

  Pembetulan akhir kepada soalan-baharu-math-y1.md, selepas tiga pusingan
  semakan guru. Ditulis oleh Claude; pemilik projek menghantarnya kepada
  guru. Ia MERINGKASKAN keputusan guru; ia bukan perkataan guru sendiri.
  Diserahkan pada 13 September 2026, dan difailkan di sini atas permintaan
  pemilik projek.

  JURANG, DINYATAKAN SUPAYA TIDAK TERSEMBUNYI:

  - Jawapan guru untuk tiga pusingan itu datang dalam mesej, bukan borang
    bertanda, dan mesej itu tiada dalam repo. Setiap "Guru: ..." di bawah,
    dan setiap "menurut dokumen pembetulan, guru ..." dalam PRD dan SPEC,
    ialah ringkasan dalam dokumen ini, yang tidak boleh disemak terhadap
    perkataan guru.
  - Dokumen ini berkata ia menggantikan pembetulan-soalan-math-y1.md. Fail
    itu tidak diterima dan tidak difailkan.
  - Rekod semakan pek (kssr.review) masih merujuk borang pusingan 2 dan
    sepuluh soalan asal. Ia tidak dinaikkan atas dokumen ini.

  TIDAK DIIKUT SEPENUHNYA, atas keputusan pemilik projek selepas ia ditulis:

  - Jadual "Liputan selepas ini" mengira ambang mengikut bank soalan.
    Pemilik projek membetulkannya: ambang dikira daripada jawapan anak
    (SPEC §5.7, PRD §16 item 22).
  - "Kemudian tekan Sedia." TIDAK dibuang daripada q003, q006 dan q011, dan
    q003 serta q006 tidak dirakam semula, sehingga isyarat butang Sedia
    dibina (PRD §16 item 26). Senarai rakaman di bawah, enam belas, kini
    tiga belas: q011 hingga q023.
  - q024 ditahan dan tidak ditulis (PRD §16 item 28).
  - Pancingan q019 daripada spesifikasi dibuang, kerana soalan dua pilihan
    tidak pernah memaparkannya (PRD §16 item 24).

  DUA KESILAPAN DALAM DOKUMEN INI — DIBETULKAN DI SINI, BUKAN DI BAWAH.
  Teks di bawah garis ialah rekod apa yang dihantar kepada guru, termasuk
  kesilapannya, jadi ia tidak disunting. Kedua-duanya disahkan sebagai
  kesilapan penulisnya pada 14 September 2026:

  - Bahagian q004 berkata dengan dua pilihan "percubaan kedua dipaksa
    betul", dan explain muncul pada percubaan pertama. Alasan lama itu
    disalin tanpa disemak terhadap PR #51. Sejak PR #51, kesilapan pertama
    pada soalan dua pilihan terus mendedahkan jawapan bersama explain;
    tiada percubaan kedua (SPEC §4.2).
  - Bahagian "Yang tersekat" menyebut "DESIGN §5.2 yang menetapkan teks
    bermula pada Y 168". Salah: DESIGN §5.2 menetapkan Y 89. Y 168 pernah
    menjadi nilainya dan dibalikkan di situ.

  KESILAPAN KETIGA, DIJUMPAI 17 SEPTEMBER 2026:

  - Baris "Ambang dua-pilihan | Empat soalan, bukan tiga" dalam jadual
    "Yang guru luluskan" bukan peraturan guru. Rekod guru yang dibina semula
    (guru-rekod-jawapan-subkemahiran-dan-semakan-soalan.md) berkata guru
    "tidak menetapkan" dua pilihan = mesti empat soalan "secara mutlak".
    Peraturan guru: minimum 3 item berbeza, minimum 2 sesi, kebarangkalian
    tekaan gabungan <= 4%. Empat soalan dua pilihan (6.25%) tidak lulus.
    Baris itu disalin ke coverage.ts dan dibetulkan pada 17 September 2026
    (PRD §16 item 22, SPEC §5.7).

  Apa yang pek bawa, dan dari mana setiap butiran datang: PRD §16 item 29.

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
  Kalau ada yang perlu ditambah, tambah di atas garis ini.
-->

# Pembetulan akhir — soalan baharu math-y1

Selepas tiga pusingan semakan guru. Ini menggantikan
`pembetulan-soalan-math-y1.md`.

**Empat belas soalan baharu, enam belas rakaman BM.**

---

## Yang guru luluskan

| | Keputusan |
|---|---|
| `q022` bentuk teka-teki | Diluluskan — lebih baik daripada cadangannya sendiri |
| Ambang dua-pilihan | **Empat soalan**, bukan tiga. `(1/2)⁴ = 6.25%` |
| Butang Sedia | Isyarat bukan teks: keadaan butang, ikon, audio pendek |
| Tiga nombor untuk tertib | **Boleh** — dengan sokongan visual. Tanpa sokongan yang berat |
| Kad diseret | Lebih baik untuk mengajar tertib: murid **menghasilkan**, bukan mengecam |

---

## q004 — tambah pilihan ketiga

Sedia ada dua pilihan, jadi ambangnya empat. Pilihan ketiga membawanya
kembali kepada tiga.

| | |
|---|---|
| **ms** | Dalam 63, apakah digit di tempat puluh? |
| **en** | In 63, what digit is in the tens place? |

- Pilihan: **`6`** · `3` · `63`

`63` ialah pengganggu yang **mengajar**: anak yang tidak faham perkataan
"digit" akan memilih nombor penuh, dan pilihan itu memberitahu kita
kesilapannya. Dengan dua pilihan, satu-satunya kesilapan yang mungkin
ialah `3`.

Ia juga memulihkan urutan pancingan → `explain` yang kita reka. Dengan
dua pilihan, percubaan kedua dipaksa betul dan `explain` muncul pada
percubaan pertama.

**Teks tidak berubah — tiada rakaman semula.**

---

## q019 — kekal dua pilihan

| | |
|---|---|
| **ms** | Kad Raju: 14, 9. Susun dari kecil ke besar. |
| **en** | Raju's cards: 14, 9. Order from small to big. |

- Pilihan: **`9, 14`** · `14, 9`

Guru: tiada pengganggu ketiga yang munasabah untuk dua nombor. Apa-apa
pilihan ketiga akan jadi jelas salah dan tidak mengajar apa-apa.

Tiga nombor **boleh** digunakan — tetapi hanya dengan sokongan visual,
dan skema tiada tempat untuk imej dalam arahan. Lihat "Yang tersekat"
di bawah.

**Jadi `order_ascending` perlukan soalan keempat.**

---

## q024 — soalan baharu untuk order_ascending

```
promptForm: direct · representation: symbolic · responseMode: select
```
| | |
|---|---|
| **ms** | Susunan manakah dari kecil ke besar? |
| **en** | Which row goes from small to big? |

- Pilihan: **`7, 12, 20`** · `20, 12, 7` · `12, 20, 7`
- **Pancingan** — ms: Nombor paling kecil di hadapan. · en: The smallest number goes first.
- **Penerangan** — ms: 7 paling kecil, 20 paling besar. · en: 7 is smallest, 20 is biggest.

Tiga pilihan, jadi ambang `order_ascending` kembali kepada tiga — tetapi
`q019` dua-pilihan menaikkannya kepada empat. Dengan `q007`, `q018`,
`q019` dan `q024`, sub-kemahiran ini ada empat.

> Ayat ini sama dengan `q007`. Nombornya berbeza, jadi ia bukti berasingan
> di bawah peraturan ambang — tetapi guru menulis dalam pusingan ini:
> "jangan sekadar menambah soalan yang sama, tukar nombor **dan** bentuk."
>
> `q018` sudah `reverse` dan `q019` `contextual`, jadi sub-kemahiran ini
> ada tiga bentuk merentas empat soalan. **Guru patut sahkan itu memadai.**

---

## q011, q003, q006 — arahan Sedia dibuang

| | ms | en |
|---|---|---|
| **q011** | Devi kutip epal. Ketuk sambil mengira. | Devi picks apples. Tap as you count. |
| **q003** | Ketuk setiap rambutan sambil mengira. | Tap every rambutan as you count. |
| **q006** | Ketuk setiap pisang sambil mengira. | Tap every banana as you count. |

Guru: arahan itu milik butang, bukan ayat. Isyarat untuk menekan Sedia
ialah keadaan butang yang berubah bila ketukan bermula, ikon, dan bunyi
pendek — bukan teks.

**Kerja UI diperlukan.** Butang Sedia mesti membawa apa yang ayat dahulu
bawa. Diagnos sebelum melaksana: apa yang anak yang belum boleh membaca
lihat dan dengar yang memberitahunya untuk menekan?

---

## Senarai rakaman

**Empat belas baharu:**
```
q011  Devi kutip epal. Ketuk sambil mengira.
q012  58 lebih kecil daripada nombor yang mana?
q013  Guli Ali 45. Guli Kumar 52. Siapa lebih banyak?
q014  34 lebih besar daripada nombor yang mana?
q015  Setem Muaz 17. Setem Faris 23. Siapa kurang?
q016  Nombor 30 datang selepas nombor apa?
q017  Mei Lin bilang 24, 25, 26. Apa selepasnya?
q018  12, kosong, 18, 21. Apakah nombor yang tertinggal?
q019  Kad Raju: 14, 9. Susun dari kecil ke besar.
q020  Nombor manakah ada 4 di tempat puluh?
q021  Muaz ada 17 setem. Apakah digit di tempat puluh?
q022  Saya tambah 15 jadi 38. Apakah nombor saya?
q023  Devi ada 32 pensel. Dia beli 14 lagi. Berapa semua?
q024  Susunan manakah dari kecil ke besar?
```

**Dua rakam semula:**
```
q003  Ketuk setiap rambutan sambil mengira.
q006  Ketuk setiap pisang sambil mengira.
```

`q004` tidak berubah teksnya — hanya pilihan ditambah.

---

## Liputan selepas ini

| Sub-kemahiran | Soalan | Ambang | Status |
|---|---|---|---|
| `count_objects` | q003, q006, q011 | 3 | ✓ |
| `compare_greater` | q001, q012, q013 | 3 | ✓ |
| `compare_smaller` | q010, q014, q015 | 3 | ✓ |
| `after` | q002, q016, q017 | 3 | ✓ |
| `order_ascending` | q007, q018, q019, q024 | 4 | ✓ |
| `digit_at_tens` | q004, q020, q021 | 3 | ✓ |
| `two_digit_plus_two_digit_no_bridge` | q008, q022, q023 | 3 | ✓ |

Tujuh sub-kemahiran boleh mencapai **Dikuasai**. Dua puluh tujuh yang
lain masih tidak disentuh.

---

## Yang tersekat pada gambar-dalam-arahan

Tiga soalan kini menunggu jurang skema yang sama:

| Soalan | Apa yang diperlukan |
|---|---|
| `q005` | Gambar bentuk dalam arahan, pilihan sebagai nama |
| `q009` | Sama |
| `q019` | Tiga nombor dengan kad bernombor sebagai sokongan visual |

Menyelesaikan jurang itu menyelesaikan ketiga-tiganya — dan membolehkan
`q019` menjadi tiga pilihan, yang menurunkan ambang `order_ascending`
kembali kepada tiga dan menjadikan `q024` tidak perlu.

**Kosnya belum diukur.** Ia menyentuh `QuestionBase`, komponen arahan,
susun atur kad, dan DESIGN §5.2 yang menetapkan teks bermula pada Y 168.

---

## Kad boleh diseret — rekod hujah guru

Guru: menyusun kad **menghasilkan** susunan; memilih daripada senarai
hanya **mengecam** susunan. Yang pertama lebih dekat dengan apa yang SP
1.2.2 (iv) minta.

Itu sebab pedagogi, bukan andaian reka bentuk. Rekod dalam PRD §16 bersama
`responseMode: order` sebagai kerja Fasa 3, dengan hujah ini sebagai
alasannya.
