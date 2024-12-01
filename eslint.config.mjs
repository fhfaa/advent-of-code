// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [ '*.js' ]
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-useless-escape": "off",
        "no-fallthrough": "off",
        "no-undef": "off",
    }
  }
);