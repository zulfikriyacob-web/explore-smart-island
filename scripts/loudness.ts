/**
 * Loudness for the prompt recordings: measure it, and even it out without
 * re-encoding. (SPEC 8, PRD 16 item 50)
 *
 * Pure: bytes and samples in, numbers and bytes out. No file system, no
 * decoder. The same module runs in Node, where `audio-gain.js` edits the files,
 * and in the browser, where `loudness.html` measures what the browser's own
 * decoder hears — the layer closest to a child that can be reached from here.
 *
 * Why the gain is changed inside the MP3 and not at playback: Howler's volume
 * stops at 1.0, so it can only turn the loud clips down to the quietest one,
 * and every clip then plays quieter on a phone speaker. `global_gain` is an
 * 8-bit field in each granule's side information; adding 1 multiplies the
 * decoded signal by 2^(1/4), 1.505 dB, and touches nothing else. It is how
 * mp3gain works, and it is lossless and reversible: -n steps restore the bytes.
 */

/** Integrated loudness every prompt clip is brought to. (SPEC 8) */
export const TARGET_LUFS = -17;

/**
 * The highest decoded sample a gain step may produce.
 *
 * Below 1.0 on purpose: the browser decoder clamps at 1.0 (measured, PRD 16
 * item 50), and a device that resamples 44.1 kHz to 48 kHz can put a peak
 * between the samples measured here.
 */
export const PEAK_CEILING = 0.95;

/** One `global_gain` step, in dB: 20·log10(2^(1/4)). */
export const STEP_DB = 20 * Math.log10(2 ** 0.25);

const BITRATES_KBPS = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
const SAMPLE_RATES = [44100, 48000, 32000, 0];

export interface Frame {
  offset: number;
  length: number;
  sampleRate: number;
  channels: 1 | 2;
  /** Byte offset of the side information, just after the 4-byte header. */
  sideInfo: number;
}

/**
 * Every frame of an MPEG-1 Layer III file, or an error that says why this
 * file is not one the gain edit can be trusted on.
 *
 * Strict by design. Everything refused below is something no prompt clip has
 * had so far — 35 of 35 were MPEG-1 Layer III, CBR, mono, no CRC, no Xing or
 * LAME frame — and each would need its own handling rather than a guess: a CRC
 * covers the side information and would have to be recomputed; a Xing or LAME
 * frame carries no audio and a tag checksum; bytes after the last frame are an
 * ID3v1 tag or a cut file.
 */
export function readFrames(bytes: Uint8Array): Frame[] {
  if (bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    throw new Error('starts with an ID3 tag: strip it first (SPEC 8)');
  }
  const frames: Frame[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    if (offset + 4 > bytes.length) {
      throw new Error(`${bytes.length - offset} trailing byte(s) after the last frame at ${offset}`);
    }
    const b1 = bytes[offset + 1] as number;
    const b2 = bytes[offset + 2] as number;
    const b3 = bytes[offset + 3] as number;
    if (bytes[offset] !== 0xff || (b1 & 0xe0) !== 0xe0) {
      throw new Error(`no frame sync at byte ${offset}`);
    }
    if (((b1 >> 3) & 3) !== 3 || ((b1 >> 1) & 3) !== 1) {
      throw new Error(`frame at ${offset} is not MPEG-1 Layer III`);
    }
    if ((b1 & 1) === 0) throw new Error(`frame at ${offset} carries a CRC`);
    const kbps = BITRATES_KBPS[b2 >> 4] as number;
    const sampleRate = SAMPLE_RATES[(b2 >> 2) & 3] as number;
    if (kbps === 0 || sampleRate === 0) {
      throw new Error(`frame at ${offset} has a free or invalid bitrate or sample rate`);
    }
    const channels = b3 >> 6 === 3 ? 1 : 2;
    const length = Math.floor((144000 * kbps) / sampleRate) + ((b2 >> 1) & 1);
    const sideInfo = offset + 4;
    // A tag frame can only be the first; anywhere else these bytes are audio.
    if (frames.length === 0) {
      const tagAt = sideInfo + (channels === 1 ? 17 : 32);
      const tag = String.fromCharCode(...bytes.subarray(tagAt, tagAt + 4));
      const vbri = String.fromCharCode(...bytes.subarray(offset + 36, offset + 40));
      if (tag === 'Xing' || tag === 'Info' || vbri === 'VBRI') {
        throw new Error(`the first frame is a ${vbri === 'VBRI' ? 'VBRI' : tag} tag frame`);
      }
    }
    if (offset + length > bytes.length) {
      throw new Error(`frame at ${offset} runs past the end of the file`);
    }
    frames.push({ offset, length, sampleRate, channels, sideInfo });
    offset += length;
  }
  if (frames.length === 0) throw new Error('no frames');
  return frames;
}

/**
 * Bit offsets of every `global_gain` field in one frame's side information.
 * MPEG-1: 9 bits main_data_begin, then 5 private bits and 4 scfsi bits for
 * mono or 3 and 8 for stereo, then 59 bits per granule per channel with
 * global_gain 21 bits in.
 */
function gainBits(frame: Frame): number[] {
  const head = frame.channels === 1 ? 18 : 20;
  const out: number[] = [];
  for (let granule = 0; granule < 2; granule++) {
    for (let ch = 0; ch < frame.channels; ch++) {
      out.push(frame.sideInfo * 8 + head + (granule * frame.channels + ch) * 59 + 21);
    }
  }
  return out;
}

function readByteAt(bytes: Uint8Array, bit: number): number {
  let v = 0;
  for (let i = 0; i < 8; i++) {
    const b = bit + i;
    v = (v << 1) | (((bytes[b >> 3] as number) >> (7 - (b & 7))) & 1);
  }
  return v;
}

function writeByteAt(bytes: Uint8Array, bit: number, value: number): void {
  for (let i = 0; i < 8; i++) {
    const b = bit + i;
    const mask = 1 << (7 - (b & 7));
    const on = (value >> (7 - i)) & 1;
    bytes[b >> 3] = on ? (bytes[b >> 3] as number) | mask : (bytes[b >> 3] as number) & ~mask;
  }
}

/** The lowest and highest `global_gain` in the file. */
export function gainRange(bytes: Uint8Array): { min: number; max: number } {
  let min = 255;
  let max = 0;
  for (const frame of readFrames(bytes)) {
    for (const bit of gainBits(frame)) {
      const g = readByteAt(bytes, bit);
      min = Math.min(min, g);
      max = Math.max(max, g);
    }
  }
  return { min, max };
}

/**
 * A copy of the file with every `global_gain` moved by `steps`. The input is
 * not touched, and nothing but those fields changes. Refuses a step that would
 * leave any field outside 0–255 rather than clamp it, because a clamped field
 * is no longer the same gain as the rest.
 */
export function applyGain(bytes: Uint8Array, steps: number): Uint8Array {
  if (!Number.isInteger(steps)) throw new RangeError(`steps must be an integer, got ${steps}`);
  const out = new Uint8Array(bytes);
  if (steps === 0) return out;
  for (const frame of readFrames(bytes)) {
    for (const bit of gainBits(frame)) {
      const g = readByteAt(out, bit) + steps;
      if (g < 0 || g > 255) {
        throw new RangeError(`global_gain would be ${g} in the frame at ${frame.offset}`);
      }
      writeByteAt(out, bit, g);
    }
  }
  return out;
}

type Biquad = { b: [number, number, number]; a: [number, number] };

/**
 * ITU-R BS.1770-4 K-weighting for any sample rate: the pre-filter shelf and
 * the RLB high-pass. The parameters are the ones libebur128 derives from the
 * standard's 48 kHz coefficients, so 48 kHz reproduces the published table and
 * 44.1 kHz — the rate these clips are recorded at — is filtered without
 * resampling first.
 */
export function kWeighting(sampleRate: number): [Biquad, Biquad] {
  let K = Math.tan((Math.PI * 1681.974450955533) / sampleRate);
  let Q = 0.7071752369554196;
  const Vh = 10 ** (3.999843853973347 / 20);
  const Vb = Vh ** 0.4996667741545416;
  let a0 = 1 + K / Q + K * K;
  const shelf: Biquad = {
    b: [(Vh + (Vb * K) / Q + K * K) / a0, (2 * (K * K - Vh)) / a0, (Vh - (Vb * K) / Q + K * K) / a0],
    a: [(2 * (K * K - 1)) / a0, (1 - K / Q + K * K) / a0],
  };
  K = Math.tan((Math.PI * 38.13547087602444) / sampleRate);
  Q = 0.5003270373238773;
  a0 = 1 + K / Q + K * K;
  const highPass: Biquad = {
    b: [1, -2, 1],
    a: [(2 * (K * K - 1)) / a0, (1 - K / Q + K * K) / a0],
  };
  return [shelf, highPass];
}

function filter(x: ArrayLike<number>, { b, a }: Biquad): Float64Array {
  const y = new Float64Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const xi = x[i] as number;
    const yi = b[0] * xi + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2;
    x2 = x1; x1 = xi; y2 = y1; y1 = yi;
    y[i] = yi;
  }
  return y;
}

/**
 * Integrated loudness in LUFS (BS.1770-4): K-weighted mean square over 400 ms
 * blocks stepping 100 ms, an absolute gate at -70 LUFS and a relative gate
 * 10 LU under the absolutely-gated mean. Channel weights are 1, which is all a
 * mono or stereo clip needs.
 *
 * Gated, and that is the reason to use it over plain RMS: a clip's silence at
 * either end does not make it read quieter. Measured, whole-file RMS put q011
 * at -18.69 dBFS where its speech reads -16.84 LUFS (PRD 16 item 50).
 */
export function integratedLoudness(channels: ArrayLike<number>[], sampleRate: number): number {
  const [shelf, highPass] = kWeighting(sampleRate);
  const weighted = channels.map((c) => filter(filter(c, shelf), highPass));
  const length = weighted[0]?.length ?? 0;
  const block = Math.round(0.4 * sampleRate);
  const hop = Math.round(0.1 * sampleRate);
  const powers: number[] = [];
  for (let start = 0; start + block <= length; start += hop) {
    let z = 0;
    for (const c of weighted) {
      let sum = 0;
      for (let i = start; i < start + block; i++) sum += (c[i] as number) ** 2;
      z += sum / block;
    }
    powers.push(z);
  }
  const lufs = (z: number) => -0.691 + 10 * Math.log10(z);
  const mean = (zs: number[]) => zs.reduce((s, z) => s + z, 0) / zs.length;
  const aboveAbsolute = powers.filter((z) => lufs(z) > -70);
  if (aboveAbsolute.length === 0) return -Infinity;
  const relative = lufs(mean(aboveAbsolute)) - 10;
  return lufs(mean(aboveAbsolute.filter((z) => lufs(z) > relative)));
}

/** The largest absolute sample across every channel. */
export function peakOf(channels: ArrayLike<number>[]): number {
  let peak = 0;
  for (const c of channels) {
    for (let i = 0; i < c.length; i++) peak = Math.max(peak, Math.abs(c[i] as number));
  }
  return peak;
}

export interface GainPlan {
  steps: number;
  /** True when the peak ceiling, not the target, decided `steps`. */
  limited: boolean;
  lufsAfter: number;
  peakAfter: number;
}

/**
 * The whole number of steps that brings a clip nearest the target without its
 * peak passing the ceiling. A clip already within half a step reads 0, so a
 * measurement taken after the edit asks for nothing more.
 */
export function planGain(
  lufs: number,
  peak: number,
  target = TARGET_LUFS,
  ceiling = PEAK_CEILING,
): GainPlan {
  // `|| 0` turns Math.round's -0 into 0.
  const wanted = Math.round((target - lufs) / STEP_DB) || 0;
  const allowed = peak > 0 ? Math.floor(4 * Math.log2(ceiling / peak)) : wanted;
  const steps = Math.min(wanted, allowed);
  return {
    steps,
    limited: steps < wanted,
    lufsAfter: lufs + steps * STEP_DB,
    peakAfter: peak * 2 ** (steps / 4),
  };
}
