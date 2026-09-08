# DESIGN.md — Sistem Reka Bentuk

**Projek:** Explore Smart Island
**Rujukan:** PRD.md v0.1 · SPEC.md v0.1
**Versi:** 0.1

---

## 1. Arah seni

**Konsep: kepulauan tropika Malaysia pada waktu petang keemasan.**

Bukan pelangi gula-gula. Bukan neon. Palet diambil daripada perkara yang murid Malaysia
berumur 7 tahun benar-benar lihat: laut cetek, pasir, buah mangga, bunga raya, daun pisang,
langit senja.

Ini memberi tiga perkara sekaligus:
1. **Ia terasa tempatan** tanpa perlu meletakkan bendera atau songkok di mana-mana.
2. **Warnanya secara semula jadi mempunyai peranan** — laut = navigasi, mangga = ganjaran,
   bunga raya = amaran, daun = betul. Kanak-kanak belajar sistem ini dalam beberapa minit.
3. **Ia tidak kelihatan seperti setiap templat app pendidikan** yang lain.

**Peraturan berani:** Kemeriahan dibelanjakan pada **momen ganjaran**. Skrin kuiz itu sendiri
adalah tenang — permukaan putih, satu warna modul, teks besar. Apabila bintang jatuh, barulah
skrin dibenarkan meletup. Jika setiap skrin meriah, tiada skrin yang terasa istimewa.

---

## 2. Palet warna

### 2.1 Asas

| Token | Hex | Guna |
|---|---|---|
| `--laut-cetek` | `#E6F7F4` | Latar belakang app (aqua pucat) |
| `--pasir` | `#FFF3DC` | Permukaan sekunder, kad melahu |
| `--putih` | `#FFFFFF` | Kad kuiz, permukaan utama |
| `--arang` | `#1F3A34` | Teks utama (hijau-hitam dalam, bukan hitam pekat) |
| `--arang-lembut` | `#5C7A72` | Teks sekunder, label |
| `--garis` | `#D3E8E3` | Pembahagi, sempadan lalai |

Latar belakang aqua pucat, bukan krim, adalah pilihan yang disengajakan. Ia mengekalkan
metafora pulau dan mengelakkan penampilan "kertas hangat" yang kini menjadi lalai.

### 2.2 Warna modul

Setiap pulau memiliki satu warna. Ia mewarnai butang topik, bar kemajuan, dan tajuk pulau —
tiada tempat lain.

| Modul | Token | Hex | Gelap (teks di atas) | Cetek (latar) |
|---|---|---|---|---|
| Matematik | `--laut` | `#0FB5A6` | `#087A70` | `#D6F5F1` |
| Membaca | `--jingga` | `#FF8A3D` | `#C25A16` | `#FFE9D9` |
| Sains | `--nila` | `#5B5BD6` | `#3B3B9E` | `#E4E4FB` |

### 2.3 Warna semantik

| Peranan | Token | Hex | Nota |
|---|---|---|---|
| Betul | `--daun` | `#2FBF71` | Hijau daun; digandingkan dengan ikon ✓, tidak pernah warna sahaja |
| Salah | `--bunga` | `#FF6B6B` | Bunga raya lembut. **Bukan** merah tanda amaran |
| Bintang / ganjaran | `--mangga` | `#FFB627` | Dikhaskan. Jangan guna untuk apa-apa lain |
| Permata | `--pirus` | `#22D3EE` | Sian terang |
| Siri | `--api` | `#FF7A00` | Oren nyala |

### 2.4 Kontras

Semua pasangan teks disahkan pada ≥ 4.5:1:

- `--arang` di atas `--putih` → 11.8:1 ✓
- `--arang` di atas `--laut-cetek` → 10.6:1 ✓
- `--putih` di atas `--laut` → 2.4:1 ✗ → **guna `--arang` di atas `--laut`**, atau
  `--putih` di atas `--laut` gelap `#087A70` → 5.1:1 ✓

> Teks putih di atas teal cerah gagal. Ini kesilapan biasa dalam app kanak-kanak. Butang
> teal utama menggunakan **teks arang gelap**, bukan putih.

### 2.5 Pemisahan palet — UI dan ilustrasi

**Isian ilustrasi boleh melebihi §2. Permukaan UI, chrome, dan warna semantik tidak boleh.**

Ini pindaan sebenar kepada palet, bukan pengecualian yang diberi kepada satu aset. Kita ada
**dua palet**, dan §2.1–2.4 mentakrifkan yang pertama sahaja.

Sebabnya: peraturan §1 bahawa skrin kuiz kekal tenang ialah peraturan tentang **UI** —
permukaan, chrome, butang, latar. Rambutan yang anak disuruh bilang bukan chrome; ia
**subjek tugasan**. Subjek terang dikelilingi UI tenang bukan melanggar ketenangan itu — ia
yang menjadikannya berfungsi. Semua senyap, satu benda kuat, dan benda kuat itu ialah benda
yang patut dipandang. Bukti kecil daripada ujian pengguna: anak kata **buah** membosankan.
Bukan skrin.

| | Palet UI (§2.1–2.4) | Palet ilustrasi |
|---|---|---|
| Terpakai pada | Permukaan, butang, sempadan, teks, bar, ikon UI | Isian dalam fail SVG ilustrasi |
| Sumber warna | Token §2 sahaja | Bebas; dipilih untuk pengecaman objek |
| Ketepuan | Sengaja lembut | Setepu yang perlu |
| Membawa makna? | Ya — betul, salah, ganjaran, modul | Tidak. Warna buah bukan isyarat |

**Garis luar kekal token UI.** Setiap ilustrasi digariskan `--arang` `#1F3A34` pada 4px
(§8). Garis luar itu chrome; isian di dalamnya bukan. Itu sempadan yang tepat antara
kedua-dua palet.

Pemisahan ini menyelesaikan dua ketegangan yang sebelum ini kelihatan seperti percanggahan:

- Rambutan boleh jadi kirmizi sebenar tanpa menambah merah kepada §2 dan tanpa meminjam
  `--bunga`, yang bermaksud "salah".
- Pisang kuning bukan lagi melanggar §12 peraturan 2 dengan menggunakan `--mangga`. Ia kuning
  ilustrasi, bukan token ganjaran.

**Kirmizi rambutan `#AE1A45` disemak terhadap `--bunga` `#FF6B6B`:**

| | `--bunga` (salah) | Rambutan asas | Rambutan bayang |
|---|---|---|---|
| Hex | `#FF6B6B` | `#AE1A45` | `#8A1236` |
| Hue | 0° | 343° | 342° |
| Ketepuan | 100% | 74% | 77% |
| Kecerahan | 71% | 39% | 31% |
| Beza kecerahan | — | 32 mata | 40 mata |

Beza kecerahan **32 mata** ialah yang menanggung pemisahan itu — salmon cerah berbanding
kirmizi dalam tidak boleh dikelirukan. Beza hue 17° menyokongnya.

Nilai ini datang daripada rujukan yang dipilih oleh kanak-kanak, dan ia terpisah **lebih
baik** daripada `#C4123C` yang kami pilih sendiri sebelumnya (hue 14°, kecerahan 29 mata).
Calon `#D62828` pernah ditolak walaupun kelihatan sesuai: hue 0°, sama tepat dengan
`--bunga`, iaitu perlanggaran yang kita cuba elak.

**Bulu `#EF6A4B` ialah pengecualian yang perlu dinyatakan.** Pada hue 11° dan kecerahan 62%,
ia hampir dengan `--bunga` — 11° hue dan 9 mata kecerahan. Ia diterima kerana bulu ialah
**strok halus di atas badan kirmizi**, bukan isian; ia tidak pernah muncul sebagai satu
bidang warna yang boleh dikelirukan dengan sempadan butang salah. Kalau warna ini pernah
digunakan sebagai isian objek, ia mesti dipilih semula.

Nota kekurangan penglihatan warna: di bawah protanopia dan deuteranopia kedua-dua merah
beralih ke arah kelabu-kuning dan menjadi **lebih** serupa. Ini diterima kerana tiada satu
pun membawa makna melalui keserupaan itu — warna buah hiasan subjek, dan "salah" disampaikan
oleh ikon, goncangan dan bunyi, bukan warna sahaja (SPEC §9).

---

## 3. Tipografi

| Peranan | Muka taip | Berat | Sebab |
|---|---|---|---|
| Paparan / tajuk | **Baloo 2** | 600, 700 | Bulat, mesra, tebal pada saiz besar; menyokong glif BM & EN |
| UI & badan | **Lexend** | 400, 500, 600 | Direka khusus untuk mengurangkan beban membaca visual |
| Huruf pengajaran (modul Membaca sahaja) | **Andika** | 400, 700 | Bentuk huruf literasi: `a` dan `g` satu tingkat, sepadan dengan tulisan yang diajar di sekolah |

Dua muka taip untuk keseluruhan app. Andika muncul **hanya** apalabila memaparkan huruf
atau perkataan sasaran yang sedang dipelajari kanak-kanak — jangan gunakannya untuk UI.

### Skala jenis

Asas ialah **18px**, bukan 16px. Kanak-kanak umur 7–9 memerlukan teks lebih besar, dan
telefon dipegang lebih dekat pada muka.

| Token | Saiz | Tinggi baris | Guna |
|---|---|---|---|
| `display` | 40px | 1.1 | Nombor besar, tajuk skrin ganjaran |
| `h1` | 30px | 1.2 | Tajuk skrin |
| `h2` | 24px | 1.25 | Tajuk topik |
| `prompt` | 22px | 1.4 | **Teks soalan** — sentiasa saiz ini |
| `body` | 18px | 1.5 | UI umum |
| `label` | 15px | 1.35 | Kapsyen, kaunter |

**Peraturan:**
- Panjang baris maksimum **32 aksara** pada skrin kuiz. Ayat pendek, bukan perenggan.
- **Tiada huruf besar semua.** Kanak-kanak Tahun 1 sedang belajar bentuk huruf kecil.
- Teks soalan **rata kiri**, tidak pernah rata tengah — mata mencari tepi kiri untuk membaca.
- Nombor pada butang matematik: `font-variant-numeric: tabular-nums` supaya digit tidak beralih.

---

## 4. Ruang, jejari, ketinggian

### Skala ruang (asas 4px)
`2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`

**Jurang minimum antara dua sasaran boleh ketuk: 16px.** Ini bukan estetik — ia menghalang
salah tekan pada tangan yang belum stabil.

### Jejari
| Token | Nilai | Guna |
|---|---|---|
| `sm` | 12px | Cip, lencana kecil |
| `md` | 20px | Butang, medan input |
| `lg` | 28px | Kad, panel |
| `xl` | 36px | Modal, lembaran ganjaran |
| `full` | 9999px | Avatar, pil, butang bulat |

Jejari besar secara konsisten. Sudut tajam terasa "borang cukai", bukan "permainan".

### Ketinggian
Dua sahaja. Bukan lima.

```css
--shadow-rest:  0 2px 0 0 rgb(0 0 0 / 0.10);        /* tepi butang pepejal */
--shadow-float: 0 8px 24px -6px rgb(31 58 52 / 0.18); /* kad terapung, item diseret */
```

---

## 5. Butang mesra sentuhan telefon

### 5.1 Saiz sasaran

| Elemen | Ketinggian minimum | Nota |
|---|---|---|
| Butang jawapan utama | **88px** | Elemen paling kerap diketuk dalam app |
| Butang sekunder (ulang, seterusnya) | **72px** | |
| Butang ikon (audio, tutup, kembali) | **64 × 64px** | Termasuk padding, bukan hanya ikon |
| Sasaran mutlak minimum | **64px** | Melebihi WCAG 44px atas sebab motor halus |

Butang jawapan menggunakan **grid 1 lajur** untuk pilihan teks (lebih mudah diimbas), dan
**grid 2 lajur** untuk pilihan imej.

### 5.2 Zon ibu jari

Skrin telefon dibahagi tiga. Segala yang kanak-kanak sentuh berulang kali berada di bawah.

```
┌──────────────────────────┐
│  BACA / TONTON           │  ← kad soalan: flex 1, mengecut dahulu
│  (jangan letak butang)   │
├──────────────────────────┤
│  main audio · kemajuan   │  ← kawalan jarang, boleh dijangkau
├──────────────────────────┤
│                          │
│   BUTANG JAWAPAN         │  ← berlabuh ke bawah; ~55% ialah sasaran
│                          │
└──────────────────────────┘
```

**55% bukan kotak keras.** Ia sasaran ketinggian di mana timbunan jawapan *bermula* pada
skrin bersaiz biasa — bukan ketinggian tetap yang dipaksa pada setiap peranti. Memaksanya
sebagai nilai tetap memecahkan skrin pendek: sama ada butang keluar dari paparan, atau teks
soalan dipotong.

Susun atur sebenar:

- **Timbunan jawapan berlabuh ke dasar.** Ia mengambil ketinggian semula jadinya dan tidak
  pernah mengecut. Butang 88px kekal 88px.
  ```css
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  ```
  `max()` diperlukan sebab `env()` menjadi `0px` pada peranti tanpa takuk atau bar rumah —
  guna `env()` sendirian dan butang melekat pada tepi skrin di kebanyakan telefon Android.
- **Kad soalan `flex: 1`.** Ia mengambil baki ruang dan **mengecut dahulu** apabila ruang
  sempit. Imej dalam kad mengecut bersamanya; teks soalan menatal dalam kad kalau terpaksa.
  Kanak-kanak boleh menatal untuk membaca; mereka tidak boleh menatal untuk mencari butang
  yang tiada.

> **Keperluan `index.html`:** tag viewport **mesti** ada `viewport-fit=cover`:
> ```html
> <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
> ```
> Tanpanya `env(safe-area-inset-bottom)` sentiasa `0px` pada iOS, dan padding dasar senyap
> menjadi 16px pada setiap peranti. Ia tidak akan gagal dengan ralat — ia cuma salah pada
> iPhone berbar rumah.

Butang "Seterusnya" muncul di **kedudukan yang sama tepat** setiap kali. Kanak-kanak
membina memori otot; memindahkannya mematahkan aliran.

### 5.3 Anatomi butang — "blok mainan"

Butang mempunyai tepi bawah pepejal, seperti blok plastik. Menekan menolaknya ke bawah
untuk bertemu tepi itu. Ia jelas boleh ditekan tanpa perlu membaca apa-apa.

```
   ┌────────────────────────────┐  ← muka: --laut cetek atau putih
   │                            │
   │        47                  │  ← teks: --arang, Baloo 2 600, 24px
   │                            │
   ├────────────────────────────┤
   └────────────────────────────┘  ← tepi 4px pepejal: warna modul gelap
        (translateY 0 → 4px semasa ditekan, tepi hilang)
```

```tsx
// components/ui/BlockButton.tsx
<motion.button
  className="
    relative w-full min-h-[88px] px-6
    rounded-[20px] bg-white
    border-4 border-laut
    shadow-[0_4px_0_0_theme(colors.laut.dark)]
    font-display font-semibold text-[24px] text-arang
    active:shadow-none
    focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2
  "
  whileTap={{ y: 4, scale: 0.98 }}
  transition={spring.pop}
/>
```

### 5.4 Keadaan butang

| Keadaan | Perubahan visual | Gerakan |
|---|---|---|
| Rehat | Muka putih, sempadan 4px modul, tepi bawah 4px | — |
| Ditekan | `translateY(4px)`, tepi bawah hilang | `whileTap`, `spring.pop` |
| Betul | Muka → `--daun` cetek, sempadan → `--daun`, ikon ✓ masuk | `correctPulse` 0.32 s |
| Salah | Sempadan → `--bunga`, ikon ✕ masuk | `shake` 0.34 s |
| Dilumpuhkan (selepas salah) | `opacity: 0.35`, sempadan → `--garis` | pudar 0.2 s |
| Fokus (papan kekunci) | Garis luar 4px `--nila`, ofset 2px | — |

**Betul dan salah tidak pernah warna sahaja.** Setiap satu mendapat ikon, gerakan tersendiri,
dan bunyi tersendiri. Seorang kanak-kanak buta warna mesti masih tahu apa yang berlaku.

---

## 6. Komponen utama

### Kad soalan
Putih, jejari `lg` 28px, padding 24px, `--shadow-float`. Lebar penuh tolak margin 16px.
Mengandungi: butang main audio (kiri atas), teks soalan, kandungan pilihan.

### Bar kemajuan
Trek tinggi 12px, jejari penuh, latar `--garis`. Isi menggunakan warna modul.
Dianimasi melalui `scaleX` dengan `transformOrigin: left` — **jangan animasi `width`**.
Kaunter "3 / 10" di sebelahnya dalam `label`.

### Bekas bintang
Tiga bekas bintang kelabu (`--garis`), diisi dengan `--mangga` semasa dianugerahkan.
Muncul pada skrin ringkasan dan pada setiap kad aktiviti di senarai topik.

### Mascot
Satu haiwan — cadangan: **anak kancil** (rusa kecil Malaysia, muncul dalam cerita rakyat
sebagai watak yang pintar, bukan kuat — sesuai untuk aplikasi tentang berfikir).
Muncul: skrin melahu, semasa maklum balas, pada skrin ganjaran. **Tidak pernah semasa
kanak-kanak sedang berfikir tentang soalan.**

### Nod peta pulau
Bulatan 96px pada laluan melengkung. Terkunci = kelabu + ikon mangga. Dibuka = warna modul.
Selesai = warna modul + gelang bintang di sekelilingnya.

---

## 7. Katalog mikro-animasi kuiz

Setiap animasi dalam app perlu mempunyai **satu tugas**. Jika ia tidak menjawab
"apa yang baru berubah?" atau "apa yang boleh saya sentuh?", ia dibuang.

Nilai spring dan tempoh tepat berada dalam SPEC.md §7. Bahagian ini menerangkan **niat**.

### Kumpulan A — Maklum balas sentuhan *(setiap ketukan, ~120 ms)*

| # | Nama | Apa yang berlaku | Tugas |
|---|---|---|---|
| A1 | **Tekan blok** | Butang menolak ke bawah 4px, tepi hilang | Mengesahkan sentuhan didaftarkan sebelum jawapan diproses |
| A2 | **Riak ketuk** | Bulatan lembut berkembang dari titik sentuh, pudar | Menunjukkan **di mana** jari mendarat — berguna apabila kanak-kanak terlepas |
| A3 | **Denyut ikon audio** | Ikon speaker berskala 1 → 1.15 → 1 mengikut rentak audio | Menunjukkan bunyi sedang dimainkan, tanpa teks |

### Kumpulan B — Maklum balas jawapan *(0.3–0.4 s)*

| # | Nama | Apa yang berlaku | Tugas |
|---|---|---|---|
| B1 | **Denyut betul** | Butang berskala 1 → 1.12 → 1, muka bertukar hijau, ✓ pop masuk | Kejayaan yang jelas dan terasa fizikal |
| B2 | **Cincin betul** | Gelang hijau berkembang keluar dari butang, `scale 0.8→1.6`, `opacity 0.6→0` | Menambah "letupan" tanpa zarah — murah pada telefon perlahan |
| B3 | **Goncang salah** | Goncang mendatar ±9px, mereda dalam 6 pusingan | Isyarat "bukan itu" yang mesra — **tidak** merah, tidak menakutkan |
| B4 | **Layu pilihan salah** | Pilihan yang dihapuskan pudar ke 0.35, skala 0.96 | Mengurangkan pilihan, mengurangkan beban kognitif pada percubaan 2 |
| B5 | **Pancingan luncur** | Kad pancingan berkembang di bawah soalan (prop `layout`) | Memperkenalkan bantuan tanpa menyusun semula skrin secara mendadak |
| B6 | **Dedah jawapan** | Selepas 3 percubaan, butang betul berdenyut perlahan 2× dengan cahaya `--mangga` | Menutup gelung — kanak-kanak tidak pernah dibiarkan tanpa jawapan |

### Kumpulan C — Gerak isyarat seret *(modul Sains & Membaca)*

| # | Nama | Apa yang berlaku | Tugas |
|---|---|---|---|
| C1 | **Angkat** | Item berskala 1.08, `--shadow-float` masuk | "Anda sedang memegang benda ini" |
| C2 | **Petak sedia** | Sasaran jatuh yang sah berdenyut lembut apabila item melayang dekat | Mengurangkan percubaan jatuh yang gagal |
| C3 | **Kunci jatuh** | Item terkunci ke dalam petak melalui `layoutId`, petak berdenyut 1 → 1.06 → 1 | Kejayaan tanpa berhenti seketika |
| C4 | **Kembali lembut** | Jatuhan tidak sah kembali ke asal dengan spring `snap` | **Tiada goncang, tiada bunyi ralat.** Penerokaan tidak dihukum |

### Kumpulan D — Kemajuan *(0.3–0.4 s)*

| # | Nama | Apa yang berlaku | Tugas |
|---|---|---|---|
| D1 | **Kemajuan tumbuh** | Bar `scaleX` ke nilai baharu, spring `settle` | "Anda telah bergerak ke hadapan" |
| D2 | **Tukar kad** | Kad keluar naik + pudar; kad seterusnya masuk dari bawah, anak-anak berperingkat 60 ms | Memisahkan soalan dengan jelas supaya kanak-kanak tidak keliru |
| D3 | **Kiraan naik** | Nombor mata beralih ke atas digit demi digit | Menjadikan ganjaran terasa diperoleh, bukan diberikan |

### Kumpulan E — Ganjaran *(0.5–1.2 s, hanya pada skrin ringkasan)*

| # | Nama | Apa yang berlaku | Tugas |
|---|---|---|---|
| E1 | **Bintang jatuh** | Bintang jatuh masuk satu demi satu: `scale 0→1.25→1`, `rotate -25°→0°`, berperingkat 180 ms, satu bunyi setiap satu | Momen puncak sesi |
| E2 | **Confetti** | 24 kepingan SVG (8 pada peranti rendah), hayat 1 s, kemudian dinyahlekap | **Hanya pada ⭐⭐⭐.** Kelangkaan menjadikannya bermakna |
| E3 | **Goncang peti** | Peti bergegar `rotate ±6°` selama 0.6 s, kemudian menunggu ketukan | Mencipta jangkaan; kanak-kanak yang membukanya |
| E4 | **Pulau dibuka** | Nod peta berskala 0.85 → 1, riak berkembang keluar, kamera pan | Satu momen besar setiap topik yang diselesaikan |

### Kumpulan F — Persekitaran *(gelung, halus)*

| # | Nama | Apa yang berlaku | Tugas |
|---|---|---|---|
| F1 | **Kancil bernafas** | `y: [0, -6, 0]` selama 3 s, tak terhingga | Membuat skrin melahu terasa hidup |
| F2 | **Kilauan ombak** | Ombak SVG halus di tepi peta, 6 s | Kedalaman ambien pada peta pulau sahaja |

**F1 dan F2 dimatikan sepenuhnya pada `prefers-reduced-motion`.** Semua yang lain merosot
kepada silang-pudar 150 ms.

### Slot yang ditempah — **tiada elemen berganjak**

Dua elemen datang dan pergi semasa sesi. Ruang untuk kedua-duanya ditempah sejak awal dan
**tidak pernah dilepaskan**, supaya kemunculannya tidak menolak apa-apa.

| Slot | Saiz | Tempat | Semasa rehat |
|---|---|---|---|
| **Kancil** | 88 × 88 | Penjuru kanan atas kad soalan | Kosong, penjuru kekal lapang |
| **Seterusnya** | tinggi 88 | Dasar timbunan jawapan | Kosong, atau butang hantar soalan itu |

Kancil masuk dan keluar dalam slotnya sendiri. Kad soalan tidak berubah tinggi, butang
jawapan tidak bergerak, dan kedudukan Seterusnya tepat sama pada setiap soalan.

**"Ditempah" bermaksud penjuru, bukan baris.** Slot kancil ialah kotak terapung di dalam
blok teks soalan: teks membalut mengelilinginya untuk 88px pertama, kemudian mengalir
semula selebar penuh. Penjuru kekal lapang, tetapi slot itu **tidak** mengambil satu baris
88px sendiri dalam aliran menegak kad.

Sebabnya diukur, bukan estetik. Sebagai baris penuh, kotak kosong itu menelan 104px daripada
kad yang sudah mengecut dahulu (§5.2) — cukup untuk memaksa kad menatal pada 360×780, dan
dalam ujian pengguna kedua-dua kanak-kanak tersekat pada skrol itu. Blok teks soalan membawa
`min-height: 88px` supaya kotak terapung itu kekal terkandung walaupun soalan hanya satu
baris.

**Slot Seterusnya dikongsi.** Bagi soalan yang butang jawapannya bukan dalam timbunan —
`count-tap`, di mana ketukan pada objek ialah jawapan — butang hantar duduk dalam slot yang
sama. Satu tempat, satu saiz, kandungan berubah ikut keadaan. Butang yang anak capai
sentiasa di tempat yang sama.

**Jangan animasikan pertukaran slot itu.** Slot ini satu-satunya laluan anak ke hadapan.
Peralihan keluar-kemudian-masuk menjadikan laluan itu bergantung pada bingkai animasi yang
mungkin tidak pernah tiba — tab latar belakang, peranti terhad — dan anak tinggal tanpa
butang langsung. Tukar serta-merta.

Ini kelihatan membazir ruang pada skrin rehat. Ia memang begitu, dengan sengaja: alternatifnya
ialah susun atur beralih tepat pada saat kanak-kanak menghulurkan jari, dan mereka menekan
apa yang baru sahaja berpindah ke situ. Ruang kosong lebih murah daripada salah tekan.

Ini peraturan susun atur, bukan animasi — jangan animasikan slot itu sendiri berkembang atau
mengecut. Slot statik; hanya isinya yang bergerak.

### Apa yang **tidak** kita animasikan

- Tiada pudar-dan-luncur pada setiap bahagian yang muncul dalam pandangan
- Tiada peralihan hover pada setiap kad (ini app sentuh — hover hampir tidak wujud)
- Tiada skrin pemuatan berputar jika muat < 400 ms; tunjukkan skeleton statik
- Tiada zarah pada jawapan betul biasa — hanya pada ⭐⭐⭐
- Tiada gerakan pada teks soalan itu sendiri selepas ia mendarat. Kanak-kanak sedang membacanya

---

## 8. Ilustrasi & ikon

- **Vektor rata dengan garis luar tebal.** Lebar strok 4px pada 100px, hujung dan sambungan bulat.
  Garis luar sentiasa `--arang` `#1F3A34` — ia chrome, dan kekal token UI (§2.5).
- **Isian ilustrasi boleh melebihi §2. Permukaan UI, chrome, dan warna semantik tidak boleh.**
  Lihat §2.5. Pilih isian untuk pengecaman objek, setepu yang perlu. Tiada kecerunan
  (gradient) — ketepuan datang daripada warna itu sendiri, bukan daripada peralihan.
- **Dua ton setiap objek.** Warna asas, plus satu ton lebih gelap bagi warna itu sebagai
  bahagian berbayang. Kedua-duanya **rata** — dua bentuk berasingan, bukan kecerunan. Ton gelap
  ialah bentuk penuh yang digariskan; ton asas ialah bentuk sama dianjak sedikit ke kiri atas
  tanpa garis luar, jadi yang tinggal di bawah kanan membaca sebagai bayang.
- **Satu sorotan putih kecil setiap objek**, di bahagian bercahaya. Satu sahaja.
- Satu bayang lembut sahaja setiap objek, tidak pernah bertindan.

> Ton gelap itu bukan token §2 — ia versi digelapkan bagi warna asas objek berkenaan, dan
> hidup dalam fail SVG itu sendiri. Ia tidak ditambah kepada palet, sebab ia bukan warna UI
> dan tidak membawa makna. Objek rata satu warna kelihatan **membosankan** kepada
> kanak-kanak, walaupun mereka mengenalinya — itu penemuan ujian pengguna, bukan pilihan
> estetik.
- Objek adalah **konkrit dan tempatan**: rambutan, pisang, bola sepak, teh tarik, kucing,
  bunga raya, payung, basikal. Bukan gambar rajah abstrak.
- Setiap imej memerlukan `alt` dwibahasa (SPEC.md §3.4).
- SVG dioptimumkan melalui SVGO; sasaran < 4 KB setiap ikon.

### Aset ilustrasi disahkan oleh kanak-kanak, bukan oleh pengukuran

Satu-satunya ujian yang penting untuk aset ilustrasi: **tunjukkan kepada kanak-kanak umur
sasaran, tanpa petunjuk, dan tanya "ini apa?"** Kalau dia menamakannya, aset itu lulus. Kalau
tidak, ia gagal — tidak kira betapa tepat bentuknya, betapa kemas palet dipatuhi, atau berapa
banyak nombor yang boleh diukur padanya.

Ini bukan peraturan teori. Lukisan rambutan pertama lulus setiap semakan teknikal — token §2
sahaja, strok 4px, `validate:content` hijau — dan seorang kanak-kanak melihatnya sebagai
**matahari**. Bulatan sepusat dengan pancaran lurus sekata. Yang membetulkannya ialah bentuk:
bulu tak sekata dan melengkung, badan lebih gelap, tangkai dan daun. Ujian kedua dengan
kanak-kanak sebenar: dia jawab "rambutan".

Yang **tidak** membetulkannya, dan yang kita hampir habiskan masa mengejar, ialah warna.
Rambutan sebenar kirmizi dan palet tiada merah sebenar; kami hampir menambah satu.
Tidak perlu — bentuk yang menanggung pengecaman.

Jadi: jangan tambah warna kepada §2 untuk menyelamatkan lukisan sebelum bentuknya diuji pada
seorang kanak-kanak. Dan jangan tandakan aset ilustrasi siap atas kekuatan semakan teknikal
sahaja.

### Kalau aset gagal, periksa STRUKTUR dahulu

**Pengecaman datang daripada struktur — susunan bahagian — bukan daripada warna, ketepuan,
atau perincian.**

Bila kanak-kanak salah kenal sesuatu, atau kenal tetapi tidak suka, periksa susunan bahagian
sebelum melaras apa-apa yang lain. Panjang, lengkungan, warna dan ketepuan ialah pelarasan;
struktur ialah lukisan itu sendiri. Melaras pembolehubah pelarasan pada struktur yang salah
memperbaikinya sedikit setiap kali dan tidak pernah menyelesaikannya.

Rambutan ialah rekod kes. Lima pusingan, dan struktur yang salah bertahan melalui empat:

| Pusingan | Yang diubah | Keputusan |
|---|---|---|
| 1 | Cincin pancaran lurus sekata, bulatan oren | Kanak-kanak: **"matahari"** |
| 2 | Bulu melengkung, panjang tak sekata, badan lebih gelap, tangkai + daun | Dikenali — tetapi **struktur masih cincin tepi** |
| 3 | Dua ton + sorotan putih | Dikenali, kata **"membosankan"** |
| 4 | Ketepuan dinaikkan, kirmizi dipilih dengan teliti | Masih memilih rujukan |
| 5 | **Coretan pendek tak sekata merentas kulit**, bukan cincin di tepi | Padan |

Pusingan 2 hingga 4 melaras panjang, lengkungan, ton, dan warna. Kesemuanya bertambah baik
sedikit. Tiada satu pun menyentuh perkara sebenar: **bulu rambutan bertaburan di seluruh
kulit, bukan tersusun di tepi.** Duri tepi ialah struktur matahari; itu sebabnya pusingan 1
gagal, dan sebabnya pusingan 4 masih terasa salah walaupun setiap pelarasan lain sudah betul.

Ujian pantas sebelum melaras apa-apa: **hapuskan semua warna dan lihat siluet dan susunan
bahagian sahaja.** Kalau ia masih boleh dikelirukan dengan objek lain pada peringkat itu,
warna tidak akan menyelamatkannya.

### Keputusan tertunda: buang garis luar sepenuhnya?

Seorang kanak-kanak menunjuk set ikon buah stok sebagai gaya yang dia suka. Dua perbezaan
sebenar daripada kita: **ketepuan** dan **ketiadaan garis luar**. Ketepuan sudah diambil
(§2.5). Garis luar belum, dengan sengaja — kita mengubah satu pembolehubah supaya ujian
seterusnya bermakna. "Membosankan" memetakan kepada kroma rendah, bukan kepada kehadiran
strok; membuang garis luar menjadikan sesuatu lebih lembut tepinya, bukan lebih menarik.

**Titik keputusan: sebelum kandungan Fasa 3 ditulis, bukan selepas.** Perpustakaan ilustrasi
hari ini **lima fail** — tiga bentuk, dua buah. Selepas Fasa 3 ia berpuluh. Kalau peraturan
garis luar akan berubah, sekarang saat termurah ia akan jadi, dan kosnya berganda dengan
setiap aset yang ditambah sebelum keputusan dibuat.

Dua perkara teknikal yang keputusan itu mesti selesaikan:

**SVG bentuk bergantung pada garis luar untuk wujud.** `square`, `triangle` dan `circle`
diisi `#D6F5F1`, `#FFE9D9` dan `#E4E4FB` — pucat, di atas kad putih. Buang garis luar dan
segi tiga itu hampir hilang. Membuang garis luar bermakna bentuk kena ditepukan juga, bukan
sekadar dinyahgaris.

**Ikon UI ialah ikon strok, jadi keseragaman yang dijanjikan separuh khayalan.** Ikon speaker
dan tanda ✓ ✕ ialah garis, bukan bentuk berisi; "tiada garis luar" tidak terpakai kepada
mereka langsung. Membuang garis luar merentas ilustrasi tetap meninggalkan ikon strok
bersebelahan ilustrasi tanpa garis. Sistem ikon dan sistem ilustrasi memang sudah dua benda
berbeza, dan keputusan ini tidak menyatukannya.

Pengecualian separa — buang garis luar pada objek `count-tap` sahaja — sudah dipertimbangkan
dan **ditolak**. Slot kancil duduk di penjuru kanan atas kad soalan dan objek count-tap
duduk tepat di bawahnya, dalam jarak kira-kira 100px pada skrin yang sama. Pengecualian itu
akan mendarat di satu-satunya tempat di mana percanggahannya dipamerkan.

---

## 9. Bunyi

Lima kesan UI sahaja. Lebih daripada ini menjadi bunyi bising.

| Bunyi | Ciri | Panjang |
|---|---|---|
| `tap` | Ketukan kayu lembut | 60 ms |
| `correct` | Dua nada naik, marimba | 300 ms |
| `wrong` | **Satu** nada lembut menurun. Bukan buzzer, bukan bunyi kecewa | 250 ms |
| `star` | Kilauan cerah, nada naik setiap bintang berturut-turut | 400 ms |
| `unlock` | Kord meriah lebih panjang | 900 ms |

Muzik latar: **dimatikan secara lalai.** Boleh dihidupkan dalam tetapan. Banyak kanak-kanak
menggunakan app ini dalam kereta atau di sebelah adik-beradik yang sedang tidur.

---

## 10. Senarai semak kebolehcapaian

Sebelum mana-mana skrin dianggap siap:

- [ ] Setiap sasaran boleh ketuk ≥ 64px, dengan jurang ≥ 16px antaranya
- [ ] Semua teks lulus kontras 4.5:1; sempadan butang lulus 3:1
- [ ] Betul/salah disampaikan melalui **ikon + gerakan + bunyi**, tidak pernah warna sahaja
- [ ] Setiap imej mempunyai `alt` dalam kedua-dua BM dan EN
- [ ] `prefers-reduced-motion` mematikan setiap gelung tak terhingga dan semua zarah
- [ ] Setiap arahan mempunyai audio; kanak-kanak yang tidak boleh membaca boleh menyiapkan skrin
- [ ] Cincin fokus papan kekunci kelihatan pada semua kawalan (untuk ibu bapa pada desktop)
- [ ] Skrin berfungsi pada 320px lebar (iPhone SE) tanpa penatalan mendatar
- [ ] Kawasan maklum balas menggunakan `aria-live="polite"`
- [ ] Diuji dengan cahaya matahari langsung — kontras masih boleh dibaca

---

## 11. Konfigurasi Tailwind

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        laut:  { DEFAULT: '#0FB5A6', dark: '#087A70', light: '#D6F5F1', shallow: '#E6F7F4' },
        jingga:{ DEFAULT: '#FF8A3D', dark: '#C25A16', light: '#FFE9D9' },
        nila:  { DEFAULT: '#5B5BD6', dark: '#3B3B9E', light: '#E4E4FB' },
        pasir:   '#FFF3DC',
        arang:   { DEFAULT: '#1F3A34', soft: '#5C7A72' },
        garis:   '#D3E8E3',
        daun:    { DEFAULT: '#2FBF71', light: '#DFF6E9' },
        bunga:   { DEFAULT: '#FF6B6B', light: '#FFE3E3' },
        mangga:  '#FFB627',
        pirus:   '#22D3EE',
        api:     '#FF7A00',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans:    ['Lexend', 'system-ui', 'sans-serif'],
        letter:  ['Andika', 'Lexend', 'sans-serif'],   // modul Membaca sahaja
      },
      fontSize: {
        display: ['40px', { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        h1:      ['30px', { lineHeight: '1.2'  }],
        h2:      ['24px', { lineHeight: '1.25' }],
        prompt:  ['22px', { lineHeight: '1.4'  }],
        body:    ['18px', { lineHeight: '1.5'  }],
        label:   ['15px', { lineHeight: '1.35' }],
      },
      borderRadius: { sm: '12px', md: '20px', lg: '28px', xl: '36px' },
      minHeight:    { tap: '64px', btn: '72px', answer: '88px' },
      boxShadow: {
        rest:  '0 2px 0 0 rgb(0 0 0 / 0.10)',
        float: '0 8px 24px -6px rgb(31 58 52 / 0.18)',
      },
    },
  },
};
```

---

## 12. Perkara yang perlu dielakkan

Nota untuk sesiapa yang menambah skrin baharu kemudian:

1. **Jangan tambah warna keempat untuk modul.** Tiga pulau, tiga warna. Selesai.
2. **Jangan gunakan `--mangga` untuk apa-apa selain ganjaran.** Ia adalah warna "anda berjaya".
3. **Jangan animasikan segalanya.** Setiap animasi baharu mesti lulus ujian §7: apakah
   tugasnya?
4. **Jangan letak butang di sepertiga atas skrin.** Ibu jari kanak-kanak tidak sampai.
5. **Jangan sesekali gunakan merah pekat.** `--bunga` sudah cukup lembut untuk sebab tertentu.
6. **Jangan tambah pemasa kiraan detik ke mana-mana skrin kuiz.** Ini keputusan produk, bukan
   keputusan reka bentuk (PRD §1) — dan reka bentuk tidak boleh menyelinapkannya masuk semula.
