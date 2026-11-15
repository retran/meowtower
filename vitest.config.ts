import { defineConfig } from "vitest/config";

// The default of 5 s per test fails the heavy template tests when the files run in parallel on a
// busy machine; alone the slowest takes under 2 s.
//
// Some tests measure time, or run a long job against a limit: the answer latency over 1,000 answers,
// the wait of an append beside a rebuild, a recompute at start-up, and the kill of a process a hundred
// times. Each passes alone in seconds and fails when it shares the machine with fifteen other workers,
// so they run one file at a time, after the parallel group has finished. Their limits are the ones the
// requirements give; only the company they run in changes.
const TIMED = [
  "tests/unit/answer-route.test.ts",
  "tests/integration/rebuild.test.ts",
  "tests/integration/version-change.test.ts",
  "tests/integration/explain-cache.test.ts",
  "tests/crash/crash.test.ts",
];

const include = ["tests/{unit,smoke,crash,integration}/**/*.test.ts"];

export default defineConfig({
  test: {
    globalSetup: ["tests/global-setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    projects: [
      {
        extends: true,
        test: {
          name: "parallel",
          include,
          exclude: [...TIMED, "**/node_modules/**"],
          sequence: { groupOrder: 1 },
        },
      },
      {
        extends: true,
        test: {
          name: "timed",
          include: TIMED,
          fileParallelism: false,
          sequence: { groupOrder: 2 },
        },
      },
    ],
  },
});
