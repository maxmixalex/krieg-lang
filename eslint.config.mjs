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
];
