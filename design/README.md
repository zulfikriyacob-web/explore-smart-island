# Reka bentuk — bahan rujukan

Fail dalam folder ini ialah handoff daripada sesi Claude Design untuk Brief 01-D.
Ia **RUJUKAN**, bukan kontrak.

Bila fail di sini bercanggah dengan `docs/SPEC.md` atau `docs/DESIGN.md`, dokumen
dalam `docs/` yang menang.

## Percanggahan yang diketahui

- `design/brief-01d/handoff/spesifikasi-kancil.md` masih dokumenkan input Rive
  `mood`. `mood` dibuang dalam PR #2. Kontrak sebenar ialah empat input, lihat
  `docs/SPEC.md` §11. Abaikan baris mood dalam fail itu.
- Rive sendiri kemudiannya ditinggalkan. Maskot dilaksana sebagai SVG + Framer
  Motion dalam `src/components/ui/Kancil.tsx`. `docs/SPEC.md` §11 masih
  menerangkan kontrak Rive dan belum dikemas kini.

Fail handoff sengaja tidak disunting supaya ia kekal sebagai rekod jujur apa yang
designer hantar.

**Satu pengecualian:** `spesifikasi-kancil.md` §5 kini disunting. Jadual pangsinya
ialah nilai yang kod baca, bukan cadangan, dan nilai lama merujuk artboard 512 yang
tidak pernah dilaksana — membiarkannya bermakna satu-satunya jadual pangsi bertulis
dalam repo adalah salah. Bahagian lain fail itu tidak disentuh.
