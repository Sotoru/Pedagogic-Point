import { defineRecipe } from "@pandacss/dev";

// Light-mode ink strength per accent, as a percentage of the accent mixed toward
// on-surface. The tag is 12px — normal text — so its ink must clear 4.5:1 against
// its own 10% tint. At full saturation pedagogy (2.69), practice (2.23) and
// rights (3.72) did not; these percentages are the least darkening that does
// (4.85 / 4.71 / 4.56). secondary and theory already pass, so they stay at 100.
//
// The accents themselves are untouched: darkening rights far enough would have
// landed it next to error #ba1a1a, which is exactly what ADR 0001 created it to
// avoid. Dark mode passes at full saturation, so it keeps the pure accent.
// Exported because scripts/check-contrast.mts reads these same numbers — one
// source of truth for the ratios it verifies. See ADR 0011.
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
