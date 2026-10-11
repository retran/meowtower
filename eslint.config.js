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
  {
    // A task is computed from its seed alone (REQ-1216), so the folders that
    // compute, render and check it import no model gateway and no network.
    files: [
      "src/math/**/*.ts",
      "src/templates/**/*.ts",
      "src/render/**/*.ts",
      "src/shared/answer.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            "node:http",
            "node:https",
            "node:http2",
            "node:net",
            "node:tls",
            "node:dns",
            "node:dgram",
            "undici",
          ].map((name) => ({
            name,
            message:
              "A task is computed from its seed alone; no network module here (REQ-1216).",
          })),
          patterns: [
            {
              group: ["**/gateway", "**/gateway/*"],
              message:
                "The model gateway never computes a number or an answer (REQ-1216).",
            },
          ],
        },
      ],
    },
  },
);
