<!--
  MENURUT PENGEPALANYA SENDIRI, DITULIS OLEH CLAUDE. BUKAN DOKUMEN GURU.

  Pakej semakan kedua yang pemilik projek hantar kepada guru: 23 soalan dalam
  tiga bahagian (PRD 16 item 52). Difailkan bersama jawapan guru,
  guru-semakan-baki-audit-48-soalan.md dalam folder ini.

  Nama fail semasa diserahkan: pakej-semakan-guru-2-baki-48-soalan.md

  Pengepalanya sendiri berkata ia disediakan pada 27 September 2026 dan
  "Draf: belum dihantar" - pengepala itu ditulis sebelum pakej dihantar.
  Jawapan guru bertarikh hari yang sama.

  Segala-galanya di bawah garis di bawah ini ialah teksnya, tidak disunting.
-->

<!--
  DITULIS OLEH CLAUDE, BUKAN DOKUMEN GURU.
  Pakej semakan kedua, disediakan 27 September 2026. Draf: belum dihantar.
  Kandungan soalan diambil dari pek pada main 0e17369; versi lama dari
  dokumen dalam docs/kssr/ dan git log. Rujukan: PRD §16 item 52.
-->

# Pakej semakan guru — 23 soalan yang belum disemak sepenuhnya

Cikgu, kami buat audit setiap soalan dalam bank terhadap dokumen semakan cikgu, satu demi satu. Hasilnya: daripada 48 soalan, **30 sudah disemak, 3 separa, dan 15 tidak pernah muncul dalam mana-mana dokumen cikgu**.

Pakej ini membawa ketiga-tiga baki itu sekali, supaya cikgu tak perlu beberapa pusingan untuk perkara yang sama. Tiga bahagian, dan setiap bahagian minta perkara berbeza:

- **Bahagian A — 15 soalan yang belum pernah disemak.** Semakan penuh.
- **Bahagian B — 5 soalan yang berubah selepas cikgu semak.** Cikgu sudah lihat versi lama; kami cuma perlu tahu sama ada versi sekarang boleh kekal.
- **Bahagian C — 3 soalan yang disemak separa.** Hanya bahagian yang tertinggal.

Untuk setiap pengganggu dalam Bahagian A, kami tulis salah faham yang **kami fikir** ia wakili. Itu bacaan kami, bukan kelulusan cikgu. Kalau bacaan itu salah, pengganggu itu patut ditukar.

Tolong pulangkan sebagai fail, sama seperti dua semakan sebelum ini.

---

## Tiga perkara yang kami sendiri tak puas hati

Baca ini dahulu; ia menyentuh empat soalan dalam Bahagian A.

### 1. Kedua-dua pengganggu mewakili salah faham yang sama — q012, q014, q020

Dalam semakan 23 September, cikgu tulis semula draf B6 atas sebab ini: *"51 dan 50 terlalu dekat: kedua-duanya meletakkan 5 di tempat puluh."* Tiga soalan lama ada bentuk yang sama:

| Soalan | Pengganggu | Kedua-duanya mewakili |
|---|---|---|
| q012 *"58 lebih kecil daripada nombor yang mana?"* | 52 · 55 | nombor yang lebih kecil — arah terbalik |
| q014 *"34 lebih besar daripada nombor yang mana?"* | 41 · 37 | nombor yang lebih besar — arah terbalik |
| q020 *"Nombor manakah ada 4 di tempat puluh?"* | 24 · 14 | 4 di tempat sa — tertukar tempat |

Adakah ketiga-tiganya patut ditulis semula seperti B6, atau ada sebab bentuk ini boleh diterima di sini?

☐ Tulis semula ketiga-tiganya  ☐ Boleh diterima — sebab: ______________________
☐ Lain: ______________________

### 2. q018 mungkin bukan *menyusun tertib menaik*

q018 ialah *"12, __, 18, 21. Apakah nombor yang tertinggal?"*, dan ia kini didakwa sebagai `1.2.2/order_ascending`.

Tetapi murid tidak menyusun apa-apa — dia melengkapkan rangkaian yang naik tiga-tiga. Dalam dokumen pecahan sub-kemahiran, cikgu sendiri menulis tentang soalan berbentuk begini: *"Soalan seperti ini lebih hampir kepada kemahiran melengkapkan rangkaian nombor."*

☐ Kekal di `order_ascending`
☐ Pindah ke: ______________________
☐ Tulis semula sebagai soalan susunan sebenar

### 3. Tiga soalan yang teksnya contoh cikgu sendiri — q026, q035, q036

Teks arahan ketiga-tiganya diambil terus daripada contoh yang cikgu beri. Yang **belum** disemak ialah pilihan, pancingan dan penerangan, yang kami tulis sendiri selepas itu. Jadi untuk ketiga-tiga soalan ini, cikgu boleh langkau bahagian pemetaan dan semak pengganggu sahaja.

---

# Bahagian A — 15 soalan yang belum pernah disemak

Dua soalan setiap satu: adakah ia mengajar kemahiran yang didakwa, dan adakah setiap pengganggu mewakili kesilapan yang munasabah.

## 1.2.2 — Menentukan nilai nombor hingga 100

### q012 · `compare_greater` · aras 1

> **58 lebih kecil daripada nombor yang mana?**

| Pilihan | Bacaan kami |
|---|---|
| **61** | betul |
| 52 | arah terbalik — memilih nombor yang lebih kecil |
| 55 | arah terbalik, sa lebih kecil walaupun puluh sama |

Pancingan: *Bandingkan puluh dahulu.* · Penerangan: *61 ada 6 puluh. 58 ada 5 puluh.*

Mengajar `compare_greater`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________ *(lihat juga perkara 1 di atas)*

### q013 · `compare_greater` · aras 1

> **Guli Ali 45. Guli Kumar 52. Siapa lebih banyak?**

| Pilihan | Bacaan kami |
|---|---|
| **Kumar** | betul |
| Ali | membandingkan digit sa sahaja: 5 lebih besar daripada 2 |
| Sama banyak | tidak membandingkan langsung |

Pancingan: *Nombor mana lebih besar?* · Penerangan: *52 lebih besar daripada 45.*

Mengajar `compare_greater`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q014 · `compare_smaller` · aras 2

> **34 lebih besar daripada nombor yang mana?**

| Pilihan | Bacaan kami |
|---|---|
| **29** | betul |
| 41 | arah terbalik |
| 37 | arah terbalik, puluh sama |

Pancingan: *Bandingkan puluh dahulu.* · Penerangan: *29 ada 2 puluh. 34 ada 3 puluh.*

Mengajar `compare_smaller`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________ *(lihat juga perkara 1)*

### q015 · `compare_smaller` · aras 2

> **Setem Muaz 17. Setem Faris 23. Siapa kurang?**

| Pilihan | Bacaan kami |
|---|---|
| **Muaz** | betul |
| Faris | arah terbalik — memilih yang lebih banyak |
| Sama banyak | tidak membandingkan langsung |

Pancingan: *Nombor mana lebih kecil?* · Penerangan: *17 lebih kecil daripada 23.*

Mengajar `compare_smaller`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q016 · `after` · aras 1

> **Apakah nombor selepas 39?**

| Pilihan | Bacaan kami |
|---|---|
| **40** | betul |
| 38 | arah terbalik — nombor sebelum |
| 49 | tambah pada tempat puluh |

Pancingan: *Kira satu lagi selepas 39.* · Penerangan: *39, kemudian 40.*

Mengajar `after`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q017 · `after` · aras 1

> **Mei Lin bilang 24, 25, 26. Apa selepasnya?**

| Pilihan | Bacaan kami |
|---|---|
| **27** | betul |
| 23 | arah terbalik — nombor sebelum urutan |
| 28 | melangkau satu |

Pancingan: *Tambah satu pada nombor akhir.* · Penerangan: *Selepas 26 ialah 27.*

Mengajar `after`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q018 · `order_ascending` · aras 2

> **12, __, 18, 21. Apakah nombor yang tertinggal?**

| Pilihan | Bacaan kami |
|---|---|
| **15** | betul |
| 14 | naik dua-dua daripada 12 |
| 16 | naik empat-empat daripada 12 |

Pancingan: *Naik tiga-tiga.* · Penerangan: *12, 15, 18, 21. Naik tiga-tiga.*

Pemetaan soalan ini ialah **perkara 2** di atas. Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q026 · `before` · aras 1 · *teks contoh cikgu*

> **Apakah nombor sebelum 30?**

| Pilihan | Bacaan kami |
|---|---|
| **29** | betul |
| 31 | arah terbalik — nombor selepas |
| 20 | tolak satu pada tempat puluh |

Pancingan: *Kira satu kurang dari 30.* · Penerangan: *29, kemudian 30.*

Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q027 · `before` · aras 1

> **Kumar bilang 46, 47, 48. Apa sebelum 46?**

| Pilihan | Bacaan kami |
|---|---|
| **45** | betul |
| 49 | meneruskan urutan ke hadapan |
| 36 | tolak satu pada tempat puluh |

Pancingan: *Bilang turun dari 46.* · Penerangan: *45, kemudian 46.*

Mengajar `before`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q028 · `before` · aras 1

> **Apakah nombor sebelum 71?**

| Pilihan | Bacaan kami |
|---|---|
| **70** | betul |
| 72 | arah terbalik |
| 61 | tolak satu pada tempat puluh |

Pancingan: *Satu kurang daripada 71.* · Penerangan: *70, kemudian 71.*

Mengajar `before`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

## 1.6.1 — Nilai tempat dan nilai digit

### q020 · `digit_at_tens` · aras 2

> **Nombor manakah ada 4 di tempat puluh?**

| Pilihan | Bacaan kami |
|---|---|
| **42** | betul |
| 24 | 4 di tempat sa — tertukar tempat |
| 14 | 4 di tempat sa; dalam "empat belas" 4 disebut dahulu |

Pancingan: *Lihat digit di hadapan.* · Penerangan: *42 ada 4 puluh dan 2 sa.*

Mengajar `digit_at_tens`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________ *(lihat juga perkara 1)*

### q021 · `digit_at_tens` · aras 2

> **Muaz ada 17 setem. Apakah digit di tempat puluh?**

| Pilihan | Bacaan kami |
|---|---|
| **1** | betul |
| 7 | digit di tempat sa |
| 17 | nombor penuh, bukan digit |

Pancingan: *Lihat digit di hadapan.* · Penerangan: *17 ada 1 puluh dan 7 sa.*

Mengajar `digit_at_tens`? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

## 2.2.2 — Menambah dalam lingkungan 100

### q025 · `two_digit_plus_two_digit_no_bridge` · aras 3

> **34 tambah 25 jadi berapa?**

| Pilihan | Bacaan kami |
|---|---|
| **59** | betul |
| 69 | bawa 1 puluh walaupun tiada yang perlu dibawa |
| 95 | digit terbalik (`digit_reversal`) |

Pancingan: *Tambah sa, kemudian puluh.* · Penerangan: *4 + 5 = 9. 30 + 20 = 50.*

Mengajar kemahiran itu? ☐ Ya ☐ Tidak → sepatutnya: ______
Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q035 · `two_digit_plus_one_digit_bridge` · aras 3 · *teks contoh cikgu*

> **59 tambah 4 jadi berapa?**

| Pilihan | Bacaan kami |
|---|---|
| **63** | betul |
| 53 | tidak membentuk puluh baharu (`missed_new_ten`) |
| 62 | kesilapan kira baki (`off_by_one`) |

Pancingan: *Cukupkan 60 dahulu.* · Penerangan: *59 + 1 = 60, 60 + 3 = 63.*

Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

### q036 · `two_digit_plus_two_digit_bridge` · aras 3 · *teks contoh cikgu*

> **34 tambah 28 jadi berapa?**

| Pilihan | Bacaan kami |
|---|---|
| **62** | betul |
| 52 | tidak membentuk puluh baharu (`missed_new_ten`) |
| 26 | digit terbalik (`digit_reversal`) |

Pancingan: *4 + 8 = 12. Bawa 1 puluh.* · Penerangan: *30 + 20 + 12 = 62.*

Pengganggu? ☐ Sesuai ☐ Ubah: ______________________

---

# Bahagian B — 5 soalan yang berubah selepas cikgu semak

Cikgu sudah luluskan kesemua lima. Kemudian ia diubah, dan tiada satu pun perubahan itu diminta oleh cikgu. Kami tidak mahu bank membawa kelulusan cikgu untuk teks yang cikgu tidak pernah lihat.

Untuk setiap satu: kekalkan versi sekarang, atau kembalikan versi yang cikgu luluskan.

### q004 · perubahan paling besar

| | Yang cikgu lihat, 12 Sep | Sekarang |
|---|---|---|
| Arahan | Nombor 63. Apakah digit di tempat puluh? | Dalam 63, apakah digit di tempat puluh? |
| Pilihan | 6 · 3 | **6** · 3 · **63** |

Arahan dipendekkan pada 13 September, dikalibrasi terhadap buku teks Tahun 1. Pilihan ketiga ditambah pada 14 September.

Pengganggu 63 ialah *"nombor penuh, bukan digit"* — corak yang cikgu kemudian luluskan untuk draf B5, B7 dan B8–B10 pada 23 September. Tiga pilihan juga menurunkan peluang tekaan daripada satu dalam dua kepada satu dalam tiga.

☐ Kekalkan versi sekarang  ☐ Kembalikan kepada dua pilihan  ☐ Lain: ______________

### q001

| | Yang cikgu lihat | Sekarang |
|---|---|---|
| Penerangan | 74 ada 7 puluh. 47 ada 4 puluh sahaja. | 74: 7 puluh. 47: 4 puluh. |

Dipendekkan pada 16 September supaya muat satu baris pada telefon. Arahan dan pilihan tidak berubah.

☐ Kekalkan  ☐ Kembalikan  ☐ Lain: ______________

### q002

| | Yang cikgu lihat | Sekarang |
|---|---|---|
| Pancingan | Bilang: dua puluh sembilan, kemudian? | Kira satu lagi selepas 29. |

Ditukar pada 16 September, sebab yang sama. Arahan dan pilihan tidak berubah.

☐ Kekalkan  ☐ Kembalikan  ☐ Lain: ______________

### q010

| | Yang cikgu lihat | Sekarang |
|---|---|---|
| Arahan | Nombor manakah paling kecil? | Apakah nombor paling kecil? |

Dipendekkan pada 13 September, sama seperti q004. Pilihan tidak berubah.

☐ Kekalkan  ☐ Kembalikan  ☐ Lain: ______________

### q019 · perubahan ini menyentuh pilihan cikgu sendiri

> **Kad Raju: 14, 9, 18. Susun dari kecil ke besar.**

| | Yang cikgu lihat, 16 Sep | Sekarang |
|---|---|---|
| Pilihan ketiga | 14, 9, 18 | 14, 18, 9 |
| Pancingan | *(tiada dalam dokumen)* | Nombor paling kecil dahulu. |
| Penerangan | *(tiada dalam dokumen)* | 9 paling kecil, kemudian 14. |

Sebab pilihan ketiga ditukar pada 17 September: **14, 9, 18** ialah susunan yang sama seperti dalam arahan soalan. Anak boleh menolaknya sekadar dengan melihat ia serupa dengan soalan, tanpa menyusun apa-apa — jadi soalan tiga pilihan itu jadi soalan dua pilihan.

Gantinya, **14, 18, 9**, ialah susunan anak yang membandingkan satu digit sahaja dan menyangka 9 lebih besar daripada 14 dan 18.

☐ Kekalkan  ☐ Kembalikan kepada 14, 9, 18  ☐ Lain: ______________

---

# Bahagian C — 3 soalan yang disemak separa

### q011 · `1.2.1/count_objects` · aras 1

> **Devi kutip epal. Ketuk sambil mengira.**
> Audio menyebut: *"Devi kutip epal. Ketuk sambil mengira. Kemudian tekan Sedia."*

Murid mengetuk setiap objek sambil membilang, dan ketukan itu sendiri ialah jawapannya. Tiada papan nombor.

**Sudah disemak:** teks skrin boleh ringkas, dan audio mesti menyebut langkah seterusnya.
**Belum disemak:** bilangan objek (8 biji epal, susun atur bertabur), penerangan *"Ada 8 biji epal."*, sub-kemahiran, dan aras.

8 objek sesuai untuk aras 1? ☐ Ya ☐ Tidak — sepatutnya: ______
Yang lain? ☐ Sesuai ☐ Ubah: ______________________

### q022 · latihan sahaja, bukan bukti · aras 3

> **Saya tambah 15 jadi 38. Apakah nombor saya?**

| Pilihan | Bacaan kami |
|---|---|
| **23** | betul |
| 28 | menolak 10, bukan 15 |
| 53 | menambah 15, bukan menolak |

Pancingan: *Tolak 15 daripada 38.* · Penerangan: *23 + 15 = 38.*

**Sudah disemak:** bahasanya diluluskan sebagai teka-teki hubungan nombor, dan cikgu kata ia **bukan** bukti penguasaan 2.2.2. Ia kini dalam bank sebagai latihan sahaja.
**Belum disemak:** pilihan, pancingan, penerangan, aras.

Pengganggu? ☐ Sesuai ☐ Ubah: ______________________
Aras 3 sesuai? ☐ Ya ☐ Tidak — sepatutnya: ______

### q023 · `2.4.2/solve_addition_daily_problem` · aras 3

> **Devi ada 32 pensel. Dia beli 14 lagi. Berapa semua?**

| Pilihan | Bacaan kami |
|---|---|
| **46** | betul |
| 36 | tambah 4 sahaja; 1 puluh daripada 14 tertinggal |
| 18 | menolak, bukan menambah |

Pancingan: *Tambah dua nombor itu.* · Penerangan: *32 + 14 = 46.*

**Sudah disemak:** cikgu pindahkan ia ke 2.4.2 pada 23 September, dengan tag `addition` dan `two_digit_plus_two_digit_no_bridge`.
**Belum disemak:** pilihan, pancingan, penerangan, aras.

Pengganggu? ☐ Sesuai ☐ Ubah: ______________________
Aras 3 sesuai? ☐ Ya ☐ Tidak — sepatutnya: ______

---

## Catatan cikgu (pilihan)

______________________________________________________________

______________________________________________________________
