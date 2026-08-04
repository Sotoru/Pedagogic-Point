// Bind design.md → Panda. Reads a DTCG export on stdin (colors/typography/
// spacing/rounded) and the design.md path on argv[2] for the bits DTCG v0.3
// drops: the `shadows:` block and per-typography `fontStyle`/`textAlign`.
// Emits a TS module of Panda tokens/semanticTokens/textStyles. design.md stays
// the single source of truth; this file is generated, never hand-edited.
//
//   design.md export docs/design.md --format dtcg | node scripts/dtcg-to-panda.mjs docs/design.md > theme/tokens.gen.ts
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

// next/font vars aren't in design.md (app-specific); design.md only names the
// family. Map each named family onto the Panda font token the config defines.
const FONT_TOKEN = {
  Montserrat: "montserrat",
  Inter: "inter",
  "Great Vibes, Montez": "script",
};

const dtcg = JSON.parse(readFileSync(0, "utf8"));
const designPath = process.argv[2];
if (!designPath) throw new Error("usage: dtcg-to-panda.mjs <path-to-design.md>");

// --- frontmatter (shadows + type props DTCG omits) ---
const raw = readFileSync(designPath, "utf8");
const fm = raw.match(/^---\n([\s\S]*?)\n---/);
if (!fm) throw new Error("no frontmatter in " + designPath);
const front = parseYaml(fm[1]);

const dim = (d) => `${d.value}${d.unit}`; // {value,unit} → "48px"
const keys = (o) => Object.keys(o).filter((k) => !k.startsWith("$"));

// --- colors → semanticTokens { base, _dark } ---
// Every non-`dark-` color becomes a semantic token; a matching `dark-<name>`
// supplies its _dark value. `dark-*` are consumed here, never exposed.
const color = dtcg.color;
const semColors = {};
for (const name of keys(color)) {
  if (name.startsWith("dark-")) continue;
  const base = color[name].$value.hex;
  const darkKey = color[`dark-${name}`];
  semColors[name] = { value: darkKey ? { base, _dark: darkKey.$value.hex } : { base } };
}

// --- which colors design.md declares as references rather than values ---
// The DTCG export resolves references away, so `semanticTokens` cannot tell a
// canonical colour from a role name pointing at one. That distinction is the
// shape of the palette — 13 unique colours behind 7 role aliases — and the
// Foundations sheet exists to show it, so it has to survive the transform.
// Read from the frontmatter for the same reason as shadows: DTCG drops it.
const colorAliases = {};
for (const [name, value] of Object.entries(front.colors ?? {})) {
  if (name.startsWith("dark-")) continue;
  const ref = typeof value === "string" && value.match(/^\{colors\.([^}]+)\}$/);
  if (ref) colorAliases[name] = ref[1];
}

// --- spacing/sizes (emit into both so maxW + padding/gap both resolve) ---
const spacing = {};
for (const k of keys(dtcg.spacing)) spacing[k] = { value: dim(dtcg.spacing[k].$value) };

// --- radii ---
const radii = {};
for (const k of keys(dtcg.rounded)) radii[k] = { value: dim(dtcg.rounded[k].$value) };

// --- shadows (from frontmatter; DTCG drops them) ---
const shadows = {};
for (const [k, v] of Object.entries(front.shadows ?? {})) shadows[k] = { value: v };

// --- textStyles (DTCG for the scale, frontmatter for fontStyle/textAlign) ---
const textStyles = {};
for (const name of keys(dtcg.typography)) {
  const v = dtcg.typography[name].$value;
  const token = FONT_TOKEN[v.fontFamily];
  if (!token) throw new Error(`unknown font family "${v.fontFamily}" for ${name} — add it to FONT_TOKEN`);
  const style = { fontFamily: `{fonts.${token}}` };
  if (v.fontSize) style.fontSize = dim(v.fontSize);
  if (v.fontWeight) style.fontWeight = String(v.fontWeight);
  if (v.lineHeight != null) style.lineHeight = `${v.lineHeight}px`; // DTCG drops the px unit
  if (v.letterSpacing) style.letterSpacing = dim(v.letterSpacing);
  // frontmatter-only props
  const fmType = front.typography?.[name] ?? {};
  if (fmType.fontStyle) style.fontStyle = fmType.fontStyle;
  if (fmType.textAlign) style.textAlign = fmType.textAlign;
  textStyles[name] = { value: style };
}

const banner = "// AUTO-GENERATED from docs/design.md by scripts/dtcg-to-panda.mjs. Do not edit.\n";
const j = (o) => JSON.stringify(o, null, 2);
process.stdout.write(
  banner +
    `export const tokens = ${j({ spacing, sizes: spacing, radii, shadows })};\n\n` +
    `export const semanticTokens = ${j({ colors: semColors })};\n\n` +
    `export const colorAliases = ${j(colorAliases)};\n\n` +
    `export const textStyles = ${j(textStyles)};\n`,
);
