import { defineConfig } from "@pandacss/dev";
import { tokens, semanticTokens, textStyles } from "./theme/tokens.gen";
import { categoryTag, button, articleCard, articleGrid } from "./theme/recipes";

export default defineConfig({
  preflight: true,
  jsxFramework: "react",
  include: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  exclude: [],
  // Class-based theming: the layout pre-paint script sets .dark/.light on <html>.
  conditions: {
    extend: {
      dark: ".dark &",
      light: ".light &",
    },
  },
  theme: {
    extend: {
      tokens: {
        ...tokens,
        // next/font vars (app-specific, not in design.md); design.md names the family.
        fonts: {
          montserrat: { value: "var(--font-montserrat), system-ui, sans-serif" },
          inter: { value: "var(--font-inter), system-ui, sans-serif" },
          script: { value: "var(--font-great-vibes), var(--font-montez), cursive" },
        },
      },
      semanticTokens,
      textStyles,
      recipes: { categoryTag, button },
      slotRecipes: { articleCard, articleGrid },
    },
  },
  // Base surface + text, bound to design.md tokens (was app/globals.css body).
  globalCss: {
    "html, body": { overflowX: "hidden" },
    // Keyboard focus in the design system's own ink instead of each browser's
    // default ring — the admin forms already did this inline. primary sits at
    // 12.58–17.52 against every surface in both schemes, well past the 3:1 WCAG
    // asks of a focus indicator (verified by npm run check:contrast).
    "*:focus-visible": { outline: "2px solid", outlineColor: "primary", outlineOffset: "2px" },
    body: {
      backgroundColor: "background",
      color: "on-surface",
      fontFamily: "inter",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
  // categoria is chosen at runtime → emit every accent variant.
  staticCss: {
    recipes: { categoryTag: ["*"] },
    // Every textStyle, because two consumers pick the name at runtime and Panda
    // can only extract literals. `Wordmark` takes `variant` as a prop, so
    // `brand-wordmark-sm` (passed from Footer) was never emitted at all and the
    // footer wordmark rendered at the inherited size instead of 32px; the
    // Foundations sheet iterates every name by definition. Guarded by
    // npm run check:tokens, which fails if a declared textStyle has no class.
    css: [{ properties: { textStyle: ["*"] } }],
  },
  // panda.config imports these, so editing design.md or a recipe should rebuild
  // the CSS without restarting the dev server / Storybook.
  dependencies: ["theme/**/*.ts"],
  outdir: "styled-system",
});
