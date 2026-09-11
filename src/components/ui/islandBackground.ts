import type { CSSProperties } from 'react';

/**
 * The island background shared by the start screen and the reward screen.
 *
 * Every value here is a measured constraint rather than a style choice.
 *
 * **Anchored to the bottom, not centred.** The grass is where the kancil stands,
 * and it has to stay under its feet at every screen size. On a portrait phone
 * `cover` scales the image by height, so the crop falls on the sides; on a
 * shorter or wider screen it falls on the top instead, and anchoring the bottom
 * is what keeps the grass where the kancil is.
 *
 * **Text lives only in the sky band.** At 390×740 the dark text colour clears
 * its contrast floor between y 150 and y 230 and nowhere else near the top:
 * above y 150 the canopy comes in and the ratio falls to about 1:1, so text
 * there would vanish. Both screens put every piece of free-standing text inside
 * this band; anything outside it sits on a surface of its own.
 *
 * Painted before it loads, too: until the image arrives the screen shows the
 * plain app ground, where `--arang` is 11:1, so nothing on these screens depends
 * on the picture having loaded.
 */
export const ISLAND_BACKGROUND: CSSProperties = {
  backgroundImage: 'url(/img/latar/rimba.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'bottom center',
  backgroundRepeat: 'no-repeat',
};

/** The measured sky band, in CSS px from the top of the screen. */
export const SKY_BAND = { top: 150, bottom: 230 } as const;

/**
 * How far the kancil's box sits above the bottom of the screen.
 *
 * Measured against the brief's y 420 at 390×740: a 210px kancil whose top is at
 * 420 ends at 630, which is 110 from the bottom. It is held from the bottom, the
 * same way the background is, so that on a taller screen it moves with the grass
 * rather than staying put while the grass slides away beneath it.
 */
export const KANCIL_FROM_BOTTOM = 110;
