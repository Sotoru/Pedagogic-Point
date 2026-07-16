import { defineRecipe } from "@pandacss/dev";

// design.md tag: 10%-opacity accent background + full-saturation accent text.
// color-mix reads the live --colors-<accent> var, so the tint follows dark mode
// for free. `categoria` is set at runtime, so all variants are forced in staticCss.
const accent = (t: string) => ({
  color: t,
  backgroundColor: `color-mix(in srgb, {colors.${t}} 10%, transparent)`,
});

export const categoryTag = defineRecipe({
  className: "categoryTag",
  base: {
    textStyle: "label-caps",
    display: "inline-block",
    // Radius: full capsule (ADR 0006) — supersedes design.md's rounded-xl 24px.
    borderRadius: "full",
    paddingInline: "2.5",
    paddingBlock: "1",
    // label-caps is uppercase+tracked by design; the mockup tags are not.
    textTransform: "none",
    letterSpacing: "normal",
  },
  variants: {
    categoria: {
      secondary: accent("secondary"),
      pedagogy: accent("pedagogy"),
      theory: accent("theory"),
      practice: accent("practice"),
      rights: accent("rights"),
    },
  },
});
