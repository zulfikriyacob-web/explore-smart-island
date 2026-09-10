import { useEffect, useState } from 'react';

import {
  deviceState,
  howlerState,
  record,
  snapshot,
  subscribe,
  type DiagEntry,
} from '../../lib/diagnostics.ts';

/**
 * TEMPORARY — the on-screen readout for the iOS audio bug. Delete with the
 * branch.
 *
 * The pane on this machine cannot reproduce the bug, so the numbers have to be
 * read off the phone itself. This renders them large enough to read on a
 * handset and offers a copy button, because retyping a log by hand loses the
 * one line that mattered.
 *
 * It is mounted, painted and legible on frame 0 — no animation, no opacity or
 * scale entry (SPEC 7.1 hard rule 2). A diagnostic that needed an animation
 * frame to appear would be missing on exactly the throttled device worth
 * diagnosing.
 */
/** Module-level, so a remount does not re-log the screen it is already on. */
let lastScreen: string | null = null;

export function DiagnosticsPanel({ where }: { where: string }) {
  const [entries, setEntries] = useState<readonly DiagEntry[]>(() => snapshot().slice());
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => subscribe(() => setEntries(snapshot().slice())), []);

  // One line when the screen changes, and only then. It used to log the whole
  // device blob on every mount, which StrictMode doubles and a remount repeats —
  // three long lines that pushed the events worth reading off the top of a phone
  // screen. The device facts live in the fixed header above instead.
  useEffect(() => {
    if (lastScreen === where) return;
    lastScreen = where;
    record(`>>> skrin: ${where}`, howlerState());
  }, [where]);

  const live = howlerState();

  const text = [
    `SCREEN ${where}`,
    `DEVICE ${JSON.stringify(deviceState())}`,
    `NOW    ${JSON.stringify(live)}`,
    ...entries.map(
      (e) => `${String(e.t).padStart(6)}ms ${e.label}${e.data ? ' ' + JSON.stringify(e.data) : ''}`,
    ),
  ].join('\n');

  return (
    <section
      aria-label="Diagnostik audio"
      className="fixed inset-x-0 top-0 z-50 max-h-[52vh] overflow-y-auto border-b-4 border-arang bg-white/95 p-2 font-mono text-[11px] leading-tight text-arang"
    >
      <div className="mb-1 flex items-center gap-2">
        <strong className="text-[12px]">AUDIO DIAG · {where}</strong>
        <button
          type="button"
          className="rounded border-2 border-arang px-2 py-1 text-[11px]"
          onPointerDown={() => {
            // Clipboard needs a gesture on iOS; a button press is one. If it is
            // refused the text is still on screen and selectable, so the copy is
            // a convenience and never the only way out.
            void navigator.clipboard
              ?.writeText(text)
              .then(() => setCopied('disalin'))
              .catch((err: unknown) => setCopied(`gagal: ${String(err).slice(0, 40)}`));
          }}
        >
          Salin
        </button>
        {copied && <span>{copied}</span>}
      </div>

      {/*
        ctxState and howlerState on one line, side by side, because the two
        disagreeing is the fault: Howl.play() gates on Howler.state, not on
        ctx.state. Both must read `running` after the Mula tap.
      */}
      <div>
        <strong>
          ctxState: {String(live.ctxState)} · Howler.state: {String(live.howlerState)}
        </strong>
      </div>
      <div>
        ctx: {String(live.ctx)} · _audioUnlocked: {String(live.audioUnlocked)} · webAudio:{' '}
        {String(live.usingWebAudio)} · noAudio: {String(live.noAudio)}
      </div>
      <div>
        autoUnlock: {String(live.autoUnlock)} · autoSuspend: {String(live.autoSuspend)} · howls:{' '}
        {String(live.howls)} · appleVendor: {String(deviceState().isAppleVendor)}
      </div>

      <hr className="my-1 border-garis" />

      {entries.length === 0 ? (
        <div>(belum ada peristiwa)</div>
      ) : (
        <ol className="m-0 list-none p-0">
          {entries.map((e, i) => (
            <li key={i} className="whitespace-pre-wrap break-words">
              {String(e.t).padStart(5)}ms {e.label}
              {e.data ? ' ' + JSON.stringify(e.data) : ''}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
