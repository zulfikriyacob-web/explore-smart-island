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

> ⚠️ **Status pengesahan.** Bahagian ini kini sepadan dengan dokumen, tetapi
> `kssr.verified` kekal `false` di dalam pek. Membaca DSKP dengan betul dan seorang guru
> mengesahkan bahawa satu soalan benar-benar mengajar kod yang didakwanya ialah dua perkara
> berbeza. Hanya semakan guru menaikkan bendera itu (PRD §15).

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
   Liputan kemahiran: 1/6 diuji
   Kemahiran yang sudah diuji: Tambah gandaan 10
   Kemahiran lain belum dinilai.
   ```

   Nisbah sendirian memberitahu ibu bapa terlalu sedikit. "1/6" berkata ada lima perkara lain;
   **namanya** berkata apa yang anak sebenarnya ditanya, dan itu yang boleh ditindaklanjuti.

   **"1 daripada 6 diuji" bukan "17% dikuasai".** Lima kemahiran lain belum diuji; anak tidak
   gagal lima kemahiran. Larangan penuh, dan larangan kedua tentang nombor 3.7%, dalam
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
*Kriteria keluar:* seorang guru menyemak pemetaan KSSR satu modul penuh dan `kssr.verified`
menjadi `true` — buat pertama kali, pada modul yang paling murah untuk membetulkannya.

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

    Kedua, dan lebih penting: **q005 dan q009 bukan sekadar berada dalam pek yang salah — ia
    ditulis terbalik.** SP 7.2.1 ialah *"**Menamakan** bentuk…"*. Soalan kita memberi nama
    dalam arahan (*"Yang mana bentuk segi tiga?"*) dan meminta murid memilih gambar. Itu
    **pengecaman**, bukan penamaan. Guru mencadangkan arah yang betul: tunjuk satu bentuk,
    tanya *"Apakah nama bentuk ini?"*, dengan nama-nama sebagai pilihan teks.

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

    **Ambang DIPUTUSKAN: `promptForm` yang dikira.** Dua bentuk berlainan, **di samping**
    tiga `questionId` berbeza dan dua sesi — bukan menggantikannya. Dua bar itu mengukur risiko
    berbeza, dan menukar satu dengan satu lagi membawa kadar tersalah label seorang peneka
    kembali daripada 3.7% ke 11%.

    `responseMode` ditolak sebagai paksi bukti kerana **senarai sub-kemahiran sudah
    memisahkannya** di mana ia penting — mengetuk untuk membilang lawan memilih nombor ialah
    dua sub-kemahiran, bukan dua bentuk. `representation` ditolak kerana ia mengubah kesukaran,
    yang sudah ada medannya sendiri. Jadual penuh dalam SPEC §5.7.

    **Pengecualian, dan ia belum disemak guru.** Sub-kemahiran yang hanya menyokong satu
    bentuk kekal pada tiga id sahaja — bar yang tiada siapa boleh lepasi tidak memberitahu ibu
    bapa apa-apa. Senarainya sepuluh entri, kesemuanya membilang 1.5.1, dalam
    `math-y1.skills.json` dengan sebab setiap satu dan `teacherReviewed: false`.
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
16. **Jawapan salah kedua pada soalan yang sama tidak diumumkan.** Ditemui semasa mengukur
    pembaikan item 14, dan ditinggalkan kerana pembetulannya ialah teks yang membawa nada.

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

    **Apa yang pane tidak boleh buktikan:** `Howler.autoUnlock` sudah `false` dan
    `_audioUnlocked` sudah `true` di sini, kerana context pane bermula dalam keadaan berjalan.
    Yang diukur ialah **perambatan** (`keydown` sampai ke `document`) dan **kelumpuhan**
    (Enter tidak membuat apa-apa). Dakwaan buka kunci bersandar pada sumber Howler, sama
    seperti sebelum ini, dan hanya peranti sebenar boleh mengesahkannya.
