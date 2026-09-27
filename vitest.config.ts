import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/{unit,smoke,crash,integration}/**/*.test.ts"] },
});
