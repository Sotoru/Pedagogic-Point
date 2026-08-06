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
  // Their own folder, not colocated: components/ holds components only, and the
  // Foundations sheets are not components at all. The cost is that Panda no
  // longer sweeps them up for free — `./stories/**/*.{ts,tsx}` is in
  // panda.config's `include` for that reason, and without it the sheets emit no
  // classes and render unstyled.
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  // Cover images resolve to public/ instead of Unsplash, so the suite doesn't
  // depend on the network for pixels.
  staticDirs: ["../public"],
};

export default config;
