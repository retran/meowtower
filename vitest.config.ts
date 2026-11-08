import { defineConfig } from "vitest/config";

// The default of 5 s per test fails the heavy template tests when the files run in parallel on a
// busy machine; alone the slowest takes under 2 s.
export default defineConfig({
  test: {
    include: ["tests/{unit,smoke,crash,integration}/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
