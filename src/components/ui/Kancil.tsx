/**
 * Kancil — maskot SVG berlapis, digerakkan dengan Framer Motion.
 *
 * Rive dibuang: eksport .riv berbayar, dan Framer Motion sudah memandu setiap
 * animasi lain dalam app. Kontrak keadaan SPEC §11 dikekalkan sebagaimana adanya,
 * cuma dipandu oleh prop `state` dan bukan oleh input state machine.
 *
 * Sumber gerakan: design/brief-01d/handoff/spesifikasi-kancil.md
 *   (bingkai @60 fps → saat; putaran lapisan → rotate + transformOrigin).
 * Token: src/motion/tokens.ts (SPEC §7.1) — ease.out, ease.back, duration.ambient, spring.settle.
 * Geometri: design/brief-01d/handoff/kancil-layered.svg (viewBox 0 0 1254 1254).
 *
 * Pangsi ditulis sebagai `transformOrigin` CSS biasa dalam unit viewBox, bukan
 * melalui originX/originY Framer. Diukur: dengan originX/originY, Framer tidak
 * menulis apa-apa atribut style sehingga ia benar-benar merender satu transform
 * — `style` kekal null dan `transform-origin` terkira kekal `0px 0px`. Pangsi
 * yang hanya wujud selepas animasi bermula ialah perangkap bingkai yang sama
 * seperti kandungan yang hanya kelihatan selepas animasi bermula (CLAUDE.md
 * prinsip 5); putaran kepala 12° akan berpangsi pada penjuru viewBox kalau
 * bingkai pertama tidak sempat tiba. Sebagai CSS statik ia ada pada bingkai 0.
 *
 * `<g>` SVG menggunakan transform-box: view-box secara lalai (disahkan dalam
 * pelayar), jadi nilai itu ialah koordinat viewBox terus. Setiap pangsi dikira
 * daripada getBBox() geometri 1254 ini — bukan disalin daripada mana-mana fail
 * spesifikasi, yang nilainya anggaran.
 *
 * Kontrak keadaan (SPEC §11, diterjemah):
 *   isThinking → state="thinking" | "idle"
 *   isCorrect  → state="happy"    (0.8 s, potong terus, badan lompat sekali)
 *   isWrong    → state="sympathy" (1.6 s, kepala senget +12°)
 *   Selepas reaksi tamat, onDone dipanggil — ibu bapa set state kembali ke idle/thinking
 *   (exit time 100 %). Tiada baris gilir: trigger baharu = tukar state, tidak ditimbun.
 *   useReducedMotion → semua gelung mati; kancil dipapar pada bingkai 0 MELAHU.
 *
 * Bingkai 0 (CLAUDE.md prinsip 5): `initial={false}` dan setiap bingkai kunci
 * pertama ialah poz neutral, jadi kancil dipapar penuh walaupun tiada satu pun
 * bingkai animasi tiba. Tiada keadaan bermula pada opacity 0 atau scale 0.
 */
import { motion, useReducedMotion, type Variant, type Variants } from 'framer-motion';
import { useEffect, useId } from 'react';

import { duration, ease, spring } from '../../motion/tokens.ts';

export type KancilState = 'idle' | 'thinking' | 'happy' | 'sympathy';

export interface KancilProps {
  state: KancilState;
  /** 88 dalam slot kad soalan (DESIGN §7); lebih besar pada skrin ringkasan. */
  size?: number;
  /**
   * Stroke pada viewBox 1254. 20 ≈ 1.6 % lebar ≈ 1.4 px pada 88 px.
   * Lapan — nilai dalam fail SVG sumber — ialah 0.64 %, dan kaki hilang jadi benang.
   */
  strokeWidth?: number;
  /** Dipanggil apabila happy / sympathy selesai. */
  onDone?: (finished: KancilState) => void;
  className?: string;
}

/* ---------- masa ---------- */
const s = (frames: number) => frames / 60;
const GEMBIRA = s(48); // 0.8 s
const SIMPATI = s(96); // 1.6 s
const at = (frame: number, total: number) => frame / total; // bingkai → pecahan `times`

const LOOP = { duration: duration.ambient, repeat: Infinity, ease: 'easeInOut' } as const;
const POSE = { duration: 0.3, ease: ease.out } as const; // MELAHU ⇄ FIKIR, 18 bingkai
const REST = { y: 0, scaleX: 1, scaleY: 1, transition: spring.settle };

/**
 * Anjakan dalam spesifikasi ditulis untuk artboard 512. viewBox ini 1254, jadi
 * setiap anjakan px didarab 1254/512 = 2.449 supaya gerakan kekal pada saiz
 * berkadar yang sama. Putaran dan skala tidak berunit — ia tidak disentuh.
 */
const px = (units512: number) => Math.round(units512 * (1254 / 512));

/* ---------- lapisan ----------
 * Kunci yang TIDAK ada pada sesuatu lapisan bermakna lapisan itu tidak disentuh
 * oleh keadaan tersebut — gelung Mood (nafas, bob, kedip) terus bermain semasa reaksi,
 * seperti campuran aditif dalam spesifikasi.
 */

/** Kumpulan induk: lompat GEMBIRA. Pangsi bawah-tengah paras kaki (624, 1103). */
const tubuh: Variants = {
  idle: REST,
  thinking: REST,
  sympathy: REST,
  happy: {
    y: [0, px(4), px(-30), 0, px(-5), 0],
    scaleX: [1, 1.04, 0.98, 1.03, 1, 1],
    scaleY: [1, 0.96, 1.04, 0.97, 1, 1],
    transition: {
      duration: GEMBIRA,
      times: [0, at(9, 48), at(22, 48), at(35, 48), at(41, 48), 1],
      ease: ease.back,
    },
  },
};

/** Bayang kekal di tanah; mengecil 15 % pada puncak lompatan. */
const bayang: Variants = {
  idle: { scaleX: 1 },
  thinking: { scaleX: 1 },
  sympathy: { scaleX: 1 },
  happy: {
    scaleX: [1, 1, 0.85, 1, 1, 1],
    transition: { duration: GEMBIRA, times: [0, at(9, 48), at(22, 48), at(35, 48), at(41, 48), 1], ease: ease.back },
  },
};

/** Nafas. Pangsi bawah-tengah badan (529, 784). Separuh amplitud semasa FIKIR. */
const badan: Variants = {
  idle: { scaleX: [1, 1.015, 1], scaleY: [1, 1.03, 1], transition: LOOP },
  thinking: { scaleX: [1, 1.006, 1], scaleY: [1, 1.012, 1], transition: LOOP },
};

/** Pose kepala pada pangkal leher (802, 736): FIKIR −8°, SIMPATI +12°. */
const kepalaPose: Variants = {
  idle: { rotate: 0, y: 0, transition: POSE },
  thinking: { rotate: -8, y: px(-2), transition: POSE },
  sympathy: {
    rotate: [null, 12, 12, 0],
    transition: {
      duration: SIMPATI,
      times: [0, at(15, 96), at(77, 96), 1],
      ease: [ease.out, 'linear', 'easeInOut'],
    },
  },
};

/** Bob kepala MELAHU, lewat 6 bingkai daripada nafas. */
const kepalaBob: Variants = {
  idle: { y: [0, px(-2), 0], transition: { ...LOOP, delay: s(6) } },
  thinking: { y: 0, transition: POSE },
};

/**
 * SIMPATI: kedua-dua telinga bergerak sama, mengikut kepala. Diasingkan sebagai
 * const kerana `noUncheckedIndexedAccess` menjadikan `telingaKiri.sympathy`
 * bertaip `Variant | undefined` — dikongsi begini, bukan dibaca semula.
 */
const telingaSimpati: Variant = {
  rotate: [null, 8, 8, 0],
  transition: { duration: SIMPATI, times: [0, at(15, 96), at(77, 96), 1], ease: [ease.out, 'linear', 'easeInOut'] },
};

const telingaKiri: Variants = {
  idle: { rotate: [0, -3, 0], transition: LOOP },
  thinking: { rotate: 0, transition: POSE },
  happy: {
    rotate: [0, -22, -22, 0],
    transition: { duration: GEMBIRA, times: [0, at(10, 48), at(31, 48), 1], ease: ease.out },
  },
  sympathy: telingaSimpati,
};

const telingaKanan: Variants = {
  idle: { rotate: [-3, 0, -3], transition: LOOP }, // beza fasa 90 bingkai
  thinking: { rotate: 0, transition: POSE },
  happy: {
    rotate: [0, 18, 18, 0],
    transition: { duration: GEMBIRA, times: [0, at(10, 48), at(31, 48), 1], ease: ease.out },
  },
  sympathy: telingaSimpati,
};

/** Picing GEMBIRA — skala Y seluruh mata, pangsi tengah mata (986, 368). */
const mata: Variants = {
  idle: { scaleY: 1 },
  thinking: { scaleY: 1 },
  sympathy: { scaleY: 1 },
  happy: {
    scaleY: [1, 1, 0.35, 0.35, 1],
    transition: { duration: GEMBIRA, times: [0, at(10, 48), at(17, 48), at(34, 48), 1], ease: 'easeInOut' },
  },
};

/**
 * Kedip. Geometri ini tiada lapisan kelopak berasingan, jadi kedipan dilaksana
 * pada kumpulan mata itu sendiri: mata rehat pada scaleY 1 dan menghimpit ke
 * 0.06 selama 4 bingkai, pangsi tepi ATAS mata (986, 332) seperti pangsi kelopak
 * dalam spesifikasi — tepi yang bersendi pada kening kekal, bahagian bawah naik.
 *
 * Ia hidup dalam kumpulan sendiri di dalam `mata`, sebab `mata` sudah memandu
 * scaleY untuk picing GEMBIRA. Dua kumpulan bersarang mendarab skala masing-masing,
 * jadi kedip dan picing tidak berebut sifat yang sama.
 *
 * Bingkai kunci pertama ialah 1, bukan 0: mata terbuka pada bingkai 0.
 */
const kedip = (period: number) => ({
  scaleY: [1, 1, 0.06, 1],
  transition: {
    duration: period,
    times: [0, (period - s(9)) / period, (period - s(5)) / period, 1], // turun 4 bingkai, naik 5
    repeat: Infinity,
    ease: 'linear' as const,
  },
});
const kelopak: Variants = {
  idle: kedip(s(252)), // 4.2 s — tidak berkongsi faktor dengan 3.0 s
  thinking: kedip(s(360)), // 6 s
  sympathy: {
    scaleY: [1, 1, 0.06, 1, 1],
    transition: { duration: SIMPATI, times: [0, at(27, 96), at(31, 96), at(35, 96), 1], ease: 'linear' },
  },
};

/* ---------- warna (DESIGN §2 + neutral bulu) ---------- */
const C = {
  bulu: '#B4794E',
  /** Anggota jauh, DESIGN §2.6. Lebih gelap supaya kedalaman terbaca. */
  buluJauh: '#9E6842',
  perut: '#FFF3DC',
  telingaDalam: '#E8B896',
  kuku: '#6B4A32',
  bayang: '#D3E8E3',
  arang: '#1F3A34',
  putih: '#FFFFFF',
} as const;

/** Garis halus — mulut. 55 % daripada strok utama, nisbah yang sama seperti fail 512. */
const HALUS = (w: number) => Math.round(w * 0.55);

export function Kancil({ state, size = 88, strokeWidth = 20, onDone, className }: KancilProps) {
  const reduce = useReducedMotion();
  // Varian 'still' tidak wujud pada mana-mana lapisan → tiada apa yang bergerak; bingkai 0 MELAHU.
  const animate = reduce ? 'still' : state;

  // Dua kancil boleh dirender serentak (kad soalan + skrin ringkasan). Nama BM
  // kekal pada data-part, yang tidak perlu unik; id diberi awalan setiap instance
  // supaya tiada dua elemen dalam dokumen berkongsi id.
  const uid = useId().replace(/:/g, '');
  const id = (part: string) => `${uid}-${part}`;

  useEffect(() => {
    if (state !== 'happy' && state !== 'sympathy') return;
    const ms = reduce ? 150 : (state === 'happy' ? GEMBIRA : SIMPATI) * 1000;
    const t = window.setTimeout(() => onDone?.(state), ms);
    return () => window.clearTimeout(t);
  }, [state, reduce, onDone]);

  return (
    <motion.svg
      viewBox="0 0 1254 1254"
      width={size}
      height={size}
      className={className}
      style={{ overflow: 'visible', display: 'block' }}
      role="img"
      aria-label="Kancil"
      initial={false}
      animate={animate}
    >
      <g
        fill={C.bulu}
        stroke={C.arang}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.g
          id={id('bayang-tanah')}
          data-part="bayang-tanah"
          variants={bayang}
          style={{ transformOrigin: '624px 1154px' }}
        >
          <ellipse cx="624" cy="1154" rx="458" ry="31" fill={C.bayang} stroke="none" />
        </motion.g>

        <motion.g
          id={id('kancil-tubuh')}
          data-part="kancil-tubuh"
          variants={tubuh}
          style={{ transformOrigin: '624px 1103px' }}
        >
          {/* Anggota jauh dahulu — z-order fail sumber, bawah → atas. */}
          <g id={id('kaki-belakang-kanan')} data-part="kaki-belakang-kanan" fill={C.buluJauh}>
            <path d="M365 695 Q394 700 442 748 Q420 812 376 864 Q359 887 371 923 L407 1047 Q419 1066 425 1088 Q399 1098 377 1088 L336 954 Q315 906 305 883 Q302 863 320 839 Q349 797 365 695 Z" />
            <path d="M378 1059 Q391 1049 406 1046 Q423 1064 433 1090 Q416 1097 391 1090 Q382 1085 378 1059 Z" fill={C.kuku} />
          </g>
          <g id={id('kaki-depan-kanan')} data-part="kaki-depan-kanan" fill={C.buluJauh}>
            <path d="M751 693 L850 711 Q827 778 826 842 L829 923 Q829 1001 845 1049 L864 1087 Q844 1094 824 1088 Q807 1062 803 1026 L776 866 Q762 810 743 773 Z" />
            <path d="M815 1061 Q830 1054 845 1050 Q862 1064 875 1091 Q851 1096 833 1090 Q822 1085 815 1061 Z" fill={C.kuku} />
          </g>

          <motion.g
            id={id('badan')}
            data-part="badan"
            variants={badan}
            style={{ transformOrigin: '529px 784px' }}
          >
            <g id={id('ekor')} data-part="ekor">
              <path d="M191 580 C150 590 141 621 130 680 Q126 694 140 686 Q172 676 195 651 Q208 618 191 580 Z" />
              <path d="M135 665 Q169 651 191 617 L194 650 Q174 675 139 684 Z" fill={C.perut} stroke="none" />
            </g>
            <path d="M183 581 C221 491 310 419 423 414 C523 403 630 442 724 458 Q765 465 798 421 Q846 412 877 449 L853 681 Q823 745 750 774 Q601 801 423 752 Q331 751 252 734 Q173 689 183 581 Z" />
            <path d="M429 711 Q535 694 652 719 Q711 735 750 747 L750 774 Q601 801 423 752 Z" fill={C.perut} stroke="none" />
            <path d="M424 752 Q601 801 750 774" fill="none" />
          </motion.g>

          <motion.g
            id={id('kepala-rig')}
            data-part="kepala-rig"
            variants={kepalaPose}
            style={{ transformOrigin: '802px 736px' }}
          >
            <motion.g variants={kepalaBob}>
              <g id={id('leher')} data-part="leher">
                <path d="M793 436 Q819 399 825 326 L891 298 L1003 393 Q1019 437 992 471 L939 484 Q920 505 898 552 L853 698 Q811 752 752 774 Q794 707 808 638 L856 520 L852 451 Z" stroke="none" />
                <path d="M897 430 Q952 452 1011 442 Q970 476 939 484 Q920 505 898 552 L853 698 Q811 752 752 774 Q773 731 808 692 Q826 656 849 607 L868 508 Z" fill={C.perut} stroke="none" />
                <path d="M1011 442 Q970 476 939 484 Q920 505 898 552 L853 698 Q811 752 752 774" fill="none" />
              </g>

              <motion.g
                id={id('telinga-kanan')}
                data-part="telinga-kanan"
                variants={telingaKanan}
                style={{ transformOrigin: '940px 272px' }}
              >
                <path d="M891 257 Q900 190 944 132 Q958 112 970 130 Q1000 177 987 252 Q981 271 959 282 Q923 282 891 257 Z" />
              </motion.g>

              <g id={id('kepala')} data-part="kepala">
                <path d="M824 324 Q851 297 890 266 Q916 246 959 254 Q1019 257 1052 309 Q1099 380 1159 414 Q1170 423 1162 442 Q1150 461 1122 470 Q1076 476 1026 476 Q974 481 939 484 L897 451 L793 436 Q818 396 824 324 Z" stroke="none" />
                <path d="M897 430 Q949 452 1005 443 Q1082 429 1155 448 Q1144 463 1122 470 Q1076 476 1026 476 Q974 481 939 484 L897 467 Z" fill={C.perut} stroke="none" />
                <path d="M959 254 Q1019 257 1052 309 Q1099 380 1159 414 Q1170 423 1162 442 Q1150 461 1122 470 Q1076 476 1026 476 Q974 481 939 484" fill="none" />
                <path d="M824 324 Q818 396 793 436" fill="none" />
                <path d="M791 438 Q786 459 797 478" fill="none" />
              </g>

              <motion.g
                id={id('telinga-kiri')}
                data-part="telinga-kiri"
                variants={telingaKiri}
                style={{ transformOrigin: '888px 296px' }}
              >
                <path d="M877 321 C824 329 783 310 762 275 C738 236 748 180 763 152 Q773 137 794 152 C848 172 882 217 900 259 Q908 278 899 294 L887 315 Q882 321 877 321 Z" />
                <path d="M772 153 Q750 181 752 217 Q753 277 797 300 Q834 320 872 321 Q858 303 861 276 Q862 224 830 188 Q806 162 772 153 Z" fill={C.telingaDalam} stroke="none" />
                <path d="M772 153 Q822 163 850 204 Q866 227 865 271 Q864 298 880 309" fill="none" />
              </motion.g>

              <motion.g
                id={id('mata-kiri')}
                data-part="mata-kiri"
                variants={mata}
                style={{ transformOrigin: '986px 368px' }}
              >
                <motion.g
                  id={id('mata-kedip')}
                  data-part="mata-kedip"
                  variants={kelopak}
                  style={{ transformOrigin: '986px 332px' }}
                >
                  <ellipse cx="986" cy="368" rx="31" ry="36" fill={C.arang} stroke="none" />
                  <path d="M961 350 Q947 378 970 397 Q954 378 963 359 Z" fill={C.putih} stroke="none" />
                  <circle cx="978" cy="353" r="9.5" fill={C.putih} stroke="none" />
                </motion.g>
              </motion.g>

              <g id={id('kening')} data-part="kening">
                <path d="M953 318 Q980 291 1007 314 Q981 299 953 318 Z" fill={C.arang} stroke="none" />
              </g>
              <g id={id('hidung')} data-part="hidung">
                <path d="M1141 417 Q1155 413 1163 421 Q1169 431 1158 443 L1149 452 Q1136 440 1134 425 Q1133 419 1141 417 Z" fill={C.arang} stroke="none" />
              </g>
              <g id={id('mulut')} data-part="mulut">
                <path d="M1091 449 Q1111 463 1135 457" fill="none" strokeWidth={HALUS(strokeWidth)} />
              </g>
            </motion.g>
          </motion.g>

          {/* Anggota dekat terakhir: kaki depan menutup bahagian bawah leher. */}
          <g id={id('kaki-belakang-kiri')} data-part="kaki-belakang-kiri">
            <path d="M184 581 Q164 660 211 741 Q237 776 239 797 Q232 820 202 842 Q178 855 181 877 L198 1034 Q197 1054 204 1066 Q225 1074 242 1065 L233 949 Q227 906 251 881 Q316 846 365 805 Q429 755 440 656 L404 615 Z" stroke="none" />
            <path d="M184 581 Q164 660 211 741 Q237 776 239 797 Q232 820 202 842 Q178 855 181 877 L198 1034 Q197 1054 204 1066 Q225 1074 242 1065 L233 949 Q227 906 251 881 Q316 846 365 805 Q429 755 440 656" fill="none" />
            <path d="M208 1071 Q220 1062 236 1060 Q253 1076 262 1100 Q241 1104 217 1096 Q210 1092 208 1071 Z" fill={C.kuku} />
          </g>
          <g id={id('kaki-depan-kiri')} data-part="kaki-depan-kiri">
            <path d="M668 672 Q646 709 653 750 Q671 790 683 842 L680 1038 Q678 1058 687 1067 Q704 1075 720 1067 L716 957 Q716 925 726 894 Q734 873 731 840 Q732 796 760 761 L780 719 L767 672 Z" stroke="none" />
            <path d="M668 672 Q646 709 653 750 Q671 790 683 842 L680 1038 Q678 1058 687 1067 Q704 1075 720 1067 L716 957 Q716 925 726 894 Q734 873 731 840 Q732 796 760 761" fill="none" />
            <path d="M687 1075 Q700 1068 716 1066 Q731 1080 744 1102 Q719 1106 699 1098 Q690 1094 687 1075 Z" fill={C.kuku} />
          </g>
        </motion.g>
      </g>
    </motion.svg>
  );
}
