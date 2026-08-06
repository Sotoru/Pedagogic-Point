import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

// Every story becomes a browser test, and the a11y addon's annotations turn each
// one into an axe run (see .storybook/vitest.setup.ts). Real chromium, because
// axe's colour-contrast rules need real computed styles.
//
// One project, `light`. A dark pass is a copy of this block with
// `initialGlobals: { theme: "dark" }` — the storybookTest option exists for
// exactly that. It is deliberately not here: check:contrast already walks every
// declared token pair in both schemes, so a dark axe run would re-cover ground a
// dependency-free script already owns, at the cost of doubling suite time. The
// dark scheme is still asserted live by the Foundations stories, which pin the
// global per story. See ADR 0012.
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [
          await storybookTest({
            configDir: ".storybook",
            storybookScript: "npm run storybook -- --ci",
          }),
        ],
        test: {
          name: "storybook",
          // No setupFiles: since Storybook 10.3 the addon provisions the preview
          // annotations itself, and a setup file calling setProjectAnnotations
          // makes it skip that — taking over a job it does correctly.
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
