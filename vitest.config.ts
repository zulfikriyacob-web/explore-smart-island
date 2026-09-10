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
      thresholds: {
        lines: 90,
        statements: 90,
        branches: 90,
        functions: 90,
      },
    },
  },
});
