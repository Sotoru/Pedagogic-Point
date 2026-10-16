// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import a11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { files: ["app/**/*.tsx", "components/**/*.tsx", "stories/**/*.tsx"], rules: a11y.flatConfigs.recommended.rules },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated (gitignored) — never lint codegen output.
    "styled-system/**",
    "theme/tokens.gen.ts",
    // Storybook's build output: minified bundles, ~10k warnings and 391 errors
    // of pure noise that would break the release gate.
    "storybook-static/**",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
