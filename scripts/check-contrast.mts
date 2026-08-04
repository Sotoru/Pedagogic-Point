// WCAG contrast guard for the design tokens (run: npm run check:contrast).
//
// Why this exists alongside npm run check:a11y: axe measures what is on screen
// during a crawl, so it only sees the combinations the current data happens to
// render. When this script was written, `practice` was mapped by no article at
// all and `pedagogy` by two out of 74 — their tags failed at 2.23:1 and 2.69:1
// and an axe run would have called the site clean. This checks every declared
// pair instead, whether or not the DB currently produces it. See ADR 0011.
//
// Thresholds: 4.5 for normal text (WCAG 1.4.3 AA — the tags are 12px, the meta
// row 13px, so nothing here qualifies as "large"), 3.0 for non-text UI (1.4.11).
import assert from "node:assert";
import { semanticTokens } from "../theme/tokens.gen.ts";
import { TAG_INK, type TagAccent } from "../theme/recipes/category-tag.ts";

type Scheme = "base" | "_dark";
const colors = semanticTokens.colors as Record<string, { value: { base: string; _dark?: string } }>;

const hex = (name: string, scheme: Scheme): string => {
  const v = colors[name]?.value;
  assert(v, `unknown colour token: ${name}`);
  return (scheme === "_dark" ? v._dark : v.base) ?? v.base;
};

const rgb = (h: string): [number, number, number] => {
  let s = h.replace("#", "");
  if (s.length === 3) s = [...s].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)) as [number, number, number];
};

// WCAG relative luminance.
const lum = (h: string): number => {
  const [r, g, b] = rgb(h)
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a: string, b: string): number => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// srgb color-mix(a p%, b) — the same operation the browser performs for the tag
// tint and ink, so the numbers here are the ones that ship.
const mix = (a: string, b: string, p: number): string => {
  const [x, y] = [rgb(a), rgb(b)];
  return "#" + x.map((v, i) => Math.round(v * p + y[i] * (1 - p)).toString(16).padStart(2, "0")).join("");
};

// Elevation fill inlined in PerlaPedagogica (not a design.md token — it is that
// component's dark elevation), included because real text sits on it.
const CARD_FILL: Record<Scheme, string> = { base: hex("surface", "base"), _dark: "#26292e" };

// Foreground/background token pairs the app actually renders, with the threshold
// that applies. There is no way to derive this list from the tokens themselves —
// only the components know which pairs exist, which is why it is written out.
const PAIRS: Array<[fg: string, bg: string, min: number, note: string]> = [
  ["on-surface", "background", 4.5, "body copy"],
  ["on-surface", "surface-container", 4.5, "body copy on the tinted band"],
  ["muted", "background", 4.5, "meta row, footer, filter caption"],
  ["muted", "surface", 4.5, "card excerpt"],
  ["muted", "surface-container", 4.5, "muted text on the tinted band"],
  ["primary", "background", 4.5, "headlines and links"],
  ["primary", "surface-container", 4.5, "headlines on the tinted band"],
  ["on-surface-variant", "background", 3.0, "theme toggle icon (UI, not text)"],
  ["error", "surface", 4.5, "form errors"],
  ["secondary", "background", 4.5, "interactive blue"],
  ["surface", "primary", 4.5, "filled button label"],
  ["on-primary", "primary", 4.5, "button label on hover fill"],
  ["primary", "background", 3.0, "focus ring against the page"],
  ["primary", "surface-container", 3.0, "focus ring against the tinted band"],
];

const failures: string[] = [];
const check = (got: number, min: number, label: string) => {
  const ok = got >= min;
  if (!ok) failures.push(`${got.toFixed(2)} < ${min.toFixed(1)}  ${label}`);
  return ok;
};

for (const scheme of ["base", "_dark"] as Scheme[]) {
  const theme = scheme === "base" ? "light" : "dark";

  for (const [fg, bg, min, note] of PAIRS) {
    check(ratio(hex(fg, scheme), hex(bg, scheme)), min, `${theme}: ${fg} on ${bg} (${note})`);
  }

  // Tags: accent ink at its TAG_INK strength, on a 10% tint of the same accent
  // over each surface a tag can appear on.
  for (const accent of Object.keys(TAG_INK) as TagAccent[]) {
    const pure = hex(accent, scheme);
    const p = TAG_INK[accent];
    // Only light mode mixes the ink toward on-surface; dark keeps the pure accent.
    const ink = scheme === "base" && p < 100 ? mix(pure, hex("on-surface", scheme), p / 100) : pure;
    for (const [bgLabel, bgHex] of [
      ["background", hex("background", scheme)],
      ["surface-container", hex("surface-container", scheme)],
      ["the perla card", CARD_FILL[scheme]],
    ] as Array<[string, string]>) {
      check(ratio(ink, mix(pure, bgHex, 0.1)), 4.5, `${theme}: ${accent} tag on ${bgLabel}`);
    }
  }
}

if (failures.length) {
  console.error(`✗ ${failures.length} contrast failure(s):\n  ` + failures.join("\n  "));
  process.exit(1);
}
console.log(`contrast ok (${(PAIRS.length + Object.keys(TAG_INK).length * 3) * 2} pairs, light + dark)`);
