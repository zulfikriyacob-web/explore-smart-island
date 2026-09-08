/**
 * Tracks whether the last input was a keyboard or a pointer, on
 * `document.documentElement[data-input]`.
 *
 * DESIGN 5.4 wants a visible focus ring for a parent on a desktop. `:focus-visible`
 * alone does not deliver that: Chrome on Android grants it after a touch in some
 * cases, and a child tapping "Sedia" got a 4px purple ring around the button —
 * confirmed on a real phone. A ring nobody asked for reads as something being
 * wrong.
 *
 * index.html ships `data-input="keyboard"`, so if this module never runs the ring
 * still shows. Failing toward more accessibility, not less.
 */

const ROOT_ATTR = 'data-input';

export function trackInputModality(doc: Document = document): () => void {
  const set = (mode: 'keyboard' | 'pointer') => {
    doc.documentElement.setAttribute(ROOT_ATTR, mode);
  };

  // Only navigation keys count. Typing into a field is not a reason to start
  // drawing focus rings around everything.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End') {
      set('keyboard');
    }
  };
  const onPointerDown = () => set('pointer');

  doc.addEventListener('keydown', onKeyDown, true);
  doc.addEventListener('pointerdown', onPointerDown, true);

  return () => {
    doc.removeEventListener('keydown', onKeyDown, true);
    doc.removeEventListener('pointerdown', onPointerDown, true);
  };
}
