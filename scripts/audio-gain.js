#!/usr/bin/env node
/**
 * Even out the loudness of the prompt recordings, inside the MP3. (SPEC 8)
 *
 * The step every new recording goes through after its ID3 tag is stripped.
 * It is two halves, because Node here has no MP3 decoder and the measurement
 * that matters is the browser's:
 *
 *   1. `npm run dev`, then open http://localhost:5173/scripts/loudness.html.
 *      It decodes every recorded clip with the browser's own decoder, measures
 *      integrated loudness, and prints the exact `apply` command.
 *   2. Run that command. Each argument is `<lang>/<id>=<steps>@<sha>`:
 *
 *        npm run audio:gain -- apply ms/q029=+4@1a2b3c4d ms/q014=-1@5e6f7a8b
 *
 *      `steps` moves every granule's global_gain; one step is 1.505 dB. The sha
 *      is the first 8 hex digits of the file as it was measured, and a file
 *      that no longer matches is refused — so running the same command twice
 *      cannot double a gain.
 *   3. Reload the page. It measures again, and every clip should now ask for 0.
 *
 *   npm run audio:gain -- check
 *
 * reads every recorded clip under public/audio/ and reports whether the gain
 * edit can be trusted on it — the ID3 tag gone, MPEG-1 Layer III, no CRC, no
 * tag frame, no trailing bytes. `apply` runs the same check first.
 *
 * Every file is edited in memory before any is written: one bad argument
 * writes nothing. Cross-platform by construction: pure Node, node:fs only.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STEP_DB, applyGain, gainRange, readFrames } from './loudness.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(HERE, '..', 'public', 'audio');

const sha8 = (bytes) => createHash('sha256').update(bytes).digest('hex').slice(0, 8);

async function check() {
  let failed = 0;
  for (const lang of await readdir(AUDIO_DIR)) {
    for (const name of (await readdir(path.join(AUDIO_DIR, lang))).sort()) {
      if (!name.endsWith('.mp3')) continue;
      const bytes = new Uint8Array(await readFile(path.join(AUDIO_DIR, lang, name)));
      if (bytes.length === 0) continue; // a placeholder, not a recording
      try {
        const frames = readFrames(bytes);
        const { min, max } = gainRange(bytes);
        const f = frames[0];
        console.log(
          `ok    ${lang}/${name}  ${frames.length} frames, ${f.sampleRate} Hz, ` +
            `${f.channels === 1 ? 'mono' : 'stereo'}, global_gain ${min}-${max}, sha ${sha8(bytes)}`,
        );
      } catch (e) {
        failed++;
        console.log(`FAIL  ${lang}/${name}  ${e.message}`);
      }
    }
  }
  return failed === 0 ? 0 : 1;
}

async function apply(args) {
  if (args.length === 0) {
    console.error('apply needs at least one <lang>/<id>=<steps>@<sha> argument');
    return 1;
  }
  const edits = [];
  for (const arg of args) {
    const m = /^(ms|en)\/([a-z0-9_]+)=([+-]?\d+)@([0-9a-f]{8})$/.exec(arg);
    if (!m) {
      console.error(`not <lang>/<id>=<steps>@<sha>: ${arg}`);
      return 1;
    }
    const [, lang, id, stepsText, sha] = m;
    const file = path.join(AUDIO_DIR, lang, `${id}.mp3`);
    const before = new Uint8Array(await readFile(file));
    if (sha8(before) !== sha) {
      console.error(
        `${lang}/${id}: file is ${sha8(before)}, not the ${sha} that was measured. ` +
          'Measure again before applying — it may have been edited already.',
      );
      return 1;
    }
    try {
      const steps = Number(stepsText);
      const after = applyGain(before, steps);
      edits.push({ lang, id, file, steps, before, after });
    } catch (e) {
      console.error(`${lang}/${id}: ${e.message}`);
      return 1;
    }
  }
  for (const e of edits) {
    await writeFile(e.file, e.after);
    const was = gainRange(e.before);
    const now = gainRange(e.after);
    console.log(
      `${e.lang}/${e.id}  ${e.steps > 0 ? '+' : ''}${e.steps} (${(e.steps * STEP_DB).toFixed(2)} dB)  ` +
        `global_gain ${was.min}-${was.max} -> ${now.min}-${now.max}  sha ${sha8(e.before)} -> ${sha8(e.after)}`,
    );
  }
  console.log(`\n${edits.length} file(s) written. Reload loudness.html to measure them again.`);
  return 0;
}

const [command, ...rest] = process.argv.slice(2);
if (command === 'check') process.exit(await check());
else if (command === 'apply') process.exit(await apply(rest));
else {
  console.error('usage: audio-gain check | audio-gain apply <lang>/<id>=<steps>@<sha> ...');
  process.exit(1);
}
