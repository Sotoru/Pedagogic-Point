import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import a11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next enables only 6 of the ~35 jsx-a11y rules (the aria-* and
  // alt-text ones), so the checks that catch unlabelled controls, dead hrefs and
  // mouse-only handlers are off by default. Turn on the full recommended set as
  // errors: `npm run lint` is the gate release.sh runs, and it ignores warnings.
  // The plugin is already registered by the config above — only rules here.
  // Nothing a linter can see covers colour contrast: that's check:contrast.
  { files: ["app/**/*.tsx", "components/**/*.tsx"], rules: a11y.flatConfigs.recommended.rules },
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
]);

export default eslintConfig;
