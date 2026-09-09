/**
 * Values copied verbatim from docs/DESIGN.md section 11. Do not reinterpret them
 * here — if a token is wrong, it is wrong in DESIGN.md first.
 *
 * `content` is the only addition: Tailwind needs it to know what to scan, and
 * DESIGN.md does not cover build plumbing.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        laut: { DEFAULT: '#0FB5A6', dark: '#087A70', light: '#D6F5F1', shallow: '#E6F7F4' },
        jingga: { DEFAULT: '#FF8A3D', dark: '#C25A16', light: '#FFE9D9' },
        nila: { DEFAULT: '#5B5BD6', dark: '#3B3B9E', light: '#E4E4FB' },
        pasir: '#FFF3DC',
        arang: { DEFAULT: '#1F3A34', soft: '#5C7A72' },
        garis: '#D3E8E3',
        daun: { DEFAULT: '#2FBF71', dark: '#157A43', light: '#DFF6E9' },
        bunga: { DEFAULT: '#FF6B6B', dark: '#A8434A', light: '#FFE3E3' },
        mangga: { DEFAULT: '#FFB627', dark: '#8F6100' },
        pirus: '#22D3EE',
        api: '#FF7A00',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['Lexend', 'system-ui', 'sans-serif'],
        letter: ['Andika', 'Lexend', 'sans-serif'], // modul Membaca sahaja
      },
      fontSize: {
        display: ['40px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h1: ['30px', { lineHeight: '1.2' }],
        h2: ['24px', { lineHeight: '1.25' }],
        prompt: ['22px', { lineHeight: '1.4' }],
        body: ['18px', { lineHeight: '1.5' }],
        label: ['15px', { lineHeight: '1.35' }],
      },
      borderRadius: { sm: '12px', md: '20px', lg: '28px', xl: '36px' },
      minHeight: { tap: '64px', btn: '72px', answer: '88px' },
      boxShadow: {
        rest: '0 2px 0 0 rgb(0 0 0 / 0.10)',
        float: '0 8px 24px -6px rgb(31 58 52 / 0.18)',
      },
    },
  },
};
