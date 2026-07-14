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
