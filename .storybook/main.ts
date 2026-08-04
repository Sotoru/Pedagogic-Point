import type { StorybookConfig } from "@storybook/nextjs-vite";

// Vite, not webpack: the Vitest addon only runs on a Vite builder, and this
// project has no webpack or babel customisation to preserve (next.config.ts
// carries images.remotePatterns and nothing else). See ADR 0012.
//
// Panda needs no wiring here — Vite loads the root postcss.config.mjs by itself,
// and preview.tsx imports app/globals.css, which is the file holding the @layer
// declaration the Panda PostCSS plugin expands.
const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  // Colocated with the components they document, which also means
  // `include: ["./components/**/*.{ts,tsx}"]` in panda.config already covers
  // them — Panda extracts story styles with no config change.
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  // Cover images resolve to public/ instead of Unsplash, so the suite doesn't
  // depend on the network for pixels.
  staticDirs: ["../public"],
};

export default config;
