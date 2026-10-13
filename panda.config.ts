import { defineConfig } from "@pandacss/dev";
import { tokens, semanticTokens, textStyles } from "./theme/tokens.gen";
import { categoryTag, button, articleCard, articleGrid } from "./theme/recipes";

export default defineConfig({
  preflight: true,
  // v2 no longer adds these implicitly; listing them keeps v1's utilities,
  // patterns (Flex, styled) and breakpoints.
  presets: ["@pandacss/preset-base", "@pandacss/preset-panda"],
  jsxFramework: "react",
  // stories/ is listed because the Foundations sheets and the icons sheet style
  // themselves with css() — extraction is what makes them render at all, not a
  // nicety. It stopped being implied when the stories left components/.
  include: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}"],
  exclude: [],
  // Class-based theming: the layout pre-paint script sets .dark/.light on <html>.
  conditions: {
    extend: {
      dark: ".dark &",
      light: ".light &",
      // Touch browsers fire :hover on tap and keep it until the next tap
      // elsewhere, leaving cards/buttons stuck in their hover state.
      hover: { "@media (hover: hover)": { "&:is(:hover, [data-hover])": "@slot" } },
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
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        fadeIn: { from: { opacity: 0 } },
        fadeUp: { from: { opacity: 0, transform: "translateY(8px)" } },
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
    // Press-scale stays (tiny, non-vestibular); spins, fades and the theme
    // cross-fade go. ThemeToggle also skips startViewTransition on its own.
    // Cover morph between card/hero and article page (see CoverTransition).
    "::view-transition-group(.morph)": { animationDuration: "400ms" },
    "@media (prefers-reduced-motion: reduce)": {
      "*, *::before, *::after": { animation: "none !important" },
      "::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)": {
        animation: "none !important",
      },
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
