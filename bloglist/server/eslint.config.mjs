import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.js"],
    plugins: { "@stylistic": stylistic },
    languageOptions: { sourceType: "commonjs", globals: globals.node },
    rules: {
      eqeqeq: "error",
      "@stylistic/indent": ["error", 2],
      "@stylistic/linebreak-style": "error",
      "@stylistic/quotes": "error",
      "@stylistic/semi": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/arrow-spacing": "error",
    },
  },
  { ignores: ["dist/**"] },
  eslintConfigPrettier,
]);
