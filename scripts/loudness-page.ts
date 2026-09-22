/**
 * The measuring half of the loudness step (SPEC 8), for `loudness.html`.
 *
 * Decodes every recorded prompt clip the packs reference with the browser's own
 * decoder, at the clip's own sample rate so nothing is resampled first, and
 * plans the `global_gain` steps that bring each to TARGET_LUFS. The command it
 * prints carries each file's hash as measured, so `audio:gain` refuses a file
 * that has changed since.
 *
 * Needs a secure context for `crypto.subtle`: open it on localhost.
 */

import { TopicPackSchema, collectAssetRefs } from '../src/content/schema.ts';
import {
  PEAK_CEILING,
  STEP_DB,
  TARGET_LUFS,
  integratedLoudness,
  peakOf,
  planGain,
  readFrames,
  type GainPlan,
} from './loudness.ts';

interface Row {
  clip: string;
  sha: string;
  sampleRate: number;
  lufs: number;
  peak: number;
  plan: GainPlan;
}

const packs = import.meta.glob('/src/content/packs/*.json', { eager: true, import: 'default' });

const log = document.getElementById('log') as HTMLElement;
const say = (text: string, cls?: string) => {
  const p = document.createElement('p');
  p.textContent = text;
  if (cls) p.className = cls;
  log.appendChild(p);
};

async function sha8(bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest.subarray(0, 4), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function measure(clip: string): Promise<Row | 'placeholder'> {
  const bytes = new Uint8Array(await (await fetch(clip)).arrayBuffer());
  if (bytes.length === 0) return 'placeholder';
  const { sampleRate, channels } = readFrames(bytes)[0] as { sampleRate: number; channels: number };
  const ctx = new OfflineAudioContext(channels, 1, sampleRate);
  const audio = await ctx.decodeAudioData(bytes.slice().buffer);
  const data = Array.from({ length: audio.numberOfChannels }, (_, i) => audio.getChannelData(i));
  const lufs = integratedLoudness(data, audio.sampleRate);
  const peak = peakOf(data);
  return { clip, sha: await sha8(bytes), sampleRate: audio.sampleRate, lufs, peak, plan: planGain(lufs, peak) };
}

const fmt = (n: number, d = 2) => n.toFixed(d);
const spread = (xs: number[]) => (xs.length ? Math.max(...xs) - Math.min(...xs) : 0);

async function main() {
  log.textContent = '';
  if (!window.isSecureContext || !crypto.subtle) {
    say('Bukan konteks selamat — crypto.subtle tiada. Buka halaman ini pada localhost.', 'err');
    return;
  }

  const clips = new Set<string>();
  for (const raw of Object.values(packs)) {
    for (const ref of collectAssetRefs(TopicPackSchema.parse(raw))) {
      if (ref.kind === 'audio') clips.add(ref.path);
    }
  }

  const rows: Row[] = [];
  const failed: string[] = [];
  let placeholders = 0;
  for (const clip of [...clips].sort()) {
    try {
      const r = await measure(clip);
      if (r === 'placeholder') placeholders++;
      else rows.push(r);
    } catch (e) {
      failed.push(`${clip}: ${(e as Error).message}`);
    }
  }

  const now = rows.map((r) => r.lufs);
  const after = rows.map((r) => r.plan.lufsAfter);
  const changes = rows.filter((r) => r.plan.steps !== 0);
  const limited = rows.filter((r) => r.plan.limited).map((r) => r.clip);
  say(
    `Sasaran ${TARGET_LUFS} LUFS · siling puncak ${PEAK_CEILING} · satu langkah ${fmt(STEP_DB, 3)} dB. ` +
      `${rows.length} klip diukur, ${placeholders} pemegang tempat 0 bait dilangkau.`,
  );
  say(`Sekarang: ${fmt(Math.min(...now))} hingga ${fmt(Math.max(...now))} LUFS, sebaran ${fmt(spread(now))} LU.`);
  say(
    `Selepas pelan: ${fmt(Math.min(...after))} hingga ${fmt(Math.max(...after))} LUFS, sebaran ` +
      `${fmt(spread(after))} LU, puncak tertinggi ${fmt(Math.max(...rows.map((r) => r.plan.peakAfter)), 3)}.`,
  );
  if (limited.length) say(`Dihadkan oleh siling puncak: ${limited.join(', ')}`, 'err');
  for (const f of failed) say(`Gagal: ${f}`, 'err');

  const command = changes.length
    ? 'npm run audio:gain -- apply ' +
      changes
        .map((r) => {
          const [, lang, id] = /\/audio\/(ms|en)\/(.+)\.mp3$/.exec(r.clip) ?? [];
          return `${lang}/${id}=${r.plan.steps > 0 ? '+' : ''}${r.plan.steps}@${r.sha}`;
        })
        .join(' ')
    : 'Tiada klip perlu diubah.';
  (document.getElementById('command') as HTMLElement).textContent = command;
  say(changes.length ? `${changes.length} klip perlu diubah.` : 'Setiap klip dalam separuh langkah daripada sasaran.', changes.length ? undefined : 'ok');

  const table = document.getElementById('table') as HTMLTableElement;
  const head = ['klip', 'Hz', 'LUFS', 'puncak', 'langkah', 'LUFS selepas', 'puncak selepas', 'sha'];
  table.innerHTML = '';
  const tr = table.insertRow();
  for (const h of head) tr.appendChild(Object.assign(document.createElement('th'), { textContent: h }));
  for (const r of rows) {
    const cells = [
      r.clip, String(r.sampleRate), fmt(r.lufs), fmt(r.peak, 3),
      (r.plan.steps > 0 ? '+' : '') + r.plan.steps + (r.plan.limited ? ' (had)' : ''),
      fmt(r.plan.lufsAfter), fmt(r.plan.peakAfter, 3), r.sha,
    ];
    const row = table.insertRow();
    for (const c of cells) row.insertCell().textContent = c;
  }

  // For a script driving the page, and for anyone who wants the raw numbers.
  Object.assign(window, { __loudness: { rows, placeholders, failed, command } });
}

main().catch((e) => say(`Gagal: ${(e as Error).stack ?? e}`, 'err'));
