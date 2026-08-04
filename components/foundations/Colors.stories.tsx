import preview from "../../.storybook/preview";
import { semanticTokens, colorAliases } from "@/theme/tokens.gen";
import { token } from "@/styled-system/tokens";
import { categoryAccent, CATEGORIE } from "@/app/content";
import { CategoryTag } from "../CategoryTag";
import { css } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";

// The whole colour system in one view, generated from theme/tokens.gen.ts.
//
// The split that matters, and that no other view in the project shows: design.md
// declares 13 unique colours and 8 role names pointing at them. `colorAliases`
// carries that structure through the DTCG transform, which otherwise resolves
// references away and leaves 21 apparently-independent colours (ADR 0004).
//
// Each row shows a live swatch — a CSS var, so it follows the active scheme — plus
// both declared hex values as text, because the point of a palette sheet is to
// compare light against dark and a themed swatch can only ever show one of them.

const colors = semanticTokens.colors as Record<string, { value: { base: string; _dark?: string } }>;
const NAMES = Object.keys(colors);
const CANONICI = NAMES.filter((n) => !colorAliases[n as keyof typeof colorAliases]);
const ALIAS = NAMES.filter((n) => colorAliases[n as keyof typeof colorAliases]);

// token.var's parameter type is the union of token paths; the name is a runtime
// value here, so it needs the one cast. Using the API rather than interpolating
// `--colors-${name}` by hand keeps Panda's var naming Panda's business.
const cssVar = (name: string) => token.var(`colors.${name}` as Parameters<typeof token.var>[0]);

const hex = css({ fontSize: "12px", lineHeight: "1.6", color: "muted" });

function Swatch({ name }: { name: string }) {
  return (
    <div
      // Every swatch is bordered: `surface` against `background` is the same
      // colour by definition, so an unbordered chip would simply vanish.
      className={css({
        width: "14",
        height: "14",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "border-subtle",
        flexShrink: 0,
      })}
      style={{ backgroundColor: cssVar(name) }}
    />
  );
}

function Row({ name }: { name: string }) {
  const { base, _dark } = colors[name].value;
  const alias = colorAliases[name as keyof typeof colorAliases];
  return (
    <li
      className={css({
        display: "grid",
        gap: "4",
        gridTemplateColumns: { base: "auto 1fr", sm: "auto 1fr auto" },
        alignItems: "center",
        paddingBlock: "4",
        borderTop: "1px solid",
        borderColor: "border-subtle",
      })}
    >
      <Swatch name={name} />
      <div>
        <div className={css({ textStyle: "label-caps", color: "primary" })}>{name}</div>
        {alias && (
          <div className={hex}>
            alias di <code>{alias}</code>
          </div>
        )}
      </div>
      <div className={hex}>
        <div>light {base}</div>
        {/* on-dark has no dark counterpart: it is the inverse ink, the same in
            both schemes. on-primary is the opposite case — declared as an alias
            of on-dark, but with its own dark value, because primary flips light. */}
        <div>{_dark ? `dark ${_dark}` : "dark —— (nessuna controparte)"}</div>
      </div>
    </li>
  );
}

const list = css({ marginTop: "5", listStyleType: "none" });

function ColorSheet() {
  return (
    <div
      className={css({
        marginInline: "auto",
        maxWidth: "content-max",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: "12",
      })}
    >
      <h2 className={css({ textStyle: "headline-md", color: "primary" })}>Color system</h2>
      <p className={css({ textStyle: "body-md", color: "muted", marginTop: "3" })}>
        {CANONICI.length} colori canonici e {ALIAS.length} alias di ruolo, generati da{" "}
        <code>docs/design.md</code>. Lo swatch segue lo schema attivo; gli hex sono i valori dichiarati.
      </p>

      <h3 className={css({ textStyle: "headline-sm", color: "primary", marginTop: "10" })}>Canonici</h3>
      <p className={css({ textStyle: "body-md", color: "muted", marginTop: "2" })}>
        Gli unici colori del sistema. Tutto il resto punta qui.
      </p>
      <ul className={list}>
        {CANONICI.map((n) => (
          <Row key={n} name={n} />
        ))}
      </ul>

      <h3 className={css({ textStyle: "headline-sm", color: "primary", marginTop: "10" })}>Alias di ruolo</h3>
      <p className={css({ textStyle: "body-md", color: "muted", marginTop: "2" })}>
        Nomi di ruolo: non aggiungono colore, dicono a cosa serve un colore.
      </p>
      <ul className={list}>
        {ALIAS.map((n) => (
          <Row key={n} name={n} />
        ))}
      </ul>

      <h3 className={css({ textStyle: "headline-sm", color: "primary", marginTop: "10" })}>Categoria → accento</h3>
      <p className={css({ textStyle: "body-md", color: "muted", marginTop: "2" })}>
        Le Categorie sono contenuto, non design token: ognuna rende in uno dei cinque accenti sanciti, e più
        Categorie possono condividerne uno.
      </p>
      <ul className={list}>
        {CATEGORIE.map((c) => (
          <li
            key={c}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "4",
              paddingBlock: "4",
              borderTop: "1px solid",
              borderColor: "border-subtle",
            })}
          >
            <Flex align="center" gap="3" minWidth="260px">
              <Swatch name={categoryAccent[c]} />
              <span className={css({ textStyle: "label-caps", color: "primary" })}>{categoryAccent[c]}</span>
            </Flex>
            {/* The tag as it really renders: a 10% tint of the accent, with the ink
                mixed toward on-surface in light mode only (TAG_INK, ADR 0011). */}
            <CategoryTag categoria={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const meta = preview.meta({
  title: "Foundations/Colors",
  component: ColorSheet,
});

export const Light = meta.story({});

// The dark pass, and the one place axe sees the dark scheme live: the suite runs
// light only because check:contrast already walks every declared pair in both
// schemes. Here it sees all 21 tokens and all five tags at once. See ADR 0012.
export const Dark = meta.story({
  globals: { theme: "dark" },
});
