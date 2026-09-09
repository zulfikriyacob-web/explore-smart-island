import { BlockButton } from '../../components/ui/BlockButton.tsx';
// TEMPORARY — iOS audio diagnostics. Delete with the branch.
import { DiagnosticsPanel } from '../../components/ui/DiagnosticsPanel.tsx';
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

  return (
    <main className="mx-auto flex h-[100dvh] max-w-[430px] flex-col items-center px-4">
      {/* TEMPORARY — iOS audio diagnostics. Delete with the branch. */}
      <DiagnosticsPanel where="mula" />

      {/*
        Reserved name slot: 44px tall, top at Y 24, so its bottom edge is Y 68.
        Empty until child profiles arrive in Phase 2. Held open now so that
        filling it later does not move the kancil, the title or the button —
        the same reasoning as the reserved slots in DESIGN 7.
      */}
      <div aria-hidden data-slot="nama" className="mt-6 h-[44px] w-full shrink-0" />

      <Kancil state="idle" size={200} />

      <h1 className="mt-4 text-center font-display text-h1 font-bold text-arang">
        {packTitle.ms}
      </h1>

      {/* The button is anchored to the bottom; the slack lives here, as background. */}
      <div className="min-h-0 flex-1" />

      <div
        className="w-full shrink-0"
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
