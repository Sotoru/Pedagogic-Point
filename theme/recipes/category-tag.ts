import { defineRecipe } from "@pandacss/dev";

export const TAG_INK = {
  secondary: 100,
  pedagogy: 60,
  theory: 100,
  practice: 55,
  rights: 80,
} as const;

export type TagAccent = keyof typeof TAG_INK;

// design.md tag: 10%-opacity accent background + accent text. color-mix reads the
// live --colors-<accent> var, so both tint and ink follow dark mode for free.
// `categoria` is set at runtime, so all variants are forced in staticCss.
const accent = (t: TagAccent) => {
  const p = TAG_INK[t];
  return {
    color:
      p === 100
        ? t
        : { base: `color-mix(in srgb, {colors.${t}} ${p}%, {colors.on-surface})`, _dark: `{colors.${t}}` },
    backgroundColor: `color-mix(in srgb, {colors.${t}} 10%, transparent)`,
  };
};

export const categoryTag = defineRecipe({
  className: "categoryTag",
  base: {
    textStyle: "label-caps",
    display: "inline-block",
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
