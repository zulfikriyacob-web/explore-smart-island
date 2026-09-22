import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import {
  STEP_DB,
  applyGain,
  gainRange,
  integratedLoudness,
  kWeighting,
  peakOf,
  planGain,
  readFrames,
} from './loudness.ts';

/** 128 kbps at 44.1 kHz: 417 bytes, 418 with padding. */
const FRAME = 417;

/** An MPEG-1 Layer III frame with zeroed side information and payload. */
function frame(opts: { stereo?: boolean; crc?: boolean; layer2?: boolean } = {}): Uint8Array {
  const f = new Uint8Array(FRAME);
  f[0] = 0xff;
  f[1] = opts.layer2 ? 0xfd : opts.crc ? 0xfa : 0xfb;
  f[2] = 0x90; // 128 kbps, 44.1 kHz, no padding
  f[3] = opts.stereo ? 0x00 : 0xc0;
  return f;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/** Write an 8-bit value at a bit offset, as the side information packs it. */
function setBits(bytes: Uint8Array, bit: number, value: number): void {
  for (let i = 0; i < 8; i++) {
    const b = bit + i;
    const mask = 1 << (7 - (b & 7));
    bytes[b >> 3] = (value >> (7 - i)) & 1 ? (bytes[b >> 3] as number) | mask : (bytes[b >> 3] as number) & ~mask;
  }
}

/** Mono MPEG-1: global_gain at bits 39 and 98 of the side information. */
function monoWithGains(g0: number, g1: number): Uint8Array {
  const f = frame();
  setBits(f, 32 + 39, g0);
  setBits(f, 32 + 98, g1);
  return f;
}

function sine(hz: number, amplitude: number, seconds: number, rate: number): Float32Array {
  const x = new Float32Array(Math.round(seconds * rate));
  for (let i = 0; i < x.length; i++) x[i] = amplitude * Math.sin((2 * Math.PI * hz * i) / rate);
  return x;
}

describe('readFrames', () => {
  it('walks every frame to the exact end of the file', () => {
    const frames = readFrames(concat(frame(), frame(), frame()));
    expect(frames.map((f) => f.offset)).toEqual([0, FRAME, 2 * FRAME]);
    expect(frames[0]).toMatchObject({ sampleRate: 44100, channels: 1, length: FRAME });
  });

  it('refuses a file whose ID3 tag has not been stripped', () => {
    expect(() => readFrames(concat(new Uint8Array([0x49, 0x44, 0x33, 4, 0]), frame()))).toThrow(/ID3/);
  });

  it('refuses a CRC, which would have to be recomputed', () => {
    expect(() => readFrames(frame({ crc: true }))).toThrow(/CRC/);
  });

  it('refuses anything but Layer III', () => {
    expect(() => readFrames(frame({ layer2: true }))).toThrow(/Layer III/);
  });

  it('refuses bytes after the last frame', () => {
    expect(() => readFrames(concat(frame(), new Uint8Array(3)))).toThrow(/trailing/);
    expect(() => readFrames(concat(frame(), new Uint8Array(10)))).toThrow(/no frame sync/);
  });

  it('refuses a Xing or Info frame first, and ignores the same bytes later', () => {
    const tagged = frame();
    tagged.set([0x49, 0x6e, 0x66, 0x6f], 4 + 17); // "Info" after mono side information
    expect(() => readFrames(concat(tagged, frame()))).toThrow(/Info/);
    expect(readFrames(concat(frame(), tagged))).toHaveLength(2);
  });
});

describe('applyGain', () => {
  it('moves every global_gain by the steps and changes no other byte', () => {
    const before = concat(monoWithGains(100, 150), monoWithGains(90, 210));
    const after = applyGain(before, 4);
    expect(gainRange(before)).toEqual({ min: 90, max: 210 });
    expect(gainRange(after)).toEqual({ min: 94, max: 214 });
    const changed = [...after.keys()].filter((i) => after[i] !== before[i]);
    // Only side-information bytes, inside the first 17 after each header.
    for (const i of changed) expect(i % FRAME).toBeGreaterThanOrEqual(4);
    for (const i of changed) expect(i % FRAME).toBeLessThan(4 + 17);
  });

  it('is undone exactly by the opposite steps', () => {
    const before = concat(monoWithGains(120, 130), monoWithGains(40, 200));
    expect(applyGain(applyGain(before, 5), -5)).toEqual(before);
  });

  it('does not touch its input', () => {
    const before = monoWithGains(100, 100);
    const copy = new Uint8Array(before);
    applyGain(before, 3);
    expect(before).toEqual(copy);
  });

  it('refuses a step that would leave a field outside 0-255', () => {
    expect(() => applyGain(monoWithGains(250, 100), 6)).toThrow(/256/);
    expect(() => applyGain(monoWithGains(2, 100), -3)).toThrow(/-1/);
    expect(() => applyGain(monoWithGains(2, 100), 1.5)).toThrow(/integer/);
  });

  it('finds all four fields in a stereo frame', () => {
    const f = frame({ stereo: true });
    // 20 bits of main_data_begin, private bits and scfsi, then 59 per granule per channel.
    for (const k of [0, 1, 2, 3]) setBits(f, 32 + 20 + k * 59 + 21, 100 + k);
    expect(gainRange(f)).toEqual({ min: 100, max: 103 });
    expect(gainRange(applyGain(f, -2))).toEqual({ min: 98, max: 101 });
  });
});

describe('integratedLoudness', () => {
  it('reproduces the BS.1770 filter coefficients at 48 kHz', () => {
    const [shelf, highPass] = kWeighting(48000);
    const close = (got: number[], want: number[]) =>
      got.forEach((g, i) => expect(g).toBeCloseTo(want[i] as number, 7));
    close(shelf.b, [1.53512485958697, -2.69169618940638, 1.19839281085285]);
    close(shelf.a, [-1.69065929318241, 0.73248077421585]);
    close(highPass.b, [1, -2, 1]);
    close(highPass.a, [-1.99004745483398, 0.99007225036621]);
  });

  it('reads a full-scale 997 Hz sine in one channel as -3.01 LUFS, at 48 and 44.1 kHz', () => {
    for (const rate of [48000, 44100]) {
      expect(integratedLoudness([sine(997, 1, 5, rate)], rate)).toBeCloseTo(-3.01, 1);
      expect(integratedLoudness([sine(997, 0.5, 5, rate)], rate)).toBeCloseTo(-9.03, 1);
    }
  });

  it('is not pulled down by silence the way whole-file RMS is', () => {
    const rate = 44100;
    const speech = sine(997, 0.3, 5, rate);
    const padded = new Float32Array(speech.length + 6 * rate);
    padded.set(speech, 3 * rate);
    const rms = (x: Float32Array) => 10 * Math.log10(x.reduce((s, v) => s + v * v, 0) / x.length);
    expect(rms(speech) - rms(padded)).toBeGreaterThan(3);
    expect(integratedLoudness([speech], rate) - integratedLoudness([padded], rate)).toBeLessThan(0.3);
  });

  it('reads silence as -Infinity rather than a number', () => {
    expect(integratedLoudness([new Float32Array(44100)], 44100)).toBe(-Infinity);
  });

  it('takes the peak across every channel', () => {
    expect(peakOf([new Float32Array([0.1, -0.4]), new Float32Array([0.3])])).toBeCloseTo(0.4);
  });
});

describe('planGain', () => {
  it('rounds to the nearest step, measured on the clips it was built for (PRD 16 item 50)', () => {
    expect(STEP_DB).toBeCloseTo(1.5051, 4);
    expect(planGain(-23.64, 0.414)).toMatchObject({ steps: 4, limited: false }); // q027
    expect(planGain(-23.64, 0.414).lufsAfter).toBeCloseTo(-17.62, 2);
    expect(planGain(-14.85, 0.854).steps).toBe(-1); // q014
    expect(planGain(-16.84, 0.856).steps).toBe(0); // q011
  });

  it('stops at the peak ceiling and says so', () => {
    const plan = planGain(-30, 0.5);
    expect(plan).toMatchObject({ steps: 3, limited: true });
    expect(plan.peakAfter).toBeLessThanOrEqual(0.95);
  });

  it('asks for nothing more once a clip has been moved', () => {
    const first = planGain(-23.64, 0.414);
    expect(planGain(first.lufsAfter, first.peakAfter).steps).toBe(0);
  });
});

describe('the recordings in the repo', () => {
  const audio = path.join(import.meta.dirname, '..', 'public', 'audio');
  const clips = readdirSync(audio).flatMap((lang) =>
    readdirSync(path.join(audio, lang))
      .filter((n) => n.endsWith('.mp3'))
      .map((n) => path.join(audio, lang, n)),
  );

  it.each(clips)('%s is either a placeholder or a clip the gain edit can be trusted on', (file) => {
    const bytes = new Uint8Array(readFileSync(file));
    if (bytes.length > 0) expect(readFrames(bytes).length).toBeGreaterThan(0);
  });
});
