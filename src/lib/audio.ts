/**
 * Is there real audio behind this URL?
 *
 * The recordings in public/ are still zero-byte placeholders (PRD 8). A button
 * that plays nothing teaches a child that buttons do nothing, so the audio
 * control hides itself until a file has actual bytes. When real recordings land
 * the button comes back with no code change — the check is the file size, not a
 * flag someone has to remember to flip.
 *
 * A failed probe counts as unavailable. Hiding a working button is a smaller
 * harm than showing a dead one.
 */
export async function isAudioAvailable(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  let response: Response;
  try {
    response = await fetchImpl(url, { method: 'HEAD' });
  } catch {
    return false;
  }
  if (!response.ok) return false;

  const length = response.headers.get('content-length');
  if (length === null) {
    // No length header: assume the file is real rather than hiding audio that
    // works. A server that omits it is not the placeholder case.
    return true;
  }
  const bytes = Number(length);
  return Number.isFinite(bytes) && bytes > 0;
}
