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
);
