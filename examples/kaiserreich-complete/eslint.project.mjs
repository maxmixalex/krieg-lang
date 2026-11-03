import krieg from "krieg-lang/eslint";

export default [
  { ignores: ["build/**", ".krieg/**", "node_modules/**"] },
  krieg.configs.recommended,
  krieg.configs.styles,
  {
    files: ["**/*.krg.ts", "**/*.krg.tsx"],
    rules: {
      "krieg/allowed-imports": ["error", { packages: ["@krieg-examples/srd-civic-kit"] }],
    },
  },
];
