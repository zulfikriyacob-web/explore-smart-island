import { useCallback, useEffect, useState } from 'react';

import { promptPlayer } from './lib/player.ts';
import { QuizScreen } from './features/quiz/QuizScreen.tsx';
import { StartScreen } from './features/quiz/StartScreen.tsx';
import { SummaryScreen } from './features/quiz/SummaryScreen.tsx';
import { useQuizStore } from './features/quiz/store.ts';

/**
 * One activity, opened directly. No island map, no topic list, no login — those
 * are out of scope for Brief 02.
 */
export function App() {
  const session = useQuizStore((s) => s.session);

  /*
    The start screen outlives its own press.

    A control that unmounts itself inside its own event handler cancels the rest
    of that gesture for every listener above it: an event dispatched on a
    detached node does not propagate, so `document` never sees it. Measured on
    the Mula button — `onPointerDown` dispatched START, React 18 flushed that
    discrete update in a microtask, and the button was `isConnected: false`
    before the browser dispatched `touchstart`. Howler registers its iOS unlock
    on `document`, in capture phase, for touchstart/touchend/click/keydown and
    for no pointer event, so the first gesture of the session never reached it,
    the AudioContext was never unlocked, and a cold press of Mula was silent on
    the iPhone. `click` was not dispatched at all: a click needs a target still
    in the tree.

    START still goes out on `pointerdown` — press latency on a seven-year-old's
    tap is why it is there — and the screen it came from stays mounted until the
    gesture that pressed it is over. This is a layout change, not a timing
    change; nothing here waits on a promise, a frame or a clock to decide what
    the child sees. (docs/HANDOFF.md section 1, CLAUDE.md "Controls that unmount
    themselves".)
  */
  const [holdingGesture, setHoldingGesture] = useState(false);
  const holdForGesture = useCallback(() => setHoldingGesture(true), []);

  const atIntro = session.status === 'intro';
  const showStart = atIntro || holdingGesture;

  useEffect(() => {
    if (!holdingGesture) return;
    const release = () => setHoldingGesture(false);
    /*
      Bubble phase on `window`, which is the last listener to run for an event —
      so Howler's capture-phase handler on `document` has already had it before
      the button can go away. A capture-phase release here would run *before*
      Howler and put the bug straight back.

      `click` is the normal end of a tap. A finger that slides off the button
      ends on `touchend` with no click at all, and a gesture the browser takes
      over ends on a cancel, so the timeout is the one that always fires. It is a
      backstop rather than the mechanism: `touchstart` follows `pointerdown`
      within a millisecond or two and is by itself enough for Howler's unlock, so
      releasing late costs nothing and releasing early costs nothing either.
    */
    window.addEventListener('click', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('touchcancel', release);
    const timer = window.setTimeout(release, 1000);
    return () => {
      window.removeEventListener('click', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('touchcancel', release);
      window.clearTimeout(timer);
    };
  }, [holdingGesture]);

  /*
    A restored session comes back at `question`, not `intro` (Brief 03), so it
    never passes the Mula button — and without that gesture iOS would refuse
    every clip for the rest of the run, including the replay button the child
    presses on purpose. So for that path, the first touch anywhere counts.

    **Not while the start screen is up.** This listener is capture-phase on
    `window`, so it ran a few milliseconds before the Mula button's own handler
    and took the gesture with it — measured on the iPhone: `unlock()` at 2641ms
    with `alreadyGestured:false`, then the press at 2646ms with
    `alreadyGestured:true`. The button's handler was then the one call stack iOS
    would have honoured, and it was the one that did nothing. The button needs
    its own gesture, so this stays out of its way and arms only once the start
    screen is gone.
  */
  useEffect(() => {
    if (showStart) return;
    const unlock = () => promptPlayer.unlock();
    const opts = { once: true, capture: true } as const;
    window.addEventListener('pointerdown', unlock, opts);
    window.addEventListener('keydown', unlock, opts);
    return () => {
      window.removeEventListener('pointerdown', unlock, opts);
      window.removeEventListener('keydown', unlock, opts);
    };
  }, [showStart]);

  if (showStart) return <StartScreen holdForGesture={holdForGesture} />;
  if (session.status === 'summary' && session.result) {
    return <SummaryScreen result={session.result} />;
  }
  return <QuizScreen />;
}
