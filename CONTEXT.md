# PedagogicPoint

An editorial hub for pedagogical content: a home page presenting a featured
article (hero), a highlighted quote, and a grid of latest articles, each tagged
by category.

## Language

**Article**:
A single piece of pedagogical content. Has a title, excerpt, category, cover
image, and reading time. Appears in the hero (one featured) or the article grid.

**Category**:
An open-ended, author-assigned label grouping articles by pedagogical domain
(e.g. `apprendimento`, `curiosità`, `crescita personale`, `community`,
`tutela diritti umani`). Categories are content, not design tokens — each maps
to exactly one of the sanctioned accent colors below.
_Avoid_: Tag (a Tag is the UI pill that renders a Category), domain.

**Accent color**:
One of the five sanctioned categorical color tokens a Category renders in:
`secondary` (blue), `pedagogy` (green), `theory` (purple), `practice` (orange),
`rights` (red). `rights` is a categorical red, distinct from the `error`
feedback red — `error` is never a category color. Multiple Categories may share
one accent color.

**Category → accent mapping** (current content):
| Category | Accent token |
|---|---|
| apprendimento | `secondary` (blue) |
| community | `pedagogy` (green) |
| crescita personale | `theory` (purple) |
| curiosità | `practice` (orange) |
| tutela diritti umani | `rights` (red) |

**Perla Pedagogica**:
The single highlighted pull-quote featured between the hero and the article
grid. Renders in the `quote` typography with a `theory` category pill. Exactly
one is shown on the home page.
_Avoid_: Quote card, pearl.

**Reading time**:
An article's estimated read duration, shown as an icon + `label-caps` meta text
(e.g. "5 min read", "3 min").

## Styling (Panda, bound to design.md — see ADR 0004)

**Generated token preset** (`theme/tokens.gen.ts`):
The Panda tokens/semanticTokens/textStyles compiled from `docs/design.md` by
`scripts/dtcg-to-panda.mjs`. Generated and git-ignored — never hand-edit it;
change `docs/design.md` and re-run `npm run tokens`.
_Avoid_: theme file (that was the Tailwind-era `app/theme.css`, now removed).

**`dark-` convention**:
Dark-scheme colours in `docs/design.md`, named `dark-<token>` (e.g.
`dark-surface`). The transform pairs each with its base token into a semantic
`{ base, _dark }`; a `dark-*` colour is never used directly. Applied under the
class-based `.dark` condition.

**textStyle**:
A named typography style from design.md (`display-lg`, `body-lg`, `quote`, …),
applied as `css({ textStyle: '…' })`. Replaces the old `.type-*` classes.

**Recipe**:
A centralized multi-variant component style in `panda.config.ts`. Two exist:
`categoryTag` (variant per accent) and `button` (outline variant). One-off
styling uses `css()`; layout uses the `flex`/`grid` patterns.
