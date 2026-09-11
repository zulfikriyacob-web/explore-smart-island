import { useEffect } from 'react';

import { promptPlayer } from '../../lib/player.ts';
import { BlockButton } from '../../components/ui/BlockButton.tsx';
import {
  ISLAND_BACKGROUND,
  KANCIL_FROM_BOTTOM,
  SKY_BAND,
} from '../../components/ui/islandBackground.ts';
import { Kancil } from '../../components/ui/Kancil.tsx';
import { packTitle } from './activity.ts';
import { useQuizStore } from './store.ts';

/**
 * The start screen (Brief 03, PRD 16 question 8).
 *
 * It exists for one reason that is not decoration: iOS will not let audio begin
 * without a user gesture (SPEC 8), and Phase 1 exit criterion 7 needs the prompt
 * to read itself — a child who cannot yet read has no way to know a speaker
 * button is there. This screen is that gesture.
 *
 * There is no speaker icon and no audio setting here, deliberately. A restored
 * session never sees this screen at all, so any promise about sound made on it
 * would be untrue for half the ways in; and the first question after a restore
 * is genuinely not read aloud, because that tap is usually an answer.
 *
 * Frame 0: everything here is mounted and painted with no animation at all. The
 * kancil renders `initial={false}` at its idle pose, the button is a plain
 * element, and nothing on the screen begins at opacity or scale 0 — so a
 * renderer that never fires a frame still shows a complete, legible screen with
 * a working button. (CLAUDE.md principle 5, SPEC 7.1 hard rule 2.)
 */
export function StartScreen() {
  const start = useQuizStore((s) => s.start);
  const firstPrompt = useQuizStore((s) => s.session.questions[0]?.promptAudio.ms);

  /*
    Arm Howler before the child can press.

    Howler unlocks iOS audio properly — a scratch buffer and `ctx.resume()` in
    capture phase, on the real gesture — but it only registers those listeners
    from inside `Howl.init`, and only when a context already exists. On a cold
    start nothing had built a Howl yet, so on the iPhone those listeners
    registered 32ms after the Mula press had already gone: measured, the first
    tap was silent and the second one worked.

    Building one Howl here hands Howler a context while the screen is still
    sitting there waiting, so it arms in time for the first tap.

    Thrown away deliberately, and never prefetched through: `_unlockAudio` calls
    `Howler.unload()` when the sample rate is not 44100, and an unloaded Howl
    still answers `play()` with a sound id while making no sound at all. The
    bytes survive in the HTTP cache, which is the part worth keeping.
  */
  useEffect(() => {
    if (firstPrompt) promptPlayer.arm(firstPrompt);
  }, [firstPrompt]);

  return (
    <main
      className="relative mx-auto flex h-[100dvh] max-w-[430px] flex-col items-center px-4"
      style={ISLAND_BACKGROUND}
    >
      {/*
        The sky band: every piece of text on this screen sits between y 150 and
        y 230, because that is the only place near the top where --arang clears
        its contrast floor against this picture. Above it the canopy comes in.

        Name slot 44px (150-194), title 36px (194-230) — the band exactly.

        The name slot is empty until child profiles arrive in Phase 2, and held
        open now so that filling it later moves nothing — the same reasoning as
        the reserved slots in DESIGN 7.
      */}
      <div className="w-full shrink-0" style={{ paddingTop: SKY_BAND.top }}>
        <div aria-hidden data-slot="nama" className="h-[44px] w-full" />
        <h1 className="m-0 text-center font-display text-h1 font-bold text-arang">
          {packTitle.ms}
        </h1>
      </div>

      {/*
        Standing on the grass. Held from the bottom, like the background, so it
        moves with the grass on a taller screen instead of floating off it.
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: KANCIL_FROM_BOTTOM }}
        data-slot="kancil-rumput"
      >
        <Kancil state="idle" size={210} />
      </div>

      {/* The button is anchored to the bottom; the slack lives here, as background. */}
      <div className="min-h-0 flex-1" />

      <div
        className="relative w-full shrink-0"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <BlockButton
          onPress={start}
          state="start"
          minHeight={96}
          ariaLabel="Mula aktiviti"
        >
          Mula
        </BlockButton>
      </div>
    </main>
  );
}
