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
  },
  outdir: "styled-system",
});
