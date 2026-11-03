import tseslint from "typescript-eslint";
import krieg from "./dist/eslint/index.js";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "site/**",
      "**/build/**",
      "**/.krieg/**",
      ".venv/**",
      ".cache/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,mjs}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  krieg.configs.recommended,
  krieg.configs.styles,
  {
    files: ["examples/vanilla-complete/**/*.krg.{ts,tsx}"],
    rules: {
      "krieg/allowed-imports": ["error", { packages: ["@krieg-examples/civ-civic-kit"] }],
    },
  },
  {
    files: ["examples/kaiserreich-complete/**/*.krg.{ts,tsx}"],
    rules: {
      "krieg/allowed-imports": ["error", { packages: ["@krieg-examples/srd-civic-kit"] }],
    },
  },
];
