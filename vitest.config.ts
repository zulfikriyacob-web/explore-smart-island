import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      // SPEC section 10.2 requires >= 90% line coverage on the scoring and
      // mastery modules. The session reducer is held to the same bar because a
      // bug there silently corrupts every score it feeds.
      include: ['src/lib/**/*.ts', 'src/features/quiz/session.ts'],
      // TEMPORARY — the iOS audio diagnostics are throwaway instrumentation for
      // one bug hunt, not logic anyone depends on. Holding them to the scoring
      // bar would mean writing tests for a file due to be deleted. Delete this
      // line with the branch.
      exclude: ['src/lib/diagnostics.ts'],
      thresholds: {
        lines: 90,
        statements: 90,
        branches: 90,
        functions: 90,
      },
    },
  },
});
