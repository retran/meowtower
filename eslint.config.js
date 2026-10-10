import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "node_modules/",
      "design/",
      "data/",
      "test-results/",
      "playwright-report/",
    ],
  },
  ...tseslint.configs.strict,
  {
    // A task rebuilds from its seed (REQ-1202), so `src/` draws only from the
    // seeded source in `src/math/rng.ts`.
    files: ["src/**/*.ts"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message:
            "Draw from the seeded source in src/math/rng.ts; a task must rebuild from its seed.",
        },
      ],
    },
  },
);
