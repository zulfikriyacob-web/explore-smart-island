# PRD.md — Aplikasi Pembelajaran Kanak-Kanak (Tahun 1–3)

**Nama kerja projek:** Explore Smart Island
**Versi dokumen:** 0.1
**Pemilik:** Zul
**Status:** Draf untuk pembangunan MVP

---

## 1. Visi

Satu aplikasi web yang *rasa* seperti permainan mudah alih, tetapi setiap ketukan skrin
adalah latihan Standard Pembelajaran KSSR yang sah.

Murid Tahun 1–3 tidak sepatutnya rasa mereka sedang "buat latihan". Mereka melayari sebuah
kepulauan tropika, membuka pulau baharu, mengumpul bintang, dan menghias avatar mereka.
Ibu bapa pula mendapat gambaran jujur tentang topik mana anak sudah kuasai dan topik mana
masih tersekat — tanpa perlu menyoal siasat anak.

**Satu ayat:** Latihan KSSR Tahun 1–3 yang dibungkus sebagai permainan pulau, dengan papan
pemuka ibu bapa yang menunjukkan penguasaan sebenar.

### Apa yang membezakan aplikasi ini

| Kebiasaan aplikasi pembelajaran | Pendirian kita |
|---|---|
| Kuiz bermasa, kira detik | **Tiada pemasa dalam pemarkahan.** Umur 7–9 belajar lebih baik tanpa tekanan masa |
| Nyawa / hati yang habis | **Tiada sistem nyawa.** Salah = cuba lagi, bukan hukuman |
| Iklan & pembelian dalam app | **Tiada iklan, tiada IAP yang disasarkan kepada kanak-kanak** |
| Kandungan generik terjemahan | **Dipetakan kepada DSKP KSSR**, konteks Malaysia (ringgit, buah tempatan, cuaca) |
| Satu bahasa sahaja | **Dwibahasa penuh** — BM/EN boleh ditukar bila-bila masa, termasuk audio |

---

## 2. Masalah yang diselesaikan

1. **Murid** — latihan bertulis membosankan; motivasi jatuh selepas 10 minit.
2. **Ibu bapa** — tidak tahu di mana anak lemah sehingga keputusan peperiksaan keluar.
3. **Bahasa** — banyak app pembelajaran berkualiti hanya dalam bahasa Inggeris; murid
   aliran kebangsaan tercicir. Sebaliknya, ibu bapa juga mahu anak biasa dengan istilah
   Matematik/Sains dalam bahasa Inggeris.

---

## 3. Pengguna sasaran

### Persona A — Aisyah, 8 tahun (Tahun 2)
Guna telefon ibu, sesi 10–20 minit selepas sekolah. Belum lancar membaca ayat panjang.
Motor halus belum mantap — sasaran sentuh kecil menyebabkan salah tekan dan kekecewaan.
**Keperluan:** arahan bersuara, butang besar, maklum balas serta-merta, sesuatu untuk dikumpul.

### Persona B — Puan Mariam, 36 tahun (ibu Aisyah)
Bekerja, tiada masa untuk menyemak latihan setiap malam.
**Keperluan:** ringkasan mingguan, tahu topik lemah, kawal masa skrin, yakin data anak selamat.

### Persona C — Cikgu Halim (fasa kemudian, **bukan skop MVP**)
Mahu tugaskan topik kepada satu kelas. Direkod di sini supaya model data tidak menghalangnya.

---

## 4. Prinsip produk

1. **Kejelasan sebelum keseronokan** — animasi tidak boleh melambatkan jawapan seterusnya.
2. **Setiap skrin boleh diselesaikan tanpa membaca** — ikon + audio dahulu, teks menyokong.
3. **Kegagalan tidak menyakitkan** — jawapan salah membawa kepada pancingan, bukan skrin merah.
4. **Ibu bapa melihat perkara sebenar** — tiada metrik hiasan; tunjukkan penguasaan dan jurang.
5. **Kurang lebih baik** — 3 modul yang mantap mengalahkan 8 modul yang cetek.

---

## 5. Skop

### Skop aktif — **Matematik Tahun 1**

Satu modul, satu tahun, dihabiskan sebelum yang berikutnya bermula. Senarai v1.0 di bawah
kekal sebagai destinasi; ini yang sedang dibina.

Urutannya: **Matematik Tahun 1 → Membaca Tahun 1 → Sains Tahun 1 → Tahun 2 → Tahun 3.**

Kenapa satu-satu, dan kenapa Matematik dahulu:

- **Matematik Tahun 1 sahaja ialah lapan tajuk, 32 Standard Kandungan dan 56 Standard
  Pembelajaran** (§7; dikira daripada `src/content/kssr/math-y1.json`). Tiga modul serentak
  bermakna tiga kali kerja itu dengan tiada satu pun siap — dan modul separuh siap tidak
  boleh diuji pada seorang kanak-kanak, kerana ia kehabisan kandungan sebelum kanak-kanak itu
  kehabisan minat.
- **Matematik paling murah dihabiskan.** Soalannya perlu audio arahan, dan itu sahaja.
  Membaca menuntut fail **dirakam manusia** untuk setiap perkataan sasaran — bukan TTS,
  kerana TTS kerap salah pada `ng`, `sy` dan vokal pendek Inggeris (§8). Itu kos produksi
  yang tidak boleh dipendekkan dengan menulis kod, dan ia tidak sepatutnya menjadi perkara
  yang menghalang modul pertama daripada siap.
- Menghabiskan satu modul dahulu juga memberi satu perkara yang tiga modul separuh siap tidak
  beri: bukti bahawa satu tahun penuh KSSR boleh dipetakan, dipersoalkan dan disahkan seorang
  guru dari hujung ke hujung — sekali, sebelum kesilapan yang sama diulang tiga kali.

### Dalam skop (MVP, v1.0)
- 3 modul: **Matematik**, **Membaca**, **Sains** — Tahun 1, 2, 3, dibina mengikut urutan
  di atas dan bukan serentak
- Dwibahasa BM ⇄ EN (teks + audio arahan)
- Sistem bintang, permata, dan siri harian
- Akaun ibu bapa + sehingga 4 profil anak
- Papan pemuka ibu bapa (penguasaan mengikut topik, masa guna, laporan mingguan)
- Web responsif, mesra telefon, boleh "Add to Home Screen" (PWA asas)
- Berfungsi luar talian untuk sesi yang sedang berjalan; disegerak apabila kembali dalam talian

### Luar skop (v1.0)
- Mod guru / kelas
- Ciri sosial, papan pendahulu awam, sembang
- Suara ibu bapa dirakam sendiri
- Tulisan tangan / lukisan huruf (perlu pengecaman tulisan — fasa 3)
- App asli iOS/Android (PWA dahulu)

---

## 6. Peta navigasi

```
Skrin Masuk
  ├─ Log masuk ibu bapa (e-mel + kata laluan)
  └─ Pilih profil anak  ──▶  PETA PULAU (skrin utama murid)
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
   Pulau Nombor            Pulau Huruf             Pulau Hidupan
   (Matematik)              (Membaca)                 (Sains)
        │                        │                        │
   Senarai topik ──▶ Senarai aktiviti ──▶ SESI KUIZ ──▶ Skrin Ganjaran
                                                              │
                                              ┌───────────────┴──────────┐
                                        Kembali ke peta          Kedai Avatar

  Pintu Ibu Bapa (dilindungi soalan matematik) ──▶ Papan Pemuka Ibu Bapa
```

**Pintu Ibu Bapa:** untuk masuk, selesaikan satu soalan darab dua digit (cth. `7 × 8`).
Cukup untuk menghalang kanak-kanak 8 tahun, tidak menyusahkan orang dewasa.

---

## 7. Modul 1 — Matematik ("Pulau Nombor")

Dipetakan kepada DSKP Matematik KSSR Tahap 1. Setiap aktiviti membawa kod Standard
Pembelajaran supaya laporan ibu bapa boleh merujuk kurikulum sebenar.

### Tahun 1 — daripada DSKP, bukan daripada ingatan

**Sumber:** DSKP KSSR (Semakan) Matematik Tahun 1, Bahagian Pembangunan Kurikulum KPM,
cetakan pertama Mei 2015, ISBN 978-967-420-104-3. Dihantar oleh seorang guru dan dibaca
terus. Senarai penuh SK dan SP disalin ke `src/content/kssr/math-y1.json`, dan
`validate:content` menyemak setiap kod pek terhadapnya.

DSKP Tahun 1 mempunyai **lapan tajuk** merentas **tiga bidang**. Bukan enam.

| Bidang | Tajuk | Standard Kandungan |
|---|---|---|
| Nombor dan Operasi | **1.0 Nombor Bulat Hingga 100** | 1.1 kuantiti secara intuitif · 1.2 nilai nombor · 1.3 menulis nombor · 1.4 kombinasi nombor · 1.5 rangkaian nombor · 1.6 nilai tempat · 1.7 menganggar · 1.8 membundarkan · 1.9 pola nombor · 1.10 penyelesaian masalah |
| Nombor dan Operasi | **2.0 Operasi Asas** | 2.1 konsep tambah dan tolak · 2.2 tambah dalam lingkungan 100 · 2.3 tolak dalam lingkungan 100 · 2.4 penyelesaian masalah · 2.5 tambah berulang · 2.6 tolak berturut-turut |
| Nombor dan Operasi | **3.0 Pecahan** | 3.1 konsep perdua dan perempat pecahan wajar · 3.2 penyelesaian masalah |
| Nombor dan Operasi | **4.0 Wang** | 4.1 wang kertas dan duit syiling · 4.2 sumber kewangan dan simpanan · 4.3 penyelesaian masalah |
| Sukatan dan Geometri | **5.0 Masa dan Waktu** | 5.1 hari dan bulan · 5.2 muka jam · 5.3 penyelesaian masalah |
| Sukatan dan Geometri | **6.0 Ukuran dan Sukatan** | 6.1 unit relatif untuk mengukur panjang, jisim dan isi padu cecair · 6.2 penyelesaian masalah |
| Sukatan dan Geometri | **7.0 Ruang** | 7.1 bentuk tiga dimensi · 7.2 bentuk dua dimensi · 7.3 penyelesaian masalah |
| Statistik dan Kebarangkalian | **8.0 Pengurusan Data** | 8.1 mengumpul, mengelas dan menyusun data · 8.2 piktograf · 8.3 penyelesaian masalah |

**Empat perkara yang senarai lama silap**, direkod supaya tiada siapa memulihkannya:

- **Pecahan (3.0) ialah Tahun 1**, bukan Tahun 3. Skopnya sempit — satu perdua, satu
  perempat, dua perempat, tiga perempat — tetapi ia ada.
- **Pengurusan Data (8.0) ialah Tahun 1**, bukan Tahun 3. Piktograf, satu gambar satu nilai.
- **Ukuran dan Sukatan (6.0) ialah Tahun 1**, bukan Tahun 2. Unit **bukan piawai** sahaja;
  sentimeter dan kilogram datang kemudian.
- **"Perkaitan dan Algebra" tiada dalam Tahun 1.** Jadual 8 DSKP meletakkan Koordinat serta
  Nisbah dan Kadaran dalam bidang itu, dan kedua-duanya bukan sekolah rendah peringkat ini.
  Pola bukan satu bidang — ia hidup di dalam tajuk: **1.9** untuk pola nombor, **7.1.3** dan
  **7.2.3** untuk pola bentuk.

Satu lagi yang senarai lama silap dan bukan hal tahun: **Wang (4.0) ialah Nombor dan
Operasi**, bukan Sukatan dan Geometri.

> ⚠️ **Status semakan.** Bahagian ini sepadan dengan dokumen. Membaca DSKP dengan betul dan
> seorang guru menyemak bahawa satu soalan benar-benar mengajar kod yang didakwanya ialah dua
> perkara berbeza. Pek `math-y1-nombor-100` kini `kssr.reviewStatus: teacher-reviewed` —
> *disemak oleh guru* melalui borang bertanda pusingan 2, **bukan** diperakui (SPEC §3.2,
> §16 item 20).

### Tahun 2 — **BELUM DISAHKAN**

Kami tiada DSKP Tahun 2. Senarai di bawah ialah senarai asal, tidak disemak, dan Tahun 1
baru sahaja menunjukkan bahawa tekaan yang munasabah meletakkan tiga topik pada tahun yang
salah. **Jangan tulis kandungan daripadanya.**

Nombor hingga 1,000 · Tambah & tolak dengan mengumpul semula · **Darab & bahagi (2, 3, 4, 5, 10)** ·
Wang hingga RM100 · Masa (setengah jam, suku jam) · Ukuran panjang & jisim · Perwakilan data mudah

### Tahun 3 — **BELUM DISAHKAN**

Sama: tiada DSKP, tidak disemak. Perhatikan bahawa Pecahan dan Piktograf muncul di sini
kerana senarai lama meletakkannya di sini — dan kedua-duanya sudah bermula dalam Tahun 1.
Apa yang sebenarnya milik Tahun 3 hanya boleh diketahui daripada DSKP Tahun 3.

Nombor hingga 10,000 · Semua operasi asas · **Pecahan wajar mudah** · Perpuluhan asas ·
Wang, masa, ukuran lanjutan · Piktograf & carta palang

### Jenis aktiviti khas Matematik
- **Ketuk & bilang** — ketuk objek satu per satu, kiraan naik dengan bunyi
- **Garis nombor** — seret penanda ke kedudukan betul
- **Dompet ringgit** — seret syiling/not untuk membentuk jumlah
- **Muka jam** — putar jarum jam ke waktu yang dinyatakan

---

## 8. Modul 2 — Membaca ("Pulau Huruf")

Dua trek berasingan, bukan terjemahan antara satu sama lain. Murid boleh maju pada kadar
berbeza dalam setiap bahasa.

### Trek Bahasa Melayu (peringkat)
1. Huruf vokal & konsonan — bunyi huruf
2. Suku kata terbuka **KV** — `ba, bu, ka, ma`
3. Perkataan **KV+KV** — `bola, meja, buku`
4. Suku kata tertutup **KVK** — `bas, kad, tin`
5. Perkataan **KVKVK** — `bulan, jalan, tangan`
6. **Diftong & vokal berganding** — `ai, au, oi` · `ua, ia`
7. **Digraf** — `ng, ny, sy, kh, gh`
8. Imbuhan asas — `me-, ber-, -kan`
9. Ayat mudah & kefahaman

### Trek English (stages)
1. Letter sounds (phonics, single letters)
2. **CVC words** — `cat, pin, dog`
3. Consonant blends — `bl, st, tr, gr`
4. Digraphs — `sh, ch, th, ph`
5. Long vowels & magic-e — `cake, kite, bone`
6. **Sight words** (Dolch pre-primer → grade 1)
7. Simple sentences & comprehension

### Jenis aktiviti khas Membaca
- **Bina perkataan** — ketuk suku kata mengikut urutan untuk membentuk perkataan
- **Dengar & pilih** — audio dimainkan, pilih perkataan yang betul daripada 3 pilihan
- **Padan gambar–perkataan** — seret perkataan ke gambar
- **Huruf hilang** — isi tempat kosong dalam perkataan
- **Baca & jawab** — 2–3 ayat, satu soalan kefahaman (Tahun 3 sahaja)

> **Keperluan audio:** setiap perkataan sasaran memerlukan fail audio yang dirakam manusia,
> bukan TTS. Sebutan suku kata BM dan bunyi fonik EN mesti tepat — TTS kerap salah pada
> `ng`, `sy`, dan bunyi vokal pendek Inggeris. Ini kos produksi yang perlu dirancang awal.

---

## 9. Modul 3 — Sains ("Pulau Hidupan")

Menekankan **kemahiran proses sains** (memerhati, mengelas, mengukur, membanding), bukan
hafalan istilah.

### Tahun 1
Deria kita · Manusia: bahagian badan & keperluan asas · Haiwan: bahagian & tempat tinggal ·
Tumbuhan: bahagian & keperluan · Objek di sekeliling: hidup vs bukan hidup

### Tahun 2
Proses hidup manusia · Haiwan: makanan & cara bergerak · Tumbuhan: tindak balas ·
Bahan: sifat & kegunaan · Magnet: menarik dan menolak · Cuaca

### Tahun 3
Kitaran hidup haiwan & tumbuhan · Keadaan bahan (pepejal, cecair, gas) · Cahaya & bayang ·
Bunyi · Bumi & langit: matahari, bulan, bintang · Teknologi & kelestarian

### Jenis aktiviti khas Sains
- **Kotak pengelasan** — seret item ke bakul kategori (`Hidup` / `Bukan Hidup`)
- **Susun kitaran** — susun peringkat kitaran hidup mengikut urutan
- **Ketuk & label** — ketuk bahagian rajah yang betul
- **Uji ramalan** — pilih apa yang akan berlaku, lalu animasi memainkan keputusan

---

## 10. Sistem gamifikasi bintang

Dua mata wang. Ini penting — mencampurkan penguasaan dengan perbelanjaan merosakkan kedua-duanya.

| | **Bintang ⭐** | **Permata 💎** |
|---|---|---|
| Maksud | Penguasaan | Mata wang belanja |
| Diperoleh | 0–3 setiap aktiviti | Sedikit setiap aktiviti + bonus siri |
| Boleh dibelanja? | **Tidak** | Ya (Kedai Avatar) |
| Boleh hilang? | Tidak. Skor tertinggi kekal | Ya, apabila dibelanja |

### Ambang bintang (berdasarkan ketepatan sahaja)

| Ketepatan aktiviti | Bintang |
|---|---|
| 95–100% | ⭐⭐⭐ |
| 80–94% | ⭐⭐ |
| 60–79% | ⭐ |
| Bawah 60% | 0 — "Cuba sekali lagi!" |

**Peraturan:** bintang aktiviti = **skor tertinggi sepanjang masa**, bukan cubaan terakhir.
Mengulang aktiviti tidak boleh menurunkan bintang. Ini menggalakkan latihan berulang tanpa
rasa takut.

### Progresi

```
Aktiviti (10 soalan)  →  0–3 ⭐
Topik (4–6 aktiviti)  →  Kunci topik seterusnya pada ≥ 60% bintang tersedia
Pulau (8–12 topik)    →  Tamat = Lencana Pulau + item avatar eksklusif
```

### Siri harian 🔥
- Bertambah apabila **satu aktiviti** disiapkan dalam sehari. Rendah dengan sengaja —
  siri sepatutnya boleh dicapai pada hari yang sibuk.
- **2 Beku Siri** disimpan; digunakan secara automatik apabila terlepas sehari.
- Tiada pemberitahuan yang mengaibkan. "Siri anda menunggu" — bukan "Anda hilang siri!"

### Kedai Avatar
Permata membeli: topi, baju, warna, haiwan peliharaan, latar belakang.
Semuanya kosmetik semata-mata. **Tiada item yang menjejaskan pembelajaran atau kesukaran.**

### Ganjaran mengejut
Peti harta karun rawak setiap ~5 aktiviti (bukan setiap kali — kebolehramalan membunuh keseronokan).
Isi: permata, item avatar, atau haiwan peliharaan baharu.

---

## 11. Akaun & Papan Pemuka Ibu Bapa

### Model akaun
```
Akaun Ibu Bapa (e-mel + kata laluan)
  ├── Profil Anak 1  (nama, umur, tahun, avatar, tetapan bahasa)
  ├── Profil Anak 2
  └── … maksimum 4
```
Anak **tidak** mempunyai log masuk sendiri. Mereka memilih avatar mereka daripada skrin profil.
Tiada e-mel, tiada nombor telefon, tiada foto anak dikumpul.

### Papan pemuka menunjukkan
1. **Petak penguasaan** — **tiga** status, ditetapkan oleh guru penyemak:
   **Belum diuji → Sedang dinilai → Dikuasai**, dan kesilapan baharu selepas dikuasai
   menurunkannya semula ke *Sedang dinilai*.

   Di bawah status, blok liputan — dan ia **menamakan** kemahiran, tidak sekadar mengira:

   ```
   Tambah dalam lingkungan 100                    Sedang dinilai
   Liputan kemahiran: 1/4 diuji
   Kemahiran yang sudah diuji: Dua digit tambah dua digit, tanpa melintasi puluh
   Kemahiran lain belum dinilai.
   ```

   Nisbah sendirian memberitahu ibu bapa terlalu sedikit. "1/4" berkata ada tiga perkara lain;
   **namanya** berkata apa yang anak sebenarnya ditanya, dan itu yang boleh ditindaklanjuti.

   **"1 daripada 4 diuji" bukan "25% dikuasai".** Tiga kemahiran lain belum diuji; anak tidak
   gagal tiga kemahiran. Larangan penuh, dan larangan kedua tentang nombor 3.7%, dalam
   SPEC §5.7 — kedua-duanya hidup bersama nombor yang ia kawal, dengan sengaja.

   Baki dilekatkan kepada kita, bukan kepada anak: *"Kemahiran lain belum dinilai."* §15
   menyenaraikan hilang kepercayaan ibu bapa sebagai risiko pemetaan salah, dan baris yang
   menyalahkan anak untuk kandungan yang kami belum tulis ialah jalan terpantas ke situ.
2. **Fokus minggu ini** — 3 topik terlemah, dengan cadangan aktiviti
3. **Masa & konsistensi** — minit sehari, hari aktif minggu ini
4. **Laporan mingguan** — ringkasan e-mel setiap Ahad malam (boleh dimatikan)

### Kawalan ibu bapa
- Had masa harian (15 / 20 / 30 / 45 minit, atau tiada had)
- Kunci bahasa (paksa BM sahaja, EN sahaja, atau benarkan anak menukar)
- Kunci aras tahun (halang anak melompat ke Tahun 3 pada minggu pertama)
- Set semula kemajuan bagi satu profil
- Padam akaun + semua data (satu butang, sah dalam 30 hari)

### Privasi & pematuhan
- Tertakluk kepada **PDPA 2010 (Malaysia)**; jika diedar di luar Malaysia, semak GDPR-K dan COPPA.
- Data minimum: nama pertama anak, tahun persekolahan, rekod kemajuan. Itu sahaja.
- Tiada analitik pihak ketiga di dalam pengalaman kanak-kanak.
- Tiada iklan, tiada pautan luar, tiada input teks bebas di mana-mana skrin kanak-kanak.

> ⚠️ Bahagian pematuhan ini adalah senarai semak kejuruteraan, bukan nasihat undang-undang.
> Dapatkan semakan peguam sebelum pelancaran awam.

---

## 12. Dwibahasa

- **Suis global** dalam tetapan profil; **suis pantas** pada skrin kuiz (ikon bendera kecil).
- Setiap rentetan disimpan sebagai `{ ms, en }`. Tiada rentetan berkod keras dalam komponen.
- Audio arahan wujud dalam kedua-dua bahasa.
- **Pengecualian:** dalam modul Membaca, bahasa **kandungan** dikunci kepada trek yang dipilih.
  Suis hanya menukar arahan UI. Menukar `bola` kepada `ball` di tengah-tengah pelajaran fonik BM
  akan merosakkan pelajaran.
- Kemajuan dijejaki secara berasingan bagi trek Membaca BM dan EN; dijejaki bersama bagi
  Matematik dan Sains.

---

## 13. Metrik kejayaan

| Metrik | Sasaran v1 | Sebab |
|---|---|---|
| Penyiapan aktiviti | ≥ 85% aktiviti dimulakan disiapkan | Mengukur sama ada sesi terlalu panjang |
| Pengekalan hari 7 (anak) | ≥ 40% | Tanda tabiat asas |
| Sesi setiap minggu aktif | ≥ 3 | Konsistensi mengalahkan tempoh |
| Penguasaan topik | ≥ 60% topik yang disentuh mencapai "Dikuasai" | Pembelajaran benar-benar berlaku |
| Lawatan papan pemuka ibu bapa | ≥ 1 setiap 2 minggu | Kes penggunaan ibu bapa berfungsi |
| Kadar keluar pada skrin ganjaran | < 15% | Ganjaran patut menarik masuk semula, bukan menamatkan |

---

## 14. Fasa pembangunan

**Satu modul pada satu masa, dalam urutan §5:** Matematik Tahun 1 → Membaca Tahun 1 → Sains
Tahun 1 → Tahun 2 → Tahun 3. Fasa di bawah mengikut urutan itu; ia pernah ditulis sebagai
tiga modul serentak, dan §5 menerangkan kenapa itu bermakna tiga kali kerja tanpa satu pun
siap.

**Fasa 1 — Rangka (2–3 minggu)**
Peta pulau, satu topik Matematik, enjin kuiz, 3 jenis soalan, bintang, storan tempatan.
*Kriteria keluar:* satu kanak-kanak sebenar boleh menyiapkan satu aktiviti tanpa bantuan.

**Fasa 2 — Matematik Tahun 1 penuh & akaun (4–6 minggu)**
Lapan tajuk DSKP, 32 SK (§7). Auth, profil, sync awan, papan pemuka ibu bapa asas.
*Kriteria keluar:* seorang guru menyemak pemetaan KSSR satu modul penuh, dan setiap pek modul itu
menjadi `kssr.reviewStatus: teacher-reviewed` — pada modul yang paling murah untuk membetulkannya.
`certified` bukan kriteria fasa ini (§16 item 20).

**Fasa 3 — Habiskan Tahun 1 (4–6 minggu)**
Membaca Tahun 1, kemudian Sains Tahun 1. Membaca membawa kos rakaman fonik manusia (§8);
rancang rakaman itu sebelum fasa ini bermula, bukan di dalamnya. Avatar + kedai. Siri.
Laporan mingguan. Muat naik audio.

**Fasa 4 — Tahun 2, kemudian Tahun 3**
Kandungan sahaja, mengikut urutan tahun. Setiap tahun memerlukan DSKP rasminya di tangan
dahulu — kami tiada Tahun 2 dan Tahun 3 hari ini, dan §7 menandakan kedua-duanya BELUM
DISAHKAN atas sebab itu.

**Fasa 5 — Penggilapan**
PWA luar talian, prestasi pada telefon murah, semakan kebolehcapaian, ujian pengguna
bersama 5 kanak-kanak sebenar setiap tahun persekolahan.

---

## 15. Andaian & risiko

| Risiko | Kesan | Tindakan |
|---|---|---|
| Kandungan KSSR salah dipeta | Ibu bapa hilang kepercayaan | Semakan guru berbayar sebelum pelancaran; kod SP kelihatan dalam papan pemuka |
| Produksi audio pantas melebihi bajet | Modul Membaca tersekat | Rakam Tahun 1 dahulu; tulis skrip semua di awal; guna satu pelakon suara setiap bahasa |
| Animasi tersekat pada peranti di bawah baseline | Kanak-kanak berputus asa | Baseline disokong: Chrome 100+ / Safari 15.4+ (peranti 2022 ke atas), diperlukan oleh Framer Motion v11; hanya animasi `transform`/`opacity` (SPEC §7.6) |
| Sesi terlalu panjang untuk umur 7 tahun | Kadar berhenti tinggi | 10 soalan maksimum; sasaran 4–6 minit setiap aktiviti; uji dengan kanak-kanak sebenar |
| Kekeliruan dwibahasa dalam Membaca | Pembelajaran fonik rosak | Kunci bahasa kandungan setiap trek (§12) |

---

## 16. Soalan terbuka

1. Adakah kita menyokong Jawi dalam trek Membaca? (Dicadangkan: tidak untuk v1.)
2. Berapa banyak soalan setiap topik diperlukan sebelum pengulangan terasa? (Dicadangkan: minimum 40.)
3. Adakah Tahun 3 memerlukan sesi lebih panjang (15 soalan)? Uji sebelum memutuskan.
4. Model perniagaan — percuma dengan langganan ibu bapa, atau bayar sekali? Belum diputuskan.
5. **Peta pulau 3D.** Kepulauan dengan kedalaman sebenar dan kamera terbang ke pulau bila
   topik dipilih. Calon untuk Fasa 3+, bukan lebih awal. Spline atau React Three Fiber.
   Ia satu skrin, dimuat sekali, di luar laluan panas kuiz — jadi belanjawan 2 MB
   SPEC.md §7.6 terpakai pada skrin itu sahaja, bukan pada setiap aktiviti.
   Risiko: runtime 3D besar, GPU pada telefon pertengahan, dan ia mesti tidak bercanggah
   dengan vektor rata DESIGN.md §8.
6. **Kemas kini kandungan tidak sampai kepada sesi yang sudah disimpan.** Soalan dibekukan
   dalam localStorage; `packVersion` wujud dalam skema tetapi belum digunakan. Akan menjadi
   masalah pada kemas kini kandungan pertama selepas pelancaran, bukan sebelum.
7. **Keperibadian pada objek boleh ketuk — hanya pada skrin ganjaran?** Muka pada buah
   ditolak untuk skrin soalan: ia melanggar peraturan DESIGN.md §6 bahawa kancil ialah maskot
   tunggal dan tidak pernah muncul semasa anak sedang berfikir, dan ia bersaing dengan nombor
   pada objek yang sudah dibilang — isyarat watak menindih isyarat keadaan pada sasaran 72px
   yang sama. Skrin ganjaran tiada kedua-dua masalah itu: kemeriahan memang dibelanjakan di
   situ (DESIGN.md §1) dan kancil sudah ada. Direkod sebagai idea sahaja; tiada kerja
   dirancang, dan ia perlu pindaan bertulis pada §10 dan DESIGN.md §6 sebelum dilaksana.
8. ~~**Skrin mula — diperlukan untuk audio, tetapi belum direka.**~~ **DISELESAIKAN (Brief 03).**
   Skrin mula wujud, dan langkah 4–7 siap: gerbang gerak isyarat, skrin itu sendiri, main
   automatik, dan prapuat satu soalan ke hadapan. Butang Mula menghantar `START` dan membuka
   kunci audio dalam gerak isyarat yang sama.

   Keputusan yang dibuat bersamanya, kerana ia menentukan apa yang skrin itu boleh janjikan:
   **sesi yang dipulihkan tidak melalui skrin ini langsung.** Ia kembali pada `question`, dan
   ketukan pertama di mana-mana yang membuka kunci audio. Akibatnya soalan pertama selepas
   menyambung semula **tidak** dibacakan sendiri — ketukan itu selalunya jawapan, dan
   membacakan soalan selepas ia dijawab lebih buruk daripada senyap. Sebab itu skrin mula tidak
   membawa ikon speaker atau tetapan audio: apa-apa janji bunyi di situ akan tidak benar untuk
   separuh laluan masuk.

   Soalan asal dikekalkan di bawah sebagai rekod sebab ia wujud.

   > Audio arahan berbunyi apabila anak menekan butang speaker, dan itu berfungsi hari ini.
   > Yang belum ialah audio **bermain sendiri** apabila soalan muncul, yang SPEC.md §8 minta
   > dan yang kriteria keluar Fasa 1 bergantung padanya: anak yang belum lancar membaca tidak
   > akan tahu untuk menekan apa-apa. iOS tidak membenarkan audio bermula tanpa gerak isyarat
   > pengguna, jadi main automatik memerlukan satu ketukan lebih awal dalam sesi — iaitu skrin
   > mula.
   >
   > Skrin itu **sengaja dibuang** daripada `store.ts`, yang menghantar `START` serta-merta
   > supaya app terus membuka aktiviti. Reducer masih menyokong keadaan `intro`; hanya skrinnya
   > yang tiada.
9. **Tiga bintang dan satu bintang mendapat maskot yang sama.** Kontrak Rive lama membawa satu
   trigger `celebrate` yang berasingan untuk ⭐⭐⭐ pada skrin ganjaran. Ia tidak dibawa masuk ke
   dalam komponen React; `KancilState` hari ini ialah empat keadaan, dan skrin ringkasan
   merender `happy` untuk setiap keputusan (SPEC §11.6).

   Confetti yang DESIGN.md §7 E2 khaskan untuk ⭐⭐⭐ juga belum dibina, jadi buat masa ini
   **tiada apa pada skrin ganjaran yang membezakan satu bintang daripada tiga**, selain kiraan
   bintang itu sendiri. Kelangkaan ialah keseluruhan hujah E2 (DESIGN.md §1: kemeriahan
   dibelanjakan pada momen ganjaran), jadi soalannya bukan "reaksi mana yang hilang" tetapi
   sama ada perbezaan itu berbaloi dibina langsung — dan kalau ya, sama ada confetti sahaja
   sudah cukup membawanya tanpa keadaan maskot kelima.

   Direkod sebagai soalan, bukan kerja dirancang. Kalau reaksi raya dikehendaki, ia ditambah
   kepada `KancilState` dalam SPEC.md §11 dahulu, kemudian dalam komponen.
10. **q005 dan q009 ialah soalan bentuk dalam pek nombor.** Kedua-duanya
    `7.2.1 Menamakan bentuk segiempat sama, segiempat tepat, segitiga dan bulatan` — bidang
    lain (Sukatan dan Geometri) dan tajuk lain (7.0 Ruang) daripada segala-galanya dalam pek
    bertajuk *Nombor Hingga 100*. `validate:content` kini memberi amaran mengenainya:
    `spans 2 DSKP topics`.

    **Keputusan: keluarkan ke pek 7.0 Ruang sendiri. Jangan namakan semula pek ini.**
    Identiti pek bukan tajuknya sahaja — `topicId: math-y1-nombor-100`, `islandId:
    pulau-nombor`, dan satu warna satu pulau (DESIGN §2.2). Menamakan semula untuk memuatkan
    dua soalan melarutkan model pulau itu. 7.0 Ruang pula tajuk Tahun 1 penuh dengan sembilan
    SP merentas bentuk 3D dan 2D; ia layak dapat pek sendiri.

    **Belum dilaksana kerana ia kerja kandungan dengan kebergantungan audio, bukan suntingan
    pemetaan.** Kosnya, supaya keputusan itu berharga apabila tiba masanya:

    | Perkara | Kos |
    |---|---|
    | Aktiviti tinggal 8 soalan kalau dibuang sahaja | Isi semula perlu **dua soalan nombor baharu** |
    | Setiap soalan wajib ada audio arahan (SPEC §3.3) | **Dua rakaman BM baharu** untuk soalan pengganti |
    | `q005`/`q009` sudah ada rakaman BM | Dipindahkan bersama soalan ke pek baharu, bukan dibuang |
    | Pek 7.0 Ruang | Fail pek sendiri, aktiviti sendiri, kemasukan pulau sendiri |

    Rakaman ialah bahagian yang tidak boleh dipendekkan dengan menulis kod — lihat §5.

    **Kemas kini selepas semakan guru — dua perkara baharu.**

    Pertama, **q008 menyertai baris ini.** Ia kini `2.2.2`, tajuk 2.0 Operasi Asas (item 11),
    jadi pek merentas tiga tajuk: `spans 3 DSKP topics`. Tiga soalan daripada sepuluh berada
    di luar tajuk pek. Itu mengubah pengiraan dalam jadual di atas — mengeluarkan ketiga-tiga
    meninggalkan aktiviti tujuh soalan, bukan lapan.

    Kedua: **q005 dan q009 ditulis terbalik bagi 7.2.1, dan akan ditulis semula — keputusan
    muktamad daripada borang bertanda.**

    Satu rekod perantaraan di sini pernah berkata soalan itu *kekal* sebagai bentuk `reverse`
    dan hanya perlu *"tulis pasangannya"*. Borang bertanda membatalkannya: kedua-dua soalan
    ditanda **☑ Tidak** untuk 7.2.1 — *"Ini menguji pengecaman segi tiga, bukan menamakan segi
    tiga"* — dan soalan bentuk dijawab **☑ Kemahiran lain, tulis semula**. Guru juga
    membetulkan penandaan kami: ia bukan `reverse`, tetapi `direct` / `visual` / `select`
    sebagai item pengecaman.

    **Sehingga ditulis semula, q005 dan q009 tidak mendakwa apa-apa SP.** Kedua-duanya kekal
    dalam aktiviti sebagai latihan pengecaman bentuk, tetapi `learningStandard` dan
    `subSkill` dibuang: soalan yang guru kata tidak mengajar 7.2.1 tidak boleh terus
    menyumbang bukti kepada `name_triangle` dan `name_circle`. Pek tidak lagi mengisytiharkan
    SK 7.2, dan amaran merentas-tajuk turun daripada tiga tajuk kepada dua.

    Jadual lapisan di bawah **kembali terpakai sepenuhnya**: tulis semula memerlukan gambar
    dalam arahan, dan skema masih tiada tempat untuknya.

    Itu bukan suntingan teks. Ia menukar jenis soalan daripada `mcq-image` kepada `mcq`
    dengan **imej dalam arahan** — dan skema tidak mempunyai tempat untuk imej dalam arahan
    (SPEC §3.3). Apa yang perlu berubah direkod di sini supaya keputusan itu tidak perlu
    diselidik semula:

    | Lapisan | Perubahan |
    |---|---|
    | `schema.ts` | Medan pilihan `promptImage: { image, alt }` pada `questionBaseShape` — `alt` dwibahasa, seperti setiap imej lain (SPEC §3.4) |
    | `collectAssetRefs` | Mesti memulangkan `promptImage` sebagai `kind: 'image'`. Soalan tanpa imej arahannya **tidak boleh dijawab**, jadi ia gagal binaan, bukan beri amaran |
    | `QuizScreen.tsx` | Perenggan arahan sudah memegang dua float — kancil 88px kanan, butang audio 64px kiri (DESIGN §7). Imej arahan ialah elemen ketiga yang bersaing untuk ruang itu |
    | **Keputusan reka bentuk sebenar** | Di mana imej itu duduk tanpa memindahkan Y baris pertama teks. DESIGN §5.2 mengukur teks bermula pada Y 89 dengan sebaran 0.65px merentas kesepuluh-sepuluh soalan; blok imej di atas teks memecahkan sebaran itu untuk dua soalan sahaja |
    | Rakaman | Arahan berubah, jadi `q005` dan `q009` perlu rakaman BM baharu juga |

    Jalan keluar yang mungkin, belum dipilih: letakkan imej arahan dalam **slot yang sudah
    ditempah** dan bukan blok baharu — slot kancil 88×88 kosong pada bahagian soalan (kancil
    tidak pernah muncul semasa anak berfikir, DESIGN §6), jadi ia satu-satunya tempat dalam
    kad yang sudah lapang dan sudah tidak menggerakkan teks. Itu memerlukan pindaan bertulis
    kepada DESIGN §7 sebelum dilaksana, kerana slot itu hari ini ialah slot maskot.
11. ~~**`explain` q008 bercakap bahasa tambah untuk standard membilang.**~~
    **DISELESAIKAN oleh semakan guru — dan ke arah yang bertentangan.**

    Rekod ini menjangka pembetulannya ialah menulis semula `explain` kepada bahasa membilang,
    supaya perkataan sepadan dengan kod `1.5.1`. Guru memutuskan sebaliknya: **soalan,
    pancingan dan penerangan ketiga-tiganya membawa murid kepada operasi tambah, jadi kodnya
    yang salah.** Soalan itu kini `2.2.2 Menambah dua nombor hasil tambah dalam lingkungan
    100`, dan teksnya menjadi *"45 tambah 10 jadi berapa?"* atas cadangan guru.

    Yang berbaloi dibawa ke hadapan: jurang itu dikesan daripada **perkataan soalan**, bukan
    daripada kod. Ketidaksepadanan antara apa yang soalan minta murid buat dan apa yang
    kodnya namakan ialah isyarat, dan isyarat itu betul — cuma kesimpulan kami tentang arah
    pembetulannya yang salah. Borang `kssr:review` meletakkan pancingan dan penerangan
    bersebelahan kod atas sebab inilah; itu yang membolehkan guru melihatnya.

    Kesan sampingan: q008 kini tajuk **2.0 Operasi Asas**, jadi pek ini merentas **tiga**
    tajuk DSKP, bukan dua. Lihat item 10 — q008 menyertai baris yang sama.
12. **"Tiga soalan berbeza" masih bermakna tiga `questionId` berbeza, bukan tiga bentuk.**
    Guru menetapkan bahawa bukti mesti datang daripada **bentuk soalan** yang berlainan.
    Contohnya untuk `1.6.1/value_of_tens_digit`:

    > *"Apakah nilai digit 6 dalam 63?"* · *"Dalam 47, digit 4 bernilai berapa?"* ·
    > *"Pilih nilai yang betul bagi digit 8 dalam 82."*

    Tiga soalan berbentuk sama mengukur hafalan bentuk, bukan kemahiran. Enjin hari ini hanya
    boleh menuntut tiga id berbeza, jadi ambang SPEC §5.7 lebih longgar daripada yang guru
    minta.

    **Cadangan, belum dibina:** medan `frame` pada soalan, daripada perbendaharaan tertutup.
    Namanya `frame` dan bukan `variant` kerana yang berbeza ialah **cara bertanya**, bukan
    kandungan — ketiga-tiga contoh di atas menguji pengiraan yang sama.

    | Lapisan | Boleh buat apa |
    |---|---|
    | Skema | Menyemak `frame` ada dan daripada enum tertutup |
    | `validate:content` | **Yang berguna:** mencetak sub-kemahiran yang soalannya kurang daripada tiga `frame` berbeza — iaitu sub-kemahiran yang **tidak boleh** mencapai Dikuasai walau berapa banyak pun soalan ditulis |
    | Enjin | Menuntut `frame` berbeza, bukan id berbeza |
    | **Tidak boleh disemak mesin** | Sama ada dua soalan bertanda `frame` berlainan benar-benar berlainan bentuk. Itu pertimbangan manusia — kelas yang sama seperti "adakah soalan ini mengajar SP ini", dan tempatnya ialah borang `kssr:review` |

    Perbendaharaan permulaan, perlu mata guru sebelum ia ditetapkan: `direct` (*"Apakah nilai
    digit 6 dalam 63?"*), `inverted` (*"Dalam 47, digit 4 bernilai berapa?"*), `select`
    (*"Pilih nilai yang betul…"*), `story` (situasi harian), `visual` (soalan dibawa oleh
    gambar).

    ~~**Berapa `frame` dituntut — tuntut 2, laporkan yang kurang daripada 3.**~~

    **Perbendaharaan lima nama ditolak guru, dan medan `frame` tunggal tidak pernah wujud.**
    Ia mencampurkan tiga perkara: cara soalan dibentuk, cara maklumat dipersembahkan, cara
    murid menjawab. Satu soalan boleh serentak ketiga-tiganya.

    Yang dibina sebagai gantinya — nilai verbatim daripada guru:

    | Paksi | Nilai |
    |---|---|
    | `promptForm` | `direct` · `reverse` · `contextual` |
    | `representation` | `symbolic` · `visual` · `mixed` |
    | `responseMode` | `select` · `input` · `tap` · `match` · `order` |
    | `wordingVariant` | `A` · `B` · `C` — variasi bahasa, **bukan** perbezaan pedagogi |

    Pembetulan guru pada `reverse` menjatuhkan contohnya sendiri: *"Apakah nilai digit 6 dalam
    63?"* dan *"Dalam 63, digit 6 bernilai berapa?"* kedua-duanya **`direct`** — ayat berubah,
    arah pemikiran sama. Yang benar-benar `reverse` ialah *"Dalam nombor 63, digit manakah
    yang bernilai 60?"*. Maksudnya tiga "bentuk" yang kami sangka ada, sebenarnya satu.

    ~~**Ambang DIPUTUSKAN: `promptForm` yang dikira.**~~ ~~**MUKTAMAD selepas semakan guru
    pusingan 2.**~~ Kedua-dua pengisytiharan itu dibatalkan — lihat di bawah dan item 18.

    **AMBANG MUKTAMAD, daripada borang semakan bertanda: tiga item berbeza, betul cubaan
    pertama, merentas sekurang-kurangnya dua sesi. Tiada syarat bentuk.**

    Bar dua-bentuk, peraturan *"bentuk sama + ayat berbeza = satu bentuk"* sebagai syarat,
    `responseMode` sebagai paksi yang *kadang-kadang* dikira, sembilan pengecualian, dan
    peraturan *"reverse ialah sub-kemahiran sebelah"* bersama syarat guru padanya — **semuanya
    dibatalkan**. Kepelbagaian bentuk ialah ukuran kualiti bank soalan, bukan gerbang
    penguasaan, jadi tiada apa untuk dikira dan tiada apa untuk dikecualikan.

    Nombor bentuk **dipindahkan**, tidak dibuang: `validate:content` mencetaknya berlabel
    `item bank:` sebagai panduan penulisan.

    #### Jurang yang tinggal — dan pembetulan pada jadual yang pernah ada di sini

    Jadual yang pernah ada di bahagian ini berkata **8** daripada 9 sub-kemahiran gagal bar
    tiga-soalan. **Itu salah.** Lapan ada **satu** soalan sahaja; yang kesembilan,
    `count_objects`, ada **dua** — dan dua masih kurang daripada tiga. Kesemua 9 gagal bar itu,
    **pada pek ketika jadual itu ditulis**. "Ada satu soalan sahaja" telah dibaca sebagai "gagal
    bar", dan dua perkara itu tidak sama. Pembetulan ini tidak mengubah arah kesimpulannya; ia
    menjadikan jurang itu lebih besar.

    **Hari ini tujuh, bukan sembilan.** Perenggan di atas pernah berkata *"Kesemua 9"* dalam
    masa kini, dan ia ditulis dalam commit yang sama (`a6f780e`) yang membuang
    `7.2.1/name_triangle` dan `7.2.1/name_circle` daripada q005 dan q009 — jadi nombor itu tidak
    pernah benar untuk pek selepas commit itu. `count_objects` bukan puncanya: id, label dan
    pemetaannya kepada q003 dan q006 tidak berubah sejak `c139f23`. `validate:content` hari ini:
    **7** sub-kemahiran — enam dengan satu soalan, `count_objects` dengan dua — dan **13** soalan
    lagi. Rekodnya dalam `docs/HANDOFF.md` §6.

    **Kemas kini, 14 September 2026: satu.** Tiga belas soalan baharu (q011–q023) ditambah, dan
    q004 mendapat pilihan ketiga. `validate:content` kini mencetak **satu** sub-kemahiran —
    `1.2.2/order_ascending`: q007, q018 dan q019, satu daripadanya dua pilihan — dan **1** soalan
    lagi, di bawah ambang SPEC §5.7 (item 22). Soalan itu ialah q024, yang ditahan (item 28).

    **Kemas kini, 17 September 2026: sifar.** q019 menjadi tiga pilihan (item 36), dan
    `validate:content` tidak lagi mencetak sebarang sub-kemahiran di bawah bar soalan.

    **Kemas kini, 18 September 2026: sifar semula.** q022 menjadi soalan latihan (item 37), yang
    meninggalkan `two_digit_plus_two_digit_no_bridge` dengan dua soalan; q025 menutupnya (item 40).

    Dengan bar bentuk hilang, bar soalan ialah **satu-satunya** jurang kepada *Dikuasai*. Ia
    ditutup dengan soalan biasa — tiada skema, tiada bentuk baharu, cuma nombor berbeza dan
    rakaman. `validate:content` kini mencetak berapa soalan lagi setiap sub-kemahiran perlukan,
    dan jumlahnya.
13. ~~**Adakah `masteredOnce` patut mengubah apa yang ibu bapa lihat?**~~
    **DISELESAIKAN — kedua-duanya diterima, tiada label keempat.**

    **Ayat sokongan**, teks diluluskan:

    ```
    Sedang dinilai — sudah pernah tunjuk kemahiran ini;
                     app sedang semak semula
    ```

    Dua calon terdahulu ditolak: *"belum cukup bukti"* membuang maklumat — ia berbunyi sama
    bagi anak yang tidak pernah sampai. *"Pernah dikuasai, sedang disemak semula"* masih
    berbunyi seperti **audit**: pasif, dan anak tiada dalam ayat. Yang diluluskan meletakkan
    **anak sebagai subjek separuh pertama** dan **app sebagai subjek separuh kedua** — tiada
    apa yang hilang, app yang sedang bekerja.

    **Belum dikunci:** akan diuji pada seorang ibu bapa sebenar sebelum dihantar.

    **Susunan "Fokus minggu ini"** (§11): kemahiran yang tergelincir mendahului yang belum
    pernah dimulakan. `standardCoverage()` memulangkan `slippedIds` untuk kedua-duanya.
    Perincian dalam SPEC §5.7.
19. **Merekod ketukan dan nombor akhir secara berasingan pada count-tap — bertembung dengan
    ujian pengguna. Belum diputuskan.**

    Borang bertanda mencatat pada q003 dan q006: *"Jika app merekod ketukan dan nombor akhir
    secara berasingan, aktiviti ini boleh memberi bukti kepada membilang objek dan menamakan
    nombor bagi kuantiti."* Itu akan membolehkan satu count-tap menyumbang kepada dua
    sub-kemahiran 1.2.1: `count_objects` dan `quantity_to_number`.

    **Tetapi count-tap hari ini tiada nombor akhir yang berasingan.** Ketukan itu sendiri ialah
    jawapan, dan kiraan ketukan dihantar terus. Langkah nombor dibuang dengan sengaja:

    > *"The number pad this used to name is gone — user testing showed it made counting two
    > steps, and a 7-year-old could not tell which step had failed."* — `schema.ts`,
    > `CountTapSchema`, `answerInput` (SPEC §3.4)

    Jadi "merekod berasingan" hanya boleh bermakna satu daripada dua perkara, dan kedua-duanya
    berharga:

    | Pilihan | Harga |
    |---|---|
    | **Kembalikan langkah nombor** — anak mengetuk, kemudian memilih atau menaip jumlah | Membalikkan keputusan ujian pengguna: kanak-kanak tersekat antara dua langkah dan tidak tahu yang mana gagal |
    | **Kira satu ketukan sebagai bukti untuk kedua-dua sub-kemahiran** | Mengira satu tindakan sebagai dua bukti. Tiada tindakan menamakan nombor untuk diperhati, jadi `quantity_to_number` akan menerima bukti yang tidak pernah berlaku |

    Pilihan pertama mungkin betul — tetapi ia keputusan reka bentuk yang perlu diuji semula
    pada kanak-kanak, bukan suntingan pemetaan.

    **Tidak dilaksana.** Sehingga diputuskan, count-tap memberi bukti kepada `count_objects`
    sahaja, seperti hari ini.
18. ~~**Borang bertanda membatalkan ambang yang PR #43 gabungkan. Belum diputuskan.**~~
    **DISELESAIKAN — bar bentuk dibalikkan mengikut borang.**

    `docs/kssr/guru-semakan-pusingan-2-bertanda.md` dikembalikan bertanda pada 12 September
    2026. Empat jawapannya **membatalkan** keputusan yang kami rekod sebagai diluluskan pada
    hari yang sama — PR #43 digabung pada 12 September 2026, 19:55; rekod asal di sini tersilap
    menyebut "sehari sebelumnya" — dan satu daripadanya membatalkan asas kepada tiga yang lain.

    | Soalan | Kami rekod | Borang bertanda kata |
    |---|---|---|
    | Paksi bukti | `promptForm` dikira | **☑ Tidak** — *"Kepelbagaian prompt_form ialah penguat bukti dan ukuran kualiti bank soalan, bukan syarat universal untuk Dikuasai."* |
    | Ambang | 3 soalan · 2 sesi · **2 bentuk** | *"Baseline mastery kekal: 3 item berbeza, betul cubaan pertama, merentas sekurang-kurangnya 2 sesi."* — tiada syarat bentuk |
    | Pengecualian | 9 diluluskan | **Kesepuluh-sepuluh ☑ Tidak.** *"Senarai pengecualian dibatalkan seluruhnya."* |
    | Peraturan "reverse ialah sebelah" | Disahkan dengan syarat | **☑ Tidak** — *"tidak lagi diperlukan kerana kepelbagaian bentuk bukan syarat wajib mastery."* |
    | q005/q009 | Kekal, tulis pasangan `direct` | **☑ Kemahiran lain, tulis semula** |

    Sebabnya satu dan konsisten: **kekurangan variasi bentuk ialah isu liputan bank soalan,
    bukan kegagalan murid mencapai penguasaan.** Kalau itu betul, bar bentuk sepatutnya menjadi
    laporan kualiti kandungan — yang `validate:content` sudah cetak setiap binaan — dan bukan
    gerbang yang menahan label seorang anak.

    **Dilaksana, atas keputusan pemilik projek selepas membaca borang.** `FORMS_FOR_MASTERY`
    dan `formExempt` dibuang daripada `coverage.ts`; bukti kini hanya `questionId` dan
    `sessionId`. Blok pengecualian dibuang daripada fail kemahiran, digantikan satu nota
    pembatalan. SPEC §5.7 menulis semula bahagian ambang. `validate:content` kini melaporkan
    dua perkara berasingan: jurang bar tiga soalan, iaitu jurang sebenar, dan kepelbagaian
    bentuk berlabel `item bank:`, iaitu laporan kualiti kandungan dan bukan gerbang. Borang
    `kssr:review` berhenti bertanya soalan paksi, pengecualian dan peraturan sebelah, kerana
    ketiga-tiganya sudah dijawab.

    **Tiga nota kandungan dalam borang yang sama:**

    - **1.2.1 — dilaksana.** *"Memilih nombor yang mewakili kuantiti yang dibilang"* dinamakan
      semula *"Menamakan nombor bagi kumpulan objek sebagai mewakili kuantiti"*, iaitu
      perkataan DSKP 1.2.1(ii). Alasannya tajam: **"Memilih" ialah cara jawab, bukan nama
      kemahiran.** Nama sub-kemahiran kita membawa `responseMode` di dalamnya, dan itu
      mencampurkan dua paksi yang guru sendiri asingkan.

      Label `1.2.2/quantity_to_number` — *"Memilih nombor bagi sekumpulan objek"* — membawa
      kecacatan yang sama. Guru tidak menyentuhnya, jadi ia **tidak diubah**; disebut di sini
      supaya ia ditanya, bukan diteka.
    - **2.2.2 — dilaksana.** *"Menambah gandaan sepuluh"* dan *"Tambah dalam bentuk situasi
      harian"* bukan sub-kemahiran wajib. Empat kelompok, id verbatim guru:
      `two_digit_plus_one_digit_no_bridge`, `two_digit_plus_one_digit_bridge`,
      `two_digit_plus_two_digit_no_bridge`, `two_digit_plus_two_digit_bridge`. q008 masuk yang
      ketiga, dengan tag diagnostik `multiple_of_10`. Situasi harian direkod sebagai milik
      **2.4.2**, belum dipecahkan kerana tiada soalan memetik 2.4.2.
    - **1.2.1 / q003, q006 — tidak dilaksana.** Merekod ketukan dan nombor akhir secara
      berasingan bertembung dengan keputusan ujian pengguna yang membuang langkah nombor.
      Item 19.

    **1.6.1 — nama berbeza, bukan pemetaan salah.** Catatan guru pada 1.6.1 menamakan empat
    pecahannya `place_tens`, `place_ones`, `value_tens`, `value_ones`; id kita ialah
    `digit_at_tens`, `digit_at_ones`, `value_of_tens_digit`, `value_of_ones_digit`. Pemetaan q004
    betul menurut kedua-dua dokumen guru: borang ini kata *"Sesuai untuk place_tens sahaja"*, dan
    pecahan A dalam `guru-sub-kemahiran-math-y1.md` ialah *"Mengenal digit di tempat puluh"*
    dengan contoh yang sama seperti q004. Id kita **tidak dinamakan semula** — *"Empat pecahan ini
    dikekalkan"* bercakap tentang pecahannya, bukan namanya. Kalau id guru mahu diguna, itu
    keputusan berasingan.

    #### Dua kesilapan pemilik projek semasa menyerahkan borang ini

    Direkod atas permintaannya sendiri: *"DAN SAYA SALAH PADA DUA PERKARA — rekod
    kedua-duanya."*

    **1. Dua petikan dikaitkan dengan borang, dan kedua-duanya tiada di dalamnya.** Mesej yang
    menyerahkan borang berkata guru mengesahkan larangan liputan-bukan-penguasaan *"dengan
    perkataannya sendiri"*: *"Nisbah 1/6 tidak boleh dianggap murid gagal 5 kemahiran lain."*
    Mesej itu meminta silang rujuk dari SPEC §5.7 ke fail ini, dan merekod keperluan *"setiap
    sub-kemahiran patut ada sekurang-kurangnya satu direct + satu reverse, kecuali
    sub-kemahiran yang membilang"* sebagai datang daripada guru. Dicari dalam fail: tiada
    kedua-duanya. Dalam perkataan pemilik projek: *"Saya membacanya daripada mesej dan
    menganggap ia daripada dokumen."*

    Silang rujuk itu **tidak ditulis**, dan keperluan direct + reverse **tidak direkod** sebagai
    keperluan kandungan guru. Atribusi palsu lebih teruk daripada tiada atribusi: seluruh sebab
    silang rujuk diminta ialah supaya larangan itu ada sumber manusia yang **benar**. Larangan
    liputan-bukan-penguasaan kekal sebagai **keputusan projek**, dan SPEC §5.7 kini menandanya
    begitu.

    **2. Borang ini disebut "ditandatangani", dan `kssr.verified` dikatakan boleh naik.**
    Dalam perkataan pemilik projek: *"Saya kata kssr.verified boleh naik. Ia tidak boleh."*
    Borang itu berkata sendiri bahawa ruang nama dan sekolah sengaja tidak diisi, bahawa ia
    *"bukan tandatangan guru bertauliah"*, dan bahawa ia *"tidak patut digunakan sendiri untuk
    menaikkan `kssr.verified`"*. **`kssr.verified` kekal `false`.**

    > **Kemas kini, 13 September 2026 (item 20):** `kssr.verified` diganti `kssr.reviewStatus`
    > tiga peringkat. Atas keputusan pemilik projek, borang ini menaikkan pek kepada
    > `teacher-reviewed`, dan tidak kepada `certified` — nota statusnya sendiri menolak yang
    > kedua. Kesilapan di atas kekal kesilapan: borang itu tidak ditandatangani.

    Kedua-duanya bentuk kesilapan yang sama: membaca apa yang dijangka ada dalam dokumen, bukan
    apa yang ada. Pembetulannya juga sama — buka fail, cari rentetan, baca nota statusnya.
17. ~~**Bila `responseMode` dikira sebagai bentuk berbeza?**~~ **TIDAK LAGI RELEVAN.**
    Borang bertanda (item 18) memutuskan bahawa tiada paksi soalan — termasuk `responseMode` —
    ialah gerbang penguasaan, jadi soalan bila ia *dikira* tidak lagi wujud. Diagnosis di bawah
    dikekalkan sebagai rekod: ia masih berguna kepada penulis soalan yang memilih
    `responseMode` atas sebab pedagogi.

    Guru menetapkan peraturannya: ia dikira **hanya jika ia mengubah cara murid berfikir, bukan
    hanya cara dia menekan.** Dua contohnya menetapkan kedua-dua hujung — `select` → `input`
    untuk nilai digit puluh **mengubah** pemikiran (pengecaman lawan pengeluaran); `tap` →
    `select` untuk membilang **tidak** (kedua-duanya memberi bahan jawapan kepada anak).

    **Boleh ia dikuatkuasakan secara mekanikal? Tidak.** Pasangan nilai yang sama membawa
    jawapan berbeza pada sub-kemahiran berbeza. `select` → `input` mengubah pemikiran untuk
    nilai digit, tetapi untuk `count_objects` menaip "7" selepas mengetuk tujuh objek tidak
    menambah apa-apa pemikiran baharu — anak sudah tahu jawapannya sebelum dia menaip.
    Peraturan itu tentang **apa yang sub-kemahiran itu tuntut**, bukan tentang pasangan mod.

    Satu heuristik mekanikal hampir berjaya dan patut direkod supaya ia tidak dicuba semula
    secara buta: **pengeluaran lawan pengecaman** — `input` menuntut anak menghasilkan jawapan,
    manakala `select` dan `tap` mempersembahkan bahannya. Ia meliputi kedua-dua contoh guru.
    Tetapi ia pecah pada `order` dan `match`: menyusun 18, 42, 27 ialah pengeluaran juga, dan
    sama ada itu bermakna "bentuk berbeza" bergantung pada sub-kemahiran — untuk
    `order_ascending` ia **memang** kemahirannya, bukan variasi bentuknya.

    **Cadangan: keputusan penulis kandungan, direkod per sub-kemahiran.** Medan pilihan dalam
    fail kemahiran, lalai **tidak dikira**:

    ```
    "value_of_tens_digit": {
      "responseModeCountsAsForm": true,
      "why": "select ialah pengecaman, input ialah pengeluaran — anak yang boleh kenal 60
              dalam senarai belum semestinya boleh mengeluarkannya"
    }
    ```

    Tiga sebab bentuk ini:

    - **Lalai selamat.** Tidak dikira bermakna bar lebih tinggi, dan bar lebih tinggi hanya
      boleh mendakwa terlalu sedikit.
    - **Ia disemak di tempat yang sama seperti pecahan sub-kemahiran** — borang `kssr:review`
      sudah merender senarai itu, jadi soalan keempat masuk ke dalam jadual yang sama.
    - **`validate:content` boleh menyemak bentuknya, bukan kebenarannya** — bahawa medan itu
      wujud, bahawa `why` ada, dan bahawa sub-kemahiran itu benar-benar mempunyai soalan dalam
      dua `responseMode` sebelum ia mendakwa faedah itu.

    Tidak dibina sehingga awak setuju pada bentuknya, dan tidak dibina sebelum sesiapa
    benar-benar perlukannya: hari ini **tiada** sub-kemahiran dalam pek mempunyai dua
    `responseMode`, jadi medan itu tidak akan mengubah satu pun nombor.
16. ~~**Jawapan salah kedua pada soalan yang sama tidak diumumkan.**~~ **DISELESAIKAN.**
    Percubaan kedua kini berkata **"Belum betul. Cuba sekali lagi."** Diukur: mutasi kawasan
    `aria-live` naik daripada 1 kepada 2, dan teksnya berbeza.

    *"Sekali lagi"* bukan hiasan untuk memaksa rentetan berbeza. Ia membawa maklumat yang sama
    seperti yang dibaca anak yang melihat daripada pilihan yang layu: **satu percubaan tinggal
    sebelum jawapan didedah.** Pengguna yang mendengar sebelum ini tidak mendapat apa-apa
    daripada itu.

    Satu varian ketiga diperlukan dan ia **mengurangkan**, bukan menambah. Pada percubaan yang
    mendedahkan jawapan, ayat menjadi **"Belum betul."** sahaja — mengundang anak "cuba sekali
    lagi" selepas jawapan ditunjukkan adalah tidak benar. Diukur pada count-tap selepas tiga
    percubaan: `"Belum betul. Jawapannya 7."`

    Tiga ayat, satu setiap keadaan, dan tiada satu pun menjanjikan sesuatu yang tidak wujud.

    Diagnosis asal dikekalkan di bawah kerana ia yang menerangkan kenapa rentetan serupa
    bermakna senyap.

    Kawasan `aria-live` mengumumkan apabila teksnya **berubah**. Pada percubaan salah pertama ia
    menjadi `"Belum betul. Cuba lagi. <pancingan>"`. Pada percubaan salah kedua, pancingan sudah
    ada dan verdict sama, jadi rentetannya **serupa** — React tidak menulis apa-apa ke DOM, dan
    pembaca skrin tidak mengumumkan apa-apa.

    Diukur dengan `MutationObserver` pada kawasan itu: percubaan pertama menghasilkan **1**
    mutasi, percubaan kedua menghasilkan **0**.

    Anak yang melihat mendapat goncangan dan ikon ✕ pada kedua-dua percubaan. Anak yang
    mendengar mendapat ayat sekali sahaja, kemudian senyap — dan senyap selepas menekan butang
    tidak dapat dibezakan daripada butang yang rosak.

    Dua pembetulan, kedua-duanya menyentuh teks yang ibu bapa dan anak dengar, jadi kedua-duanya
    perlu kelulusan:

    | Pembetulan | Kos |
    |---|---|
    | Ayat berbeza pada percubaan kedua, cth. *"Belum betul. Cuba sekali lagi."* | Satu rentetan baharu, dan nadanya mesti dipilih dengan sengaja seperti yang pertama |
    | Kandungan berubah tanpa teks baharu — cth. menyebut pilihan yang baru digugurkan: *"Belum betul. Cuba lagi. 38 bukan jawapannya."* | Lebih banyak perkataan setiap kali, dan ia menamakan kesilapan anak dengan kuat |

    Cadangan saya yang pertama: ia lebih pendek, dan *"sekali lagi"* membawa maklumat sebenar —
    anak sudah cuba dua kali dan ada satu percubaan lagi sebelum jawapan didedah.
14. **Betul/salah tidak sampai kepada pembaca skrin langsung.** ~~Diagnosis, belum dibaiki.~~
    **DISELESAIKAN.** Kawasan `aria-live` kini membawa verdict, dan `aria-disabled` menggantikan
    `disabled` supaya fokus kekal. Perinciannya dalam SPEC §9; had yang tinggal dalam item 16.

    SPEC §9 membina keseluruhan strategi kebolehcapaian di atas satu ayat: *"Betul/salah
    **tidak pernah** disampaikan melalui warna sahaja — sentiasa ikon + gerakan + bunyi."*
    **Pembaca skrin tidak menerima satu pun daripada tiga.** Ikon dalam slot `aria-hidden`,
    gerakan visual, bunyi ialah nada marimba tanpa padanan teks.

    Diukur pada halaman berjalan, soalan 1, selepas menekan jawapan:

    | | Selepas SALAH | Selepas BETUL |
    |---|---|---|
    | Kawasan `aria-live` | `"Lihat nombor di hadapan dahulu."` — pancingan sahaja | **kosong** |
    | `aria-label` butang | `"Jawapan 38"` — tidak berubah | `"Jawapan 74"` — tidak berubah |
    | Ikon ✓/✕ | dalam `aria-hidden`, tiada dalam pokok kebolehcapaian | sama |
    | Sempadan | `rgb(121,21,28)` | `rgb(21,122,67)` — warna, tidak kelihatan kepada AT |
    | `document.activeElement` | kekal pada butang | **BODY** |

    Dua perkara lebih teruk daripada "senyap":

    **Betul lebih senyap daripada salah.** Satu-satunya perkara yang diumumkan ialah
    pancingan, dan pancingan hanya muncul selepas jawapan salah. Jadi "salah" boleh disimpulkan
    secara tidak sengaja, dan "betul" tidak menghasilkan apa-apa langsung.

    **Jawapan betul memusnahkan fokus.** Semua butang jawapan menjadi `disabled`, dan butang
    yang baru ditekan hilang daripada susunan tab semasa fokus berada padanya — diukur, fokus
    melompat daripada `BUTTON[Jawapan 74]` ke `BODY`. Pengguna papan kekunci mesti menavigasi
    semula dari atas dokumen untuk mencapai "Soalan seterusnya".

    **Cadangan, mengikut susunan kos:**

    1. **Kawasan `aria-live` membawa keputusan, bukan hanya bantuan.** `spokenFeedback` kini
       pancingan + dedahan; ia patut bermula dengan verdict. Teks mesti dwibahasa (SPEC §3.1)
       dan nadanya terikat: **"Betul!"** dan **"Belum betul. Cuba lagi."** — bukan "Salah!".
       Corak untuk pemalar berlabel `LANG` sudah ada dalam `QuizScreen` bagi dedahan count-tap.
    2. **`aria-disabled` menggantikan `disabled` pada butang jawapan.** `handlePress` sudah
       pulang awal apabila `isLocked`, jadi tindakan sudah disekat tanpa `disabled`. Menukarnya
       mengekalkan butang dalam susunan tab, dan fokus tidak ke mana-mana. Ini membaiki
       kehilangan fokus **tanpa** memindahkan fokus, yang lebih baik daripada melompat ke
       "Soalan seterusnya" — memindahkan fokus mengganggu pengguna yang tidak memintanya.
    3. **Pilihan yang dipangkah membawa keadaannya dalam labelnya**, cth. `"Jawapan 38, salah"`,
       supaya pengguna yang membaca semula senarai tahu yang mana sudah gugur. Kesan kedua;
       jangan harap AT mengumumkan perubahan label secara automatik — itu kerja kawasan
       `aria-live`.

    Tidak dicadang: menukar `aria-label` sebagai saluran pengumuman utama. Banyak AT tidak
    membacakan semula label yang berubah semasa fokus berada padanya, jadi ia kelihatan
    berfungsi dalam ujian dan senyap pada peranti sebenar.
15. **Butang Mula boleh difokus tetapi tidak boleh ditekan dengan papan kekunci.**
    ~~Diagnosis, belum dibaiki.~~ **DISELESAIKAN.** `onClick` dengan penjaga `detail === 0`,
    dan laluan papan kekunci tidak menggunakan pegangan gerak isyarat. Perinciannya dalam
    SPEC §9. Diagnosis asal dikekalkan di bawah kerana ia yang menerangkan kenapa.

    DESIGN §10 meminta cincin fokus untuk ibu bapa pada desktop, dan ia ada. Diukur:
    `tabIndex 0`, garis luar fokus **3px**. Butang itu kelihatan sepenuhnya boleh digunakan.

    Ia tidak. Diukur pada butang yang difokus:

    | Tindakan | Hasil |
    |---|---|
    | `Enter` (keydown + keyup) | aktiviti **tidak** bermula |
    | `click` sintetik | aktiviti **tidak** bermula |

    `BlockButton` hanya mengendali `onPointerDown`. Tiada laluan click langsung. **Butang yang
    boleh difokus tetapi tidak boleh ditekan lebih teruk daripada tiada fokus langsung** — ia
    menjanjikan sesuatu yang tidak wujud.

    **Bolehkah Enter membuka kunci audio? Ya, dan ia tidak memerlukan laluan baharu.** Howler
    mendaftar pembuka kuncinya pada `document`, fasa capture, untuk `touchstart`, `touchend`,
    `click` **dan `keydown`**. Diukur dalam pane: `keydown` pada butang Mula yang difokus
    **sampai ke `document` dalam fasa capture**. Papan kekunci menggunakan salah satu daripada
    empat peristiwa yang Howler sudah dengar.

    Dan susunannya bertentangan dengan pepijat sentuh, yang menjadikannya selamat:

    ```
    Sentuh:       pointerdown (kita bertindak, komponen tanggal)  ->  touchstart (terlewat)
    Papan kekunci: keydown (Howler buka kunci)                    ->  click (kita boleh bertindak)
    ```

    Pembukaan kunci berlaku **dahulu** pada laluan papan kekunci. Jadi ia **tidak memerlukan
    pegangan gerak isyarat PR #33 langsung.**

    **Cadangan:** tambah laluan pengaktifan papan kekunci yang menghantar `START` **tanpa**
    melibatkan `holdForGesture`. Tiada apa untuk dipegang — `keydown` sudah sampai ke
    `document` sebelum apa-apa tanggal. Melibatkan pegangan itu pada laluan ini akan
    menyebabkan skrin mula berlengah sehingga pemasa 1000 ms, kerana pendengar pelepas
    dipasang oleh satu effect yang berjalan **selepas** render dan tidak akan wujud semasa
    click itu sendiri.

    ~~**Apa yang pane tidak boleh buktikan:**~~ **Disahkan pada laptop.** Menekan Enter pada
    butang Mula yang difokus **membuka kunci audio**, dan soalan pertama berbunyi. Dakwaan itu
    tidak lagi bersandar pada sumber Howler.

    Yang pane boleh ukur ialah **perambatan** (`keydown` sampai ke `document` dalam fasa
    capture) dan **kelumpuhan** (Enter tidak membuat apa-apa sebelum pembaikan). Ia tidak boleh
    mengukur pembukaan kunci, kerana `Howler.autoUnlock` sudah `false` dan `_audioUnlocked`
    sudah `true` di situ — context pane bermula dalam keadaan berjalan. Peranti yang menutup
    jurang itu, seperti iPhone menutup jurang PR #33.
20. **`kssr.reviewStatus` ialah rekod provenance, bukan gerbang. Tiada apa dalam kod
    menguatkuasakannya.**

    `kssr.verified` (boolean) diganti tiga peringkat — `unreviewed` · `teacher-reviewed` ·
    `certified` (SPEC §3.2). Pek `math-y1-nombor-100` menjadi `teacher-reviewed`, dengan borang
    bertanda pusingan 2 (12 September 2026) sebagai dokumennya.

    **Kenapa peringkat, bukan ya/tidak — keputusan pemilik projek.** Silibus KSSR sama di
    seluruh Malaysia, jadi perakuan bertauliah hanya perlu kalau produk dijual di luar Malaysia,
    dan app ini belum pada tahap yang menuntutnya. Tetapi silibus sama tidak bermakna pemetaan
    kita betul: guru membetulkan tiga daripada sepuluh pada pusingan pertama (SPEC §6), bukan
    kerana silibus berbeza tetapi kerana kita salah membaca dokumen yang sama. Semakan masih
    perlu; ia cuma perlu peringkat.

    **`certified` diperlukan apabila:**

    - app diedarkan di luar Malaysia; atau
    - apa-apa pemasaran membuat dakwaan pematuhan kurikulum.

    Sehingga itu `teacher-reviewed` memadai, dan papan pemuka boleh memaparkan kod SP pada
    peringkat itu dengan perkataan *"disemak oleh guru"* — bukan *"diperakui"*.

    **Jurang: pintu itu tidak pernah berkunci.** Diagnosis sebelum pertukaran mendapati
    `verified` tidak pernah menahan apa-apa. Satu-satunya kod yang membaca nilainya ialah satu
    amaran dalam `validate:content`. Tiada papan pemuka, dan tiada kod dalam `src/` membaca
    `kssr` untuk paparan. *"Kod SP disembunyikan untuk pek yang belum disahkan"* benar hanya
    kerana tiada skrin yang memaparkannya. Membuka papan pemuka pada `teacher-reviewed` membuka
    pintu yang tidak pernah berkunci.

    Dua akibat, untuk sesiapa yang hendak bergantung padanya:

    - Peraturan perkataan dalam SPEC §3.2 ialah peraturan untuk skrin yang belum wujud.
    - Status melekat pada **pek**; semakan melekat pada **soalan**. Guru menyemak sepuluh soalan
      sebagaimana pada 12 September 2026. Soalan yang ditambah atau ditulis semula selepas itu
      — q005 dan q009, dan tiga belas soalan jurang bar tiga-soalan (item 12) — akan duduk di
      bawah `teacher-reviewed` tanpa pernah dilihat guru. `review.note` dalam pek menyatakannya.

    **Kalau ia patut menjadi gerbang, itu kerja berasingan yang belum diminta.** Tiada
    penguatkuasaan dibina bersama pertukaran ini, dengan sengaja.

    **Penyemak tidak dinamakan dalam mana-mana fail.** Ruang nama dan sekolah dalam borang
    sengaja kosong, jadi `review.by` merekod itu dan bukan satu nama.
21. **Bandingkan dua nombor, seperti buku teks? Belum diputuskan.**

    Kalibrasi pemilik projek terhadap buku teks KPM Tahun 1
    (`docs/kssr/pemilik-kalibrasi-buku-teks-kpm-tahun-1.md`): buku teks membandingkan **dua**
    nombor pada peringkat ini. q001 memberi tiga pilihan, dengan 47 dan 74 — helah pembalikan
    digit yang buku teks tidak guna di sini. q010 juga membandingkan tiga.

    **Tidak ditukar, atas keputusan pemilik projek:** dua pilihan memecahkan peraturan
    tiga-percubaan (SPEC §4.2). Satu jawapan salah melumpuhkan satu pilihan, dan yang tinggal
    ialah jawapan betul.

    **Kosnya sudah dibayar pada satu soalan hari ini: q004.** Skema membenarkan `mcq` dua
    hingga tiga pilihan (`.min(2).max(MCQ_MAX_OPTIONS)`), dan q004 mempunyai dua — `6` dan `3`.
    Butang yang dipangkah tidak boleh ditekan semula (`BlockButton`, `isLocked`), dan `revealed`
    hanya ditetapkan pada kesilapan ketiga (`session.ts`). Jadi, pada mana-mana mcq dua pilihan:

    | Kos | Kesan | Pada q004 hari ini |
    |---|---|---|
    | Percubaan kedua dipaksa betul | Satu-satunya butang yang tinggal. 60 markah (SPEC §5.1) untuk tekanan yang tidak menguji apa-apa; ketepatan dan bintang naik | Ya |
    | Percubaan ketiga tidak boleh berlaku | Dedahan tidak pernah dilukis, jadi `explain` tidak pernah dipaparkan. Ini benar juga bagi setiap mcq tiga pilihan (item 23) | *"63 = 6 puluh dan 3 sa."* tidak pernah dilihat anak |
    | Peneka betul 1 daripada 2 | Tiga soalan dua-pilihan diteka betul **12.5%**, bukan 3.7%. SPEC §5.7 menyaiz ambang tiga soalan pada mcq tiga pilihan dan pernah berkata ia disaiz mengikut soalan paling mudah dalam pek (dibetulkan; item 22); q004 lebih mudah diteka daripada itu | `1.6.1/digit_at_tens` bergantung pada q004 sahaja |

    Penguasaan tidak dikira daripada percubaan kedua — ia percubaan pertama sahaja (SPEC §5.7) —
    jadi percubaan yang dipaksa itu tidak memalsukan status. Yang terjejas ialah markah dan
    bintang, `explain`, dan alasan di sebalik nombor tiga.

    **Kos menukar mana-mana mcq kepada dua pilihan:** peraturan percubaan baharu untuk jenis itu.
    Keputusan yang sama terpakai kepada q004, yang sudah pun di situ.

    **Kemas kini, 13 September 2026.** Sebab q001 ditahan dibatalkan oleh pemilik projek: *"q004
    dua pilihan membatalkan sebab saya menahan q001 — kosnya sudah dibayar, bukan hipotesis."* Dua
    baris pertama jadual di atas juga tiada lagi, kerana item 23: kesilapan yang meninggalkan hanya
    jawapan betul kini mendedah, jadi tiada percubaan dipaksa dan `explain` q004 dipaparkan. Baris
    ketiga dibawa ke guru oleh item 22. Yang tinggal ialah soalan kandungan — sama ada q001 dan q010
    menjadi perbandingan dua nombor — dengan harga baharu yang item 23 tunjukkan: `hint` pada soalan
    dua pilihan tidak pernah dilihat.

    Jadual di atas juga berkata butang yang dipangkah tidak boleh ditekan semula, dan bahawa
    `explain` q004 tidak pernah dilihat. Kedua-duanya tidak tepat pada masa itu: pembetulan dalam
    item 23.
22. ~~**Ambang tiga soalan disaiz pada soalan tiga pilihan; soalan dua pilihan lebih mudah diteka.
    Belum diputuskan — ia menyentuh ambang yang guru luluskan.**~~ ~~**DIPUTUSKAN — SPEC menyatakan
    julat; soalan dibawa ke pusingan semakan guru seterusnya.**~~ ~~**DIJAWAB — empat soalan untuk
    bukti dua pilihan, dikira daripada jawapan anak.**~~ **DIBETULKAN — siling tekaan gabungan 4%,
    daripada rekod guru.**

    SPEC §5.7 pernah berkata tiga *"disaiz mengikut soalan paling mudah dalam pek"*. Salah:
    soalan paling mudah diteka ialah dua pilihan (item 21), dan skema membenarkannya bagi `mcq`
    dan `mcq-image`. SPEC §5.7 kini menyatakan fakta tanpa memilih.

    | Bukti, semuanya diteka betul | Tiga pilihan | Dua pilihan |
    |---|---|---|
    | 3 soalan | 3.7% | 12.5% |
    | 4 soalan | 1.2% | 6.25% |
    | 5 soalan | 0.4% | 3.1% |

    Hari ini satu sub-kemahiran sahaja terjejas: `1.6.1/digit_at_tens`, yang satu-satunya soalan
    ialah q004, dua pilihan. Kalau item 21 memilih perbandingan dua nombor, `compare_greater` dan
    `compare_smaller` menjadi dua pilihan sepenuhnya, dan 12.5% menjadi kes biasa.

    | Pilihan | Apa berubah | Siapa perlu bersetuju |
    |---|---|---|
    | **A. Ambang naik untuk soalan dua pilihan** | Bukti dikira mengikut kos tekaan, bukan bilangan — contohnya lima soalan dua pilihan (3.1%), atau campuran yang hasil darabnya di bawah satu daripada dua puluh. `coverage.ts` perlu tahu bilangan pilihan setiap bukti | **Guru.** Ia mengubah *"3 item berbeza"* yang borang bertanda luluskan |
    | **B. SPEC berhenti mendakwa 3.7% sebagai sifat ambang** | Ambang kekal tiga. SPEC menyatakan julat 3.7%–12.5%, dan 3.7% hanya untuk soalan tiga pilihan. Tiada kod berubah | Pemilik projek. Borang bertanda meluluskan bilangan — *"3 item berbeza, betul cubaan pertama, merentas sekurang-kurangnya 2 sesi"* — dan tidak memetik 3.7%, jadi B tidak mengubah apa yang guru luluskan |
    | **C. Tiada soalan dua pilihan** | Skema: minimum tiga pilihan. q004 perlu pilihan ketiga. 3.7% kekal benar | Pemilik projek. Menutup item 21 ke arah bertentangan dengan kalibrasi buku teks |

    **Cadangan: B sekarang; bawa A kepada guru jika item 21 memilih dua nombor.** B menjadikan
    SPEC benar tanpa mengubah apa yang guru luluskan, dan hari ini hanya satu soalan terjejas. A
    patut ditanya apabila bukti dua pilihan menjadi biasa, bukan sebelum.

    **DIPUTUSKAN, 13 September 2026: B.** Dalam perkataan pemilik projek: *"Guru yang meluluskan
    tiga; dia yang patut memutuskan sama ada ia mencukupi untuk soalan dua pilihan."* SPEC §5.7
    menyatakan julat, ambang kekal tiga, dan soalan itu **ditanya pada pusingan semakan
    seterusnya**: `kssr:review` kini menjana bahagian *"Ambang untuk soalan dua pilihan"* setiap
    kali soalan yang mendakwa sub-kemahiran mempunyai dua pilihan — hari ini q004. Kebarangkalian
    dalam borang dikira oleh penjana, bukan disalin.

    **DIJAWAB, 14 September 2026.** Menurut dokumen pembetulan
    (`docs/kssr/pembetulan-akhir-soalan-math-y1.md` — ditulis Claude, ringkasan dan bukan perkataan
    guru; item 29), guru meluluskan **empat soalan** untuk
    soalan dua pilihan, `(1/2)⁴ = 6.25%`. Peraturan dalam SPEC §5.7, dikuatkuasakan dalam
    `coverage.ts`: **(a)** ≥ 3 soalan berbeza tiga pilihan atau lebih, **atau (b)** ≥ 4 soalan
    berbeza apa pun bilangan pilihannya — kedua-duanya percubaan pertama, merentas ≥ 2 sesi.

    Jadual liputan dalam dokumen yang sama mengira ambang mengikut **bank**: satu soalan dua pilihan
    (q019) menaikkan `order_ascending` kepada empat. Pemilik projek membetulkannya sebelum ia
    dilaksana — *"Jadual dalam dokumen saya salah"* — kerana hujah 6.25% ialah tentang apa yang anak
    jawab, dan mengira mengikut bank *"menghukum anak untuk komposisi bank soalan"*.

    `kssr:review` berhenti bertanya soalan ini, kerana ia sudah dijawab.

    **DIBETULKAN, 17 September 2026 — "empat soalan" bukan peraturan guru.** Rekod guru yang dibina
    semula (`docs/kssr/guru-rekod-jawapan-subkemahiran-dan-semakan-soalan.md`) berkata guru *"tidak
    menetapkan"* `dua pilihan = mesti empat soalan` *"secara mutlak"*. Peraturannya:

    > *"Minimum 3 item berbeza + minimum 2 sesi + kebarangkalian tekaan gabungan ≤ 4%."*

    Empat soalan datang daripada dokumen pembetulan yang ditulis Claude, dan disalin ke
    `coverage.ts` dalam `952dc77` bersama komen *"Approved in teacher review"*. Komen itu atribusi
    palsu, dan dibuang. Kelas kesilapan yang sama seperti item 18: ringkasan dibaca sebagai perkataan
    guru.

    | Bukti yang anak beri | Tekaan | Peraturan lama, syarat (b) | Siling 4% |
    |---|---|---|---|
    | 4 dua pilihan | 6.25% | Dikuasai | Tidak |
    | 3 dua pilihan + 1 tiga pilihan | 4.2% | Dikuasai | Tidak |

    Hanya dua gabungan itu berubah; setiap gabungan lain memberi keputusan yang sama. Kedua-duanya
    perlukan tiga soalan dua pilihan dalam satu sub-kemahiran. Sejak stor kemajuan wujud (`993acdd`,
    15 September 2026), q019 ialah satu-satunya soalan dua pilihan yang membawa sub-kemahiran, jadi
    tiada peranti boleh memegang bukti begitu dan tiada `masteredOnce` tersimpan yang salah kerana
    ini. Kesimpulan daripada sejarah pek, bukan bacaan storan peranti. Kecacatan itu akan menjadi
    nyata jika item 21 memilih perbandingan dua nombor.

    **Dibina, atas keputusan pemilik projek:** siling dalam `skillState()`, melalui `guessOdds()`,
    yang `validate:content` turut panggil. Dua andaian kita, bukan peraturan guru, direkod dalam
    SPEC §5.7: count-tap dikira tiga pilihan, dan soalan yang buktinya bercanggah tentang bilangan
    pilihan dikira dua pilihan.
23. ~~**`explain` tidak boleh dicapai pada setiap `mcq`, bukan hanya yang dua pilihan. Tiga
    daripada tiga dalam pek. Belum diputuskan.**~~ **DISELESAIKAN — jawapan didedah apabila anak
    tidak boleh salah lagi.**

    `explain` dilukis hanya bersama dedahan, dan dedahan hanya pada kesilapan ketiga
    (`session.ts`, `revealed`). Setiap salah memangkah pilihan yang digunakan, dan pilihan yang
    dipangkah tidak boleh ditekan semula: `BlockButton` pulang awal apabila `isLocked`, pada
    laluan penunjuk dan papan kekunci. Jadi soalan pilihan perlu **empat** pilihan untuk sampai
    ke kesilapan ketiga, dan `mcq` dihadkan kepada tiga (SPEC §3.4).

    | Soalan | Jenis | Pilihan | Kesilapan paling banyak | `explain`, tidak pernah dilihat |
    |---|---|---|---|---|
    | q001 | `mcq` | 3 | 2 | *"74 ada 7 puluh. 47 ada 4 puluh sahaja."* |
    | q004 | `mcq` | 2 | 1 | *"63 = 6 puluh dan 3 sa."* |
    | q008 | `mcq` | 3 | 2 | *"45 + 10 = 55."* |

    Tiada soalan lain dalam pek membawa `explain`. count-tap boleh sampai ke dedahan dan memakai
    *"Jawapannya N."*.

    **Kenapa tiada apa menangkapnya:**

    - Ujian *"reveals the answer after three misses"* dalam `session.test.ts` sampai ke dedahan
      dengan menekan pilihan `a` **sekali lagi** selepas ia dipangkah. Reducer menerimanya; UI
      tidak. Ujian itu lulus pada laluan yang tiada anak boleh ambil.
    - `validate:content` sudah mengira ini (`canReachReveal`), tetapi hanya menggunakannya untuk
      membenarkan `hint` dan `explain` bersama. Ia kini memberi amaran bagi setiap `explain` yang
      tidak boleh dicapai.

    | Pilihan | Apa berubah | Kos |
    |---|---|---|
    | **(i) Buang `explain`** daripada soalan yang tidak boleh mendedahkan; amaran menjadi ralat | Kandungan sahaja | Tiga penerangan hilang. q001 ialah yang menerangkan helah 47/74 — saat anak yang keliru paling memerlukannya |
    | **(ii) Dedahkan apabila hanya jawapan betul yang tinggal.** Kesilapan yang meninggalkan satu pilihan menamatkan soalan: jawapan dan `explain` dipaparkan, 0 markah | Peraturan percubaan jenis pilihan (SPEC §4.2) dan markah (§5.1) | Tekanan dipaksa hilang — 30 markah percuma pada tiga pilihan, 60 pada dua pilihan (item 21). q001, q004 dan q008 membawa `hint` **dan** `explain`, jadi dedahan yang boleh dicapai melanggar peraturan satu jalur (SPEC §3.5, DESIGN §7) pada ketiga-tiganya: perlu diputuskan sama ada `explain` menggantikan `hint` dalam jalur semasa dedahan |
    | **(iii) Tunjukkan `explain` bersama "Betul!"** selepas jawapan betul yang didahului kesilapan | Paparan sahaja | Tekanan dipaksa dan markah percumanya kekal. `hint` masih dipaparkan selepas jawapan betul (`showHint` bergantung pada `hintShown` sahaja), jadi pertembungan jalur yang sama berlaku |

    **Cadangan: (ii).** Ia satu-satunya pilihan yang membetulkan tiga perkara dengan satu
    peraturan: `explain` yang mati, markah untuk tekanan yang tidak menguji apa-apa, dan peraturan
    percubaan dua pilihan yang item 21 perlukan. Tetapi ia perubahan tingkah laku dan pemarkahan
    yang menyentuh SPEC §3.5, §4.2, §5.1 dan DESIGN §7, dan ia tidak dibina di sini.

    **DIPUTUSKAN, 13 September 2026: (ii), dan dibina.** Dalam perkataan pemilik projek:
    *"explain bukan mesej percubaan ketiga, ia mesej untuk bila anak tidak boleh gagal lagi."*

    - `missesLeft()` dalam `session.ts` memutuskan bila soalan tamat. `validate:content` dan ayat
      verdict memanggil fungsi yang sama, jadi ketiga-tiganya tidak boleh berbeza pendapat.
    - Dedahan **menggantikan** pancingan dalam jalur, supaya jalur memegang satu blok. Diukur di
      pane: `aria-live` membacakan *"Belum betul. &lt;explain&gt;"* pada ketiga-tiga dedahan baharu, dan
      pancingan tidak dibaca bersamanya.
    - *"Cuba sekali lagi"* kini bermaksud satu kesilapan lagi sebelum jawapan ditunjukkan, jadi
      pada tiga pilihan ia dibaca selepas kesilapan pertama.
    - **Kos yang tinggal: pancingan q004 kini tidak pernah dilihat.** Dua pilihan mendedah pada
      kesilapan pertama, jadi *"Tempat puluh ada di sebelah kiri."* tiada peluang untuk muncul.
      `validate:content` memberi amaran. Satu `explain` yang mati pada setiap mcq diganti oleh satu
      `hint` yang mati pada satu soalan.
    - Kad q001 terpotong 9px pada 390 × 740, dan 27px dengan inset iPhone — padding sahaja, teks
      penuh (DESIGN §7).

    **Pembetulan pada diagnosis di atas, 13 September 2026.** Item ini berkata pilihan yang
    dipangkah tidak boleh ditekan semula, dan bahawa `explain` q001, q004 dan q008 tidak pernah
    dilihat. **Kedua-duanya tidak tepat.** Pilihan yang **terakhir** dipangkah kekal boleh ditekan:
    ia melukis ✕ dalam keadaan `wrong`, dan `BlockButton` hanya mengunci `disabled` dan `correct`.
    Menekannya semula menghabiskan satu percubaan. Diukur di pane pada q001: tiga ketukan pada 47
    mendedahkan jawapan tanpa 38 pernah dicuba, dan ketukan kedua tidak diumumkan kerana ayatnya
    serupa. Jadi `explain` pada mcq tiga pilihan **boleh** dicapai sebelum ini — melalui laluan yang
    salah, mengetuk jawapan salah yang sama tiga kali. Ujian *"reveals the answer after three
    misses"*, yang item ini kata mengambil laluan yang tiada anak boleh ambil, sebenarnya mengambil
    laluan itu.

    Dibaiki dalam enjin, bukan butang: `sessionReducer` kini mengabaikan jawapan pada pilihan yang
    sudah dipangkah. Keadaan `wrong` tidak boleh dikunci dalam `BlockButton`, kerana butang Sedia
    count-tap memakai keadaan yang sama dan mesti boleh ditekan semula.
24. ~~**Tiga soalan tersekat pada gambar-dalam-arahan: q005, q009 dan q019.**~~ **Dua sahaja: q005
    dan q009. q019 tidak pernah memerlukannya — item 36.**

    Item 10 merekod jurang skema ini untuk q005 dan q009: skema tiada tempat untuk imej dalam
    arahan (SPEC §3.3). q019 kini menunggu jurang yang sama. Menurut dokumen pembetulan
    (item 29), guru membenarkan tiga nombor untuk tertib **dengan sokongan visual**, dan tidak
    tanpanya — jadi q019 ditulis dengan dua nombor, *"Kad Raju: 14, 9."*, dan dua pilihan.

    | Soalan | Menunggu |
    |---|---|
    | q005 | Gambar bentuk dalam arahan, pilihan sebagai nama |
    | q009 | Sama |
    | q019 | Tiga nombor, dengan kad bernombor sebagai sokongan visual |

    **Menyelesaikan jurang itu menyelesaikan ketiga-tiganya, dan menjadikan q024 tidak perlu.**
    Dengan q019 tiga pilihan, `order_ascending` ada tiga soalan tiga pilihan — q007, q018, q019 —
    dan ambang SPEC §5.7 boleh dicapai tanpa soalan keempat. Hari ini ia ada dua, jadi ia
    perlukan q024 (item 28).

    **Kosnya belum diukur.** Jadual lapisan item 10 terpakai kepada ketiga-tiganya: `schema.ts`,
    `collectAssetRefs`, `QuizScreen.tsx`, di mana imej duduk tanpa memindahkan baris pertama teks
    soalan, dan rakaman. Dokumen pembetulan menyebut DESIGN §5.2 menetapkan teks bermula pada
    Y 168; DESIGN §5.2 hari ini menetapkan **Y 89**. Y 168 pernah menjadi nilainya dan dibalikkan
    di situ.

    Pancingan q019 dalam spesifikasi — *"Cari nombor paling kecil dahulu."* — **dibuang**, atas
    keputusan pemilik projek. Dua pilihan mendedah pada kesilapan pertama (SPEC §4.2), jadi ia tidak
    pernah dilihat: masalah yang sama seperti `explain` yang mati dalam item 23. Kalau q019 menjadi
    tiga pilihan, pancingan ditulis semula ketika itu.

    **Kemas kini, 17 September 2026.** Rekod guru yang dibina semula membetulkan bacaan di atas:
    "sokongan visual" *"tidak semestinya bermaksud perlu gambar atau animasi"*, tetapi *"paparan
    yang bersih dan mudah dilihat"*. q019 kini tiga nombor dan tiga pilihan, dalam teks arahan
    biasa, tanpa perubahan skema (item 36). Jadual di atas tinggal q005 dan q009, dan item 10
    kekal jalannya.
25. **Kad diseret untuk tertib — `responseMode: order`, kerja Fasa 3, dengan sebab pedagogi.**

    Menurut dokumen pembetulan (item 29), guru menyatakan bahawa menyusun kad **menghasilkan**
    susunan, manakala memilih daripada senarai hanya **mengecam** susunan, dan yang pertama lebih
    dekat dengan apa yang SP 1.2.2 (iv) minta: *"Menyusun kumpulan objek mengikut tertib menaik dan
    tertib menurun."* (`src/content/kssr/math-y1.json`).

    **Itu sebab pedagogi, bukan andaian reka bentuk.** Item 17 sudah mencatat bahawa bagi
    `order_ascending`, menyusun ialah kemahiran itu sendiri, bukan variasi bentuknya.

    Hari ini `order_ascending` ditanya dengan `select` sahaja — q007, q018, q019. Jenis `sequence`
    disenaraikan dalam SPEC §3.3 tetapi di luar subset MVP, dan skema menolaknya. Tidak dibina.
    Direkod supaya apabila Fasa 3 tiba, sebabnya sudah ada dan tidak perlu ditemui semula.
26. **Butang Sedia mesti membawa isyaratnya sendiri sebelum "Kemudian tekan Sedia." dibuang
    daripada rakaman.**

    Menurut dokumen pembetulan (item 29), guru mahu ayat itu dibuang daripada arahan
    count-tap: arahan itu milik butang, bukan ayat, dan isyaratnya ialah **keadaan butang yang
    berubah bila ketukan bermula, ikon, dan bunyi pendek**.

    **Tetapi hari ini audio arahan ialah satu-satunya saluran bukan teks yang menyuruh anak
    menekan Sedia.** Diagnosis, 14 September 2026, daripada kod dan skrip rakaman — tidak diuji
    pada peranti atau pembaca skrin:

    | Saluran | Hari ini | Menyuruh tekan Sedia? |
    |---|---|---|
    | Audio arahan | Dimainkan sendiri; dirakam daripada ayat yang mengandungi *"Kemudian tekan Sedia."* | **Ya — satu-satunya** |
    | Butang | Perkataan "Sedia". Keadaan `rest` sejak soalan muncul, `wrong` hanya selepas jawapan salah (`QuizScreen.tsx`). Tidak berubah bila ketukan bermula. Tiada ikon | Tidak |
    | Kiraan | Nombor pada setiap objek yang diketuk, dan *"Dibilang: N"* | Tidak — ia menunjukkan kiraan, bukan langkah seterusnya |
    | Bunyi dan getaran ketukan | Tiada. Bunyi UI SPEC §8 belum dilaksanakan | Tidak |

    **Diputuskan oleh pemilik projek:** q003, q006 dan q011 **kekal** membawa *"Kemudian tekan
    Sedia."* sehingga isyarat itu dibina, dan q003 serta q006 tidak dirakam semula. Membuang ayat
    dahulu meninggalkan anak yang belum boleh membaca tanpa sebarang isyarat. Kosnya: arahan q011
    sembilan perkataan, di luar julat 3–7 kalibrasi buku teks.

    **Urutan kerja:** bina isyarat butang, ukur pada bingkai 0 (CLAUDE.md prinsip 5) dan uji pada
    kanak-kanak; kemudian buang ayat daripada ketiga-tiga arahan, dan rakam semula tiga klip.

    **Sebab kedua untuk kerja yang sama — teks arahan membalut tidak sekata, 16 September 2026.**
    Dilihat buat kali pertama pada iPhone, pada q011. Diukur di pane pada 390×740:

    - Dua float dalam perenggan arahan — butang audio 62px + margin 16px di kiri, slot kancil 85px +
      margin 16px di kanan — meninggalkan **jalur sempit 121px daripada 299px**, iaitu 40%. Dari
      baris keempat ke bawah teks mendapat 299px penuh: **lompatan 2.47 kali ganda**.
    - **q003 dan q006 sudah begitu sejak sepuluh soalan pertama.** Kedua-duanya berakhir dengan baris
      penuh 281px selepas tiga baris 61–103px. Ini mendahului enjin pemilih dan bukan regresi
      daripadanya.
    - **Pencetusnya baris keempat, bukan bilangan ayat.** Arahan tiga baris tidak pernah
      menunjukkannya. Diukur merentas kesemua 23 arahan: **21 mencapai empat baris atau lebih**, dan
      10 daripadanya membawa baris penuh ≥200px.
    - **Membuang *"Kemudian tekan Sedia."* mengecilkan kontras, tidak membuangnya.** q003, q006 dan
      q011 turun daripada lima baris kepada empat, dan baris penuh daripada 291px kepada 174px. Trio
      sempit diikuti satu baris penuh masih kekal. Geometri itu sendiri direkod sebagai item 33.
    - **Perangkap ukuran:** `AudioButton` memulangkan `null` sehingga probe `isAudioAvailable`
      selesai, jadi ukuran yang diambil terlalu awal menunjukkan satu float sahaja dan jalur
      terbaca 199px. Tunggu butang audio muncul sebelum mengukur perenggan ini.

    #### DIBINA, 21 September 2026: dua daripada tiga isyarat

    Keputusan pemilik projek: **butang dahulu, teks kemudian.** Sebabnya peraturan guru dan bukan
    kos — kita tidak boleh mengisytiharkan UI cukup jelas sebelum seorang anak mengesahkannya.
    Jadi teks arahan **dan** audio kekal menyebut *"Kemudian tekan Sedia."* buat masa ini.

    **Jadual saluran, dijalankan semula terhadap kod 21 September 2026** — sebelum perubahan ini:

    | Saluran | Keadaan | Menyuruh tekan Sedia? |
    |---|---|---|
    | Audio arahan | Dimainkan sendiri; klip merakam ayat penuh | **Ya — satu-satunya** |
    | Butang Sedia | `rest` sejak soalan muncul, `wrong` selepas jawapan salah. Tidak berubah bila ketukan bermula. Slot ikon ditempah tetapi kosong | Tidak |
    | Lencana nombor | Muncul pada objek yang diketuk | Menunjukkan kiraan, bukan langkah |
    | Tali *"Dibilang: N"* | Teks + `aria-live` | Sama |
    | Bunyi UI, getaran | **Tiada** dalam `src/` langsung | Tidak |

    Tiada satu pun berubah sejak jadual 14 September; yang berubah ialah kad, bukan butang.

    **Yang dibina:** keadaan `ready` pada `BlockButton` — muka terisi `--laut` dan ikon anak panah
    dalam pil `--laut-dark` — dinyalakan oleh ketukan pertama pada objek. Ukuran, di pane pada
    393×695, dipandu melalui UI sebenar:

    | Keadaan | Muka | Ikon |
    |---|---|---|
    | Tiba, 0 dibilang | putih, sempadan `--laut-dark` | **tiada**, slot 36px kekal ditempah |
    | Ketukan pertama | `rgb(15,181,166)` = `--laut` | anak panah, pil 36px, `opacity: 1`, tiada transform |
    | Hantar salah | putih, sempadan `--bunga-dark` | ✕ |
    | Ketuk semula (kiraan berubah) | `--laut` semula | anak panah semula |
    | Ketuk balik ke kiraan yang dihantar | putih, `--bunga-dark` | ✕ |

    Nisbah kontras dikira daripada piksel yang pelayar selesaikan, bukan daripada token: teks
    `--arang` atas muka `--laut` **4.78:1**, strok putih atas pil `--laut-dark` **5.21:1**. Pil
    atas muka ialah 2.03:1 — ia hiasan di sekeliling anak panah, dan yang membawa bentuk ialah
    strok.

    **`wrong` menang hanya selagi kiraan sama dengan kiraan yang dihantar.** Tanpa itu butang
    kekal merah sepanjang kiraan semula dan isyarat langkah tidak pernah kembali pada percubaan
    kedua dan ketiga. Ia perlukan satu keping keadaan baharu, `submittedCount`.

    **Satu kecacatan yang hanya pane boleh tunjukkan, dijumpai dan dibaiki dalam kerja ini.**
    Ikon ✕ yang sedang keluar masih terpasang semasa `AnimatePresence` memainkan animasi
    keluarnya — dan animasi keluar yang tidak pernah mendapat bingkai tidak pernah tamat. Slot
    ikon membesar kepada dua baris, anak panah ditolak ke atas, dan ✕ duduk di bawahnya; dengan
    kedua-duanya dipaksa ke dalam satu sel grid, ✕ duduk **di atas** anak panah selama-lamanya.
    Dua isyarat bercanggah pada butang yang anak hendak tekan. Dibaiki dengan menyahlekap
    `AnimatePresence` sepenuhnya semasa keadaan `ready`. Kosnya, diukur: pada laluan
    `ready → wrong`, ✕ tiba satu detik lewat di pane (antara 120ms dan 400ms); sempadan merah dan
    goncangan tiba serta-merta, jadi isyarat salah tidak pernah tiada. Pada peranti yang
    memberi bingkai itu satu bingkai.

    **Jurang `audio:script` ditutup dalam PR yang sama, walaupun teks belum dipendekkan.** Medan
    `promptAudioText` pilihan (SPEC §3.3) diisi untuk q003, q006 dan q011 dengan ayat penuh. Sebab
    ia dibina sekarang dan bukan nanti: skrip itu mengambil ayat rakaman daripada `prompt`, jadi
    sesi yang memendekkan teks akan menjatuhkan langkah itu daripada rakaman seterusnya tanpa
    sesiapa memutuskannya — dan sesi itu tidak perlu mengingat sesuatu yang sudah ada.

    **Rakaman tidak berubah.** Item ini pernah merancang *"rakam semula tiga klip"*; tidak perlu.
    Klip sedia ada sudah menyebut ayat penuh — q003 65,201 bait, q006 78,576, q011 118,282,
    ketiga-tiganya bersih ID3 — jadi memendekkan teks skrin nanti tidak menyentuh audio.

    #### Bunyi: menyusul, dengan tiga kekangan yang sudah diketahui

    Tidak dibina, atas keputusan pemilik projek. Yang perlu diselesaikan bila ia dibina:

    - **Saluran kedua diperlukan.** `player.ts` ialah pemain klip arahan tunggal dan ia
      **menghentikan** klip semasa apabila klip baharu dimainkan. Bunyi ketukan yang berkongsi
      pemain itu akan memotong arahan yang sedang dibacakan kepada anak.
    - **SPEC §8 berkata satu klip boleh didengar pada satu masa.** Itu peraturan untuk klip
      arahan; membenarkan bunyi UI bertindih ialah pindaan bertulis, bukan hanya kod.
    - **Langkau, jangan parkir.** `Howl.play()` pada context tergantung memarkir main balik dan
      tidak boleh dibatalkan (SPEC §8 peraturan 5). Bunyi UI mesti menyemak `ctx.state` dan
      berdiam diri, bukan beratur untuk dimainkan lewat.

    Aset pula tiada: SPEC §8 menyenaraikan lima bunyi UI dan tiada satu pun wujud dalam repo.

    #### Kos yang akan datang bila teks dipendekkan

    Diukur pada 393×695, dan direkod supaya sesi itu tahu ia sebahagian harga:

    | | Sekarang | Ayat dibuang |
    |---|---|---|
    | q003 | 4 baris, kad 471, **lompat** (item 33) | 3 baris, kad 440, tiada lompat |
    | q006 | 4 baris, kad 385, jurang 158px | 2 baris, kad 324, **jurang 219px** |
    | q011 | 4 baris, kad 471, **lompat** | 3 baris, kad 440, tiada lompat |

    Lompatan item 33 jatuh 2/25 → **0/25**, dan potongan count-tap dedahan hilang. Tetapi jurang
    kad-ke-butang item 47 pada q006 menjadi **219px**, jurang terbesar dalam pek — pada skrin
    dengan objek paling sedikit. Itu bukan sebab untuk tidak memendekkan; ia sebahagian harga.

    #### DISAHKAN PADA PERANTI, DAN OLEH SEORANG ANAK — 21 September 2026

    Ketiga-tiga keadaan betul pada iPhone: putih tanpa ikon, teal dengan anak panah selepas
    ketukan pertama, merah dengan ✕ selepas hantar salah.

    Dan ujian yang sebenarnya: **anak tujuh tahun pemilik projek menekan Sedia sendiri selepas
    mengetuk, tanpa diberitahu apa-apa.** Itu satu anak, satu kali, dan ia bukan bukti statistik —
    tetapi ia jenis bukti yang peraturan guru minta sebelum ayat *"Kemudian tekan Sedia."* boleh
    dibuang daripada teks. Keputusan memendekkan teks masih milik pemilik projek.

    #### Ujian kedua, dan teks dipendekkan — 22 September 2026

    **Anak yang sama menekan Sedia sendiri pada hari kedua juga, tanpa diberitahu apa-apa.**

    **Hadnya, ditulis supaya ia tidak dibaca lebih besar daripada yang sebenarnya: satu anak, dua
    kali.** Bukan dua anak, bukan sepuluh, dan bukan seorang anak yang tidak pernah melihat app
    ini. Anak yang mengulang mungkin mengingati butang itu daripada semalam, bukan membacanya
    hari ini. Yang boleh dikatakan: isyarat itu memadai untuk anak ini, dua hari berturut-turut,
    tanpa sebarang kata-kata.

    Atas dasar itu, pemilik projek memutuskan **syarat guru dipenuhi** — *"petunjuk bukan teks
    yang benar-benar jelas kepada murid yang belum membaca"* — dan ayat *"Kemudian tekan Sedia."*
    dibuang daripada **teks skrin** q003, q006 dan q011.

    **Audio tidak disentuh, dan itu keputusan, bukan kerja yang tertunggak.** Rekod guru berkata
    arahan audio *"boleh dinilai semula"* apabila UI mempunyai petunjuk bukan teks — **boleh,
    bukan mesti.** Klip sedia ada sudah menyebut ayat penuh dan ia berfungsi; tiada sebab merakam
    semula sesuatu yang berfungsi untuk menjadikan audio sepadan dengan teks yang lebih pendek.
    `promptAudioText` memegang ayat penuh untuk ketiga-tiganya, jadi `audio:script` masih
    mencetak apa yang klip itu sebut — disahkan selepas perubahan, keenam-enam baris (BM dan EN)
    bertanda **bukan teks di skrin**.

    **Diukur pada 393×695 selepas teks dipendekkan:**

    | | Dahulu | Kini |
    |---|---|---|
    | q003 | 4 baris, kad 464 | **3 baris**, kad 434 |
    | q006 | 4 baris, kad 378 | **2 baris**, kad 319 |
    | q011 | 4 baris, kad 464 | **3 baris**, kad 434 |
    | Arahan melompat lebar (item 33) | 2 / 25 | **0 / 25** |
    | q003 dedahan: tinggi kad | 464 tiba → **449** dengan jalur, terpotong 22 | **434 dalam kedua-duanya**, terpotong 7 |

    Potongan 7px yang tinggal ialah padding bawah kad, sama pada keadaan tiba: objek terakhir 59px
    di dalam tepi, tali kiraan 23px di dalam. **Jalur tidak lagi mengecilkan kad.**
27. **Tiga belas soalan baharu wujud dalam fail, tetapi tiada anak boleh melihatnya. Enjin pemilih
    soalan ialah keutamaan seterusnya.**

    App membuka satu aktiviti sahaja, `math-y1-nombor-100-a1` (`ACTIVITY_ID`, `activity.ts`), dan
    a1 memegang q001–q010. q011–q023 duduk dalam aktiviti a2–a7, satu sub-kemahiran setiap
    aktiviti:

    | Aktiviti | Sub-kemahiran | Soalan |
    |---|---|---|
    | a2 | `count_objects` | q003, q006, q011 |
    | a3 | `compare_greater`, `compare_smaller` | q001, q012, q013, q010, q014, q015 |
    | a4 | `after` | q002, q016, q017 |
    | a5 | `order_ascending` | q007, q018, q019 |
    | a6 | `digit_at_tens` | q004, q020, q021 |
    | a7 | `two_digit_plus_two_digit_no_bridge` | q008, q022, q023 |

    - Soalan lama dirujuk semula dalam aktiviti kemahirannya, supaya setiap aktiviti memegang
      kemahirannya dengan lengkap. Bukti dikira mengikut `questionId`, jadi tiada soalan dikira dua
      kali.
    - a3 menggabungkan dua sub-kemahiran kerana kedua-duanya daripada sub-titik DSKP yang sama,
      1.2.2 (iii) *"Membandingkan nilai dua nombor."*
    - Tajuk aktiviti ialah label fail kemahiran, tanpa teks baharu; a3 memakai kedua-dua label.
      Tiada skrin memaparkan tajuk aktiviti hari ini.

    **a1 tidak disusun semula.** Ia aktiviti yang app buka, jadi menyusunnya mengikut kemahiran
    menukar apa yang anak mainkan hari ini — contohnya kepada tiga soalan count-tap sahaja. Dan
    ukuran yang sudah direkod merujuk a1 sepuluh soalan: DESIGN §5.2 dan §7 merentas kesepuluh-
    sepuluh soalan pek, dan SPEC §10 kriteria 3. Enjin pemilih akan menggantikan senarai tetap a1,
    jadi kos itu dibayar sekali, bersama enjin.

    **Belum diukur:** susun atur q011–q023, kerana tiada skrin memaparkannya. Yang paling berisiko:
    lapan objek q011 (had 9, SPEC §3.4), arahan tiga ayat q011, q021 dan q023, dan pilihan
    *"Sama banyak"*.

    **Keutamaan seterusnya, atas keputusan pemilik projek:** enjin yang memilih 10 soalan daripada
    bank, dengan komposisi aras SPEC §5.5. Tanpa ia, soalan baharu hanya lulus `validate:content`.

    **Kemas kini, 15 September 2026: stor kemajuan dibina dahulu, bukan enjin.** Atas keputusan
    pemilik projek: tanpa stor, enjin tidak boleh mengingati aras anak, dan *Dikuasai* perlukan dua
    sesi — enjin tanpa stor bermula semula setiap kali. Stor itu dalam SPEC §6.

    Empat jawapan pemilik projek untuk enjin, pada hari yang sama, supaya ia tidak perlu ditanya
    semula:

    1. **Aras 3 tidak boleh dipenuhi** — bank memegang tiga soalan aras 3 (q008, q022, q023). Enjin
       merosot dengan anggun, tidak gagal: campuran SPEC §5.5 ialah sasaran, bukan jaminan. Ambil apa
       yang ada pada aras yang diminta, isi baki daripada aras terdekat, dan laporkan jurang.
    2. **q005 dan q009 dikecualikan.** Kedua-duanya akan berpindah ke pek 7.0 Ruang (item 10) dan
       tidak mendakwa SP.
    3. **Sesi tersimpan dibatalkan sekali bila enjin masuk** — perkara `packVersion` dalam item 6.
       Pembatalan sekali lebih murah daripada memindahkan sesi yang memegang soalan yang mungkin
       tidak lagi sah.
    4. **Satu soalan tidak dipilih dua kali dalam satu sesi.** Bukti dikira mengikut `questionId`, jadi
       ia tidak akan dikira dua kali — tetapi anak yang nampak soalan sama dua kali dalam sepuluh
       merasakan app rosak.

    Aras anak disimpan dalam stor kemajuan bersama enjin, bukan sebelumnya (SPEC §6, keputusan 2).

    **DIBINA, 16 September 2026.** Enjin menggantikan senarai tetap sebagai sumber soalan; ia tidak
    membuang konsep aktiviti. Yang hilang daripada kod ialah `ACTIVITY_ID`, carian aktiviti,
    `activityTitle` (tiada pengguna) dan `loadActivityQuestions()`. Yang masuk ialah `lib/selection.ts`
    tulen, dan `buildSession()` dalam `activity.ts` yang menyuapnya daripada stor kemajuan.

    | Keputusan | Yang dibina |
    |---|---|
    | Skop pemilihan | Seluruh pek. Aktiviti dalam fail pek tidak disentuh: skema menuntut setiap soalan berada dalam satu aktiviti, dan a1 satu-satunya pemegang q005 dan q009 (item 10) |
    | Aras | `packs[topicId].level`, bersama `runs`, `lastSessionId` dan `lastAsked` (SPEC §6) |
    | Keutamaan | Tergelincir, kemudian belum dikuasai, kemudian sudah dikuasai. Dalam setiap kumpulan: soalan tanpa bukti cubaan pertama, kemudian paling lama tidak ditanya, kemudian susunan pek |
    | Rawak | **Tiada dalam pemilihan.** Hanya susunan pilihan jawapan masih dikocok |
    | Susunan soalan | Aras rendah dahulu, kemudian aras semasa, kemudian aras tinggi — "kemenangan mudah dahulu" §5.5 |
    | Jurang aras | Diisi daripada aras terdekat, dan dilaporkan sebagai `gaps` oleh pemilih. Tiada skrin memaparkannya lagi |

    **Pembatalan sekali datang percuma.** `SessionState.activityId` kini `topicId` pek, dan
    `loadSession` sudah menolak sesi yang disimpan untuk aktiviti lain — jadi setiap sesi lama
    `math-y1-nombor-100-a1` dibatalkan sekali, tanpa kod `packVersion`. Masalah item 6 untuk
    suntingan kandungan akan datang kekal terbuka.
28. **Soalan untuk pusingan semakan guru seterusnya.**

    - **q024 ditahan, dan tidak ditulis.** Dokumen pembetulan menulisnya dengan ayat
      yang sama seperti q007 — *"Susunan manakah dari kecil ke besar?"* — dan nombor berbeza, dan
      menurut dokumen itu guru pernah menulis supaya tidak sekadar menambah soalan yang sama tetapi
      menukar nombor **dan** bentuk. Pemilik projek sedang bertanya guru sama ada ia memadai.
      Sehingga itu `order_ascending` kurang satu soalan untuk ambang SPEC §5.7.
      Item 24 menjadikan q024 tidak perlu.

      **Kemas kini, 17 September 2026: q024 tidak diperlukan.** q019 kini tiga pilihan (item 36),
      jadi q007, q018 dan q019 memberi tekaan gabungan 1/27, di bawah siling 4%, dan
      `validate:content` tidak lagi mencetak jurang untuk `order_ascending`. Akibat yang boleh
      diperhati di bawah — tiga soalan yang sama dalam hampir setiap sesi aras 2 — berakhir apabila
      anak mencapai Dikuasai, kerana ia kini boleh dicapai. Satu kaveat kekal: kalau q018 dipetakan
      semula (bullet seterusnya), `order_ascending` kembali kepada dua soalan.

      **Akibat yang boleh diperhati, bukan hanya jurang ambang — 16 September 2026.** Dengan enjin
      pemilih (item 27), sub-kemahiran yang belum dikuasai didahulukan. `order_ascending` **tidak
      boleh** dikuasai hari ini: tiga soalannya ialah q007, q018 dan q019, dan q019 dua pilihan, jadi
      tekaan gabungannya 1/18, di atas siling 4% SPEC §5.7, dan ia perlukan satu soalan lagi. Ia
      kekal dalam kumpulan keutamaan kedua selama-lamanya, jadi **q007, q018 dan q019 muncul dalam
      hampir setiap sesi aras 2** — anak akan nampak tiga soalan yang sama berulang kali. Soalan
      keempat, atau item 24, menutupnya.
    - **q018 dipetakan ke `order_ascending`.** *"12, __, 18, 21."* ialah soalan isi tempat kosong.
      Dokumen guru sendiri, dalam bahagian 1.5.1, berkata soalan begitu *"lebih hampir kepada
      kemahiran melengkapkan rangkaian nombor"* (`docs/kssr/guru-sub-kemahiran-math-y1.md`). Tidak
      ditukar; guru yang memutuskan. Senarai rakaman dokumen pembetulan membaca tempat kosong itu
      sebagai *"kosong"*.
29. **Jawapan guru untuk tiga pusingan semakan q011–q023 datang dalam mesej, bukan borang
    bertanda. Jurang itu dinyatakan, bukan disembunyikan.**

    Dua dokumen difailkan dalam `docs/kssr/`. Kedua-duanya **ditulis oleh Claude**, dan pemilik
    projek menghantarnya kepada guru untuk disemak — bukan dokumen guru:

    | Fail | Apa |
    |---|---|
    | `soalan-baharu-math-y1.md` | Spesifikasi penuh q011–q023, **sebelum** semakan. Nota statusnya sendiri: *"Belum disemak guru."* |
    | `pembetulan-akhir-soalan-math-y1.md` | Pembetulan **selepas** tiga pusingan semakan. Menang di mana kedua-duanya bercanggah |

    **Yang tiada dalam repo:**

    - **Jawapan guru sendiri** untuk tiga pusingan itu. Ia datang dalam mesej, bukan borang
      bertanda, dan mesej itu tidak difailkan.
    - `pembetulan-soalan-math-y1.md`, yang dokumen pembetulan akhir katakan ia gantikan.

    Akibatnya, setiap *"menurut dokumen pembetulan, guru …"* — item 22, 24, 25, 26 dan 28, dan
    SPEC §5.7 — ialah **ringkasan dalam dokumen yang ditulis Claude**, dan tidak boleh disemak
    terhadap perkataan guru.
    `kssr.review` dalam pek masih merujuk borang pusingan 2 dan sepuluh soalan asal, dan tidak
    dinaikkan atas dokumen ini.

    **Yang dalam pek tetapi tiada dalam kedua-dua dokumen** — diberi atau diputuskan oleh pemilik
    projek dalam sesi, 14 September 2026:

    | Soalan | Butiran |
    |---|---|
    | q022 | Spesifikasi penuh: *"Saya tambah 15 jadi 38. Apakah nombor saya?"*, pilihan 23 · 28 · 53, pancingan, penerangan, `reverse` |
    | q012, q014 | Arahan EN bagi arahan BM yang ditulis semula |
    | q019 | Penerangan *"9 lebih kecil daripada 14."*; pancingan dibuang (item 24) |
    | q011 | Arahan BM tiga ayat yang mengekalkan *"Kemudian tekan Sedia."* (item 26); pancingan dibuang kerana count-tap tidak boleh membawanya |
    | q013, q015 | EN pilihan *"Sama banyak"*: *"The same"*, daripada label `compare_groups` fail kemahiran |
    | Semua | `difficulty` disalin daripada soalan sedia ada sub-kemahiran yang sama; `wordingVariant` "A"; `layout` q011 `scatter`, seperti q003 |

    **Untuk menutup jurang:** failkan jawapan guru seperti yang diterima, atau semak q011–q023 melalui
    borang `kssr:review` yang dikembalikan bertanda.
30. **Jadual SQL `mastery` dalam SPEC §6 menyimpan skor peringkat SP, bercanggah dengan peraturan 2
    dalam bahagian yang sama. Jurang, direkod dan tidak dibaiki.**

    Jadual Supabase ringkas dalam SPEC §6 membawa
    `mastery (child_id, learning_standard, score, updated_at)` — satu nombor setiap Standard
    Pembelajaran. Peraturan 2 stor kemajuan, beberapa baris di atasnya, melarang tepat itu: *"Simpan
    bukti per id sub-kemahiran sahaja. Jangan sekali-kali simpan nombor peringkat SP."* Gulungan yang
    disimpan menjadi basi saat senarai sub-kemahiran berubah.

    **Tidak dibaiki, atas keputusan pemilik projek, 15 September 2026.** Skema backend itu belum wujud:
    tiada Supabase dalam `package.json`, tiada `sync.ts`. Tetapi sesiapa yang membinanya akan membaca
    §6 dan membina jadual yang salah. Stor tempatan `esi.progress.v1` sudah mengikut peraturan 2; jadual
    pelayan patut mencerminkannya — bukti per sub-kemahiran, gulungan dikira semasa baca — apabila ia
    direka.
31. ~~**Tangga aras SPEC §5.5 memilih kemahiran, bukan kesukaran. Jurang kandungan, bukan pepijat
    enjin.**~~ ~~Terbuka sepenuhnya.~~ ~~Dipisahkan 22 September 2026: aras 1 dan 2 ditutup dengan
    nombor, aras 3 kekal terbuka.~~ **DITUTUP 22 September 2026, kedua-dua bahagian.** Lihat hujung
    item ini.

    Tangga itu direka untuk memilih kesukaran **dalam satu kemahiran**: 70% pada aras semasa, 20% di
    bawah, 10% di atas. Dalam bank hari ini setiap soalan dalam satu sub-kemahiran membawa aras yang
    sama, kerana `difficulty` disalin daripada soalan sedia ada sub-kemahiran yang sama (item 29):

    | Aras | Sub-kemahiran | Soalan |
    |---|---|---|
    | 1 | `count_objects`, `compare_greater`, `after` | 9 |
    | 2 | `compare_smaller`, `order_ascending`, `digit_at_tens` | 9 |
    | 3 | `two_digit_plus_two_digit_no_bridge` | 3 |

    Jadi aras ialah **gerbang kemahiran**. Akibatnya, diukur daripada `questionMix()`:

    - **Aras 1** meminta sembilan soalan aras 1, dan bank ada tepat sembilan — jadi anak aras 1
      mendapat kesembilan-sembilan soalan yang sama **setiap sesi**, ditambah satu soalan aras 2.
      Soalan tambah tidak pernah muncul sehingga anak naik dua rung.
    - **Aras 3** meminta lapan soalan aras 3 dan bank ada tiga.

    Enjin sudah merosot dengan anggun dan melaporkan jurang (item 27). Yang tinggal ialah kerja
    kandungan: **setiap sub-kemahiran patut membawa soalan pada lebih daripada satu aras**, atau
    tangga itu bermakna sesuatu yang lain daripada yang §5.5 dakwa dan §5.5 patut ditulis semula.

    Direkod 16 September 2026 semasa enjin dibina; tiada kerja kandungan dirancang lagi.

    **Diagnosis, 18 September 2026: satu sub-kemahiran boleh membawa dua aras dengan selamat — dan
    itu tidak menyelesaikan bahagian item ini yang paling dirasai anak.**

    Ditanya sebelum soalan tambah keempat ditulis. Diukur dengan pemilih dan peraturan kemajuan
    sebenar, soalan keempat hipotetikal disalin daripada q023, anak yang menjawab semua betul dengan
    arasnya dikekalkan, lapan larian:

    | | Soalan baharu di aras 2 | Soalan baharu di aras 3 |
    |---|---|---|
    | Soalan boleh dimain, aras 1 / 2 / 3 | 9 / 10 / 3 | 9 / 9 / **4** |
    | Anak aras 1: soalan tambah dalam 8 larian | **0** | **0** |
    | Anak aras 2: tambah dikuasai pada larian ke- | 2 | 3 |
    | Anak aras 3: soalan aras 3 setiap sesi | 3 | **4** |
    | Aras 2: soalan yang muncul dalam setiap larian | 4 | 5 |

    - **Enjin selamat.** `questionMix()` dan tangga §5.5 hanya melihat aras; soalan satu sub-kemahiran
      cuma jatuh ke dalam dua kumpulan aras.
    - **Penguasaan selamat.** Bukti tidak merekod aras, dan peraturan guru tidak menyebutnya, jadi
      bukti dari aras berbeza dikira sama. Dengan hanya satu soalan di aras rendah, anak tetap perlu
      menjawab dua soalan aras 3 untuk mencapai Dikuasai.
    - **Tiada kod mengandaikan satu aras setiap sub-kemahiran.** Yang mengandaikannya ialah satu komen
      dalam `progress.ts`, satu ayat dalam SPEC §6, dan konvensyen item 29. Ketiga-tiganya perlu
      dikemas kini apabila soalan dua aras yang pertama mendarat.
    - **Aras 1 tidak berubah dalam kedua-dua penempatan.** Bank aras 1 kekal sembilan, jadi anak aras 1
      masih mendapat kesembilan-sembilan soalan yang sama setiap sesi, dan masih tidak pernah melihat
      soalan tambah dalam lapan larian. **Itu bahagian item ini yang paling dirasai anak, dan dua aras
      tidak menyentuhnya.** Ia ditutup hanya dengan menulis soalan aras 1 baharu.

    **Keputusan pemilik projek: soalan tambah keempat ditulis pada aras 3**, kerana ia sepadan dengan
    penilaian kesukarannya dan ia satu-satunya penempatan yang menambah bank aras 3.

    **Dilaksana, 18 September 2026:** q025 ditulis pada aras 3 (item 40). Bank aras 3 kini empat
    soalan boleh dimain — q008, q023 dan q025 sebagai bukti, dan q022 sebagai latihan — berbanding
    lapan yang sesi aras 3 minta. Aras 1 kekal sembilan soalan yang sama, seperti di atas.

    **Jurang yang dibiarkan: q008 mungkin salah aras.** *45 + 10* ialah menambah puluh bulat, dan
    pemilik projek menilainya lebih mudah daripada *34 + 25* dan *32 + 14* yang berkongsi aras 3
    dengannya. Memindahkannya ke aras 2 akan menukar apa yang anak lihat hari ini, pada soalan yang
    guru sudah semak, untuk faedah yang belum diukur. Tidak dibuat, atas keputusan pemilik projek.

    #### Dipisahkan dua, 22 September 2026: aras 1 dan 2 DITUTUP, aras 3 kekal terbuka

    Item ini mencampurkan dua perkara, dan hanya satu daripadanya kerja kandungan.

    **Apa yang anak sebenarnya rasa — soalan yang sama setiap sesi — ialah item 38, dan ia
    ditutup.** Soalan `before` (item 43) menaikkan bank aras 1 daripada 9 kepada 12, dan pemecah
    seri `timesAsked` (item 38) menghabiskan set tetap itu. Diukur dengan pemilih dan stor sebenar,
    lima larian, selepas kedua-duanya:

    | Aras | Bank | Slot setiap larian | Muncul dalam setiap larian |
    |---|---|---|---|
    | 1 | 12 | 9 | **0** — dahulu 9 daripada 9 |
    | 2 | 9 | 7 | **0** — dahulu 5 daripada 9 |
    | 3 | **4** | 8 diminta | **4** — kesemuanya |

    Aras 1 dan 2 **ditutup**. Bank masih kecil — 9 daripada 12 dan 7 daripada 9 di skrin setiap
    larian, iaitu 75% dan 78% — tetapi tiada soalan yang muncul setiap kali, dan kiraannya rata.
    Menulis lebih banyak soalan aras 1 dan 2 masih berfaedah; ia bukan lagi pepijat.

    ~~**Aras 3 kekal terbuka, dan ia kini satu-satunya bahagian item ini.**~~ Empat soalan boleh
    dimain — q008, q023, q025 sebagai bukti dan q022 sebagai latihan — untuk lapan slot yang sesi
    aras 3 minta. Bank lebih kecil daripada satu sesi, jadi kesemua empat muncul dalam setiap
    larian dan tiada pemecah seri boleh mengubahnya. **Itu kerja kandungan: tulis soalan aras 3.**

    **DITUTUP 22 September 2026: kerja kandungan itu dibuat.** Enam soalan tambah melintasi puluh
    dan dua soalan situasi harian (item 49) menaikkan bank aras 3 daripada 4 kepada **12** soalan
    boleh dimain — sembilan bukti dan tiga latihan — untuk lapan slot. Diukur dengan pemilih
    sebenar, lima larian aras 3: **0 soalan muncul dalam setiap larian**, kiraan
    4,4,4,4,3,3,3,3,3,3,3,3.

    Item 31 ditutup sepenuhnya. Yang tinggal bukan lagi pepijat: bank yang lebih besar sentiasa
    lebih baik, dan `validate:content` masih mencetak sub-kemahiran yang belum diuji setiap larian.
32. **Model aktiviti PRD §10 ditulis sebelum enjin wujud. Direkod, belum diputuskan.**

    §10 menganggap aktiviti ialah senarai soalan tetap: *"Aktiviti (10 soalan) → 0–3 ⭐"*,
    *"Topik (4–6 aktiviti)"* membuka topik seterusnya, bintang terbaik **setiap aktiviti**, siri
    harian dikira apabila *"satu aktiviti"* disiapkan, dan peti kejutan setiap ~5 aktiviti. Jadual
    `activity_progress` dalam SPEC §6 menyimpan `best_stars` per `activity_id`.

    Dengan enjin (item 27), satu sesi ialah sepuluh soalan yang dipilih daripada seluruh pek. Satu
    pek ada **satu** sesi jenis itu, bukan empat hingga enam aktiviti, jadi:

    - *"Topik (4–6 aktiviti) → kunci topik seterusnya pada ≥ 60% bintang tersedia"* tiada penyebut.
    - Bintang terbaik setiap aktiviti menjadi bintang terbaik setiap **pek**.
    - Aktiviti a1–a7 dalam fail pek kekal sebagai kumpulan penulisan yang tiada skrin mainkan.

    Tiada satu pun daripadanya menyekat enjin, dan tiada satu pun diputuskan di sini. Ia perlu
    dijawab sebelum peta pulau, kedai avatar atau papan pemuka dibina — dan bersama item 10, yang
    akan mengeluarkan q005 dan q009 daripada a1.
33. **Dua float menyempitkan 40% arahan dalam pek. Jurang geometri, berasingan daripada item 26.**

    Item 26 tentang butang Sedia membawa arahannya sendiri. Ini tentang perenggan arahan itu sendiri:
    butang audio (62px + margin 16px, kiri) dan slot kancil (85px + margin 16px, kanan) meninggalkan
    **jalur 121px daripada 299px** untuk tiga baris pertama, kemudian 299px penuh untuk baris keempat
    ke bawah. Kesannya merentas 21 arahan yang boleh dipilih, diukur pada 390×740: purata 4.1 baris,
    **16 arahan membawa baris lebar selepas baris sempit**, dan 10 daripadanya baris penuh ≥200px.

    Memendekkan teks tidak menyelesaikannya (item 26): ia menukar 5 baris kepada 4, dan baris penuh
    291px kepada 174px.

    **Calon, diukur dengan klon perenggan pada font dan lebar yang sama:**

    | Geometri | Jalur sempit | Purata baris | Arahan berjela | Baris penuh ≥200px |
    |---|---|---|---|---|
    | Sekarang | 121px | 4.1 | **16 / 21** | 10 |
    | Butang audio keluar daripada perenggan | 198px | 3.0 | 3 / 21 | 3 |
    | Butang audio keluar + slot kancil 64px | 219px | 2.9 | **0 / 21** | 0 |
    | Slot kancil keluar daripada aliran | 299px | 2.2 | 0 / 21 | 0 |
    | Butang audio sebaris dengan teks | 198px | 3.1 | 12 / 21 | 12 |
    | Lajur sempit seragam 121px | 121px | 5.4 | 0 / 21 | 0 |

    **Dua jalan buntu, diukur supaya tidak dicuba semula:**

    - **Meletakkan kedua-dua float supaya tamat pada baris yang sama tidak mengubah apa-apa.** Slot
      kancil dipendekkan kepada 62px memberi nombor yang **sama persis** seperti sekarang. Sebabnya
      halus: tinggi baris 30.8px, jadi dua baris ialah 61.6px, dan float 62px menjulur 0.4px ke baris
      ketiga — cukup untuk menyempitkannya. Lantai sasaran sentuh SPEC §9 ialah 64px, iaitu **di atas**
      61.6px, jadi butang yang mematuhi lantai itu sentiasa menyempitkan tiga baris, bukan dua.
    - **Lajur sempit seragam memberi q011 lapan baris** pada 121px. Itu lajur akhbar, bukan arahan.

    **DIPUTUSKAN dan DIBINA, 16 September 2026: kedua-dua float dalam satu lajur di kanan.** Slot
    kancil kekal di penjuru kanan atas, butang audio `clear` di bawahnya. Pemilik projek memilih sisi
    itu kerana kancil mempunyai sebab kedudukan dan butang audio tidak: penjuru kanan ditempah supaya
    tiada apa berganjak apabila maskot muncul (DESIGN §7, disahkan pada telefon), manakala butang
    audio hanya perlu berdekatan teks yang dibacanya — dan turun satu baris tidak memutuskan itu.
    DESIGN §5.2 dipinda dengan sebabnya.

    > **Berundur sebahagian, 20 September 2026.** Slot kancil dibuang daripada kad (item 45), jadi
    > lajur dua float menjadi satu float. Diukur pada 25 arahan pada 393×695: tujuh arahan turun
    > satu baris, dan **dua berundur** — q003 dan q011, dua arahan count-tap terpanjang, mendapat
    > semula lompatan lebar-selepas-sempit kerana butang audio masih menyempitkan baris pertama
    > sementara baris di bawahnya kini selebar penuh. **Diterima sebagai harga** oleh pemilik
    > projek: kedua-duanya membawa ayat *"Kemudian tekan Sedia."* yang item 26 akan buang, dan
    > lompatan itu mungkin hilang bersamanya. Angka di bawah ialah keadaan sebelum pembuangan itu.
    >
    > **Ditutup semula, 22 September 2026: 0 / 25.** Ayat itu dibuang daripada teks skrin q003,
    > q006 dan q011 (item 26), dan kedua-dua arahan yang melompat berhenti melompat — seperti yang
    > diramalkan. Diukur pada kesemua 25 arahan pada 393×695.

    | | Sebelum | Selepas |
    |---|---|---|
    | Arahan melompat lebar | 12 / 21 | **0 / 21** |
    | Purata baris | 4.1 | 3.2 |
    | Teks di bawah mana-mana float | — | **tiada** |
    | 360×780, semua soalan, inset 0 dan 34 | — | **tiada potongan** |
    | 390×740, tanpa pancingan | tiada potongan | tiada potongan |

    **Dua jalan buntu, diukur dan direkod supaya tidak dicuba semula:**

    - **Mutlak dengan `text-indent` tidak boleh.** `text-indent` menempah baris pertama sahaja;
      butang 64px merangkumi 2.08 baris pada tinggi baris 30.8px, jadi baris kedua dan ketiga
      berjalan di belakang butang. Diukur: butang x45–107 y89–151, baris 2 pada x45 y119, baris 3
      pada x45 y149. Float menempah setiap baris yang dilindunginya; itu sebab ia float.
    - **Butang pada baris sendiri, atau di bawah kad**, memotong kad 31–35px pada inset 0 dan
      49–53px pada inset 34.

    **Tarikan −4px, bukan −8px.** Titik terendah lukisan kancil berada kira-kira 4.7px di atas dasar
    slot 88px. Pada −8px butang audio menutup 3px maskot semasa maklum balas; pada −24px, 19px. −4px
    meninggalkan 0.8px antara keduanya, dan ia tarikan terbesar yang tidak menindih. Maskot tidak
    dikecilkan, atas arahan pemilik projek.

    **Potongan kad pada q013 diterima.** Pada 390×740, soalan pilihan dengan jalur pancingan, inset
    34px: kad menatal kira-kira 25px, tetapi yang menatal hanyalah padding bawah kad. Baris terakhir
    teks kekal 56px dari tepi yang kelihatan, dan tepi bawah butang audio mendarat tepat pada tepi itu.
    Ini kelas yang sama yang DESIGN §5.2 sudah terima dan yang iPhone sudah sahkan pada dedahan awal
    q001. Pemilik projek pernah menolak "terima potongan" atas andaian bahawa soalan terpotong;
    pengukuran menunjukkan ia tidak.

    **Yang tinggal terbuka: q002.** Arahan dua baris dengan pancingan panjang. Float bertindan memberi
    perenggannya 143px untuk teks 61px, dan dengan pancingan dipaparkan, yang terpotong ialah butang
    audio, bukan teks: **9px pada inset 0, 26px pada inset 34**, pada 390×740. 360×780 bersih. Padding
    kad 16px bersama tarikan −4px masih meninggalkan 1px dan 18px.

    Susunan bersyarat — hanya arahan panjang mendapat lajur bertindan — **ditolak**. Mengukur teks
    semasa render menjadikan susun atur bergantung pada bila fon Lexend selesai dimuat, dan anak akan
    melihatnya beralih di depan matanya: kelas yang sama seperti pepijat bingkai-tidak-tiba, dengan
    punca berbeza. Ambang panjang teks pula rapuh.

    **Diagnosis q002 — masalah kandungan, bukan geometri.** Kesemua 21 soalan disapu, dalam keadaan
    pancingan dan dedahan, pada 390×740. Butang audio terpotong dalam **tiga keadaan sahaja**: pancingan
    q002, dedahan q002 (tiada `explain`, jadi pancingan kekal dalam jalur), dan **dedahan q001**.
    Ketiga-tiganya ialah satu-satunya teks jalur yang membalut kepada dua baris, menjadikan jalur 78px.
    Setiap teks satu baris (51px) hanya menatalkan padding. Puncanya bukan arahan pendek: setiap arahan
    dua atau tiga baris mendapat perenggan 143px yang sama daripada float bertindan, dan arahan q001
    bukan pendek.

    Kapasiti satu baris jalur, Lexend 18px: **326px pada 390×740, 296px pada 360×780**. Pancingan q002
    341px dan `explain` q001 334px — dua sahaja daripada 33 teks BM yang melebihinya. Pada 360×780
    kedua-duanya juga membalut, tetapi skrin itu ada ruang tinggi dan tiada apa terpotong. Tiga pancingan
    berada 3–6px daripada had 360px: q007 (293px), q001 (292px), q008 (290px).

    Sebelum float bertindan, dedahan q001 yang sama memotong kad 9px pada 390×740 dan 27px dengan
    inset iPhone — padding sahaja, teks penuh (dedahan awal, di atas). Kini butang audio ialah
    kandungan terendah kad, jadi teks jalur dua baris memotong butang ulang tayang. **Kekangan itu
    datang bersama susun atur ini.**

    **Dua teks ditulis semula:** pancingan q002 dan `explain` q001. Kedua-duanya tidak dirakam —
    `audio:script` hanya membaca `promptAudio` — jadi tiada rakaman semula.

    > **Jangan salin pancingan q016 ke q002.** Pancingan asal q002 ialah *"Bilang: dua puluh sembilan,
    > kemudian?"*. *"Kira menurun satu langkah."* ialah pancingan q016 — sub-kemahiran sama, `after` —
    > dan ia salah arah untuk q002: q002 bertanya nombor *selepas* 29, iaitu membilang naik. Kedua-duanya
    > pernah dikelirukan semasa soalan ini dibincangkan.
    >
    > **Kemas kini, 20 September 2026.** Arah itu ialah petunjuk pertama bahawa q016 sendiri salah
    > dipetakan: ia meminta nombor sebelum 30. q016 ditulis semula, dan pancingannya kini *"Kira satu
    > lagi selepas 39."* — membilang naik, seperti q002 (item 42).

    **Ditulis semula dalam versi guru, 16 September 2026** (`fix/band-text`):

    | Teks | Dahulu | Kini | Aksara | Lebar, Lexend 18px |
    |---|---|---|---|---|
    | pancingan q002, BM | *"Bilang: dua puluh sembilan, kemudian?"* | *"Kira satu lagi selepas 29."* | 37 → 26 | 340.8 → 216.2px |
    | `explain` q001, BM | *"74 ada 7 puluh. 47 ada 4 puluh sahaja."* | *"74: 7 puluh. 47: 4 puluh."* | 38 → 25 | 333.7 → 200.1px |
    | pancingan q002, EN | *"Count on: twenty-nine, then?"* | *"Count one more after 29."* | 28 → 24 | 216.4px |
    | `explain` q001, EN | *"74 has 7 tens. 47 has only 4 tens."* | *"74: 7 tens. 47: 4 tens."* | 34 → 23 | 177.0px |

    Pemilik projek mencadangkan *"Bilang naik dari 29."* dan *"74 ada 7 puluh, 47 ada 4."*.
    **Menurut pemilik projek**, guru menyemak kedua-duanya:

    - Guru lebih suka *"Kira satu lagi selepas 29."*, kerana ia lebih natural untuk murid Tahun 1.
    - Guru **menolak** *"74 ada 7 puluh, 47 ada 4."*. Alasannya: *"47 ada 4"* boleh dibaca sebagai
      digit 4, bukan 4 puluh, dan maksudnya hilang. Perkataan *puluh* mesti kekal pada kedua-dua
      nombor, kerana itulah titik pengajarannya.

    **Jawapan guru ini datang dalam mesej pemilik projek, bukan dokumen yang difailkan** — jurang
    yang sama seperti item 29.

    Borang pusingan 2 (`docs/kssr/guru-semakan-pusingan-2-bertanda.md`) menyemak **teks lama**,
    iaitu kedua-dua baris "Dahulu" di atas, perkataan demi perkataan. Nota `kssr.review` pek sudah
    berkata soalan yang ditulis semula selepas 12 September 2026 tidak diliputi oleh borang itu, dan
    `reviewStatus` tidak diubah. Petikan teks lama dalam DESIGN §7 (pengukuran 13 September) dan item
    23 kekal sebagai rekod bertarikh.

    **EN ditulis oleh Claude** supaya setara dengan versi BM guru, dan dikekalkan pendek walaupun EN
    belum dihantar. Guru tidak menyemaknya.

    > **Nombor potongan di bawah tidak sah — item 44.** Ia diukur pada 390×740 dan 360×780, dua
    > viewport yang tidak pernah wujud pada telefon. Lebar dan teks jalur kekal sah; potongan tidak.

    Diukur di pane pada sesi baharu (storan dikosongkan), selepas butang audio dipasang. Keadaan
    yang diukur: pancingan dan dedahan q001, dan pancingan dan dedahan q002 (q002 tiada `explain`):

    | Viewport | Jalur | Butang audio terpotong, inset 0 / 34 | Teks soalan terpotong | Kad menatal, inset 0 / 34 |
    |---|---|---|---|---|
    | 390×740 | satu baris, 51px, keempat-empat keadaan | 0 / 0 | 0 | 7 / 25px — padding sahaja, kelas q013 |
    | 360×780 | satu baris, 51px, keempat-empat keadaan | 0 / 0 | 0 | 0 / 0 |

    `aria-live` membacakan *"Belum betul. 74: 7 puluh. 47: 4 puluh."* dan *"Belum betul. Kira satu
    lagi selepas 29."*. Bagaimana pembaca skrin sebenar menyebut titik bertindih tidak disemak dari
    sini.

    **Peraturan, dikuatkuasakan dalam `validate:content`:**

    | Teks jalur BM (`hint`, `explain`) | Kesan | Asas |
    |---|---|---|
    | Lebih 28 aksara | Amaran | 28 aksara muat 296px dengan margin 12.9px dalam kes terlebar |
    | 37 aksara atau lebih | Ralat | Pada 390px, 64% ayat 37 aksara membalut, dan 98% pada 40. Anggaran |

    Dua ukuran dalam pelayar, Lexend 400 18px, kedua-duanya terhadap ayat yang dibina daripada 192
    perkataan BM pek sendiri, supaya had itu meliputi teks yang belum ditulis. Aksara, bukan piksel,
    kerana Node tiada fon.

    - **Had 28 — 6,000 ayat, 20–39 aksara, terhadap 296px.** Ayat terlebar sehingga 28 aksara ialah
      283.1px (margin 12.9px). Sehingga 29 aksara 294.2px (margin 1.8px); sehingga 30, 302.5px,
      melimpah. Teks sebenar terlebar sehingga 28 aksara: 264px.
    - **Had 37 — 12,000 ayat dijana, 8,896 yang panjangnya 30–42 aksara diukur terhadap 326px:**

    | Aksara | Sampel | Membalut pada 326px | Tersempit | Terlebar |
    |---|---|---|---|---|
    | 30 | 424 | 0% | 241px | 302px |
    | 31 | 486 | 0% | 246px | 310px |
    | 32 | 581 | 0% | 253px | 330px |
    | 33 | 690 | 3% | 250px | 336px |
    | 34 | 743 | 8% | 276px | 344px |
    | 35 | 754 | 24% | 264px | 352px |
    | 36 | 786 | 30% | 279px | 365px |
    | 37 | 801 | 64% | 297px | 362px |
    | 38 | 782 | 79% | 303px | 388px |
    | 39 | 736 | 92% | 308px | 393px |
    | 40 | 803 | 98% | 318px | 397px |
    | 41 | 726 | 100%, dibundarkan | **321px — muat** | 406px |
    | 42 | 584 | 100% | 338px | 411px |

    **Tiada titik "pasti membalut" di bawah 42 aksara**, dan panjang melebihi 42 tidak diukur. 37
    dipilih kerana ia menangkap kedua-dua teks yang memang membalut (37 dan 38) tanpa menanda sebarang
    teks yang muat hari ini — yang terpanjang ialah 33.

    **Pembetulan, 16 September 2026.** Rekod ini, komen `checkBandText` dalam
    `scripts/validate-content.js`, mesej commit `7642bd7` dan badan PR #63 berkata kedua-dua had diukur
    terhadap 12,000 ayat, dan bahawa setiap ayat dari 41 aksara membalut. **Kedua-duanya tidak
    tepat.** Had 28 diukur dalam larian berasingan terhadap 6,000 ayat. Dan 100% pada 41 aksara ialah
    angka dibundarkan: output yang sama melaporkan ayat 41 aksara tersempit pada 321px, yang muat.
    Kesilapan itu dibuat semasa hasil asal pertama kali dibaca, dan ringkasan compaction membawanya ke
    hadapan. Ia dijumpai dengan membaca semula hasil asal dalam transkrip sesi. Rekod ini dan komen
    skrip dibetulkan; mesej commit dan badan PR tidak boleh diubah. **Peraturan tidak berubah:** 28 dan
    37 kekal, kerana tiada satu pun bersandar pada titik 41.

    Mesej ralat validator dahulu berkata jalur *"almost always wraps"* dari 37 aksara, sedangkan
    kadarnya 64% pada 37. **Dibetulkan atas arahan pemilik projek**, kerana penulis kandungan
    membaca mesej itu dan mempercayainya. Mesej kini memetik kadar yang diukur bagi panjang teks itu
    sendiri daripada jadual di atas: 64%, 79%, 92%, 98%, *"over 99%"* pada 41, dan 100% pada 42.
    Melebihi 42 aksara, mesej berkata setiap ayat 42 aksara membalut dan yang lebih panjang tidak
    diukur. Mesej juga berkata ia anggaran daripada kiraan aksara, bukan ukuran piksel teks itu,
    kerana Node tiada fon.

    Amaran dan bukan ralat untuk had 28, **atas keputusan pemilik projek**: lapan teks BM lain yang
    melebihi 28 aksara (30–33) muat satu baris pada 390×740 hari ini, dan menulis semula ayat yang
    berfungsi untuk memuaskan had adalah kerja tanpa faedah. Amaran ialah maklumat untuk penulis.

    Peraturan ini digabung ke `main` bersama PR #63 dengan **dua ralat** — dua teks di atas — dan
    `main` gagal `validate:content` sehingga `fix/band-text`. Tiada apa yang menyekatnya: repo ini
    tiada CI (item 34). Selepas `fix/band-text`: **0 ralat**, dan lapan amaran jalur — pancingan
    q001, q004, q007, q008, q017, dan `explain` q012, q014, q018.

    **BM sahaja buat masa ini.** EN belum dihantar: `LANG` dikodkan `'ms'` dan audio EN masih 0 bait.
    **Had yang sama terpakai kepada EN bila suis bahasa mendarat.** Selepas `fix/band-text`, enam teks
    EN melebihi 28 aksara, semuanya di bawah 37: pancingan q004 (30), q007 (29), q010 (29), dan
    `explain` q012, q014, q018 (29 setiap satu).
34. **SPEC berkata `validate:content` "gagal dalam CI". Repo ini tiada CI. Direkod, belum dibaiki.**

    Dakwaan itu muncul di tiga tempat:

    | Tempat | Dakwaan |
    |---|---|
    | SPEC §3.5, jadual katalog DSKP | *"Kod tiada dalam katalog — Ralat — gagal CI"* |
    | SPEC §3.5, perenggan skrip masa bina | *"… gagal dalam CI jika ada aset hilang …"* |
    | `scripts/validate-content.js`, komen kepala | *"Fails CI on the first category of problem it finds, so a broken pack cannot reach a child."* |

    `src/features/quiz/activity.ts` pula berkata pek *"Validated at build time by validate:content"*,
    dan menyebut *"A pack that survived CI"*.

    **Disemak 16 September 2026:**

    - Tiada `.github/`, tiada fail aliran kerja, dan tiada konfigurasi CI lain dalam repo.
    - Tiada git hook selain fail `.sample`.
    - `npm run build` ialah `vite build` sahaja, dan tidak menjalankan pengesah.
    - `npm test` juga tidak menjalankannya.
    - Hos luar yang membina dari repo, jika ada, tidak kelihatan dari sini. Kalaupun ada, ia
      menjalankan `build`, dan `build` tidak memanggil pengesah.

    **Akibatnya, ralat `validate:content` tidak menyekat apa-apa.** Ia sudah berlaku: PR #63
    menggabungkan peraturan jalur (item 33) bersama dua ralat, dan `main` gagal sehingga
    `fix/band-text`. Ralat itu dijumpai hanya kerana skrip dijalankan dengan tangan.

    Pek juga dihurai dengan Zod semasa masa jalan (`activity.ts`), jadi pek yang rosak skemanya tetap
    ditolak. Pemeriksaan yang hanya wujud dalam skrip tidak berlaku semasa masa jalan: aset hilang,
    katalog DSKP, fail kemahiran, dan had jalur.

    **Sehingga dibaiki:** jalankan `npm run validate:content` dengan tangan sebelum menggabungkan
    perubahan kandungan. Kod keluarnya ialah satu-satunya gerbang. Tidak dibaiki di sini, atas arahan
    pemilik projek.
35. **Enam jurang dalam dokumen, dijumpai semasa membaca semula dokumen projek, 16 September 2026.
    Direkod, belum dibaiki.**

    Dijumpai dengan membaca HANDOFF, CLAUDE.md, SPEC, §16 ini dan `docs/kssr/` satu demi satu.
    Pemilik projek mengesahkan nombor 1 dan nombor 6.

    **1. Ujian ayat pada ibu bapa sudah berlaku, tetapi SPEC dan item 13 masih berkata ia akan
    berlaku.** SPEC §5.7 dan item 13 berkata ayat sokongan yang diluluskan *"akan diuji pada seorang
    ibu bapa sebenar"*. Nota itu ditulis dalam `a24126e` (12 September 2026, 17:55). Jawapan seorang
    ibu bapa difailkan sebagai `docs/kssr/ibu-bapa-ayat-status.md` dalam `fb599a6`, 19 minit
    kemudian (18:14). Tiada fail lain merujuknya.

    Yang ibu bapa itu kata, dan yang belum diputuskan:

    - Ayat kita difahami, tetapi tidak menjawab kenapa app menyemak semula.
    - Ia memisahkan satu keadaan kepada dua, dan memberi yang kedua — pernah menguasai, jawapan
      terbaru salah — tajuk *"Sedang dinilai semula"*. Itu berbunyi seperti nama status, dan SPEC
      §5.7 menetapkan tiga status tanpa label keempat.
    - Ia menamakan tiga perkara yang ibu bapa mahu tahu: sama ada anak pernah boleh, kenapa statusnya
      "sedang dinilai", dan apa yang perlu berlaku sebelum app boleh kata dikuasai.

    Ayat itu kekal belum dikunci. Keputusannya milik pemilik projek.

    **2. Siapa yang menanda borang pusingan 2 tidak direkod.** Nota status borang itu berkata:
    *"Salinan bertanda berdasarkan semakan pedagogi dalam perbualan ini."* `teacher-reviewed`
    bersandar pada borang ini (item 20), tetapi tiada fail berkata perbualan yang mana, atau siapa
    yang menanda salinan itu. Rekod guru yang dibina semula
    (`docs/kssr/guru-rekod-jawapan-subkemahiran-dan-semakan-soalan.md`) berkata keputusan semakan
    itu *"pernah diberi dalam chat"*. Ia tidak berkata siapa yang menanda borang.

    **3. CLAUDE.md menerangkan `docs/kssr/` sebagai apa yang guru dan ibu bapa hantar.** Bahagian
    *"Received documents"* berkata folder itu memegang *"what teachers and a parent actually sent"*.
    Tiga daripada lapan fail bukan begitu: `soalan-baharu-math-y1.md` dan
    `pembetulan-akhir-soalan-math-y1.md` ditulis Claude, dan
    `pemilik-kalibrasi-buku-teks-kpm-tahun-1.md` ialah nota pemilik projek. Pengepala setiap satu
    menyatakannya dengan betul; penerangan folder itu yang tidak.

    **4. HANDOFF.md bertajuk *"Handoff — 12 September 2026"*,** dan kali terakhir diubah dalam
    `e079ef8` (13 September 2026). Stor kemajuan, enjin pemilih, float bertindan dan had jalur
    (14–16 September) direkod dalam SPEC dan §16 ini sahaja. Pembaca yang bermula di HANDOFF, seperti
    yang disuruh, mendapat gambaran 13 September dahulu.

    **5. Nombor item §16 tidak berturutan dalam fail:** 1–13, kemudian 19, 18, 17, 16, 14, 15, dan
    20 ke atas. Spesifikasi CommonMark hanya memakai nombor item pertama dalam senarai bernombor, dan
    yang lain dinomborkan mengikut susunan. Pemapar yang mengikutnya memaparkan item yang ditaip 19
    sebagai 14, dan rujukan seperti *"item 18"* menunjuk kepada nombor yang tidak kelihatan di skrin.
    **Tidak dilihat dirender:** tiada pemapar Markdown dalam `node_modules`, dan tiada pratonton
    GitHub dari sini.

    **6. Item 27 berkata susun atur q011–q023 *"belum diukur"*. Ia sudah diukur.** Item 33 menyapu
    kesemua 21 soalan yang boleh dipilih, dalam keadaan pancingan dan dedahan, pada 390×740, dan
    melaporkan tiada potongan pada 360×780 bagi semua soalan, dengan inset 0 dan 34. Ayat item 27
    ditulis ketika tiada skrin memaparkan soalan itu, dan tidak dikemas kini.
36. **q019: tiga nombor, tiga pilihan, dan pengganggu yang tiada dalam arahan. Dibina 17 September
    2026; digabung hanya selepas rakaman BM baharu masuk.**

    Rekod guru yang dibina semula membetulkan nasihat awal guru: tiga nombor munasabah untuk Tahun 1,
    dan dua nombor *"terlalu hampir kepada `compare_smaller`"*. "Sokongan visual" bermaksud paparan
    yang bersih, tidak semestinya gambar (item 24).

    | | Dahulu | Kini |
    |---|---|---|
    | Arahan BM | *Kad Raju: 14, 9. Susun dari kecil ke besar.* | *Kad Raju: 14, 9, 18. Susun dari kecil ke besar.* |
    | Pilihan | `9, 14` · `14, 9` | `9, 14, 18` · `18, 14, 9` · `14, 18, 9` |
    | Pancingan BM | tiada — dua pilihan tidak pernah memaparkannya | *Nombor paling kecil dahulu.* (27 aksara) |
    | `explain` BM | *9 lebih kecil daripada 14.* | *9 paling kecil, kemudian 14.* (28 aksara) |

    **Keputusan pemilik projek:**

    - **Teks arahan biasa sudah memadai.** Guru memberi *"kad yang jelas"* sebagai contoh, bukan
      syarat. Pemilik projek akan mengesahkan dengan guru; kalau guru mahu kad, itu perubahan UI
      kemudian.
    - **Pengganggu ketiga ialah `14, 18, 9`, bukan `14, 9, 18` yang guru senaraikan.** `14, 9, 18`
      ialah susunan dalam arahan, jadi ia boleh dibuang dengan memadankan rentetan: bagi anak yang
      menyedarinya, soalan itu dua pilihan, dan siling 4% mengiranya tiga. Peraturan umumnya dalam
      SPEC §3.4, *Pengganggu*. `14, 18, 9` ialah susunan anak yang membanding digit pertama atau
      digit sa sahaja, dan menganggap 9 lebih besar daripada 14 dan 18.

    Guru sendiri menyenaraikan `14, 9, 18`, dalam dokumen yang sama yang menetapkan prinsip
    pengganggu. Pemilik projek akan menyebutnya kepada guru — dalam perkataannya, bukan untuk
    menangkap guru, tetapi kerana ia menunjukkan prinsip itu sukar dipatuhi walaupun oleh orang yang
    menulisnya. Sebab itu ia ditulis sebagai peraturan.

    > **Nombor potongan di bawah tidak sah — item 44.** Viewport ujiannya lebih tinggi daripada
    > telefon, jadi "0 / 0" di situ tidak berkata apa-apa tentang peranti.

    **Diukur di pane,** q019 dipandu melalui UI sebenar selepas kemajuan di-seed, dengan pilihan
    `14, 9, 18` — aksara yang sama seperti `14, 18, 9`, jadi susun aturnya sama:

    | Keadaan | Viewport | Jalur | Kad menatal, inset 0 / 34 | Butang audio terpotong |
    |---|---|---|---|---|
    | Sebelum menjawab | 390×740 | — | 0 / 18px | 0 / 0 |
    | Pancingan | 390×740 | satu baris, 245px | 7 / 25px | 0 / 0 |
    | Dedahan | 390×740 | satu baris, 240px | 7 / 25px | 0 / 0 |
    | Dedahan | 360×780 | satu baris, 240px | 0 / 18px | 0 / 0 |

    Arahan tiga baris pada kedua-dua viewport, dan tiada baris di bawah float. Setiap tatalan ialah
    padding kad sahaja — kelas q013 (item 33). Nilai inset 34 dikira dengan menganggap kad mengecil
    18px, bukan diukur pada telefon. Pancingan pada 360×780 tidak dipandu: 245px di bawah kapasiti
    satu baris 296px.

    **Rakaman.** Arahan berubah, jadi `/audio/ms/q019.mp3` perlu dirakam semula. Cawangan ini tidak
    digabung sebelum rakaman baharu masuk, atas arahan pemilik projek: anak yang mendengar dua nombor
    sambil melihat tiga diberitahu perkara yang salah.

    **Rakaman masuk, 17 September 2026.** Pemilik projek mendengar klip itu sebelum menyimpannya:
    *"Kad Raju: 14, 9, 18. Susun dari kecil ke besar."* Tag ID3 16,648 bait dibuang (SPEC §8).
    Sebelum dan selepas: 237 bingkai, 6.191 s, tiada bait ekor, dan penyahkod pelayar melaporkan
    6.191 s. Kandungan pertuturan disahkan oleh telinga pemilik projek, bukan dari sini.

    **Peranti ujian.** Bukti q019 lama tersimpan dengan `twoOptions: true`. Di bawah SPEC §5.7,
    soalan yang buktinya bercanggah dikira dua pilihan, jadi q019 kekal dua pilihan pada peranti itu
    sehingga storan dikosongkan.
37. **q022 dimainkan sebagai latihan, tanpa bukti dan tanpa markah. `noEvidence` membezakan latihan
    daripada diparkir. Dibina 17 September 2026.**

    Rekod guru yang dibina semula (`docs/kssr/guru-rekod-jawapan-subkemahiran-dan-semakan-soalan.md`)
    meluluskan bahasa q022 sebagai teka-teki atau latihan hubungan nombor, dan menolaknya sebagai
    bukti `two_digit_plus_two_digit_no_bridge`: *"? + 15 = 38"* mendorong `38 - 15`, bukan
    penambahan.

    **Diagnosis sebelum bina: membuang syarat `subSkill` daripada penapis enjin memulangkan q005 dan
    q009 juga.** Diukur dengan `selectSession` sebenar atas pek sebenar, lima larian anak yang belum
    mengumpul bukti: bank aras 1 naik daripada 9 kepada 11, dan q005 serta q009 muncul dalam
    kelima-lima sesi aras 1. Kedua-duanya latihan pengecaman yang sah menurut borang bertanda —
    *"kedua-duanya ialah latihan pengecaman"* — tetapi bukan 7.2.1, dan milik pek 7.0 Ruang (item
    10). Jadi yang perlu dibezakan ialah "latihan" daripada "menunggu pek lain", bukan daripada
    "rosak".

    **Keputusan pemilik projek:**

    - Medan tertutup `noEvidence: "practice" | "parked"` (SPEC §3.3). Setiap soalan membawa tepat
      satu daripada `subSkill` atau `noEvidence`. `tags` ditolak: teks bebas tanpa skema, jadi satu
      salah eja memaparkan atau menyembunyikan soalan tanpa amaran.
    - `learningStandard` q022 dibuang. Membiarkannya bermakna pek mendakwa q022 mengajar 2.2.2, dan
      guru kata ia tidak.
    - Jawapan `practice` tidak dikira dalam ketepatan, bintang, permata, markah atau tangga aras
      (SPEC §5.2, §5.5).
    - Soalan tambah terus yang baharu untuk `two_digit_plus_two_digit_no_bridge` masuk dalam
      cawangan berasingan, kerana ia kandungan yang perlu semakan guru. Pemilik projek belum
      menulisnya.

    **Yang dibina:** medan dan peraturan dalam `schema.ts`; `isScored()`; penapis dan keutamaan
    dalam `selection.ts` (latihan disusun bersama sub-kemahiran yang dikuasai); `summarise()` dan
    `finish()` mengira soalan yang dikira sahaja; tangga aras dalam `progress.ts` sama; amaran
    `parked` dalam `validate:content`. Pek: q005 dan q009 `parked`, q022 `practice`.

    **Bank aras 3, dengan q022 dimainkan semula:**

    | | Soalan aras 3 | Sesi aras 3: diminta / dapat |
    |---|---|---|
    | Sebelum perubahan ini | q008, q022, q023 | 8 / 3 |
    | Kalau q022 disembunyikan | q008, q023 | 8 / 2 |
    | **Selepas perubahan ini** | q008, q023, q022 (latihan, terakhir) | **8 / 3** |

    Item 31 kekal seteruk yang direkod, tidak lebih teruk.

    **Diukur di pane, UI sebenar,** kemajuan di-seed pada aras 3: sesi memilih q022 sebagai soalan
    kesepuluh, dengan `noEvidence: "practice"` dalam salinan beku. Sembilan jawapan betul dan q022
    salah memberi ketepatan 1.0, *"3 daripada 3 bintang"*, 30 permata, dan tiada bukti q022 dalam
    `esi.progress.v1`. Tanpa perubahan ini larian yang sama ialah 0.9 dan dua bintang.

    **Yang belum diputuskan:**

    - ~~**Baris *"9 daripada 10 betul pada cubaan pertama"*** dipaparkan bersebelahan tiga bintang.
      `firstTryCount` masih mengira setiap jawapan; hanya skor yang tidak mengira latihan. Kedua-dua
      nombor benar, tetapi ibu bapa mungkin bertanya kenapa sembilan daripada sepuluh ialah tiga
      bintang.~~ **Diputuskan dan dibina, 17 September 2026: *"9 daripada 9"*.** Kiraan cubaan
      pertama diambil atas soalan yang dikira, seperti bintang, kerana ibu bapa membaca dua nombor
      pada skrin yang sama sebagai satu kenyataan. Sesi tanpa soalan dikira tidak boleh berlaku
      dengan pek hari ini; kalau berlaku, baris itu disembunyikan. SPEC §5.2.
    - ~~**Borang `kssr:review`.** q022 tidak hilang daripadanya: borang merender setiap soalan pek,
      termasuk yang tiada SP. Tetapi ia merender soalan tanpa SP dengan *"Kami tidak mendakwa apa-apa
      SP untuk soalan ini. Kalau ia sepatutnya membawa satu, tulis kodnya di sini"* — soalan yang
      salah bagi soalan latihan yang sengaja tiada SP, dan bagi q005 dan q009 yang diparkir.~~
      **Dibina, 17 September 2026.** Soalan `practice` ditanya *"Sesuai sebagai latihan?"*; soalan
      `parked` disebut tidak dimainkan, tanpa soalan untuk guru; ringkasan menulis *latihan* dan
      *diparkir* tanpa kotak Ya/Tidak; dan kiraan *"kesepuluh-sepuluh"* kini *"kesemua 23"*, diambil
      daripada pek. Dalam perkataan pemilik projek, sebab yang paling penting: meminta kod SP untuk
      soalan yang sengaja tiada SP akan membuat guru menulis satu. SPEC §3.6.
    - ~~**`two_digit_plus_two_digit_no_bridge` tinggal q008 dan q023.** `validate:content` melaporkan
      kurang satu soalan (tekaan gabungan 1/9).~~ **Ditutup oleh q025, 18 September 2026 (item 40).**

    **Dua jurang, direkod dan tidak dibaiki:**

    - Peraturan 3 SPEC §6 tidak meliputi soalan yang dipetakan semula. Bukti q022 yang sudah
      tersimpan di bawah `two_digit_plus_two_digit_no_bridge` masih dikira. Hanya pada peranti ujian
      pemilik projek, yang boleh dikosongkan; dibiarkan atas keputusannya.
    - q022 masih bertanda `promptForm: reverse`. Laporan kepelbagaian bentuk dalam
      `validate:content` mengumpul mengikut `subSkill`, jadi tanda itu tidak dibaca di situ lagi.
      Borang `kssr:review` masih memaparkannya dalam jadual paksi, sebagai *Terbalik*, bersama
      pengenalan yang masih berkata *"kesepuluh-sepuluh soalan pek ini"* — pek ada 23. Pengenalan
      itu dibetulkan pada hari yang sama; tanda *Terbalik* kekal, untuk guru semak.
38. ~~**Putaran soalan terlalu perlahan walaupun bank mencukupi. Jurang, berasingan daripada item
    31. Direkod 17 September 2026, belum dibaiki.**~~ **DIBAIKI 22 September 2026: `timesAsked`
    menjadi pemecah seri sebelum `lastAsked`.** Diagnosis dikekalkan di bawah; pembaikan dan
    nombornya selepasnya.

    Item 31 ialah bank yang terlalu kecil. Ini masalah lain: aras 2 ada sembilan soalan dan sesi
    meminta tujuh, jadi putaran sepatutnya mungkin — tetapi lima soalan yang sama kembali setiap
    kali.

    Diukur dengan `selectSession` sebenar atas pek, aras 2, lima larian berturut-turut, semua
    sub-kemahiran pada keutamaan yang sama:

    | Anak | Soalan aras 2 dalam kelima-lima larian |
    |---|---|
    | Tidak mengumpul bukti | 5 daripada 9: q004, q007, q010, q014, q015 |
    | Mengumpul bukti bagi setiap jawapan | 5 daripada 9: sama |

    **Sebabnya.** Setiap soalan yang ditanya dalam satu larian mendapat nombor `lastAsked` yang sama.
    Larian seterusnya mengambil dua soalan yang tidak ditanya dahulu (nombornya lebih lama), kemudian
    baki lima dipilih oleh pemecah seri terakhir, iaitu susunan pek — lima yang sama setiap kali. Hanya
    dua daripada tujuh tempat berputar. Mengumpul bukti tidak membantu: selepas larian kedua setiap
    soalan sudah memberi bukti, dan seri kembali kepada susunan pek.

    Yang tidak diukur: keutamaan sub-kemahiran yang berbeza-beza (dikuasai, tergelincir), yang
    mengubah susunan bagi anak sebenar. Tiada kerja dirancang.

    #### Pembaikan, 22 September 2026: kira **berapa kerap**, bukan hanya **bila**

    `lastAsked` menjawab *bila*; ia tidak boleh memisahkan sepuluh soalan yang ditanya dalam larian
    yang sama, dan satu larian menanya sepuluh sekali gus. `timesAsked` menjawab *berapa kerap*,
    dan ia diletakkan **sebelum** `lastAsked` dalam rantaian pemecah seri.

    Tiga calon disimulasi sebelum memilih, semuanya tanpa rawak — lima larian setiap satu, pemilih
    dan stor kemajuan sebenar, anak aras 1 dan aras 2, dengan dan tanpa bukti:

    | Calon | Aras 1: muncul setiap larian | Aras 2 |
    |---|---|---|
    | Sekarang (`lastAsked` → susunan pek) | 6 / 3 | 5 / 5 |
    | Putaran susunan pek menggantikan `lastAsked` | 7 / 6 | **7** / 5 — lebih teruk |
    | Putaran susunan pek sebagai seri terakhir | 3 / 3 | 5 / 5 — hampir tiada kesan |
    | **`timesAsked` sebelum `lastAsked`** | **0 / 0** | **0 / 0** |

    **Diukur semula selepas dibina, dengan `buildSession` dan `recordSession` sebenar:**

    | Anak | Muncul dalam setiap larian | Taburan |
    |---|---|---|
    | Aras 1, tiada bukti | **0** daripada 12 | 4,4,4,4,4,4,4,4,4,3,3,3 |
    | Aras 1, mengumpul bukti | **0** daripada 12 | sama |
    | Aras 2, tiada bukti | **0** daripada 9 | 4,4,4,4,4,4,4,4,3 |
    | Aras 2, mengumpul bukti | **0** daripada 9 | sama |

    **Susunan keutamaan tidak berubah, dan itu diukur.** Pemecah seri duduk selepas `rank` dan
    `banked`, jadi tergelincir → belum dikuasai → dikuasai tidak disentuh. Semakan mekanikal
    merentas **80 larian simulasi**: tiada soalan yang ditinggalkan mempunyai pasangan
    (rank, banked) yang lebih baik daripada soalan yang dipilih — **0 pelanggaran**. q022 juga
    kekal di tempatnya: sekali dalam lima larian aras 2, sama seperti sebelum ini.

    **Kos naik taraf:** stor yang ditulis sebelum medan ini wujud membaca kiraan sebagai kosong,
    jadi satu larian melayan setiap soalan sebagai belum pernah ditanya. Diterima oleh pemilik
    projek — app belum dilancar, dan kosnya satu larian pada peranti ujiannya. SPEC §6 menulisnya.

    **Ujian yang gagal terhadap pemecah seri lama**, seperti item 39:
    *"prefers the questions a child has been asked least often"* dan *"counts how often before it
    counts how long ago"* dalam `selection.test.ts`, dan *"counts how many runs a question has been
    in, run after run"* dalam `progress.test.ts`. Disahkan dengan mengeluarkan medan itu semula:
    kedua-dua ujian pemilih gagal tanpa term `timesAsked`, dan ujian kiraan gagal tanpa kenaikan
    dalam `recordSession`.
39. ~~**Soalan `practice` mendahului soalan yang sudah dikuasai, selama-lamanya. Kecacatan dalam item
    37, dijumpai 17 September 2026. Belum dibaiki.**~~ **DIBAIKI 18 September 2026, sebelum soalan
    tambah keempat dihantar.**

    Item 37 meletakkan soalan latihan dalam kumpulan keutamaan yang sama seperti sub-kemahiran yang
    sudah dikuasai. Dalam kumpulan itu, pemecah seri seterusnya ialah *"soalan yang belum pernah
    memberi bukti cubaan pertama didahulukan"* (SPEC §5.5). Soalan latihan tidak pernah memberi
    bukti, jadi ia sentiasa menang — walaupun sebab pemecah seri itu, iaitu mengumpul soalan berbeza
    untuk penguasaan, tidak terpakai kepadanya.

    **Dengan pek hari ini ia belum kelihatan.** `two_digit_plus_two_digit_no_bridge` ada dua soalan
    sahaja dan tidak boleh dikuasai, jadi q008 dan q023 kekal dalam kumpulan "belum dikuasai", di
    depan q022. Kecacatan itu muncul sebaik sub-kemahiran aras 3 itu boleh dikuasai — iaitu apabila
    soalan tambah keempat masuk.

    **Kesannya diukur dengan soalan keempat hipotetikal**, disalin daripada q023, melalui pemilih dan
    peraturan kemajuan sebenar: anak yang menjawab semua betul dan kekal pada aras 2, lapan larian.
    Aras 2 ada satu tempat untuk soalan aras 3. Selepas sub-kemahiran itu dikuasai, q022 mengambil
    tempat itu dalam **enam** daripada lapan larian (soalan keempat pada aras 2) atau **lima** (pada
    aras 3); q008 dan q023 muncul sekali setiap satu.

    **Dibina, atas keputusan pemilik projek:** soalan latihan dikira "sudah memberi bukti" untuk
    pemecah seri itu sahaja — satu baris dalam `selection.ts`. Ia mendarat sebelum soalan tambah
    keempat dihantar, supaya soalan baharu tidak masuk ke dalam pemilih yang sudah diketahui rosak.

    Diukur semula dengan pemilih yang dibaiki, simulasi yang sama: tempat aras 3 bagi anak aras 2
    berputar — q008 tiga kali, q023 tiga kali, q022 dua kali (soalan keempat pada aras 2), atau dua
    kali setiap satu (pada aras 3). Soalan latihan masih mengambil gilirannya melalui `lastAsked`;
    ia hanya tidak lagi mendahului soalan yang sudah dikuasai secara kekal.
40. **q025 — soalan tambah keempat, ditulis pemilik projek. Ditambah 18 September 2026; tidak
    digabung sebelum rakaman BM masuk.**

    Ia menutup jurang yang dibuka apabila q022 menjadi latihan (item 37): sub-kemahiran
    `2.2.2/two_digit_plus_two_digit_no_bridge` kembali kepada tiga soalan bukti.

    | | |
    |---|---|
    | Arahan BM | *34 tambah 25 jadi berapa?* — 25 aksara |
    | Arahan EN | *What is 34 plus 25?* |
    | Pilihan | **59** · 69 · 95 |
    | Pancingan | *Tambah sa, kemudian puluh.* — 26 aksara BM, 28 EN |
    | Penerangan | *4 + 5 = 9. 30 + 20 = 50.* — 24 aksara |
    | Aras | 3 (item 31) |
    | Paksi | `direct` · `symbolic` · `select` |

    **Pengganggu, dengan sebabnya** — perkataan pemilik projek:

    - **69** — anak membawa satu puluh sedangkan tiada bawaan diperlukan. 4 + 5 tidak melintasi
      puluh, tetapi anak yang baru belajar mengumpul semula kadang membawa secara automatik.
    - **95** — digit betul, tempat terbalik. Keluarga yang sama seperti helah 47/74 dalam q001.

    Kedua-duanya dua digit, jadi tiada satu pun boleh dibuang kerana ia "nampak pelik", dan tiada
    satu pun sepadan dengan nombor dalam arahan — peraturan pengganggu SPEC §3.4.

    **Disahkan:**

    - Aksara seperti dikira di atas, dan kesemuanya di bawah had 28 aksara jalur.
    - Tiada pilihan muncul dalam teks arahan (34, 25).
    - 34 + 25 memang tanpa melintasi puluh: 4 + 5 = 9, di bawah sepuluh; jawapan 59.
    - `validate:content`: 0 ralat, dan jurang ambang bagi sub-kemahiran itu hilang. Bank penguasaan
      kini q008, q023 dan q025, ketiga-tiganya tiga pilihan — tekaan gabungan 1/27, di bawah siling
      4% (SPEC §5.7).

    > **Nombor potongan di bawah tidak sah — item 44.** Viewport ujiannya lebih tinggi daripada
    > telefon.

    **Susun atur, diukur dalam pane pada UI sebenar.** Kemajuan di-seed pada aras 3, dan q025 tiba
    sebagai soalan ketujuh.

    | Viewport | Arahan | Jalur | Kad menatal, inset 0 / 34 | Butang audio terpotong |
    |---|---|---|---|---|
    | 390×740, tiba | 2 baris, tiada tindih float | — | 0 / 18px | 0 / 0 |
    | 390×740, pancingan | sama | 1 baris, 249px | 7 / 25px | 0 / 0 |
    | 390×740, dedahan | sama | 1 baris, 189px | 7 / 25px | 0 / 0 |
    | 360×780, dedahan | 2 baris, tiada tindih float | 1 baris, 189px | 0 / 18px | 0 / 0 |

    - Pancingan pada 360×780 tidak dipandu; 249px di bawah kapasiti satu baris 296px.
    - `aria-live` membaca *"Belum betul. Cuba sekali lagi. Tambah sa, kemudian puluh."* dan
      *"Belum betul. 4 + 5 = 9. 30 + 20 = 50."*
    - **Butang audio dipaksa hadir untuk ukuran itu.** Dengan klip BM masih kosong, `AudioButton`
      menyembunyikan diri, jadi susun atur hari ini hanya membawa satu float. Ukuran di atas
      diambil selepas klip beku sesi ditukar kepada klip sebenar q008, iaitu susun atur yang anak
      akan lihat selepas rakaman mendarat. Perangkap yang sama direkod dalam item 26.

    **Rakaman menahan merge.** Ayat: `34 tambah 25 jadi berapa?` Klip BM dan EN kini fail 0 bait,
    jadi butang audio menyembunyikan diri dan soalan masih boleh dijawab (SPEC §3.5). Bila klip BM
    masuk, tag ID3 dibuang dan disahkan mengikut SPEC §8.

    **Rakaman masuk, 19 September 2026**, selepas PR #72 sudah digabung — jadi `main` membawa q025
    dengan klip kosong untuk seketika, dan butang audionya tersembunyi. Pemilik projek mendengar
    klip itu sebelum memasangnya: *"34 tambah 25 jadi berapa?"*

    | Semakan | Sebelum | Selepas |
    |---|---|---|
    | Saiz | 70,982 bait | 54,334 bait |
    | Tag | ID3v2.4, 16,638 bait diisytiharkan, tiada footer — 16,648 dibuang, berakhir tepat pada `ff fb` | tiada; bait pertama `ff fb` |
    | Bingkai / tempoh, dikira daripada bingkai | 130 / 3.396 s | 130 / 3.396 s |
    | Bait ekor | 0 | 0 |
    | Penyahkod pelayar | 3.396 s, 163,004 sampel | 3.396 s, 163,004 sampel; puncak 0.908 |

    Dalam UI sebenar, butang audio q025 kini dipasang (legap penuh), dan `Howler._howls` app sendiri
    memuatkan `/audio/ms/q025.mp3`. Kandungan pertuturan disahkan oleh telinga pemilik projek, bukan
    dari sini.
41. **Status *Dikuasai* dicapai pada peranti sebenar buat kali pertama — 20 September 2026.**

    Tiga larian pada iPhone, melalui alamat LAN pelayan pembangunan, dengan jawapan betul. Dua
    sub-kemahiran mencapai ambang SPEC §5.7:

    | Sub-kemahiran | Bukti | Sesi | Tekaan gabungan |
    |---|---|---|---|
    | `1.2.2/compare_greater` | q001, q012, q013 | 2 | 1 dalam 27 |
    | `1.2.2/after` | q002, q016, q017 | 2 | 1 dalam 27 |

    Rantaian penuh berjalan pada peranti untuk kali pertama: pemilih memilih soalan, sesi
    merekodnya, `recordSession` menulis bukti ke `esi.progress.v1`, dan `skillState` membacanya
    sebagai *Dikuasai*. Dua semakan lain dalam larian yang sama: tiga bintang bersama *"9 daripada
    9"* selepas q022 dijawab salah (item 37), dan q025 dengan rakamannya (item 40).

    **Tiga perkara yang data mentah sahkan, yang dibina tanpa pernah dilihat:**

    - **q001 muncul dalam kedua-dua sesi dan dikira sekali.** Bukti dikira mengikut `questionId`
      berbeza, bukan bilangan jawapan (SPEC §5.7). Tanpa itu, `compare_greater` akan mencapai
      ambang dengan dua soalan sahaja.
    - **`masteredOnce: true` melekat pada kedua-duanya**, dan akan kekal walaupun status turun
      kepada *Sedang dinilai* selepas satu jawapan salah.
    - **q022 tiada dalam bukti walaupun ia dimainkan.** Itu soalan latihan (item 37), dan
      `recordSession` tidak meninggalkan apa-apa untuknya.

    > **Bukti `after` datang daripada q016, yang ditulis semula keesokan harinya — item 42.** Rekod
    > ini kekal sebagaimana ia berlaku: pada 20 September 2026 ambang dicapai dengan teks q016 yang
    > lama. Bukti itu masih tersimpan di bawah `1.2.2/after` pada telefon pemilik projek sehingga
    > storan dikosongkan.

    **Cara ia dibaca.** Satu halaman sementara dalam `public/`, membaca sahaja, yang memanggil
    `skillState()` dan `standardCoverage()` sebenar terhadap `localStorage` telefon. Ia tidak
    pernah dijejak dan dipadam selepas dibaca, seperti halaman semai sebelum ini. Halaman itu
    sendiri mendedahkan satu perangkap; CLAUDE.md, *"Localhost ialah konteks selamat"*.
42. **q016 ditulis semula: ia meminta nombor sebelum 30, bukan selepas. 20 September 2026.**

    Teks lama: *"Nombor 30 datang selepas nombor apa?"*, jawapan 29, bertanda `promptForm:
    reverse`, dipetakan kepada `1.2.2/after`. Ia memberi 30 dan meminta nombor yang 30 ikuti —
    iaitu nombor **sebelum** 30.

    | | Dahulu | Kini |
    |---|---|---|
    | Arahan BM | *Nombor 30 datang selepas nombor apa?* | *Apakah nombor selepas 39?* — 25 aksara |
    | Arahan EN | *The number 30 comes after what number?* | *What is the number after 39?* |
    | Pilihan | 28 · **29** · 31 | 38 · **40** · 49 |
    | Pancingan | *Kira menurun satu langkah.* | *Kira satu lagi selepas 39.* — 26 aksara |
    | Penerangan | *29, kemudian 30.* | *39, kemudian 40.* — 16 aksara |
    | `promptForm` | `reverse` | `direct` — ia tidak lagi terbalik |

    Pengganggu, dengan sebabnya (SPEC §3.4): **38** ialah anak yang membilang menurun, dan **49**
    ialah anak yang menambah sepuluh dan bukan satu, keliru tempat puluh dengan tempat sa. Tiada
    satu pun sepadan dengan nombor dalam arahan.

    **Ditulis semula, bukan dipetakan semula — keputusan pemilik projek.** Memetakan q016 kepada
    `before` akan meninggalkan `after` dengan dua soalan dan `before` dengan satu: dua
    sub-kemahiran di bawah ambang, dan *Dikuasai* pertama pada peranti (item 41) hilang. Menulis
    semula mengekalkan `after` utuh dan membiarkan `before` bermula bersih.

    #### Keputusan ini dibuat atas bukti dalam repo, bukan atas petikan

    Pembetulan guru tentang q016 **tidak wujud dalam mana-mana fail**. Dicari: `q016` muncul dalam
    tiga fail sahaja — pek, `soalan-baharu-math-y1.md` dan `pembetulan-akhir-soalan-math-y1.md`,
    kedua-dua dokumen itu ditulis Claude. Ia **tidak** ada dalam borang bertanda pusingan 2, yang
    bertarikh 12 September dan menyemak q001 hingga q010; q016 baru ditulis 13 September dan masuk
    pek 14 September. Ayat yang dikaitkan dengan guru — *"data mastery akan salah walaupun jawapan
    murid betul"* — tiada di mana-mana dalam repo.

    Yang **ada** dalam repo, dan yang menyokong keputusan ini tanpa petikan:

    - Contoh guru sendiri dalam rekod yang dibina semula: `before` ialah *"Apakah nombor sebelum
      30?"* dan `after` ialah *"Apakah nombor selepas 29?"*. Teks lama q016 memberi 30 dan meminta
      29 — contoh `before` guru, dengan nombor yang sama.
    - Pancingan lama kita sendiri berkata *"Kira menurun satu langkah."* Item 33 sudah menolaknya
      untuk q002 kerana q002 membilang **naik** — sedangkan kedua-duanya dipetakan kepada `after`.
      Dua soalan dalam satu sub-kemahiran membilang ke arah bertentangan.
    - `1.2.2/before` tiada satu soalan pun, manakala `after` ada tiga — satu daripadanya soalan ini.

    **Ayat baharu ialah ayat pemilik projek, bukan ayat guru.** Corak *"Apakah nombor selepas N?"*
    memang corak contoh guru, tetapi contoh yang difailkan memakai **29**, dan itu q002 hari ini.
    Ayat dengan 39 tidak ada dalam mana-mana dokumen guru. Disebut di sini supaya ia tidak dibaca
    sebagai petikan kemudian — kesilapan kelas item 18.

    **Kesannya: q002 dan q016 kini berkongsi ayat yang sama dengan nombor berbeza.** Kedua-duanya
    `direct`. Menurut dokumen pembetulan (item 29), guru pernah meminta soalan baharu menukar
    nombor **dan** bentuk. Itu soalan untuk pusingan semakan seterusnya, bukan sekatan di sini.

    #### Jurang: kali ketiga jawapan guru hanya wujud dalam mesej

    Item 29 merekod jurang ini untuk tiga pusingan semakan q011–q023. Item 33 merekodnya untuk dua
    teks jalur yang guru semak. Ini yang ketiga, dan kali ini ia menggigit: pemetaan yang salah
    hidup dalam pek selama enam hari, memberi bukti kepada sub-kemahiran yang salah, dan
    menyumbang kepada *Dikuasai* pertama pada peranti.

    Sehingga jawapan guru difailkan seperti yang diterima, setiap pembetulan yang datang dalam
    mesej akan hilang dengan cara yang sama.

    #### Rakaman dan storan

    - **Klip BM q016 dikosongkan kepada 0 bait.** Klip lama merakam ayat lama; kalau cawangan ini
      digabung sebelum rakaman baharu masuk, anak akan mendengar ayat yang tidak lagi di skrin.
      Klip lama kekal dalam sejarah git (`51,826` bait). Ayat untuk dirakam:
      `Apakah nombor selepas 39?`

      **Rakaman masuk, 20 September 2026.** Pemilik projek mendengar klip itu sebelum
      memasangnya: *"Apakah nombor selepas 39?"*

      | Semakan | Sebelum | Selepas |
      |---|---|---|
      | Saiz | 64,713 bait | 48,065 bait |
      | Tag | ID3v2.4, 16,638 bait diisytiharkan, tiada footer — 16,648 dibuang, berakhir tepat pada `ff fb` | tiada; bait pertama `ff fb` |
      | Bingkai / tempoh, dikira daripada bingkai | 115 / 3.004 s | 115 / 3.004 s |
      | Bait ekor | 0 | 0 |
      | Penyahkod pelayar | 3.004 s, 144,195 sampel | 3.004 s, 144,195 sampel; puncak 0.815 |

      Dalam UI sebenar, butang audio q016 dipasang semula (legap penuh, 62px dalam pane), dan
      `Howler._howls` app sendiri memuatkan `/audio/ms/q016.mp3`. Kandungan pertuturan disahkan
      oleh telinga pemilik projek, bukan dari sini.
43. **q026, q027, q028 — tiga soalan untuk `1.2.2/before`, yang kosong sejak awal. Ditulis pemilik
    projek, ditambah 20 September 2026; tidak digabung sebelum rakaman BM masuk.**

    `before` ialah sub-kemahiran yang item 42 tinggalkan bersih: q016 dahulunya mengujinya sambil
    mendakwa `after`. Kini ia ada bank sendiri.

    | | q026 | q027 | q028 |
    |---|---|---|---|
    | Arahan BM | *Apakah nombor sebelum 30?* | *Kumar bilang 46, 47, 48. Apa sebelum 46?* | *Apakah nombor sebelum 71?* |
    | Pilihan | **29** · 31 · 20 | **45** · 49 · 36 | **70** · 72 · 61 |
    | Pancingan BM | *Kira satu kurang dari 30.* (25) | *Bilang turun dari 46.* (21) | *Satu kurang daripada 71.* (24) |
    | Penerangan BM | *29, kemudian 30.* (16) | *45, kemudian 46.* (16) | *70, kemudian 71.* (16) |
    | `promptForm` | `direct` | `contextual` | `direct` |

    Ketiga-tiganya aras 1, tiga pilihan, dan berada dalam aktiviti baharu `a8` — satu aktiviti satu
    sub-kemahiran, seperti a2 hingga a7, bertajuk label fail kemahiran.

    **Arahan q026 ialah contoh guru sendiri, kata demi kata**: *"Apakah nombor sebelum 30?"*
    (`guru-rekod-jawapan-subkemahiran-dan-semakan-soalan.md`, bahagian `before`). q028 ialah ayat
    yang sama dengan nombor lain, jadi `wordingVariant` kedua-duanya kekal `A`: ayatnya tidak
    berbeza, hanya nombornya.

    **Pengganggu, dalam perkataan pemilik projek.** Setiap soalan membawa dua salah faham yang
    boleh dinamakan:

    - **Arah salah — anak membilang naik, bukan turun.** 31 untuk q026, 72 untuk q028. Untuk q027
      ia lebih tajam: 49 ialah meneruskan urutan 46, 47, 48 ke hadapan, iaitu menjawab *"after"*
      pada hujung yang salah.
    - **Puluh bukan sa — anak menolak sepuluh, bukan satu.** 20, 36 dan 61. Keliru tempat puluh
      dengan tempat sa, keluarga yang sama seperti helah 47/74 dalam q001.

    Tiada pengganggu sepadan dengan nombor dalam arahan (SPEC §3.4).

    **Had sub-kemahiran, bukan kelemahan bank: `before` hanya menyokong `direct` dan
    `contextual`.** Bentuk `reverse` untuknya ialah *"29 datang sebelum nombor apa?"* — jawapannya
    30, yang menjadikannya soalan `after`. Itu tepat perangkap q016 (item 42). Jadi dua daripada
    tiga soalan di sini `direct`, walaupun guru meminta soalan baharu menukar nombor **dan**
    bentuk: bentuk ketiga tidak wujud untuk sub-kemahiran ini.

    **Kesan pada bank, diukur dengan pemilih sebenar:**

    | | Sebelum | Selepas |
    |---|---|---|
    | Soalan boleh dimain, aras 1 | 9 | **12** |
    | `1.2.2` sub-kemahiran diuji | 4 daripada 9 | **5 daripada 9** |
    | Aras 1, soalan yang muncul dalam kelima-lima larian | 9 daripada 9 | **3 daripada 12** |
    | Aras 1, soalan berbeza yang dilihat dalam lima larian | 9 | **12** |

    Itu menyentuh bahagian item 31 yang paling dirasai anak — sembilan soalan yang sama setiap
    sesi — dan ia ditutup dengan cara yang item 31 sendiri namakan: menulis soalan aras 1 baharu,
    bukan memindahkan aras.

    > **Nombor potongan di bawah tidak sah — item 44,** termasuk angka 1–5px itu. Pada telefon
    > potongannya kira-kira 28px, separuh butang, dan ia berlaku pada setiap soalan.

    **Susun atur, diukur dalam pane dengan klip beku ditunjukkan kepada rakaman sebenar** supaya
    butang audio dipasang:

    | Viewport | Arahan | Jalur | Kad menatal, inset 0 / 34 | Butang audio terpotong, inset 0 / 34 |
    |---|---|---|---|---|
    | 390×740, tiba | q026 dan q028 dua baris, q027 tiga | — | 0 / 18px | 0 / 0 |
    | 390×740, pancingan | sama | satu baris, 178–220px | 7 / 25px | 0 / **1–5px** |
    | 390×740, dedahan | sama | satu baris, 145–148px | 7 / 25px | 0 / **1–2px** |
    | 360×780, ketiga-tiga keadaan (q028) | dua baris | satu baris | 0 / 18px | 0 / 0 |

    Tiada baris teks di bawah mana-mana float, dan `aria-live` membaca verdict bersama teks jalur.

    > **Diterima buat masa ini, dan bukan kelas q013: potongan 1–5px pada 390×740 dengan inset
    > 34.** Dalam keadaan pancingan dan dedahan, tepi bawah butang audio berada 1–5px di bawah
    > tepi kad yang kelihatan. Kad menatal 25px, jadi butang masih boleh dicapai.
    >
    > **Ia berbeza daripada potongan q013 (item 33), dan tidak boleh direkod sebagai kelas yang
    > sama** — keputusan pemilik projek. q013 memotong padding kad; ini memotong tepi butang yang
    > anak perlu tekan. Lantai sasaran sentuh SPEC §9 ialah 64px, dan yang kelihatan semasa rehat
    > kurang daripada itu.
    >
    > Soalan sebelum ini — q016, q019, q025 — diukur 0 dalam keadaan yang sama, dan 360×780
    > bersih. Nilai inset 34 **dikira**, bukan diukur pada telefon: andaiannya kad mengecut 18px.
    > Pemilik projek akan mengesahkannya pada telefon selepas rakaman masuk.

    **Rakaman menahan merge.** Enam klip 0 bait: BM dan EN bagi ketiga-tiga soalan. Ayat BM untuk
    dirakam:

    ```
    q026  Apakah nombor sebelum 30?
    q027  Kumar bilang 46, 47, 48. Apa sebelum 46?
    q028  Apakah nombor sebelum 71?
    ```

    **Rakaman BM masuk, 20 September 2026.** Pemilik projek mendengar ketiga-tiganya sebelum
    memasangnya. Setiap satu membawa tag ID3v2.4 yang sama: 16,638 bait diisytiharkan, tiada
    footer, 16,648 dibuang, dan hujung tag mendarat tepat pada `ff fb`.

    | Klip | Saiz sebelum → selepas | Bingkai | Tempoh, dari bingkai | Penyahkod pelayar | Puncak |
    |---|---|---|---|---|---|
    | q026 | 54,264 → 37,616 | 90 | 2.351 s | 2.351 s · 112,848 sampel | 0.815 |
    | q027 | 119,465 → 102,817 | 246 | 6.426 s | 6.426 s · 308,453 sampel | 0.414 |
    | q028 | 60,951 → 44,303 | 106 | 2.769 s | 2.769 s · 132,911 sampel | 0.730 |

    Bingkai, tempoh dan bilangan sampel sama sebelum dan selepas tag dibuang, dan tiada bait ekor
    selepas bingkai terakhir. Dalam UI sebenar, ketiga-tiga butang audio dipasang (legap penuh,
    62px dalam pane) dan `Howler._howls` app memuatkan ketiga-tiga klip. Kandungan pertuturan
    disahkan oleh telinga pemilik projek, bukan dari sini. Klip EN kekal 0 bait, seperti semua klip
    EN lain.
    - **Bukti q016 pada peranti ujian kekal di bawah `after`** sehingga storan dikosongkan —
      peraturan 3 SPEC §6 tidak menapis bukti mengikut pemetaan pek semasa (item 37). Pemilik
      projek akan mengosongkannya.

    > **Nombor potongan di bawah tidak sah — item 44.** Viewport ujiannya lebih tinggi daripada
    > telefon.

    **Diukur dalam pane, UI sebenar,** dengan kemajuan di-seed supaya q016 tiba dahulu. Klip beku
    ditunjukkan kepada rakaman sebenar supaya butang audio dipasang, seperti item 40.

    | Viewport | Arahan | Jalur | Kad menatal, inset 0 / 34 | Butang audio terpotong |
    |---|---|---|---|---|
    | 390×740, tiba | 2 baris | — | 0 / 18px | 0 |
    | 390×740, pancingan | 2 baris | 1 baris, 216px | 7 / 25px | 0 |
    | 390×740, dedahan | 2 baris | 1 baris, 147px | 7 / 25px | 0 |
    | 360×780, dedahan | 2 baris | 1 baris, 147px | 0 / 18px | 0 |

    `aria-live` membaca *"Belum betul. Cuba sekali lagi. Kira satu lagi selepas 39."* dan *"Belum
    betul. 39, kemudian 40."*
44. ~~**Butang audio terpotong separuh pada iPhone, pada setiap soalan — dan setiap ukuran yang
    kata ia tidak terpotong diambil pada viewport yang tidak wujud pada telefon. Didiagnos 20
    September 2026; belum dibaiki.**~~ **DIBAIKI 20 September 2026: slot kancil keluar daripada
    kad soalan** (item 45 membawa keputusan, alternatif yang ditolak, dan ukuran selepasnya).
    **DISAHKAN PADA TELEFON 21 September 2026.** Diagnosis dikekalkan di bawah kerana ia yang
    menerangkan kenapa setiap ukuran lama tidak bermakna.

    **Apa yang pemilik projek lihat pada iPhone, 21 September 2026** — tiga keadaan, ketiga-tiganya
    lulus:

    | Ujian | Hasil pada peranti |
    |---|---|
    | Butang audio dalam keadaan jalur, termasuk arahan tiga baris (q028) | **Penuh**, tidak terpotong |
    | Skrin ganjaran, kancil 104px (item 46) | Seterusnya penuh; kaki kancil tidak terpotong |
    | Count-tap dedahan | 22px padding, seperti diukur |

    Pemerhatian tambahan, dalam perkataannya: kad soalan tanpa kancil *"nampak lebih tenang, dan
    teks tidak lagi membalut pelik"*.

    > **Satu percanggahan kecil, direkod supaya ia tidak menjadi kekeliruan nanti.** Pemilik projek
    > melaporkan **q028 sebagai tiga baris** pada telefon; pane mengukurnya **dua baris** pada
    > 393×695 (*"Apakah nombor sebelum 71?"*, 25 aksara, kad 110px). Pane melukis kira-kira 3%
    > kecil (CLAUDE.md), jadi arahan yang duduk dekat sempadan balutan boleh jatuh ke sebelah lain
    > pada peranti. Kalau q028 memang tiga baris di situ, kadnya ialah kes 140px — iaitu kes baki
    > 4px — dan butang audio **tetap penuh**, yang menjadikan ujian itu lebih kuat, bukan lebih
    > lemah. Tidak diselesaikan dari sini; kiraan baris pane tidak boleh mengatasi mata pada
    > peranti.

    Dilihat pada telefon: bahagian bawah bulatan audio hilang di bawah tepi kad putih, dalam
    keadaan tiba dan juga selepas menjawab.

    > **Keadaan tiba belum disahkan semula.** Pada 393×695 dalam pane, potongan itu muncul dalam
    > keadaan pancingan dan dedahan sahaja (27–28px); pada keadaan tiba kad 193px dan butang
    > penuh. Jadual dan apa yang ia ubah: item 45.

    **Diukur daripada piksel tangkapan skrin telefon** (590×1280 bagi viewport 390 lebar, skala
    1.513):

    | | Piksel imej | CSS |
    |---|---|---|
    | Tepi atas kad | 185 | 122 |
    | Tepi bawah kad | 401 | 265 |
    | Tinggi kad | 216 | **143** |
    | Tepi atas bulatan audio | 347 | 229 |

    Butang itu 64px tinggi, jadi **36px kelihatan dan kira-kira 28px terpotong — 44%**. Di bawah
    baris 401 warnanya latar mint, bukan cincin: bulatan benar-benar dipotong oleh tepi kad.

    **Mekanismenya, diukur dalam pane.** Kad ialah `flex: 0 1 auto` dengan `min-h-0` dan
    `overflow-y: auto`, jadi tingginya ditentukan ruang yang tinggal, bukan kandungan. Apabila
    ruang berkurang, kad mengecut di bawah kandungannya dan memotong bahagian bawah — dan
    kandungan paling bawah ialah butang audio.

    | Viewport | Tinggi kad | Limpahan kad | Butang vs tepi kad |
    |---|---|---|---|
    | 390×740 — viewport ujian kita | 193 | 0 | 25px di atas tepi |
    | 390×700 | 196 | 0 | 24px di atas |
    | 390×660 | 180 | 16 | 8px di atas |
    | 390×640 | 160 | 36 | 12px di bawah |
    | **390×620** | **140** | 56 | **32px di bawah — separuh** |

    Pada 390×620 pane menghasilkan gambar telefon: kad 140 berbanding 143 yang diukur pada
    telefon. Tepi atas kad pada telefon ialah 122 CSS berbanding 64 dalam pane — **58px hilang di
    atas**, iaitu jalur status dan safe-area yang pane tidak tiru, dan bakinya diambil bar Safari.

    **Tiga hipotesis yang diperiksa dan ditolak:**

    - *Kad menghadkan tingginya kepada teks, dan float melepasi tanpa menolak.* Tidak: perenggan
      arahan ialah flex item, jadi ia membentuk konteks pemformatannya sendiri dan **mengandungi**
      floatnya. Bawah perenggan 232 sama dengan bawah butang, dan `scrollHeight` kad 196 termasuk
      timbunan float.
    - *Float tidak menyumbang tinggi melainkan induk membentuk BFC; mungkin Safari berbeza.* Tidak
      diperlukan untuk menerangkan gejala ini: menurunkan tinggi viewport sahaja menghasilkannya.
      Tingkah laku float Safari tidak boleh diuji dari sini, dan tidak perlu diuji untuk kes ini.
    - *Ia kesan inset 34 yang dikira.* Bukan. Inset itu bernilai 18px; yang hilang di sini 53px
      tinggi kad.

    #### Satu angka salah, disalin ke hadapan lima kali

    Viewport 390×740 dan 360×780 ialah nombor kita sendiri, daripada dokumen kita, dan tidak pernah
    disahkan terhadap telefon. Setiap dakwaan *"tiada potongan"* dalam **item 33, 36, 40, 42 dan
    43** diambil pada viewport itu. **Tiada satu pun daripadanya berkata apa-apa tentang peranti**,
    dan kelima-limanya kini ditanda begitu.

    Ini bukan lima kesilapan berasingan. Ia satu angka salah yang disalin ke hadapan lima kali —
    kelas yang sama seperti *"1/6 diuji"* dengan `count_objects` dan *"kesepuluh-sepuluh soalan"*
    (HANDOFF §6): sesuatu yang kedengaran betul, dibawa ke hadapan, dan tidak pernah disemak
    terhadap sumbernya. Bezanya kali ini sumbernya bukan fail; ia peranti.

    Akibatnya kecacatan ini **bukan khusus kepada tiga soalan `before`**. Ia berlaku pada setiap
    soalan, dan ujian kita tidak pernah boleh menangkapnya.

    #### Langkah seterusnya, mengikut susunan

    1. ~~**Ukur viewport sebenar telefon**~~ **Diukur, 20 September 2026.**

       | | Telefon | Viewport ujian lama |
       |---|---|---|
       | `innerWidth × innerHeight` | **393 × 695** | 390 × 740 |
       | `100dvh`, `100svh` | 695px | — |
       | `100lvh`, `100vh` | 735px | — |
       | `screen` | 414 × 896, dpr 3 | — |
       | UA | iOS 18.7, Safari 26.6.1 | — |

       Viewport ujian kita **45px lebih tinggi dan 3px lebih sempit** daripada telefon.

       **Bila bar menyorot, telefon melaporkan `innerHeight` 735 tetapi
       `documentElement.clientHeight` kekal 695.** Pemilik projek membacanya daripada satu medan
       dan menyimpulkan hanya satu tinggi yang penting. Kesimpulan itu berkemungkinan besar betul,
       tetapi medannya bukan yang menentukan: skrin app disaiz dengan `h-[100dvh]`, jadi yang
       memutuskan ialah **dvh setiap keadaan**, bukan `innerHeight` dan bukan `clientHeight`.

       **Bacaan ketiga, 20 September 2026 — `dvh` memang naik.** Halaman ditatal sehingga bar
       Safari menyorot, dan setiap keadaan direkod:

       | Keadaan | `innerH` | `clientH` | `dvh` | `svh` | `lvh` | inset bawah |
       |---|---|---|---|---|---|---|
       | bar kelihatan | 695 | 695 | **695** | 695 | 735 | 0 |
       | bar tersorot | 735 | 695 | **735** | 695 | 735 | 0 |

       `innerHeight` dan `dvh` bergerak bersama; `clientHeight` tidak. Tekaan bahawa
       `clientHeight` ialah satu-satunya tinggi yang penting ditolak oleh bacaan ini —
       medannya bukan yang menentukan susun atur kita.

       **Tetapi app tidak boleh menyebabkannya naik pada skrin soalan.** Bar hanya menyorot bila
       **halaman** menatal. `main` ialah tepat `100dvh`, dan yang mengalah ialah kad (`min-h-0`,
       `overflow-y-auto`) — tatalan dalam kad bukan tatalan halaman. Diukur dalam pane pada
       393×695, memandu UI sebenar: `scrollHeight === clientHeight === 695` pada keadaan tiba,
       dengan jalur pancingan, dengan dedahan, dan pada setiap count-tap termasuk lapan objek
       q011. Skrin mula muat tepat juga. **Jadi skrin soalan ada satu tinggi, 695**, dan 735
       tidak sampai ke susun aturnya. Skrin ganjaran lain — ia menatal, dan di situ 735 boleh
       dicapai: item 46.

       **Ekor bacaan itu menunjukkan `innerHeight` turun ke 598 kemudian naik ke 694, dengan
       `dvh` dan `clientHeight` terpaku pada 695.** Itu bukan keadaan susun atur: apa sahaja
       lapisan UA yang menutup 97px itu — syak pemilik projek, callout pilihan teks daripada
       tekan-lama untuk menyalin — tidak menyentuh unit yang app gunakan. Puncanya tidak
       ditentukan daripada nombor sahaja, dan tidak perlu ditentukan: `dvh` tidak bergerak.

       `screen` melaporkan 414 × 896 pada dpr 3, yang tidak sepadan dengan lebar 393. Tidak
       diterangkan, dan tidak digunakan: `innerHeight` dan `dvh` yang dipakai.

       **`env(safe-area-inset-*)` ialah 0 pada telefon ini, dalam setiap keadaan.** Bacaan kedua,
       selepas halaman ditinggikan supaya bar boleh menyorot: **36 keadaan berbeza**, bar kelihatan
       dan bar tersorot, daripada elemen statik dan elemen `fixed` — setiap sisi 0px.

       Syak pertama pemilik projek ialah halaman itu tiada `viewport-fit=cover`; disemak, dan ia
       **ada**, sama seperti `index.html`, termasuk dalam salinan yang pelayan hantar. Halaman itu
       memang cacat, tetapi atas sebab lain: ia terlalu pendek untuk ditatal, jadi bar tidak pernah
       menyorot dan hanya satu keadaan boleh dilihat.

       **34px tidak pernah wujud di sini.** Ia nombor kita, bukan nombor peranti, dan ia masuk ke
       dalam lajur *"inset 34"* dalam item 33, 36, 40, 42 dan 43 — angka hantu di sebelah viewport
       yang salah. Jangan gantikan apa-apa; ukur pada 393×695.
    2. **Jadikan nombor itu angka ujian** dalam CLAUDE.md, menggantikan 390×740 dan 360×780.
       Dibuat; CLAUDE.md, *"The test viewport has to come from the phone"*.
    3. **Baru kemudian pembaikan.** Tiga arah yang munasabah, belum diukur dan belum dipilih:
       tinggi minimum untuk kad yang memuatkan timbunan float; mengeluarkan butang audio daripada
       aliran kad; atau mengecilkan slot kancil. Tiada satu pun boleh diukur dengan betul sebelum
       langkah 1.

    ~~Sementara itu kad masih boleh ditatal, jadi butang itu boleh dicapai~~ — tetapi semasa rehat
    anak nampak separuh bulatan, dan yang kelihatan jauh di bawah lantai sasaran sentuh 64px
    SPEC §9.

    #### Menatal kad bukan mitigasi: ia menukar satu potongan dengan satu lagi

    Dilihat pada telefon, kemudian diukur di pane pada 393×695 dalam keadaan jalur. Kad boleh
    ditatal 52px, dan menatalnya untuk mencapai butang audio mengangkat baris pertama soalan
    keluar dari atas kad:

    | | Kad di atas (seperti ia tiba) | Kad ditatal ke bawah |
    |---|---|---|
    | Baris pertama soalan | y 90, penuh | y 39 — **25px di atas tepi kad**, terpotong |
    | Butang audio | **26px di bawah tepi kad** | penuh dalam kad |

    **Anak tidak boleh melihat soalan penuh dan butang audio serentak.** Menatal untuk mencapai
    satu menyembunyikan yang lain, dan anak yang belum boleh membaca memerlukan kedua-duanya —
    butang itu yang membacakan baris yang baru hilang.

    Puncanya sama, jadi ia di sini dan bukan item baharu: kotak kandungan kad ialah 94px (142
    tolak padding 48), dan ia memegang slot kancil 88px dan butang audio 62px. Dua kandungan
    wajib berebut satu kotak yang tidak muat satu pun daripadanya bersama yang lain.
45. **Empat arah untuk membaiki potongan kad, dan kenapa tiada satu pun boleh diukur sebelum
    sekarang. Direkod 20 September 2026; tiada satu pun dipilih.**

    Kandungan kad ialah kira-kira 196px: slot kancil 88px, butang audio 64px di bawahnya dengan
    `clear`, dan padding kad. Pada 393×695 telefon memberi kad kira-kira 143px. Jurang itu, kira-kira
    53px, ialah apa yang mana-mana pembaikan mesti hapuskan.

    | Arah | Apa yang berubah | Apa yang perlu diukur dahulu | Kos yang sudah diketahui |
    |---|---|---|---|
    | **A. Tinggi minimum untuk kad** | Kad berhenti mengecut di bawah kandungannya | Apa yang mengalah sebagai ganti: padang dan maskot, butang jawapan, atau halaman mula menatal | Menolak butang jawapan ke bawah pada skrin pendek; DESIGN §7 meletakkan maskot pada padang atas sebab yang diukur |
    | **B. Butang audio keluar daripada aliran kad** | Butang jadi mutlak atau tetap di penjuru kad | Kedudukan setiap baris teks berbanding kotak butang, bukan hanya lebar baris | Sudah cuba sekali dan gagal: `text-indent` menempah baris pertama sahaja, dan teks berjalan di belakang butang (item 33) |
    | **C. Slot kancil dikecilkan** | Timbunan float jadi lebih pendek, contohnya 88px kepada 64px | Sama ada maskot masih terbaca pada saiz itu, dan kesan pada baris arahan | **Bercanggah dengan keputusan sedia ada**: maskot tidak dikecilkan, atas arahan pemilik projek (item 33) |
    | **D. Tukar apa yang mengecut** | Kad membesar penuh dan halaman yang menatal, bukan kad | Sama ada menatal halaman merosakkan kedudukan jalur dan butang jawapan | Menatal halaman pada skrin soalan belum pernah diuji pada kanak-kanak |

    **Kenapa tiada satu pun boleh diukur sebelum ini.** Setiap calon akan kelihatan lulus pada
    390×740, kerana pada tinggi itu kad tidak mengecut langsung dan butang berada 25px di atas tepi
    kad. Dan aritmetik di atasnya salah dua kali: viewport 45px terlalu tinggi, dan inset 34px yang
    digantikan tidak pernah wujud pada peranti (item 44). Ukuran pertama yang bermakna bagi
    mana-mana arah ialah pada **393×695 dengan inset 0**.

    #### Diukur pada 393×695, 20 September 2026 — dan B tidak boleh bersendirian

    Defisit skrin soalan ialah **52px**, dan hanya dalam keadaan jalur: pada keadaan tiba ada 22px
    lapang dan tiada apa terpotong (disahkan pada telefon). Jalur kos 71px — 51 jalur campur jurang
    20 — jadi kad kehilangan 49 dan butang audio jatuh 26px di bawah tepi kad.

    B dicuba dengan `position:absolute` di penjuru kad, diukur di pane:

    | | Sebelum | Dengan B |
    |---|---|---|
    | Kandungan kad | 196 | **136** |
    | Tinggi kad | 142 (terpotong 54) | 134 — muat, tiada potongan |
    | Baris teks di belakang butang | — | **tiada** (semakan `x` setiap baris) |
    | Butang vs slot kancil | — | **bertindih** |

    **B membebaskan tinggi kad; ia tidak memberi butang itu tempat.** Kotak kandungan kad dalam
    keadaan jalur ialah 94px, slot kancil 88px, butang audio 62px — 88 + 62 dalam 94 tidak muat
    dalam apa jua susunan, jadi mana-mana kedudukan dalam kad bertindih dengan slot kancil, dan
    penjuru bawah-kiri berlanggar dengan baris teks. Semakan `x` setiap baris lulus; yang gagal
    ialah maskot, dan maskot hadir tepat dalam keadaan yang sama (maklum balas).

    Tuas yang tinggal, dengan nombornya:

    | Pilihan | Beri | Kos |
    |---|---|---|
    | Butang jawapan 88 → 72 | 48, campur 6 lapang = **54** | Menyentuh saiz butang pilihan DESIGN §5.2; 72 masih di atas lantai sentuh 64px SPEC §9, dan sama dengan slot Seterusnya |
    | Slot kancil keluar daripada kad | **88** | DESIGN §7: penjuru ditempah supaya tiada apa berganjak bila maskot tiba. Maskot perlu rumah lain |
    | B sahaja | 60 tinggi kad, **0** tempat untuk butang | Tidak menutup |

    **Peraturan yang menutup kedua-dua pepijat bukan satu perubahan:** setiap skrin `100dvh`
    menamakan kotak yang menyerap kekurangan, dan kotak itu tidak boleh memegang kawalan. Pada
    skrin ganjaran kotak itu ialah kancil — satu-satunya blok tanpa kawalan, dan item 46 sudah
    dibaiki begitu. Pada skrin soalan kotak itu hari ini ialah **kad**, yang memegang butang audio,
    dan itulah pepijatnya. Dua tuas di atas ialah dua cara menamakan kotak lain.

    #### Kesilapan yang sama, dua kali, dan namanya

    Cadangan B datang daripada Claude, dan pemilik projek memilihnya. Kedua-duanya mengira
    **ruang yang dibebaskan** (60px, lebih besar daripada defisit 52) dan tidak mengira **ruang
    yang elemen itu perlukan** (62px, yang mesti datang dari suatu tempat). Nombor pertama betul
    dan tidak mencukupi untuk membuat keputusan.

    Ujiannya, untuk kali seterusnya: selepas mengira apa yang sesuatu perubahan bebaskan, tanya
    di mana benda yang dipindahkan itu akan berdiri, dan ukur kotak itu juga. Kelas yang sama
    seperti `text-indent` yang menempah baris pertama sahaja — jawapan yang betul kepada soalan
    yang salah.

    #### DIPUTUSKAN dan DIBINA, 20 September 2026: slot kancil keluar daripada kad

    Keputusan pemilik projek, atas peraturan di atas: **kotak yang menyerap tidak boleh memegang
    kawalan.** Slot kancil hiasan; butang jawapan 88px ialah benda yang anak tekan pada setiap
    soalan, dan 88 dipilih untuk motor kasar umur tujuh. Jadi slot itu yang keluar, bukan butang
    yang mengecil.

    Tiga kedudukan lain untuk maskot ditolak oleh ukuran, bukan oleh citarasa:

    | Kedudukan | Kenapa tidak |
    |---|---|
    | Mutlak atas penjuru kad | Teks berlanggar dengan kotak 88×88 itu pada **5 daripada 25** arahan — q003, q006, q011, q022, q027 |
    | Latar antara kad dan jalur | Latar bebas dalam keadaan jalur ialah 4–34px. Ia muat hanya bila maskot tiada |
    | Berhampiran bar kemajuan | Baris itu 20px; maskot menambah 68px. Menukar defisit dengan defisit |

    Yang dipilih ialah keempat: **kancil hidup pada skrin ganjaran, tidak pada kad soalan.**
    Saluran maklum balas tidak bergantung padanya — ikon ✓/✕ dalam butang jawapan, perkataan
    dalam jalur, verdict dalam `aria-live` — dan slot itu berharga 88px pada setiap soalan untuk
    reaksi yang tiba selepas anak sudah tahu keputusannya. DESIGN §6 dan §7 dipinda dengan
    sebabnya dan dengan apa yang hilang: `happy` dan `sympathy` tiada pemanggil pada kad soalan.

    **Diukur selepas perubahan, pane 393×695, UI sebenar, satu larian penuh sepuluh soalan:**

    | | Sebelum | Selepas |
    |---|---|---|
    | Kandungan kad, mcq | 194–196 | **110–140** |
    | Butang audio melepasi tepi kad | 26–28px | **tiada, pada mana-mana keadaan** (terdekat 25px di dalam) |
    | Kad mcq menatal | ya | **tidak** (julat tatal 0) |
    | Halaman menatal | tidak | tidak |
    | Count-tap, dedahan | terpotong ~46px (dikira) | **22px — padding bawah kad sahaja** |

    Count-tap dedahan diukur hidup kali ini, dengan kemajuan dikosongkan supaya larian membawa
    q003: objek terakhir 44px di dalam tepi kad, tali kiraan *"Dibilang: N"* 8px di dalam, dan
    yang di luar ialah padding. Itu kelas q013 (item 33), bukan kawalan terpotong.

    **Baki 4px pada kes terburuk.** Arahan tiga baris (q019, q021, q023) memberi kad 140 daripada
    142 yang ada. Jalur dua baris menambah 27 dan defisit kembali — jadi had 28/37 aksara
    `validate:content` kini menahan susun atur, bukan hanya bacaan. Dicatat dalam SPEC §3.5.

    ~~Satu bacaan masih terbuka dan ia menyentuh arah A dan D: sama ada `dvh` naik kepada 735
    apabila bar Safari menyorot.~~ **Ditutup, 20 September 2026: satu tinggi.** `dvh` memang naik
    kepada 735 apabila bar menyorot (item 44), tetapi bar hanya menyorot bila halaman menatal, dan
    skrin soalan tidak pernah menatal — `scrollHeight === clientHeight === 695` dalam setiap
    keadaan yang dipandu. Jadi keempat-empat arah diukur pada **393×695 sahaja**, dan tiada satu
    pun perlu bekerja pada dua tinggi.

    **Dan jurang 53px itu hanya wujud dalam keadaan jalur.** Diukur dalam pane pada 393×695,
    soalan tiga pilihan:

    | Keadaan | Tinggi kad | Kandungan kad | Butang audio vs tepi kad |
    |---|---|---|---|
    | Tiba | 193 | 196 | **0** — 25px di atas tepi |
    | Pancingan | 143 | 196 | **27px di bawah** |
    | Dedahan | 144 | 196 | **28px di bawah** |

    Kad 143 dan potongan 28px sepadan dengan tangkapan skrin telefon (143 dan ~28px), tetapi
    **hanya dalam keadaan jalur** — pada keadaan tiba pane memberi kad 193 dan butang penuh. Jalur
    satu baris ialah 51px, dan 193 − 143 = 50. Jadi sama ada tangkapan skrin itu diambil selepas
    satu jawapan salah, atau telefon mempunyai ~50px kurang daripada 695 pada keadaan tiba. **Tidak
    diselesaikan dari sini**; ia diselesaikan dengan satu pandangan pada telefon sebelum menjawab.
    Ia mengubah saiz pembaikan: kalau potongan hanya dalam keadaan jalur, yang perlu dicari ialah
    51px untuk jalur, bukan 53px pada setiap soalan.
46. **Skrin ganjaran melimpah 39px pada 393×695, dan butang kedua 23px di bawah tepi skrin.
    Diukur 20 September 2026; belum dibaiki.**

    Dijumpai semasa menyemak sama ada halaman app boleh menatal langsung (item 44). Skrin soalan
    tidak boleh; skrin ganjaran boleh, kerana blok butangnya `shrink-0`:

    | | |
    |---|---|
    | `documentElement.scrollHeight` | 734 |
    | `clientHeight` | 695 |
    | Limpahan | **39px** |
    | Blok butang (`flex w-full shrink-0 flex-col gap-4`) | atas 542, bawah **734** |
    | Butang **Seterusnya** (72px) | atas 646, bawah **718** — 23px di bawah tepi, 49px kelihatan |

    `main` ialah `h-[100dvh]` dan `overflow` kekal `visible`, jadi blok yang tidak boleh mengecut
    tumpah keluar daripadanya dan halaman itu sendiri yang menatal.

    Dua akibat:

    - **Anak nampak butang Seterusnya terpotong** selepas menyiapkan satu aktiviti — pada skrin
      yang sepatutnya ganjaran. Lantai sasaran sentuh SPEC §9 ialah 64px; yang kelihatan 49px.
    - **Ini satu-satunya skrin di mana `dvh` boleh mencapai 735**, kerana ia satu-satunya yang
      menatal. Kalau bar menyorot, `main` menjadi 735 dan kandungan 734 muat — jadi keadaan itu
      membetulkan dirinya sendiri, dan berkemungkinan berayun. Sama ada 39px cukup untuk Safari
      menyorotkan barnya **belum disemak pada telefon**.

    Komen dalam `SummaryScreen.tsx` merekod limpahan yang diukur pada 390×740 dan lantai yang
    dipilih untuk menghapuskannya. Nombor itu diambil pada viewport yang tidak pernah wujud (item
    44), jadi lantai itu disaiz untuk skrin 45px lebih tinggi daripada telefon.

    **DIBAIKI, 20 September 2026: kancil yang menyerap.** `KANCIL_PX` 150 → **104**. Kaedahnya sama
    seperti yang memilih 150, dijalankan semula pada tinggi sebenar: baki skrin ialah 584px, jadi
    111 yang terbesar muat pada 695 dan 104 menyimpan 7px di tangan — margin yang sama seperti
    nombor lama simpan apabila 160 melimpah 8.4px dan 150 diambil.

    Kancil dipilih kerana ia **satu-satunya blok pada skrin itu yang tidak memegang kawalan**
    (peraturan dalam item 45), atas keputusan pemilik projek.

    Diukur selepas perubahan, pane 393×695, UI sebenar:

    | | Sebelum | Selepas |
    |---|---|---|
    | `scrollHeight` vs `clientHeight` | 734 / 695 | **695 / 695** |
    | Halaman boleh ditatal | ya | **tidak** |
    | Butang Seterusnya | 607–718, 23px di bawah tepi | **607–679, penuh kelihatan** |
    | Kancil | 150 | 104, kaki masih di atas padang |

    Baki 7px duduk dalam pelapik `flex-1`, iaitu kotak yang memang direka untuk memegangnya.

    **DISAHKAN PADA TELEFON, 21 September 2026.** Pemilik projek membuka skrin ganjaran pada
    iPhone: butang **Seterusnya** penuh, dan kaki kancil tidak terpotong pada 104px. Item ditutup
    pada peranti, bukan hanya di pane.
47. **Ruang kosong antara kad soalan dan timbunan jawapan, selepas kad mengecil kepada
    kandungannya. Diukur 21 September 2026; tiada pembaikan dirancang.**

    Dilihat pada telefon selepas item 44: pada soalan dua baris tanpa jalur, ruang antara kad dan
    butang jawapan *"nampaknya kira-kira 200px"*. Pemilik projek meminta nombornya sebelum
    memutuskan sama ada ia perlu disentuh.

    **Ia bukan ruang baharu. Ia ruang yang berpindah.** Bahagian soalan ialah `flex-1`, jadi
    tingginya tetap — 279px pada soalan pilihan, 591px pada count-tap — dan kad tidak lagi
    mengisinya. Apa yang dahulu putih di dalam kad (88px slot kancil) kini latar padang di
    bawahnya.

    Diukur pada 393×695, keadaan tiba, tanpa jalur. Jurang diukur dari tepi bawah kad ke **butang
    pertama yang anak tekan**:

    | Bentuk arahan | Bilangan | Tinggi kad | Jurang ke timbunan | Jurang ke butang pertama |
    |---|---|---|---|---|
    | Pilihan, 2 baris | 10 / 22 | 110 | 104 | **120** |
    | Pilihan, 3 baris | 12 / 22 | 140 | 76 | **92** |
    | count-tap q003, q011 | 2 | 464 | 62 | 78 |
    | count-tap q006 | 1 | 378 | 149 | **165** |

    **Jurang terbesar dalam pek ialah 165px (q006), dan bagi soalan pilihan 120px** — bukan 200.
    Sepuluh soalan dipandu hidup melalui UI sebenar; lima belas yang lain dikira daripada klon
    perenggan yang disahkan terhadap sepuluh itu (sisihan 0–7px, kecuali satu bacaan yang
    diterangkan di bawah).

    Berbanding sebelum slot kancil dibuang, apabila setiap kad pilihan ialah 194–196px:

    | Bentuk | Jurang dahulu | Jurang kini | Perubahan |
    |---|---|---|---|
    | Pilihan, 2 baris | 37 | 120 | **+83** |
    | Pilihan, 3 baris | 37 | 92 | **+55** |

    **Dalam keadaan jalur ruang itu hampir hilang**, kerana jalur duduk di dalamnya. Diukur hidup
    pada q027: kad 110, jalur 51 pada y 188–239, dan yang tinggal di bawah jalur ialah **40px**.
    Pada arahan tiga baris ia 10px. Jadi ruang besar itu hanya wujud sebelum anak menjawab.

    **Perangkap ukuran, dan ia menggigit lagi.** Satu bacaan hidup memberi q017 sebagai dua baris
    (kad 110) sedangkan ia tiga baris (kad 138–140): `AudioButton` soalan sebelumnya masih
    terpasang ketika gelung menyemak, jadi ukuran diambil sebelum float soalan semasa mendarat.
    CLAUDE.md sudah merekod perangkap ini (PRD §16 item 26); tunggu butang **di dalam perenggan
    kad semasa**, bukan mana-mana butang audio pada halaman.

    **Tidak dibaiki, atas arahan pemilik projek** — nombor dahulu, keputusan kemudian. Kalau ia
    disentuh nanti, perkara yang perlu diputuskan ialah ke mana ruang itu pergi: kad yang lebih
    besar daripada kandungannya, timbunan yang naik, atau sesuatu yang mengisi padang. Ketiga-tiga
    pilihan menyentuh DESIGN §5.2 (zon ibu jari) dan kedudukan butang yang anak sudah biasa.

    **Kos yang diramal itu sudah tiba — 22 September 2026.** Teks count-tap dipendekkan (item 26),
    dan jurang membesar seperti yang diukur sebelum keputusan itu dibuat:

    | | Sebelum | Kini | Diramal |
    |---|---|---|---|
    | q006 (5 objek) | 165 | **223** | 219 |
    | q003, q011 (7 dan 8 objek) | 78 | **109** | 103 |

    Ramalan datang daripada klon perenggan; nombor kini dipandu melalui UI sebenar, dan bezanya
    4–6px — julat klon-lawan-hidup yang sama seperti sebelum ini.

    **q006 kini jurang terbesar dalam pek: 223px, pada skrin dengan objek paling sedikit.** Itu
    harga yang diterima sebelum teks dipendekkan, bukan kejutan. Item ini kekal **terbuka**, dan
    ia kini lebih berbaloi diputuskan daripada semalam.
48. **Dua perkara yang ujian anak tunjukkan, 21 September 2026. Satu didiagnos, satu direkod.
    Tiada satu pun dibaiki.**

    Kedua-duanya dilihat dalam tangkapan skrin telefon semasa anak tujuh tahun pemilik projek
    bermain count-tap sendiri (item 26). Kedua-duanya **bukan regresi** — keduanya sudah begitu
    sebelum isyarat butang dibina.

    #### 1. *"Dibilang: 0"* muncul sebelum anak mengetuk apa-apa

    Nombor sifar tidak bermakna kepada anak yang belum mula, dan ia menduduki ruang yang sama
    seperti kiraan sebenar. Tali itu juga kawasan `aria-live`, jadi apa-apa pembaikan menyentuh
    dua perkara sekali.

    **Apa yang pembaca skrin dapat hari ini.** Kawasan `aria-live` mengumumkan **perubahan**,
    bukan kandungan awal — jadi *"Dibilang: 0"* pada kedatangan tidak diumumkan kepada sesiapa.
    Ia kos visual tanpa faedah audio. Diukur dengan `MutationObserver` pada tali itu: ketukan
    pertama menghasilkan **1** mutasi (*"Dibilang: 1"*), ketukan kedua **2** — jadi setiap ketukan
    memang diumumkan, kerana kawasan itu sudah wujud sebelum teksnya berubah.

    **Empat layanan, diukur pada 393×695 melalui UI sebenar** (q006, 5 objek; q011, 8 objek):

    | Layanan | Kad q006 | Jurang ke Sedia, q006 | Kad q011 | Jurang, q011 | Anjakan bila tali muncul |
    |---|---|---|---|---|---|
    | **A. Sekarang** — *"Dibilang: 0"* | 378 | 165 | 464 | 78 | — |
    | **B. Tali dibuang sehingga ketukan pertama** | 342 | 201 | 429 | 114 | **36px** |
    | **C. Teks kosong, elemen kekal** | 358 | 185 | 444 | 98 | **20px** |
    | **D. Teks kosong + tinggi 20px ditempah** | 377 | 165 | 464 | 79 | **tiada** |

    - **B dan C menganjak susun atur tepat pada ketukan pertama** — saat jari anak berada di
      skrin. Kad membesar ke bawah dan jurang mengecut; objek tidak bergerak, kerana tali berada
      di bawahnya.
    - **B juga mencipta kawasan `aria-live` pada ketukan pertama, bukan pada muat.** Kawasan yang
      baru dimasukkan ke DOM tidak boleh diharap mengumumkan perubahan yang memasukkannya. Itu
      tingkah laku AT yang didokumenkan, **bukan sesuatu yang boleh diukur dari sini** — tiada
      pembaca skrin pada mesin ini.
    - **B tidak menamatkan potongan kad count-tap.** q011 kekal terpotong 6px berbanding 7px: yang
      terpotong ialah padding bawah kad, dan objek terakhir berada 24–60px di dalam tepi dalam
      setiap layanan.
    - **D ialah satu-satunya yang tidak menganjak apa-apa** dan tetap membuang sifar itu: kawasan
      kekal dalam DOM sejak muat, teksnya kosong, dan ketukan pertama menukar teks dalam kawasan
      yang sudah ada — mekanisme pengumuman yang sama seperti hari ini.

    ~~**Cadangan: D.**~~ **DIBINA, 21 September 2026: D.** Tinggi yang ditempah ialah
    `min-h-[1.35em]` — satu baris `--text-label`, token yang span ini pakai, jadi ia mengikut
    token dan bukan nombor yang disalin. Diselesaikan pelayar kepada **20.25px**.

    B ditolak walaupun ia memberi 36px ruang kad: ia membelinya dengan anjakan pada ketukan
    pertama dan dengan kawasan `aria-live` yang dicipta pada ketukan itu.

    **Disahkan pada 393×695, memandu UI sebenar, q003 (7 objek) dan q006 (5 objek):**

    | | Tiba, belum diketuk | Ketukan pertama | Ketukan kedua |
    |---|---|---|---|
    | Teks tali | `""` | `"Dibilang: 1"` | `"Dibilang: 2"` |
    | Kotak tali | atas 485, bawah 505, tinggi 19.9 | **sama** | **sama** |
    | Tinggi kad | 464.4 | **464.4** | **464.4** |
    | Jurang ke Sedia | 78 | **78** | **78** |
    | `aria-live` | `polite`, **sudah dalam DOM** | — | — |
    | Mutasi kawasan | — | **1** | **2** |

    Ketiga-tiga syarat dipenuhi: tiada anjakan pada ketukan pertama, kawasan wujud sebelum teksnya
    muncul, dan jurang ke Sedia tidak berubah — 78 pada q003 dan **165** pada q006, sama seperti
    sebelum perubahan. Kiraan mutasi juga sama seperti sebelum ini, jadi setiap ketukan masih
    diumumkan.

    Yang tidak boleh disahkan dari sini kekal tidak disahkan: tiada pembaca skrin pada mesin ini,
    jadi *"diumumkan"* bermakna kawasan itu berubah dengan cara yang sama seperti sebelum ini,
    bukan bahawa seseorang mendengarnya.

    #### 2. Merah selepas mengetuk tujuh daripada lapan

    Dalam tangkapan skrin ketiga, anak mengetuk tujuh epal daripada lapan, tali berkata
    *"Dibilang: 7"*, dia menekan Sedia, dan butang menjadi merah dengan ✕.

    **Itu betul.** Jawapannya 8 dan dia menghantar 7; peraturan percubaan SPEC §4.2 tidak berubah.

    Yang direkod ialah bacaan, bukan pepijat: selepas anak berjaya mengetuk tujuh objek satu demi
    satu — kerja yang dia buat betul — merah mungkin terbaca sebagai hukuman untuk kerja itu, dan
    bukan untuk nombor akhir. Tiada saluran hari ini yang memisahkan *"kiraan kamu tersasar satu"*
    daripada *"kamu salah"*.

    ~~**Direkod, tidak dibaiki, atas arahan pemilik projek:** dia mahu melihat sama ada anak itu
    mencuba lagi atau berhenti sebelum memutuskan sama ada ia perlu disentuh.~~ **DITUTUP TANPA
    PERUBAHAN, 22 September 2026: anak itu mencuba lagi.** Merah tidak terbaca sebagai hukuman
    kepadanya; ia terbaca sebagai *cuba sekali lagi*, yang memang maksudnya.

    **Had yang sama seperti di atas: satu anak, dua kali.** Ia menutup item ini kerana pemilik
    projek menetapkan tingkah laku anak sebagai ujiannya, dan ujian itu memberi jawapan. Ia tidak
    membuktikan merah berfungsi untuk setiap anak; ia membuktikan tiada sebab untuk mengubahnya
    sekarang.
49. **Enam soalan tambah melintasi puluh, disemak guru — dan dokumen gurunya sampai sebagai fail.
    Ditulis 22 September 2026.**

    `docs/kssr/guru-semakan-tambah-melintasi-puluh-dan-nilai-digit.md`, difailkan verbatim di bawah
    pengepala provenance. **Jurang item 29 tidak berulang untuk kelompok ini:** jawapan guru datang
    sebagai fail, bukan mesej, jadi setiap keputusan di bawah boleh disemak terhadap perkataannya.

    #### Id sub-kemahiran, disahkan dahulu

    Kedua-duanya wujud dalam `math-y1.skills.json`, dieja sama:
    `2.2.2/two_digit_plus_one_digit_bridge` dan `2.2.2/two_digit_plus_two_digit_bridge`. Tiada id
    direka.

    #### Yang ditulis

    | Sub-kemahiran | Soalan | Nota |
    |---|---|---|
    | `two_digit_plus_one_digit_bridge` | q029 (38+5), q031 (46+7), **q035 (59+4)** | q035 ialah contoh guru sendiri |
    | `two_digit_plus_two_digit_bridge` | q032 (27+16), q034 (48+25), **q036 (34+28)** | q036 ialah contoh guru sendiri |
    | — | q030 (Ali, 27+6), q033 (Mei Lin, 36+17) | situasi harian; `noEvidence: "practice"` |

    Ketiga-tiga bukti setiap sub-kemahiran ialah pengiraan **terus**, seperti yang guru minta. Kedua
    -duanya kini boleh mencapai *Dikuasai*: tiga soalan tiga pilihan, tekaan gabungan 1/27 = 3.7%,
    di bawah siling 4% (SPEC §5.7). `validate:content`: 2.2.2 kini **3 daripada 4** sub-kemahiran
    diuji — yang tinggal `two_digit_plus_one_digit_no_bridge`.

    Aktiviti baharu a9, a10 dan a11 (situasi harian). Rakaman: 16 klip 0 bait, BM dan EN.

    #### 2.4.2 — ada dalam katalog, tiada sub-kemahiran

    Guru mahu q030 dan q033 direkod di bawah `2.4.2`, bukan sebagai bukti 2.2.2. Disemak:

    - **`2.4.2` ADA dalam katalog DSKP** (`math-y1.json`), di bawah SK 2.4 *Penyelesaian masalah*:
      *"Menyelesaikan masalah tambah dan tolak yang melibatkan situasi harian."*
    - **Tiada sub-kemahiran di bawahnya** dalam `math-y1.skills.json`. Fail itu sendiri menjelaskan
      sebabnya, dalam nota `add_word_problem`: *"Belum dipecahkan di fail ini kerana tiada soalan
      pek memetik 2.4.2."* Sekarang dua soalan memetiknya.

    **Dibina sebagai `practice` buat sementara**, bukan sebagai bukti 2.4.2. Sebabnya: mendakwa
    2.4.2 memerlukan sub-kemahiran, dan memecahkan satu SP ialah kerja yang guru sendiri lakukan
    untuk SP yang lain — bukan sesuatu yang kami reka sambil menulis soalan. `practice` bermakna
    soalan itu dimainkan, tidak dikira dalam skor atau tangga, dan tidak meninggalkan bukti (SPEC
    §3.3) — iaitu tepat *"kekal dalam bank, fungsi evidencenya berbeza"* tolak bahagian 2.4.2.

    **Keputusan yang menunggu pemilik projek:** pecahkan 2.4.2 dalam fail kemahiran (dan tambah SK
    2.4 kepada `kssr.contentStandards` pek), atau biarkan `practice`. Kos pilihan pertama: satu
    sub-kemahiran baharu bernama, `reviewStatus` pek tidak berubah kerana borang pusingan 2 tidak
    meliputi soalan ini, dan 2.4.2 tidak boleh *Dikuasai* sehingga setiap pecahannya diuji.

    #### q023 — peraturan yang sama menyentuhnya, dan kosnya diukur

    q023 *"Devi ada 32 pensel. Dia beli 14 lagi. Berapa semua?"* ialah cerita penambahan, dan hari
    ini ia bukti untuk `two_digit_plus_two_digit_no_bridge`. Guru tidak menyebutnya; peraturannya
    menyentuhnya.

    **Kalau q023 dipindahkan ke 2.4.2:**

    | | Sekarang | Selepas pindah |
    |---|---|---|
    | Bukti `two_digit_plus_two_digit_no_bridge` | q008, q023, q025 | **q008, q025 sahaja** |
    | Tekaan gabungan | 1/27 = 3.7% | **1/9 = 11.1%** |
    | Boleh capai *Dikuasai*? | Ya | **Tidak** — di bawah bar tiga soalan dan di atas siling 4% |
    | 2.2.2 boleh capai *Dikuasai*? | Belum (satu sub-kemahiran belum diuji) | Tidak, dan dua sebab sekarang |

    Ia perlukan satu soalan tambah dua-digit tanpa melintasi puluh yang baharu, terus, untuk
    menggantikan q023. **Tidak dipindahkan** — pemilik projek akan bertanya guru dahulu.

    #### Pancingan dua peringkat guru, dipetakan kepada dua slot yang ada

    Guru menulis dua pancingan: *"Cukupkan 40 dahulu."*, kemudian *"Tambah 2 jadi 40. Baki 3."*
    App ada satu `hint` dan satu `explain`, bukan dua pancingan.

    - `hint` = **peringkat pertama** guru, dan ia sengaja tidak memberi nombor: *"jangan terus beri
      angka 2"*.
    - `explain` = **laluan penuh**, dipaparkan bersama jawapan apabila anak tidak boleh salah lagi
      (SPEC §4.2) — contohnya *"38 + 2 = 40, 40 + 3 = 43."*

    **Peringkat kedua guru diserap ke dalam `explain`, bukan slot baharu.** Slot pancingan kedua
    akan bermakna jalur kedua atau jalur yang tumbuh, dan DESIGN §7 memberi satu jalur satu blok.
    Direkod di sini supaya sesiapa yang membaca dokumen guru tahu ke mana peringkat kedua itu
    pergi.

    #### Label pengganggu — direkod di sini, tiada medan skema

    Guru menolak satu label untuk semua jawapan salah, dan menamakan tiga keluarga:

    | Soalan | Pengganggu | Label guru |
    |---|---|---|
    | q029 | 33 | `missed_new_ten` / `no_regrouping` |
    | q029 | 42 | `off_by_one` / `remainder_count_error` |
    | q031 | 43 | `missed_new_ten` |
    | q031 | 52 | `off_by_one` |
    | q032 | 33 | `missed_new_ten` |
    | q032 | 34 | `digit_reversal` |
    | q034 | 63 | `missed_new_ten` |
    | q034 | 37 | `digit_reversal` |
    | q035 | 53 | `missed_new_ten` |
    | q035 | 62 | `off_by_one` |
    | q036 | 52 | `missed_new_ten` |
    | q036 | 26 | `digit_reversal` |

    **Tiada medan skema ditambah, atas arahan pemilik projek.** Tiada kod membaca label itu hari
    ini, dan medan tanpa pembaca ialah kerja tanpa pengguna — alasan yang sama yang menolak skor
    keyakinan (SPEC §5.7). Ia dibina apabila sesuatu memerlukannya; sehingga itu jadual ini
    tempatnya.

    #### Diukur pada 393×695, UI sebenar

    q030 dan q033 ialah arahan terpanjang dalam kelompok ini:

    | | q030 | q033 |
    |---|---|---|
    | Baris arahan | **3** | **3** |
    | Tinggi kad | 138.3 (kandungan 140) | sama |
    | Dengan jalur pancingan | kad **tidak berubah**, jalur 51px | sama |
    | Dengan jalur dedahan | kad tidak berubah | sama |
    | Butang audio vs tepi kad | **52px di dalam** | sama |
    | Halaman menatal | tidak | tidak |

    Enam soalan terus ialah arahan dua baris, bentuk yang sama seperti q025.

    **Butang audio dipaksa hadir untuk ukuran ini.** Klip baharu 0 bait, jadi `AudioButton`
    menyembunyikan diri dan ukuran pertama menunjukkan kad dua baris tanpa float — susun atur yang
    tiada anak akan lihat selepas rakaman mendarat. Klip beku sesi ditukar kepada rakaman sebenar,
    seperti item 40. Perangkap yang sama, kali ketiga.

    #### Kesan pada item 31

    Bank aras 3 naik daripada **4** soalan boleh dimain kepada **12** (sembilan bukti, tiga
    latihan), untuk lapan slot yang sesi aras 3 minta. Diukur dengan pemilih sebenar, lima larian:
    **0 soalan muncul dalam setiap larian**, kiraan 4,4,4,4,3,3,3,3,3,3,3,3. Item 31 ditutup
    sepenuhnya — lihat item itu.

    #### Yang tidak ditulis di sini

    Soalan nilai digit. Keputusan guru tentang pengganggu *"6"* direkod dalam SPEC §3.4 sebagai
    pengecualian kedua, tetapi soalannya ialah kelompok berasingan, atas arahan pemilik projek.
