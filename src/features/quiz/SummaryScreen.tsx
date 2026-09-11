import { animate, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { BlockButton } from '../../components/ui/BlockButton.tsx';
import { ISLAND_BACKGROUND, SKY_BAND } from '../../components/ui/islandBackground.ts';
import { Kancil, type KancilState } from '../../components/ui/Kancil.tsx';
import { duration, ease } from '../../motion/tokens.ts';
import type { SessionResult } from '../../lib/scoring.ts';
import { useQuizStore } from './store.ts';

const STAR_PATH =
  '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';

/**
 * D3 — gems count up, so the reward feels earned rather than handed over.
 *
 * State starts at the real number, and the count-up runs from zero up to it.
 * `onUpdate` only ever fires on an animation frame, so with no frames nothing
 * touches `shown` and the child reads the true total; with frames it rewinds on
 * the first one and climbs. The number is the reward and the climb is the
 * flourish, in that order. (CLAUDE.md principle 5.)
 */
function CountUp({ to }: { to: number }) {
  const [shown, setShown] = useState(to);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setShown(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 0.6,
      ease: ease.out,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);

  return <span className="tabular-nums">{shown}</span>;
}

/**
 * E1 — stars land one at a time, staggered. The peak moment of the session.
 *
 * The trick is the one the tick and cross icons already use: start at the final
 * state and animate away from it and back, rather than starting at nothing. The
 * first keyframe of each track equals `initial`, so a frozen render is three
 * filled stars at full size and full opacity — the true result — while a
 * rendering one gets the swell and the tip, 180ms apart.
 *
 * Starting at `scale: 0, opacity: 0` meant a child who got no frame reached the
 * end of an activity and was shown three empty outlines: told they had won
 * nothing. (CLAUDE.md principle 5.)
 */
/** Star size on the reward screen. The largest a row of three can be inside the sky band. */
const STAR_PX = 72;
/**
 * The kancil on the reward screen, sized to the grass left above two buttons.
 * Measured at 390×740: 160 overflowed the screen by 8.4px with every other
 * piece at its natural height; 150 fits with the hooves still on the meadow.
 */
const KANCIL_PX = 150;
/**
 * A 4px outline, expressed in the 24-unit viewBox. At 72px one unit is 3px.
 * Half of a stroke sits outside the polygon, which spans 2-22, so the ink
 * reaches 1.33-22.67 and stays inside the box.
 */
const STAR_STROKE = (4 * 24) / STAR_PX;

function Star({ filled, index }: { filled: boolean; index: number }) {
  const reduce = useReducedMotion();
  const animated = filled && !reduce;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      style={{ width: STAR_PX, height: STAR_PX }}
      /*
        The middle star sits 8px higher. It was 16 at 88px; at 72px the band has
        8px of room above the side stars and no more, and the stars have to stay
        inside the band as firmly as the text does. (DESIGN 2.4, the sky band.)

        A bottom margin, not a negative top one: the row is `items-end`, and in
        a bottom-aligned row a top margin moves nothing — measured, all three
        stars sat at y 158 with `-mt-2`.
      */
      className={index === 1 ? 'mb-2' : ''}
      initial={animated ? { opacity: 1, scale: 1, rotate: 0 } : false}
      animate={
        animated
          ? { opacity: 1, scale: [1, 1.25, 1], rotate: [0, -25, 0] }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: duration.cheer, ease: ease.back, delay: index * 0.18 }}
      aria-hidden
    >
      {/*
        Outlined in --arang, filled or empty.

        On this sky the --mangga fill alone measures about 1:1 — a gold star on a
        pale sky is not there. The outline is what makes the shape, and it is
        --arang because every illustration is already outlined in --arang
        (DESIGN 8); a --mangga-dark outline was measured and rejected at a
        minimum of 2.96 against the clear sky, under the 3:1 floor. The fill
        stays --mangga: that is the reward colour and the part a child reads.

        An empty star keeps the same outline and loses the fill, so filled and
        empty still differ by what is inside them. The --garis grey outline it
        used to have was drawn for the pale app ground and disappears on a sky.
      */}
      <polygon
        points={STAR_PATH}
        className={filled ? 'fill-mangga stroke-arang' : 'fill-none stroke-arang'}
        strokeWidth={STAR_STROKE}
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function SummaryScreen({ result }: { result: SessionResult }) {
  const restart = useQuizStore((s) => s.restart);
  const session = useQuizStore((s) => s.session);
  const total = session.questions.length;
  const [kancil, setKancil] = useState<KancilState>('happy');

  return (
    <main
      className="relative mx-auto flex h-[100dvh] max-w-[430px] flex-col items-center px-4"
      style={ISLAND_BACKGROUND}
    >
      {/*
        The stars, and nothing else, in the sky band.

        They are why this screen exists (DESIGN 7 E1), and user testing says
        children read them rather than the sentence under them: a nine-year-old
        said "alaaaa" at two stars. So they get the band to themselves, as large
        as three fit — 72px, bottom-aligned so the side stars end at y 230 and
        the raised middle one starts at y 150.
      */}
      <div
        className="flex w-full shrink-0 items-end justify-center gap-4"
        style={{ paddingTop: SKY_BAND.top, height: SKY_BAND.bottom }}
        role="img"
        aria-label={`${result.stars} daripada 3 bintang`}
      >
        {[0, 1, 2].map((i) => (
          <Star key={i} index={i} filled={i < result.stars} />
        ))}
      </div>

      {/*
        Every word on this screen, on one white card.

        Text anywhere else would sit on the forest, where it drops to about 1:1.
        On a card it has a surface of its own — and it reads better for it: a
        seven-year-old never connected "8 daripada 10 betul pada cubaan pertama"
        to the stars. Beside the gems it becomes one block of results instead of
        a sentence floating on its own.

        It sits under the stars and not directly on top of the buttons, and
        that order is forced by the picture, not chosen. The open meadow starts
        at y 450 on 390×740 and the two buttons begin at 564, which leaves
        114px of grass. A card between the kancil and the buttons would fill
        that grass on its own and push the kancil up into the trees — measured,
        hooves at y 415 in the bushes, and the second button pushed 65px off the
        bottom of the screen. With the card up here, the grass is left for the
        kancil to stand on.
      */}
      {/*
        A 2px --arang border, because a white card does not separate from this
        picture on its own. Measured in a 6px ring of background around it at
        390×740: white against the sky and the treeline has a median of 1.98,
        with 74% of the ring under 3:1 — the card dissolved. With --arang the
        outer edge has a median of 6.21 and 7.5% under 3:1; where it is low, dark
        trees meet a dark border, and the white face against --arang at 12.26 is
        the edge that shows. --laut-dark (56% under), --arang-soft (83%) and
        --garis (91%) were measured and rejected.

        2px, not the 4px the buttons carry: this card is not something to press,
        and it should not look like one.
      */}
      <section
        data-slot="kad-keputusan"
        className="mt-2 flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg border-2 border-arang bg-white px-4 py-2 shadow-float"
      >
        <h1 className="m-0 font-display text-h1 font-bold text-arang">Syabas!</h1>
        <div className="font-display text-h2 font-semibold text-arang">
          {result.stars} daripada 3 bintang
        </div>
        <div className="text-center font-sans text-label text-arang-soft">
          {result.firstTryCount} daripada {total} betul pada cubaan pertama
        </div>
        <div className="mt-1 flex items-center gap-2.5 rounded-full border-2 border-garis bg-white px-[18px] py-1 font-sans font-semibold text-arang">
          <i aria-hidden className="h-3.5 w-3.5 rotate-45 rounded-[4px] bg-pirus" />+
          <CountUp to={result.gems} /> permata
        </div>
      </section>

      <div className="min-h-0 flex-1" />

      {/*
        Standing on the meadow, directly above the buttons. It lands on `happy`
        — one jump, ears up, eyes squeezed — and settles into idle breathing.
        DESIGN 6 puts the mascot on the reward screen; this is the screen it was
        drawn for.

        Smaller than on the start screen, because it shares the grass with two
        buttons rather than one. Sized to the space that is actually there.
      */}
      <div data-slot="kancil-rumput" className="shrink-0">
        <Kancil state={kancil} size={KANCIL_PX} onDone={() => setKancil('idle')} />
      </div>

      <div
        className="flex w-full shrink-0 flex-col gap-4 pt-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <BlockButton onPress={restart} minHeight={72} ariaLabel="Main aktiviti ini lagi">
          Main lagi
        </BlockButton>
        {/*
          The same slot as the quiz screen's Next, so the button does not move —
          which means 72, not 88. This used to be `min-h-answer`, the 88px floor
          for buttons a child chooses *between*; DESIGN 7 puts Seterusnya at 72,
          and the quiz screen's slot has been 72 since that change. The comment
          said "same slot" while the number said otherwise.
        */}
        <div className="min-h-btn">
          <BlockButton onPress={restart} minHeight={72} ariaLabel="Seterusnya">
            Seterusnya
          </BlockButton>
        </div>
      </div>
    </main>
  );
}
