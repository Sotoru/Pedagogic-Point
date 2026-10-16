import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  // Their own folder, not colocated: components/ holds components only, and the
  // Foundations sheets are not components at all. The cost is that Panda no
  // longer sweeps them up for free — `./stories/**/*.{ts,tsx}` is in
  // panda.config's `include` for that reason, and without it the sheets emit no
  // classes and render unstyled.
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest", "@storybook/addon-mcp"],
  // Cover images resolve to public/ instead of Unsplash, so the suite doesn't
  // depend on the network for pixels.
  staticDirs: ["../public"],
};

export default config;
