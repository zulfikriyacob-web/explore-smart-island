<!--
  DOKUMEN DITERIMA, BUKAN DOKUMEN KAMI.

  Borang kssr:review pusingan 2, dikembalikan bertanda. Bertarikh
  12 September 2026.

  BACA NOTA STATUSNYA SENDIRI SEBELUM MENGGUNAKANNYA. Dokumen ini
  mengisytiharkan, dalam perkataannya sendiri, bahawa ia BUKAN tandatangan
  atau pengesahan rasmi guru sekolah, bahawa ruang nama dan sekolah sengaja
  dibiarkan kosong, dan bahawa ia "tidak patut digunakan sendiri untuk
  menaikkan kssr.verified". Jadi kssr.verified kekal false, dan borang ini
  bukan perkara yang menaikkannya.

  KEMAS KINI 13 SEPTEMBER 2026. Boolean itu sudah diganti kssr.reviewStatus
  tiga peringkat: unreviewed | teacher-reviewed | certified. Atas keputusan
  pemilik projek, borang ini ialah dokumen bagi teacher-reviewed pek
  math-y1-nombor-100. Ia BUKAN dokumen bagi certified, dan tidak boleh menjadi
  satu: nota statusnya sendiri menolaknya. Perenggan di atas dikekalkan sebagai
  rekod. Perinciannya dalam PRD 16 item 20.

  IA BERCANGGAH DENGAN AMBANG YANG DIGABUNG DALAM PR #43. Empat jawapannya
  membatalkan keputusan yang kami rekod sebagai diluluskan:

    - soalan paksi: TIDAK. Kepelbagaian promptForm ialah ukuran kualiti bank
      soalan, bukan gerbang penguasaan.
    - kesepuluh-sepuluh pengecualian: TIDAK. Senarai dibatalkan seluruhnya.
    - peraturan "reverse ialah sub-kemahiran sebelah": TIDAK, tidak lagi
      diperlukan.
    - q005/q009: "Kemahiran lain, tulis semula" — bukan "kekal, tulis
      pasangan direct".

  Perinciannya, dan apa yang belum diputuskan, dalam PRD 16 item 18.

  Segala-galanya di bawah garis di bawah ini ialah teks borang itu, tidak
  disunting.
-->


# Semakan pemetaan KSSR — Nombor Hingga 100

> **Status rekod:** Salinan bertanda berdasarkan semakan pedagogi dalam perbualan ini. Bahagian tandatangan sengaja dibiarkan kosong. Salinan ini bukan tandatangan atau pengesahan rasmi guru sekolah, dan tidak patut digunakan sendiri untuk menaikkan `kssr.verified`.

Borang untuk seorang guru. Dijana oleh `npm run kssr:review`; jangan sunting salinan bercetak dan jangkakan kod berubah — sunting pek, kemudian jana semula.

## Dokumen sumber

Kami memetakan terhadap dokumen ini. Kalau salinan cikgu berbeza, berhenti di sini dan beritahu kami — selebihnya borang ini tidak bermakna.

| | |
|---|---|
| Dokumen | Dokumen Standard Kurikulum dan Pentaksiran — Matematik Tahun 1 |
| Kurikulum | KSSR (Semakan) |
| Penerbit | Bahagian Pembangunan Kurikulum, Kementerian Pendidikan Malaysia |
| Cetakan | Mei 2015 |
| ISBN | 978-967-420-104-3 |

## Apa yang kami minta

Satu soalan sahaja, bagi setiap soalan kuiz: **adakah soalan ini benar-benar mengajar Standard Pembelajaran yang kami dakwakan?** Mesin sudah menyemak bahawa setiap kod **wujud** dalam DSKP; yang ia tidak boleh putuskan ialah sama ada soalan itu mengajarnya. Teks penuh setiap SP ada dalam **Rujukan** di hujung borang. Sehingga borang ini dijawab, pek membawa `verified: false` dan papan pemuka ibu bapa tidak memaparkan satu pun kod SP (PRD §15).

*Pilihan bertanda ← betul. Susunannya diacak setiap kali anak bermain; urutan di sini ialah urutan dalam fail.*

## Ringkasan — satu baris setiap soalan

| # | Soalan | Didakwa | Ya | Tidak |
|---|---|---|---|---|
| 1 | Nombor manakah yang lebih besar? | `1.2.2` | ☑ | ☐ |
| 2 | Apakah nombor selepas 29? | `1.2.2` | ☑ | ☐ |
| 3 | Ketuk setiap rambutan sambil mengira. Kemudian teka… | `1.2.1` | ☑ | ☐ |
| 4 | Nombor 63. Apakah digit di tempat puluh? | `1.6.1` | ☑ | ☐ |
| 5 | Yang mana bentuk segi tiga? | `7.2.1` | ☐ | ☑ |
| 6 | Ketuk setiap pisang sambil mengira. Kemudian tekan … | `1.2.1` | ☑ | ☐ |
| 7 | Susunan manakah dari kecil ke besar? | `1.2.2` | ☑ | ☐ |
| 8 | 45 tambah 10 jadi berapa? | `2.2.2` | ☑ | ☐ |
| 9 | Yang mana bulatan? | `7.2.1` | ☐ | ☑ |
| 10 | Nombor manakah paling kecil? | `1.2.2` | ☑ | ☐ |

## Nota: pek ini merentas lebih daripada satu tajuk DSKP

Pek bertajuk **Nombor Hingga 100**, tetapi soalannya datang daripada:

- **1.0 Nombor Bulat Hingga 100** — `q001`, `q002`, `q003`, `q004`, `q006`, `q007`, `q010`
- **7.0 Ruang** — `q005`, `q009`
- **2.0 Operasi Asas** — `q008`

Kami sudah tahu dan sudah memutuskan untuk memindahkan yang terkeluar ke pek sendiri (PRD §16). Disebut di sini supaya cikgu tidak perlu melaporkannya semula — tetapi kalau cikgu tidak bersetuju dengan pemetaan mana-mana soalan itu, tandakan seperti biasa.

## Soalan satu per satu

### 1. `q001` — Nombor manakah yang lebih besar?

- Pilihan: 47 · **74 ← betul** · 38
- Pancingan (selepas satu kali salah): Lihat nombor di hadapan dahulu.
- Penerangan (bersama jawapan didedah): 74 ada 7 puluh. 47 ada 4 puluh sahaja.
- **Didakwa: `1.2.2` — Menentukan nilai nombor hingga 100.**

Mengajar `1.2.2`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai untuk membandingkan nilai nombor.`

### 2. `q002` — Apakah nombor selepas 29?

- Pilihan: 28 · **30 ← betul** · 39
- Pancingan (selepas satu kali salah): Bilang: dua puluh sembilan, kemudian?
- **Didakwa: `1.2.2` — Menentukan nilai nombor hingga 100.**

Mengajar `1.2.2`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai untuk nombor selepas.`

### 3. `q003` — Ketuk setiap rambutan sambil mengira. Kemudian tekan Sedia.

- Anak mengetuk setiap objek sambil membilang, kemudian menghantar kiraannya. Objek: **7** · betul: **7**
- **Didakwa: `1.2.1` — Menamakan nombor hingga 100.**

Mengajar `1.2.1`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai. Jika app merekod ketukan dan nombor akhir secara berasingan, aktiviti ini boleh memberi bukti kepada membilang objek dan menamakan nombor bagi kuantiti.`

### 4. `q004` — Nombor 63. Apakah digit di tempat puluh?

- Pilihan: **6 ← betul** · 3
- Pancingan (selepas satu kali salah): Tempat puluh ada di sebelah kiri.
- Penerangan (bersama jawapan didedah): 63 = 6 puluh dan 3 sa.
- **Didakwa: `1.6.1` — Menyatakan nilai tempat dan nilai digit bagi sebarang nombor.**

Mengajar `1.6.1`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai untuk place_tens sahaja; belum meliputi place_ones, value_tens dan value_ones.`

### 5. `q005` — Yang mana bentuk segi tiga?

- Pilihan (gambar): Segi empat sama · **Segi tiga ← betul** · Bulatan
- **Didakwa: `7.2.1` — Menamakan bentuk segiempat sama, segiempat tepat, segitiga dan bulatan.**

Mengajar `7.2.1`? ☐ Ya ☑ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Ini menguji pengecaman segi tiga, bukan menamakan segi tiga. Tulis semula sebagai gambar bentuk + “Apakah nama bentuk ini?” jika mahu bukti 7.2.1.`

### 6. `q006` — Ketuk setiap pisang sambil mengira. Kemudian tekan Sedia.

- Anak mengetuk setiap objek sambil membilang, kemudian menghantar kiraannya. Objek: **5** · betul: **5**
- **Didakwa: `1.2.1` — Menamakan nombor hingga 100.**

Mengajar `1.2.1`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai. Jika app merekod ketukan dan nombor akhir secara berasingan, aktiviti ini boleh memberi bukti kepada membilang objek dan menamakan nombor bagi kuantiti.`

### 7. `q007` — Susunan manakah dari kecil ke besar?

- Pilihan: **12, 45, 78 ← betul** · 78, 45, 12 · 45, 12, 78
- Pancingan (selepas satu kali salah): Menaik bermaksud kecil ke besar.
- **Didakwa: `1.2.2` — Menentukan nilai nombor hingga 100.**

Mengajar `1.2.2`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai untuk order_ascending.`

### 8. `q008` — 45 tambah 10 jadi berapa?

- Pilihan: 46 · **55 ← betul** · 35
- Pancingan (selepas satu kali salah): Tambah satu pada tempat puluh.
- Penerangan (bersama jawapan didedah): 45 + 10 = 55.
- **Didakwa: `2.2.2` — Menambah dua nombor hasil tambah dalam lingkungan 100.**

Mengajar `2.2.2`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai. Rekod sebagai two_digit_plus_two_digit_no_bridge dengan tag diagnostik multiple_of_10.`

### 9. `q009` — Yang mana bulatan?

- Pilihan (gambar): **Bulatan ← betul** · Segi empat sama
- **Didakwa: `7.2.1` — Menamakan bentuk segiempat sama, segiempat tepat, segitiga dan bulatan.**

Mengajar `7.2.1`? ☐ Ya ☑ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Ini menguji pengecaman bulatan, bukan menamakan bulatan. Tulis semula sebagai gambar bentuk + “Apakah nama bentuk ini?” jika mahu bukti 7.2.1.`

### 10. `q010` — Nombor manakah paling kecil?

- Pilihan: 81 · **18 ← betul** · 80
- Pancingan (selepas satu kali salah): Banding tempat puluh dahulu.
- **Didakwa: `1.2.2` — Menentukan nilai nombor hingga 100.**

Mengajar `1.2.2`? ☑ Ya ☐ Tidak → SP betul `—` ☐ Tidak pasti · Catatan: `Sesuai untuk compare_smaller.`

## Sub-kemahiran — adakah senarai ini lengkap?

Setiap SP di bawah dipecahkan kepada sub-kemahiran, dan app merekod bukti bagi setiap satu **secara berasingan**. Satu SP hanya boleh dilaporkan "Dikuasai" apabila setiap sub-kemahirannya dikuasai — jadi kalau satu kemahiran hilang daripada senarai, anak tidak akan pernah ditanya mengenainya, dan kalau ada yang lebih daripada sepatutnya, anak tidak akan pernah sampai ke hujung.

Lajur **Asal** kata dari mana pecahan itu datang. Yang bertanda *keputusan app* ialah bacaan kami, bukan DSKP — itu yang paling perlu mata cikgu.

### `1.2.1` — Menamakan nombor hingga 100.

Asal: **DSKP menyenaraikannya sendiri**

| Sub-kemahiran | Diuji oleh pek ini? |
|---|---|
| Membilang objek satu demi satu | ya |
| Memilih nombor yang mewakili kuantiti yang dibilang | — |
| Membandingkan dua kumpulan objek — lebih banyak, lebih sedikit, sama banyak | — |

**Ada kemahiran yang hilang daripada senarai 1.2.1 ini?** ☑ Tidak, lengkap  ☐ Ada — yang hilang: `—`

**Ada yang tidak sepatutnya di situ?** ☑ Tidak  ☐ Ada: `—`

**Catatan cikgu:** Tukar nama “Memilih nombor yang mewakili kuantiti yang dibilang” kepada **“Menamakan nombor bagi kumpulan objek sebagai mewakili kuantiti”**. `Memilih` ialah cara jawab, bukan nama kemahiran. q003/q006 boleh menguji kemahiran ini juga jika nombor akhir direkod secara berasingan.

### `1.2.2` — Menentukan nilai nombor hingga 100.

Asal: **DSKP menyenaraikannya sendiri**

| Sub-kemahiran | Diuji oleh pek ini? |
|---|---|
| Menunjukkan kuantiti bagi nombor yang diberi | — |
| Memilih nombor bagi sekumpulan objek | — |
| Menentukan nombor yang lebih besar | ya |
| Menentukan nombor yang lebih kecil | ya |
| Menentukan nombor sebelum | — |
| Menentukan nombor selepas | ya |
| Menentukan nombor di antara | — |
| Menyusun tertib menaik | ya |
| Menyusun tertib menurun | — |

**Ada kemahiran yang hilang daripada senarai 1.2.2 ini?** ☑ Tidak, lengkap  ☐ Ada — yang hilang: `—`

**Ada yang tidak sepatutnya di situ?** ☑ Tidak  ☐ Ada: `—`

**Catatan cikgu:** Kekalkan `compare_greater` dan `compare_smaller` berasingan. Kekalkan juga `order_ascending` dan `order_descending` berasingan.

### `1.6.1` — Menyatakan nilai tempat dan nilai digit bagi sebarang nombor.

Asal: **dibaca daripada ayat SP**

| Sub-kemahiran | Diuji oleh pek ini? |
|---|---|
| Mengenal digit di tempat puluh | ya |
| Mengenal digit di tempat sa | — |
| Menyatakan nilai digit di tempat puluh | — |
| Menyatakan nilai digit di tempat sa | — |

**Ada kemahiran yang hilang daripada senarai 1.6.1 ini?** ☑ Tidak, lengkap  ☐ Ada — yang hilang: `—`

**Ada yang tidak sepatutnya di situ?** ☑ Tidak  ☐ Ada: `—`

**Catatan cikgu:** Empat pecahan ini dikekalkan: `place_tens`, `place_ones`, `value_tens`, `value_ones`.

### `2.2.2` — Menambah dua nombor hasil tambah dalam lingkungan 100.

Asal: **keputusan app, bukan DSKP**

| Sub-kemahiran | Diuji oleh pek ini? |
|---|---|
| Dua digit campur satu digit, tanpa melintasi puluh | — |
| Dua digit campur satu digit, melintasi puluh | — |
| Dua digit campur dua digit, tanpa melintasi puluh | — |
| Dua digit campur dua digit, melintasi puluh | — |
| Menambah gandaan sepuluh | ya |
| Tambah dalam bentuk situasi harian | — |

**Ada kemahiran yang hilang daripada senarai 2.2.2 ini?** ☑ Tidak, lengkap  ☐ Ada — yang hilang: `—`

**Ada yang tidak sepatutnya di situ?** ☐ Tidak  ☑ Ada: `Menambah gandaan sepuluh bukan sub-kemahiran wajib; jadikan tag diagnostik multiple_of_10. Tambah dalam bentuk situasi harian bukan sub-kemahiran wajib 2.2.2; letakkan di bawah 2.4.2.`

**Catatan cikgu:** Mastery gate `2.2.2` guna empat kelompok: `two_digit_plus_one_digit_no_bridge`, `two_digit_plus_one_digit_bridge`, `two_digit_plus_two_digit_no_bridge`, `two_digit_plus_two_digit_bridge`. q008 masuk `two_digit_plus_two_digit_no_bridge` dan boleh diberi tag `multiple_of_10`.

### `7.2.1` — Menamakan bentuk segiempat sama, segiempat tepat, segitiga dan bulatan.

Asal: **dibaca daripada ayat SP**

| Sub-kemahiran | Diuji oleh pek ini? |
|---|---|
| Menamakan segi empat sama | — |
| Menamakan segi empat tepat | — |
| Menamakan segi tiga | ya |
| Menamakan bulatan | ya |

**Ada kemahiran yang hilang daripada senarai 7.2.1 ini?** ☑ Tidak, lengkap  ☐ Ada — yang hilang: `—`

**Ada yang tidak sepatutnya di situ?** ☑ Tidak  ☐ Ada: `—`

**Catatan cikgu:** Senarai empat kemahiran penamaan ini betul. Tetapi q005 dan q009 **tidak** memberi bukti kepada `name_triangle` / `name_circle`; kedua-duanya ialah latihan pengecaman.

## Bentuk soalan — adakah penandaan kami betul?

Cikgu memecahkan variasi soalan kepada tiga paksi, dan kami menerimanya bulat-bulat. Kami kemudian menanda kesepuluh-sepuluh soalan pek ini dengannya. Yang kami minta di sini ialah sama ada penandaan itu betul — bukan sama ada paksinya betul.

| # | Soalan | Bentuk | Persembahan | Cara jawab |
|---|---|---|---|---|
| 1 | Nombor manakah yang lebih besar? | Terus | Simbolik | Pilih |
| 2 | Apakah nombor selepas 29? | Terus | Simbolik | Pilih |
| 3 | Ketuk setiap rambutan sambil mengira. K… | Terus | Visual | Ketuk |
| 4 | Nombor 63. Apakah digit di tempat puluh? | Terus | Simbolik | Pilih |
| 5 | Yang mana bentuk segi tiga? | Terbalik | Visual | Pilih |
| 6 | Ketuk setiap pisang sambil mengira. Kem… | Terus | Visual | Ketuk |
| 7 | Susunan manakah dari kecil ke besar? | Terus | Simbolik | Pilih |
| 8 | 45 tambah 10 jadi berapa? | Terus | Simbolik | Pilih |
| 9 | Yang mana bulatan? | Terbalik | Visual | Pilih |
| 10 | Nombor manakah paling kecil? | Terus | Simbolik | Pilih |

**Ada penandaan yang salah?** ☐ Tidak  ☑ Ada — yang mana dan sepatutnya apa: `q005 dan q009 bukan Terbalik. Jika dikekalkan sebagai item pengecaman: Bentuk = Terus, Persembahan = Visual, Cara jawab = Pilih. Jika hendak menjadi bukti 7.2.1, tulis semula kepada gambar bentuk + “Apakah nama bentuk ini?”.`

### Soalan bentuk — `terbalik`, atau kemahiran lain?

Kami menanda **"Yang mana bentuk segi tiga?"** dan **"Yang mana bulatan?"** sebagai **terbalik**: anak diberi nama, dan perlu mencari bentuknya. Itu definisi cikgu sendiri — diberi nilai, cari benda.

Tetapi cikgu juga pernah berkata soalan ini **ditulis terbalik** bagi SP 7.2.1, kerana 7.2.1 ialah *"menamakan"* dan soalan ini meminta pengecaman. Kami merekod itu sebagai kerja yang perlu dibuat: tukar kepada "Apakah nama bentuk ini?", yang memerlukan perubahan skema untuk meletakkan gambar dalam arahan.

**Kami rasa dua nasihat cikgu bertembung di sini, dan mungkin cikgu tidak perasan** — ia diberi dalam dua surat berasingan, beberapa minggu berbeza. Yang pertama kata soalan ini salah bentuk. Yang kedua memberi definisi `reverse` yang menjadikan soalan ini **betul**, cuma bukan satu-satunya bentuk yang diperlukan. Kami tidak memilih antara keduanya; itu keputusan cikgu.

Kedua-duanya tidak boleh betul serentak, dan jawapannya mengubah kerja:

| Kalau | Maka |
|---|---|
| Ia **terbalik** bagi kemahiran yang sama | Soalan sedia ada kekal. Kami cuma perlu menulis pasangan **terus** untuk setiap bentuk — soalan biasa, tiada perubahan skema |
| Ia **kemahiran lain** | Soalan sedia ada perlu ditulis semula, gambar mesti masuk ke dalam arahan, dan skema perlu berubah dahulu |

**Yang mana?** ☐ Terbalik, kemahiran sama  ☑ Kemahiran lain, tulis semula  ☐ Lain: `—`

### Sebelum cikgu jawab: pek ini tiada kepelbagaian bentuk langsung

Kami mengira selepas menanda. **Kesemua 9 sub-kemahiran yang pek ini sentuh ditanya dalam satu bentuk sahaja.** Lapan daripada sepuluh soalan ialah *terus*, dan dua *terbalik* itu ialah dua soalan yang cikgu sendiri kata ditulis terbalik.

Maksudnya seluruh bekalan kepelbagaian bentuk kami datang daripada satu kesilapan — dan kalau cikgu jawab "tulis semula" pada soalan sebelum ini, kami akan tinggal dengan **sifar**.

Kesannya kalau bentuk dikira: **tiada satu pun kemahiran boleh mencapai "Dikuasai" hari ini.** Bukan kerana anak, dan bukan kerana kemahiran yang belum diuji — kerana setiap soalan yang kami tulis bertanya dengan cara yang sama. Itu jurang penulisan, dan kami rasa betul untuk app berkata begitu daripada berpura-pura sebaliknya. Tetapi cikgu patut tahu harganya sebelum menjawab soalan seterusnya.

### Paksi mana yang dikira sebagai bukti berasingan?

Untuk mengira satu kemahiran sebagai *Dikuasai*, app perlu beberapa jawapan betul yang benar-benar berlainan. Persoalannya: berlainan pada paksi yang mana?

| Paksi | Cadangan kami | Sebab |
|---|---|---|
| **Bentuk** (terus / terbalik / situasi) | **Dikira** | Arah pemikiran berubah. Anak yang boleh buat terus tetapi tidak terbalik belum faham sepenuhnya |
| **Cara jawab** (pilih / ketuk / …) | **Tidak dikira** | Di mana ia benar-benar menguji perkara berlainan, senarai sub-kemahiran sudah memisahkannya — cth. mengetuk untuk membilang lawan memilih nombor ialah dua sub-kemahiran, bukan dua bentuk |
| **Persembahan** (simbolik / visual / campuran) | **Tidak dikira** | Ia mengubah kesukaran, bukan arah pemikiran. Kesukaran sudah ada medannya sendiri |
| **Variasi ayat** (A / B / C) | **Tidak dikira** | Itu sebab cikgu mengasingkannya |

**Setuju?** ☐ Ya  ☑ Tidak — sepatutnya: `Kepelbagaian prompt_form ialah penguat bukti dan ukuran kualiti bank soalan, bukan syarat universal untuk Dikuasai. Baseline mastery kekal: 3 item berbeza, betul cubaan pertama, merentas sekurang-kurangnya 2 sesi. response_mode, representation dan wording_variant juga bukan gate mastery sejagat.`

> Kesan pada pek hari ini, kalau **bentuk** yang dikira: kesepuluh-sepuluh soalan menyentuh sembilan sub-kemahiran, dan **setiap satu daripada sembilan itu ditanya dalam satu bentuk sahaja**. Tiada satu pun boleh mencapai *Dikuasai* sehingga soalan bentuk kedua ditulis. Kami rasa itu betul dan bukan masalah — tetapi cikgu yang tahu.

### Dan pengecualian: kemahiran yang hanya ada satu bentuk

Kalau bentuk dikira, satu kemahiran yang hanya **boleh** ditanya dalam satu bentuk tidak akan pernah mencapai *Dikuasai*. Itu mod kegagalan yang sama seperti menuntut tiga bentuk: **bar yang tiada siapa boleh lepasi tidak memberitahu ibu bapa apa-apa.**

Jadi kemahiran begitu dikecualikan daripada syarat bentuk, dan kekal pada tiga soalan berbeza merentas dua sesi seperti sebelum ini. Ini **cadangan kami, bukan keputusan cikgu** — cikgu yang menulis pecahan sub-kemahiran itu, jadi cikgu yang akan tahu dengan segera kalau kami tersalah baca senarainya.

**Peraturan yang mengecilkan senarai ini kepada sepuluh:**

> Apabila bentuk *terbalik* bagi satu sub-kemahiran ialah sub-kemahiran **sebelah** dalam senarai yang sama, ia **tidak** dikecualikan — buktinya cuma milik yang sebelah.

Contohnya: *terbalik* bagi **menentukan nombor sebelum** ialah **menentukan nombor selepas**, dan kedua-duanya sudah ada dalam senarai 1.2.2. Jadi kedua-duanya masih boleh ditanya secara *terus* dan *situasi*, dan tiada satu pun dikecualikan. Peraturan itu memotong senarai daripada tekaan kepada sepuluh.

**Adakah peraturan itu membaca senarai cikgu dengan betul?** ☐ Ya  ☑ Tidak: `Peraturan pengecualian ini tidak lagi diperlukan kerana kepelbagaian bentuk bukan syarat wajib mastery.`

**Sepuluh yang kami cadang kecualikan**, setiap satu dengan sebab kami:

**Membilang satu-satu menaik** · `1.5.1/count_1_up`

> Bentuk terbalik ialah membilang satu-satu MENURUN, yang sudah menjadi sub-kemahiran sebelah — buktinya milik yang itu, bukan yang ini. Yang tinggal ialah bentuk situasi, dan itu menjadikannya masalah berayat yang anak mesti baca sebelum dia boleh membilang: ia mengukur bacaan, bukan membilang.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang satu-satu menurun** · `1.5.1/count_1_down`

> Bentuk terbalik ialah membilang satu-satu MENAIK, sub-kemahiran sebelah. Bentuk situasi menuntut anak membaca cerita dahulu sebelum membilang undur, dan membilang undur sudah pun yang paling sukar antara sepuluh ini.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang dua-dua menaik** · `1.5.1/count_2_up`

> Bentuk terbalik ialah dua-dua menurun, sub-kemahiran sebelah. Bentuk situasi untuk membilang dua-dua — sepasang kasut, sepasang tangan — boleh ditulis, tetapi ia menjadi soalan darab bersamar, bukan soalan membilang.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang dua-dua menurun** · `1.5.1/count_2_down`

> Bentuk terbalik ialah dua-dua menaik, sub-kemahiran sebelah. Situasi menurun dua-dua jarang berlaku secara semula jadi, dan yang dikarang menambah bacaan tanpa menambah matematik.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang empat-empat menaik** · `1.5.1/count_4_up`

> Bentuk terbalik ialah empat-empat menurun, sub-kemahiran sebelah. Empat-empat ialah selang yang paling jarang dalam kehidupan harian antara lima selang DSKP, jadi bentuk situasi di sini hampir semestinya karangan.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang empat-empat menurun** · `1.5.1/count_4_down`

> Bentuk terbalik ialah empat-empat menaik, sub-kemahiran sebelah. Sama seperti di atas, dan lebih teruk: menurun empat-empat tiada konteks harian yang jujur.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang lima-lima menaik** · `1.5.1/count_5_up`

> Bentuk terbalik ialah lima-lima menurun, sub-kemahiran sebelah. Bentuk situasi ada — jari, syiling lima sen — tetapi ia bertukar menjadi soalan wang atau darab, iaitu SP lain.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang lima-lima menurun** · `1.5.1/count_5_down`

> Bentuk terbalik ialah lima-lima menaik, sub-kemahiran sebelah. Konteks harian untuk mengira undur lima-lima hampir tiada tanpa mengarang.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang sepuluh-sepuluh menaik** · `1.5.1/count_10_up`

> Bentuk terbalik ialah sepuluh-sepuluh menurun, sub-kemahiran sebelah. PENGECUALIAN PALING LEMAH ANTARA SEPULUH: not RM10 dan bingkai-sepuluh memberi konteks harian yang jujur, jadi bentuk situasi mungkin memang boleh ditulis di sini. Kalau cikgu setuju ia boleh, buang entri ini.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

**Membilang sepuluh-sepuluh menurun** · `1.5.1/count_10_down`

> Bentuk terbalik ialah sepuluh-sepuluh menaik, sub-kemahiran sebelah. Lebih kuat daripada pasangan menaiknya: membelanja RM10 pada satu masa ialah konteks, tetapi ia menjadi soalan wang, iaitu SP 4.0.

☐ Setuju  ☑ Tidak — sebabnya: `Tidak perlu pengecualian khas; mastery kekal pada 3 item berbeza, cubaan pertama, sekurang-kurangnya 2 sesi. Variasi bentuk dinilai pada kualiti bank soalan.`  *(1.5.1)*

> Setiap sub-kemahiran lain **tidak** dikecualikan. Itu arah yang lebih selamat untuk tersilap: tidak dikecualikan bermakna bar lebih tinggi, dan bar lebih tinggi tersilap dengan mendakwa terlalu sedikit, bukan terlalu banyak.

**Keputusan cikgu untuk bahagian ini:** Senarai pengecualian dibatalkan seluruhnya. Kekurangan variasi bentuk ialah isu **item-bank coverage**, bukan kegagalan murid mencapai mastery.

## Rujukan — teks penuh setiap SP yang didakwa

Disalin daripada dokumen di atas. Ini yang borang ini minta cikgu semak kami terhadapnya.

### `1.2.1` — Menamakan nombor hingga 100.

Nombor dan Operasi · 1.0 Nombor Bulat Hingga 100 · SK **1.2** Nilai nombor.

> (i) Membilang objek dalam kumpulan.
> (ii) Menamakan nombor bagi kumpulan objek sebagai mewakili kuantiti.
> (iii) Membandingkan kuantiti dua kumpulan objek.

### `1.2.2` — Menentukan nilai nombor hingga 100.

Nombor dan Operasi · 1.0 Nombor Bulat Hingga 100 · SK **1.2** Nilai nombor.

> (i) Menunjukkan kuantiti bagi nombor yang diberi.
> (ii) Memadankan kumpulan objek dengan nombor.
> (iii) Membandingkan nilai dua nombor.
> (iv) Menyusun kumpulan objek mengikut tertib menaik dan tertib menurun.

CATATAN DSKP:

> Menggunakan objek sebenar, gambar, garis nombor dan abakus 4:1.
> Menyatakan hubungannya 'lebih daripada' dan 'kurang daripada'.
> Sebarang nombor yang terletak di antaranya, sebelum dan selepas.

### `1.6.1` — Menyatakan nilai tempat dan nilai digit bagi sebarang nombor.

Nombor dan Operasi · 1.0 Nombor Bulat Hingga 100 · SK **1.6** Nilai tempat.

### `2.2.2` — Menambah dua nombor hasil tambah dalam lingkungan 100.

Nombor dan Operasi · 2.0 Operasi Asas · SK **2.2** Tambah dalam lingkungan 100.

### `7.2.1` — Menamakan bentuk segiempat sama, segiempat tepat, segitiga dan bulatan.

Sukatan dan Geometri · 7.0 Ruang · SK **7.2** Bentuk dua dimensi.

---

## Tandatangan

| | |
|---|---|
| Nama guru | ______________________________________ |
| Sekolah | ______________________________________ |
| Tarikh | 12 September 2026 — rekod semakan bertanda sahaja |

> **Nota:** Ruang nama dan sekolah sengaja tidak diisi. Ini ialah rekod keputusan semakan dalam projek, bukan tandatangan guru bertauliah.

Borang yang ditandatangani ialah satu-satunya perkara yang menaikkan `kssr.verified` kepada `true`.
