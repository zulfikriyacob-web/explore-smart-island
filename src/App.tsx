import { useEffect } from 'react';

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

  const atIntro = session.status === 'intro';

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
    if (atIntro) return;
    const unlock = () => promptPlayer.unlock();
    const opts = { once: true, capture: true } as const;
    window.addEventListener('pointerdown', unlock, opts);
    window.addEventListener('keydown', unlock, opts);
    return () => {
      window.removeEventListener('pointerdown', unlock, opts);
      window.removeEventListener('keydown', unlock, opts);
    };
  }, [atIntro]);

  if (session.status === 'intro') return <StartScreen />;
  if (session.status === 'summary' && session.result) {
    return <SummaryScreen result={session.result} />;
  }
  return <QuizScreen />;
}
