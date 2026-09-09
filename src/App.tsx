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

  /*
    A restored session comes back at `question`, not `intro` (Brief 03), so it
    never passes the Mula button — and without that gesture iOS would refuse
    every clip for the rest of the run, including the replay button the child
    presses on purpose.

    So the first touch anywhere counts. It is capture-phase and `once`, so it
    runs before the button underneath it and then removes itself; it does not
    play anything, it only records that a gesture happened. The prompt already
    on screen stays silent, which is the decision: after a restore the first tap
    is usually an answer, and reading the question aloud once it is answered is
    worse than saying nothing.
  */
  useEffect(() => {
    if (promptPlayer.unlocked()) return;
    const unlock = () => promptPlayer.unlock();
    const opts = { once: true, capture: true } as const;
    window.addEventListener('pointerdown', unlock, opts);
    window.addEventListener('keydown', unlock, opts);
    return () => {
      window.removeEventListener('pointerdown', unlock, opts);
      window.removeEventListener('keydown', unlock, opts);
    };
  }, []);

  if (session.status === 'intro') return <StartScreen />;
  if (session.status === 'summary' && session.result) {
    return <SummaryScreen result={session.result} />;
  }
  return <QuizScreen />;
}
