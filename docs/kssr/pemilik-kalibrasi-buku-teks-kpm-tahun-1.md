<!--
  BUKAN DOKUMEN DITERIMA DARIPADA GURU ATAU IBU BAPA.

  Fail lain dalam docs/kssr/ ialah apa yang guru dan ibu bapa hantar, tidak
  disunting, di bawah pengepala asal. Fail ini lain jenisnya: nota bacaan
  pemilik projek tentang buku teks KPM Tahun 1, disampaikan dalam sesi pada
  13 September 2026 dan ditulis di sini sebagai rujukan penulisan kandungan.
  Ia boleh dikemas kini apabila pemilik projek membaca lebih lanjut.

  Buku teks itu tiada dalam repo. Setiap pemerhatian di bawah ialah bacaan
  pemilik projek, bukan petikan yang sesiapa di sini boleh semak terhadap buku.
  Lajur kedua jadual pula disemak terhadap fail pek, dan boleh disemak semula.

  BUKU TEKS ITU TIDAK BOLEH DISALIN. Lihat bahagian kedua.
-->

# Kalibrasi terhadap buku teks KPM Tahun 1

## Status

| | |
|---|---|
| Sumber | Buku teks KPM Tahun 1, © 2016, hak cipta terpelihara. Dibaca pemilik projek pada halaman nombor bulat |
| Belum direkod | Tajuk penuh, penerbit, ISBN |
| Fail ini ialah | Rujukan penulisan kandungan: pemerhatian tentang bentuk, bukan teks |
| Fail ini bukan | Semakan guru, dokumen DSKP, atau sumber soalan |

## Buku teks TIDAK boleh disalin

Rujukan kalibrasi sahaja. Kita mengukur kandungan kita terhadapnya — panjang ayat, julat nombor,
kata kerja, watak — dan menulis soalan kita sendiri.

- **Jangan salin** soalan, ayat contoh, pasangan nombor, cerita, watak bersama situasinya, atau
  ilustrasi daripada buku teks ke dalam pek, skrip audio, borang `kssr:review`, atau dokumen.
- **Jangan transkripsi halaman** sebagai "rujukan". Kalau sesuatu perlu diingat, tulis
  pemerhatiannya — bentuk, panjang, julat — bukan teksnya.
- **Bentuk tatabahasa pendek yang biasa bukan salinan.** q010 kini *"Apakah nombor paling
  kecil?"*, yang menurut pemilik projek ialah bentuk yang sama digunakan buku teks. Itu empat
  perkataan BM biasa; nombor, pilihan, pancingan dan soalan itu sendiri milik kita.

## Pemerhatian, bersebelahan pek hari ini

Lajur kanan disemak terhadap `src/content/packs/math-y1-nombor-100.json` pada 13 September 2026.

| Pemerhatian pemilik projek | Pek `math-y1-nombor-100` |
|---|---|
| Ayat arahan 3–7 perkataan | 8 daripada 10 dalam julat itu. q003 dan q006 lapan perkataan, dalam dua ayat |
| Julat kerja sebenar 1–30, walaupun standard berkata "hingga 100" | Setiap `mcq` bernombor melepasi 30: q001 (74), q002 (39), q004 (63), q007 (78), q008 (55), q010 (81). Hanya count-tap q003 (7) dan q006 (5) di dalamnya. Tiada keputusan dibuat — SP 1.2.1 dan 1.2.2 memang "hingga 100" |
| Membandingkan **dua** nombor, bukan tiga | q001 dan q010 membandingkan tiga. Soalan terbuka, dengan kosnya: PRD §16 item 21 |
| Watak bernama, sengaja pelbagai kaum: Kumar, Ramesh, Muaz, Mei Lin, Ali, Faris, Devi, Raju | **Tiada watak** dalam mana-mana `prompt`, `hint` atau `explain` |
| Penjodoh bilangan *"biji rambutan"*, dikatakan sepadan dengan kita | **Tidak sepadan dalam teks.** Perkataan *biji* tiada dalam pek; q003 berkata *"Ketuk setiap rambutan"*. Rakaman audio tidak disemak. Dokumen guru memakainya: *"8 biji epal"* (`guru-sub-kemahiran-math-y1.md`, `guru-struktur-variasi-soalan.md`) |
| Kata kerja: Apakah, Bilang, Bandingkan, Tentukan, Padankan, Susun, Namakan, Lengkapkan | Kita guna *Apakah* (q002, q004, q010) dan *Ketuk* (q003, q006); yang lain bentuk soal *Yang mana* / *manakah* (q001, q005, q007, q009) |

## Untuk penulis soalan seterusnya

**Watak ialah konteks yang pek ini tiada.** `promptForm: contextual` ialah paksi guru
(`guru-struktur-variasi-soalan.md`), dan kedua-dua contoh guru memakai watak bernama: *"Siti ada
23 pelekat"* dan *"Ali ada 23 guli"*. Pek hari ini tiada satu pun soalan `contextual`. Apabila
bentuk kedua ditulis, watak bernama dan pelbagai kaum ialah cara buku teks membawa konteks itu —
dengan nama, situasi dan nombor kita sendiri.

**Panjang ayat ialah kos audio juga.** Setiap `prompt` dibacakan kepada anak (SPEC §3.3), jadi
ayat pendek ialah rakaman pendek.

**Pembetulan yang sudah dibuat atas nota ini:**

| Soalan | Dahulu | Kini |
|---|---|---|
| q004 | *Nombor 63. Apakah digit di tempat puluh?* | *Dalam 63, apakah digit di tempat puluh?* — satu ayat, bukan dua |
| q010 | *Nombor manakah paling kecil?* | *Apakah nombor paling kecil?* |

Kedua-duanya perlukan rakaman BM baharu. Julat nombor dan perbandingan dua nombor belum
diputuskan.
