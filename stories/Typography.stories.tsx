import preview from "../.storybook/preview";
import { textStyles } from "@/theme/tokens.gen";
import { css } from "@/styled-system/css";

// Every named type style design.md declares, rendered at its real size with its
// declared values beside it. Generated from theme/tokens.gen.ts by iteration, not
// listed by hand: a hand-written list is a second source of truth that goes stale
// the first time design.md gains a style (ADR 0004, ADR 0012).
//
// This is also why panda.config forces `textStyle: ["*"]` in staticCss — the name
// here is a runtime value, and Panda only extracts literals. npm run check:tokens
// fails if a declared style has no class, which is the guard that keeps this sheet
// from silently rendering half of its rows in the inherited body font.

type StyleName = keyof typeof textStyles;

const NAMES = Object.keys(textStyles) as StyleName[];

// design.md names families; panda.config maps them onto font tokens. Reverse that
// for display, so a reader sees "Montserrat" rather than "{fonts.montserrat}".
const FAMILY: Record<string, string> = {
  "{fonts.montserrat}": "Montserrat",
  "{fonts.inter}": "Inter",
  "{fonts.script}": "Great Vibes + Montez",
};

// One phrase for every row, so the rows compare. Italian, because the type has to
// survive the accents it will actually carry.
const SPECIMEN = "Pedagogia, con garbo";

const row = css({
  display: "grid",
  gap: "3",
  gridTemplateColumns: { base: "1fr", lg: "220px 1fr" },
  alignItems: "baseline",
  paddingBlock: "6",
  borderTop: "1px solid",
  borderColor: "border-subtle",
});

const specs = (name: StyleName) => {
  const v = textStyles[name].value as Record<string, string>;
  return [
    FAMILY[v.fontFamily] ?? v.fontFamily,
    v.fontSize,
    v.fontWeight && `w${v.fontWeight}`,
    v.lineHeight && `lh ${v.lineHeight}`,
    v.letterSpacing && `ls ${v.letterSpacing}`,
    v.fontStyle,
    v.textAlign && `align ${v.textAlign}`,
  ].filter(Boolean);
};

function TypographySheet() {
  return (
    <div
      className={css({
        marginInline: "auto",
        maxWidth: "content-max",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: "12",
      })}
    >
      <h2 className={css({ textStyle: "headline-md", color: "primary" })}>Typography</h2>
      <p className={css({ textStyle: "body-md", color: "muted", marginTop: "3" })}>
        {NAMES.length} stili nominati, generati da <code>docs/design.md</code>. Il nome è la chiave da
        passare a <code>css({"{ textStyle }"})</code>.
      </p>

      <ul className={css({ marginTop: "8", listStyleType: "none" })}>
        {NAMES.map((name) => (
          <li key={name} className={row}>
            <div>
              <div className={css({ textStyle: "label-caps", color: "primary" })}>{name}</div>
              <div className={css({ fontSize: "12px", lineHeight: "1.6", color: "muted", marginTop: "2" })}>
                {specs(name).join(" · ")}
              </div>
            </div>
            {/* The style under test, applied by name. */}
            <p className={css({ textStyle: name, color: "on-surface", overflowWrap: "anywhere" })}>{SPECIMEN}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const meta = preview.meta({
  title: "Foundations/Typography",
  component: TypographySheet,
});

export const Light = meta.story({});

// The dark pass. The suite otherwise runs light only — check:contrast already
// walks every declared token pair in both schemes — so these two Foundations
// stories are where axe sees the dark scheme on real DOM. See ADR 0012.
export const Dark = meta.story({
  globals: { theme: "dark" },
});
