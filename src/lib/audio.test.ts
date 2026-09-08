import { describe, expect, it } from 'vitest';

import { isAudioAvailable } from './audio.ts';

function fakeFetch(init: {
  ok?: boolean;
  contentLength?: string | null;
  throws?: boolean;
}): typeof fetch {
  return (async () => {
    if (init.throws) throw new TypeError('NetworkError');
    const headers = new Headers();
    if (init.contentLength !== null && init.contentLength !== undefined) {
      headers.set('content-length', init.contentLength);
    }
    return { ok: init.ok ?? true, headers } as Response;
  }) as unknown as typeof fetch;
}

describe('isAudioAvailable', () => {
  it('reports a zero-byte placeholder as unavailable', async () => {
    expect(await isAudioAvailable('/audio/ms/q001.mp3', fakeFetch({ contentLength: '0' }))).toBe(
      false,
    );
  });

  it('reports a real recording as available', async () => {
    expect(
      await isAudioAvailable('/audio/ms/q001.mp3', fakeFetch({ contentLength: '18432' })),
    ).toBe(true);
  });

  it('treats a missing file as unavailable', async () => {
    expect(
      await isAudioAvailable('/audio/ms/nope.mp3', fakeFetch({ ok: false, contentLength: '0' })),
    ).toBe(false);
  });

  it('treats a network failure as unavailable rather than showing a dead button', async () => {
    expect(await isAudioAvailable('/audio/ms/q001.mp3', fakeFetch({ throws: true }))).toBe(false);
  });

  it('assumes real audio when the server sends no content-length', async () => {
    // A server that omits the header is not the placeholder case, and hiding
    // working audio would be the worse mistake here.
    expect(await isAudioAvailable('/audio/ms/q001.mp3', fakeFetch({ contentLength: null }))).toBe(
      true,
    );
  });

  it('treats a nonsense content-length as unavailable', async () => {
    expect(
      await isAudioAvailable('/audio/ms/q001.mp3', fakeFetch({ contentLength: 'banyak' })),
    ).toBe(false);
  });
});
