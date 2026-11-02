import { definePreview } from "@storybook/nextjs-vite";
import a11y from "@storybook/addon-a11y";
import { sb } from "storybook/test";
import "../app/globals.css";
import { fontVariables } from "../app/fonts";
import { WCAG_TAGS } from "../scripts/a11y-tags.mjs";

// app/actions.ts is "use server" and reaches lib/data → lib/db →
// @neondatabase/serverless. Mocking the module is not a convenience: it is what
// keeps the database client out of the story bundle. The mock lives at
// app/__mocks__/actions.ts and returns fixtures, so the "Carica altri" and
// perla-refresh interactions have something to append.
sb.mock(import("../app/actions.ts"));

const THEMES = [
  { value: "system", title: "Sistema" },
  { value: "light", title: "Chiaro" },
  { value: "dark", title: "Scuro" },
];

export default definePreview({
  // Not decoration: this is what types the preview. `definePreview` infers the
  // parameter and globals shape from the addons array, and with the array absent
  // the whole generic chain collapses to `never` — every `args`, `parameters` and
  // `globals` in every story file then fails to typecheck.
  addons: [a11y()],
  globalTypes: {
    theme: {
      description: "Tema della vetrina",
      toolbar: { title: "Tema", icon: "contrast", items: THEMES, dynamicTitle: true },
    },
  },
  // `system` follows prefers-color-scheme, which is what lets the Vitest suite
  // run every story once per scheme without a dark copy of each story.
  initialGlobals: { theme: "system" },
  decorators: [
    (Story, { globals }) => {
      // Both the scheme class and the font vars go on <html>, where the app's
      // pre-paint script puts them. Panda scopes the dark tokens to `.dark`
      // itself, and `body`'s own background/font declarations resolve against
      // that element — a wrapper div would leave the page surface unthemed and
      // the base font falling back to system-ui.
      const root = document.documentElement;
      const dark =
        globals.theme === "dark" ||
        (globals.theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.remove("light", "dark");
      root.classList.add(dark ? "dark" : "light");
      root.classList.add(...fontVariables);
      // Gallery thumbnails are pictures, not controls.
      root.inert = window.frameElement?.hasAttribute("data-story-thumbnail") ?? false;
      return <Story />;
    },
  ],
  parameters: {
    // Every route in this project is App Router, so next/navigation's mocks are
    // wanted everywhere rather than per story — Dropdown's useRouter would
    // throw otherwise.
    nextjs: { appDirectory: true },
    options: {
      storySort: {
        order: [
          "Panoramica",
          "Esplora",
          "Componenti",
          ["Articoli", "Perla pedagogica", "Navigazione", "Amministrazione"],
          "UI",
          "Fondamenti",
        ],
        method: "alphabetical",
      },
    },
    a11y: {
      // Violations keep every node; passes keep one example, so the test panel
      // and the MCP don't carry hundreds of positive copies.
      options: { runOnly: WCAG_TAGS, resultTypes: ["violations", "incomplete"] },
      // Violations fail `npm run check:stories`, not just the addon panel.
      test: "error",
    },
  },
});
