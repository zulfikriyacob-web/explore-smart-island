# PRD.md — Aplikasi Pembelajaran Kanak-Kanak (Tahun 1–3)

**Nama kerja projek:** Pulau Pintar
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

### Dalam skop (MVP, v1.0)
- 3 modul: **Matematik**, **Membaca**, **Sains** — Tahun 1, 2, 3
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

> ⚠️ **Nota pengesahan:** pemetaan topik di bawah adalah rangka kerja berdasarkan struktur
> DSKP KSSR (Semakan 2017). Kod SP sebenar (cth. `1.1.1`) **mesti disahkan terhadap fail
> DSKP rasmi KPM** sebelum kandungan dimuktamadkan. Jangan hantar ke produksi tanpa semakan
> seorang guru berpengalaman.

### Tahun 1
| Bidang | Topik aktiviti | Contoh kemahiran |
|---|---|---|
| Nombor & Operasi | Nombor bulat hingga 100 | Membilang, nilai tempat, tertib menaik/menurun |
| Nombor & Operasi | Tambah & tolak dalam lingkungan 100 | Fakta asas, ayat matematik |
| Sukatan & Geometri | Wang hingga RM10 | Kenal syiling & not, jumlah harga |
| Sukatan & Geometri | Masa & waktu | Hari, bulan, waktu tepat pada jam |
| Sukatan & Geometri | Bentuk 2D & 3D | Kenal pasti, ciri sisi/bucu |
| Perkaitan & Algebra | Pola mudah | Sambung pola bentuk & nombor |

### Tahun 2
Nombor hingga 1,000 · Tambah & tolak dengan mengumpul semula · **Darab & bahagi (2, 3, 4, 5, 10)** ·
Wang hingga RM100 · Masa (setengah jam, suku jam) · Ukuran panjang & jisim · Perwakilan data mudah

### Tahun 3
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
1. **Petak penguasaan** — setiap topik: Belum mula / Sedang belajar / Dikuasai
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

**Fasa 1 — Rangka (2–3 minggu)**
Peta pulau, satu topik Matematik, enjin kuiz, 3 jenis soalan, bintang, storan tempatan.
*Kriteria keluar:* satu kanak-kanak sebenar boleh menyiapkan satu aktiviti tanpa bantuan.

**Fasa 2 — Kandungan & akaun (4–6 minggu)**
Ketiga-tiga modul, Tahun 1 penuh. Auth, profil, sync awan, papan pemuka ibu bapa asas.

**Fasa 3 — Kedalaman (4–6 minggu)**
Kandungan Tahun 2 & 3. Avatar + kedai. Siri. Laporan mingguan. Muat naik audio.

**Fasa 4 — Penggilapan**
PWA luar talian, prestasi pada telefon murah, semakan kebolehcapaian, ujian pengguna
bersama 5 kanak-kanak sebenar setiap tahun persekolahan.

---

## 15. Andaian & risiko

| Risiko | Kesan | Tindakan |
|---|---|---|
| Kandungan KSSR salah dipeta | Ibu bapa hilang kepercayaan | Semakan guru berbayar sebelum pelancaran; kod SP kelihatan dalam papan pemuka |
| Produksi audio pantas melebihi bajet | Modul Membaca tersekat | Rakam Tahun 1 dahulu; tulis skrip semua di awal; guna satu pelakon suara setiap bahasa |
| Animasi tersekat pada telefon Android murah | Kanak-kanak berputus asa | Anggaran prestasi pada peranti sasaran ~RM600; hanya animasi `transform`/`opacity` |
| Sesi terlalu panjang untuk umur 7 tahun | Kadar berhenti tinggi | 10 soalan maksimum; sasaran 4–6 minit setiap aktiviti; uji dengan kanak-kanak sebenar |
| Kekeliruan dwibahasa dalam Membaca | Pembelajaran fonik rosak | Kunci bahasa kandungan setiap trek (§12) |

---

## 16. Soalan terbuka

1. Adakah kita menyokong Jawi dalam trek Membaca? (Dicadangkan: tidak untuk v1.)
2. Berapa banyak soalan setiap topik diperlukan sebelum pengulangan terasa? (Dicadangkan: minimum 40.)
3. Adakah Tahun 3 memerlukan sesi lebih panjang (15 soalan)? Uji sebelum memutuskan.
4. Model perniagaan — percuma dengan langganan ibu bapa, atau bayar sekali? Belum diputuskan.
