import { QuizScreen } from './features/quiz/QuizScreen.tsx';
import { SummaryScreen } from './features/quiz/SummaryScreen.tsx';
import { useQuizStore } from './features/quiz/store.ts';

/**
 * One activity, opened directly. No island map, no topic list, no login — those
 * are out of scope for Brief 02.
 */
export function App() {
  const session = useQuizStore((s) => s.session);

  if (session.status === 'summary' && session.result) {
    return <SummaryScreen result={session.result} />;
  }
  return <QuizScreen />;
}
