import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "design/", "data/"] },
  ...tseslint.configs.strict,
);
