import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

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
