<!--
  RUJUKAN, BUKAN KERJA. Tiada apa dalam dokumen ini dirancang atau akan dibina
  kerananya.

  Kajian corak seni bina Pandai.org daripada dokumentasi awam mereka, dibaca
  13 September 2026. KANDUNGAN PANDAI BERHAK CIPTA — pengaki halaman mereka
  menandakannya hak cipta terpelihara — DAN TIDAK BOLEH DISALIN: bukan soalan,
  bukan penyelesaian, bukan penerangan, bukan nota, video atau kad imbas, bukan
  susunan bab atau topik mereka. Yang dikaji di sini ialah bentuk — bagaimana
  kandungan disusun dan dilampirkan — dan tiada satu pun kandungan mereka masuk
  ke repo ini.
-->

# Rujukan seni bina: corak daripada Pandai.org

## Status dokumen

| | |
|---|---|
| Jenis | Rujukan seni bina. Bukan spesifikasi, bukan pelan, bukan senarai kerja |
| Sumber | `pandai.org/en/faq`, `pandai.org/en/academic`, `pandai.org/en/features` |
| Dibaca | 13 September 2026 |
| Cara dibaca | Melalui alat pengambil halaman yang meringkaskan isinya, bukan HTML mentah. Satu laluan lebih dalam (`app.pandai.org/page/year/kssr-y1/year-1`) memulangkan 404 |
| Siapa memilih corak | Pemilik projek. Setiap perkara tentang Pandai di bawah ditanda sama ada halaman awam menyatakannya |

**Tanda pengesahan** yang dipakai sepanjang dokumen:

- **Disemak** — halaman awam yang disenaraikan menyatakannya.
- **Sebahagian** — halaman menyatakan sebahagian; yang selebihnya ditulis.
- **Tidak disemak** — dakwaan pemilik projek yang tiada dalam halaman yang dibaca. Mungkin betul; tiada siapa di sini melihatnya.

## Kandungan Pandai tidak boleh disalin

Sama seperti buku teks KPM (`docs/kssr/pemilik-kalibrasi-buku-teks-kpm-tahun-1.md`): dikaji,
tidak disalin.

- **Jangan salin** soalan, penyelesaian, penerangan, nota, transkrip video, kad imbas, nama bab
  atau susunan topik Pandai ke dalam pek kandungan, skrip audio, borang `kssr:review`, atau
  dokumen.
- **Corak bukan kandungan.** Bilangan peringkat dalam taksonomi, apa yang dilampirkan pada satu
  soalan, bagaimana beberapa permukaan berkongsi satu pokok — itu bentuk, dan itu yang direkod.
- Kalau pek kita dan pek mereka memetik kod DSKP yang sama, itu kerana kedua-duanya memetakan
  kepada dokumen KPM yang sama (`src/content/kssr/math-y1.json`), bukan kerana satu menyalin yang
  lain.

---

## Corak 1 — Taksonomi enam peringkat, dengan tahap penguasaan sebagai dimensi kandungan

**Mereka — disemak** (faq, academic). Kandungan dibahagikan mengikut gred, subjek, bab, topik,
subtopik dan tahap penguasaan, dan dipetakan kepada DSKP. Halaman menyebut *mastery level*; ia
tidak menggunakan istilah Tahap Penguasaan. Menyamakan kedua-duanya ialah bacaan kita.

**Kita.** Subjek > tahun > topik (satu pek) > aktiviti > soalan, dengan `learningStandard` dan
`subSkill` melekat pada soalan (SPEC §3.2, §3.3). Pokok DSKP sendiri — bidang > tajuk > SK > SP —
hidup dalam `src/content/kssr/math-y1.json`, dan pecahan sub-kemahiran dalam
`math-y1.skills.json`.

**Bezanya.** Mereka **mengarang pada** tahap penguasaan: ia label pada kandungan. Kita **mengira**
penguasaan daripada bukti: tiga status, tiga soalan berbeza merentas dua sesi (SPEC §5.7). Dua
perkara yang perlu tepat tentang pihak kita:

- Soalan kita **ada** aras kesukaran: `difficulty` 1–3 — pengenalan, teras, regangan (SPEC §3.1),
  wajib pada setiap soalan. Ia tidak dipetakan kepada Tahap Penguasaan, dan tiada kod di luar
  skema membacanya hari ini; tangga kesukaran SPEC §5.5 belum dibina.
- Tahap Penguasaan DSKP **tidak direkod** dalam katalog kita. Katalog menyalin SK dan SP sahaja.
  "TP 1–6" ialah pengetahuan pemilik projek tentang DSKP, belum disalin ke repo.

**Soalan terbuka: patutkah soalan membawa tag TP?** Tidak diputuskan. Tiga perkara untuk sesiapa
yang menjawabnya:

- **Guru sudah memberi amaran ke arah ini.** Dalam `docs/kssr/guru-sub-kemahiran-math-y1.md`,
  selepas mencadangkan label status app, guru menulis bahawa label itu *"tidak sepatutnya dianggap
  sama dengan Tahap Penguasaan rasmi sekolah"*. Tag TP pada soalan ialah dimensi kandungan; ia
  tidak boleh menjadi dakwaan TP tentang seorang anak.
- **Ia bersaing dengan `difficulty`.** Tag TP sama ada menggantikan aras 1–3, dipetakan kepadanya,
  atau hidup bersamanya. Setiap satu ialah keputusan skema yang berbeza.
- **Ia memerlukan TP masuk ke katalog dahulu**, seperti SK dan SP, supaya `validate:content` boleh
  menyemak tag itu terhadap dokumen dan bukan terhadap ingatan (SPEC §3.5).

---

## Corak 2 — Tiga lampiran setiap soalan

**Mereka — disemak** (faq, academic, features; dinyatakan untuk kuiz harian). Setiap soalan datang
dengan jawapan betul, **penyelesaian**, dan penerangan terperinci. Halaman tidak menyatakan sama
ada ujian topikal dan peperiksaan membawa ketiga-tiganya juga.

**Kita.** `hint` — bantuan selepas jawapan salah — dan `explain` — dipaparkan bersama jawapan yang
didedah (SPEC §3.3, §4.2). **Tiada lapisan penyelesaian**: tiada tempat untuk langkah kerja.

**Implikasi.** Untuk Tahun 1 mungkin tidak perlu; untuk Tahun 3 ia akan (pemilik projek). Bila
tiba masanya, penyelesaian ialah medan dan permukaannya sendiri, bukan `explain` yang lebih
panjang: jalur bantuan di bawah kad soalan memegang satu blok dan kad yang mengalah apabila blok
itu tinggi (DESIGN §7).

---

## Corak 3 — Satu taksonomi, banyak permukaan

**Corak paling penting dalam kajian ini.**

**Mereka — sebahagian.**

- **Disemak:** kuiz harian, ujian topikal dan peperiksaan penggal disusun mengikut kurikulum
  (faq, academic); video dipetakan kepada tahap, subjek, bab dan topik (features); bahan
  pertandingan juga disebut (faq).
- **Tidak disemak:** bahawa **nota dan kad imbas** tergantung pada pokok bab–topik yang sama.
  Kedua-duanya disebut dalam penerangan umum platform, tetapi halaman tidak menyatakan cara ia
  disusun.
- **Tidak disemak:** corak URL `kssr-y1-sc-01` (kurikulum–tahun–subjek–bab). Laluan yang kelihatan
  pada halaman awam berhenti di peringkat tahun — `app.pandai.org/page/year/kssr-y1/year-1`, dan
  laluan itu sendiri memulangkan 404 kepada alat pengambil. Segmen subjek dan bab tidak dilihat.

**Kita.** Satu permukaan: kuiz. Tetapi "taksonomi terikat pada permukaan" hanya separuh benar
tentang repo hari ini:

| Lapisan | Di mana | Terikat pada kuiz? |
|---|---|---|
| Pokok DSKP: bidang > tajuk > SK > SP | `src/content/kssr/math-y1.json` | Tidak — fail sendiri |
| Pecahan sub-kemahiran | `src/content/kssr/math-y1.skills.json` | Tidak |
| Bukti dan status penguasaan | `src/lib/coverage.ts` | Tidak — fungsi tulen atas id sub-kemahiran |
| **Unit kandungan: pek topik** | `src/content/packs/*.json` | **Ya.** Satu fail memegang identiti topik, `islandId` (pulau), `activities` — bentuk kuiz: `questionCount`, `questionIds` — dan soalannya |
| **Jenis kandungan** | `QuestionSchema` | **Ya.** Soalan ialah satu-satunya jenis. Tiada nota, video, penyelesaian atau kad imbas |
| Katalog DSKP yang wujud | `src/content/kssr/` | Matematik Tahun 1 sahaja |

Id kita sudah membawa sebahagian corak mereka: `topicId` `math-y1-nombor-100` ialah
subjek–tahun–slug, dan `activityId` menambah `-a1`. Yang tiada ialah nombor tajuk DSKP (`1.0`) dalam
id — slug kita nama, bukan kod.

**Implikasi — pemilik projek:** kalau taksonomi dipisahkan daripada permukaan sekarang, Membaca dan
Sains jadi murah nanti; kalau tidak, setiap modul membina semula.

**Bacaan terhadap jadual di atas:** separuh pemisahan itu sudah berlaku. Pokok DSKP, sub-kemahiran
dan liputan tidak tahu tentang kuiz. Yang masih terikat ialah **pek**: topik, pulau dan aktiviti
kuiz dalam satu fail, dengan soalan sebagai satu-satunya jenis kandungan. Jadi pemisahan yang
tinggal ialah soalan reka bentuk tentang pek, bukan tentang katalog. Dan setiap subjek–tahun baharu
tetap perlukan katalog DSKPnya sendiri sebelum satu kod pun boleh disemak (SPEC §3.5) — itu kos
yang pemisahan tidak menghapuskan.

---

## Corak 4 — Pelepasan berperingkat

**Mereka — sebahagian.**

- **Disemak** (academic): kandungan dilepaskan berperingkat sepanjang tahun, dan yang sudah
  dilepaskan kekal boleh diakses sepanjang tahun, supaya murid boleh mencuba semula.
- **Disemak** (faq): bahan pertandingan dilepaskan 30 hari sebelum tarikh pertandingan.
- **Tidak disemak:** bahawa urutannya mengikut sukatan. Halaman menyebut berperingkat, bukan
  urutan apa.

**Kita.** Tiada strategi pelepasan kandungan kepada pengguna. PRD §14 ialah fasa **pembangunan**,
bukan jadual pelepasan. Dua perkara dalam repo yang pelepasan berperingkat akan temui dahulu:

- `packVersion` wujud dalam skema tetapi tiada apa menggunakannya (PRD §16 item 6).
- Sesi tersimpan membekukan soalannya, jadi kandungan yang dikemas kini tidak sampai kepada anak
  yang sedang di tengah aktiviti (PRD §16 item 6).

---

## Corak 5 — Pasukan

**Mereka — disemak** (faq). Kandungan ditulis oleh guru berpengalaman, penulis dalaman dan editor,
dengan kerjasama penerbit pendidikan.

**Kita.** Seorang guru penyemak — tidak dinamakan dalam borang, dan `kssr.review.by` merekodnya
begitu — dan pemilik projek.

**Direkod sebagai sebab, bukan had.** Skop berturutan — satu modul, satu tahun, dihabiskan sebelum
yang berikutnya (PRD §5) — ialah keputusan yang betul untuk pasukan sebesar ini. PRD §5 memberi
sebabnya dari sisi kerja: tiga modul serentak ialah tiga kali kerja dengan tiada satu pun siap.
Corak ini memberi sebab dari sisi orang: corak 3 dan 4 mereka — banyak permukaan, pelepasan
sepanjang tahun — hidup di atas pasukan yang boleh mengisinya. Meniru bentuknya tanpa pasukannya
menghasilkan banyak permukaan yang kosong.

---

## Yang kita tolak — Nyawa

**Mereka — disemak** (academic). Gamifikasi mereka termasuk nyawa, syiling dan matlamat harian.
**Tidak disemak:** bagaimana nyawa hilang. Halaman tidak menyatakan bahawa jawapan salah
menghabiskannya.

**Kita — ditolak dengan sengaja.** PRD §1, dalam jadual *"Apa yang membezakan aplikasi ini"*:
*"Tiada sistem nyawa. Salah = cuba lagi, bukan hukuman"*. Disokong oleh PRD §4 prinsip 3
(kegagalan tidak menyakitkan) dan SPEC §4.2 (jangan sekali-kali sekat kemajuan).

Ia direkod di sebelah corak mereka supaya sesiapa yang membaca kajian ini kemudian tahu ketiadaan
nyawa ialah **pilihan**, bukan terlepas pandang. Kalau ia hendak dicadangkan semula, ia bermula
dengan membatalkan PRD §1, bukan dengan menambah satu ciri.

---

## Ringkasan pengesahan

| Dakwaan tentang Pandai | Status |
|---|---|
| Gred > subjek > bab > topik > subtopik > tahap penguasaan, dipetakan kepada DSKP | Disemak |
| Tahap penguasaan mereka ialah Tahap Penguasaan DSKP | Tidak disemak — istilah itu tiada dalam halaman |
| Jawapan betul, penyelesaian, penerangan terperinci setiap soalan | Disemak, untuk kuiz harian |
| Kuiz, ujian topikal, peperiksaan, video pada pokok kurikulum | Disemak |
| Nota dan kad imbas pada pokok yang sama | Tidak disemak |
| URL `kssr-y1-sc-01` = kurikulum–tahun–subjek–bab | Tidak disemak — hanya `kssr-y1` dilihat |
| Dilepaskan berperingkat, kekal boleh diakses | Disemak |
| Mengikut urutan sukatan | Tidak disemak |
| Guru, penulis dalaman, editor, penerbit | Disemak |
| Sistem nyawa | Disemak bahawa ia wujud; tidak disemak bahawa jawapan salah menghabiskannya |
