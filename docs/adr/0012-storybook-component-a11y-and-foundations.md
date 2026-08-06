# Storybook: a third a11y runner, and the Foundations sheets

We added Storybook 10 (`@storybook/nextjs-vite`) with `addon-a11y` and the Vitest
addon, so every story is a browser test and every test is an axe run. Thirteen
components in `components/` are covered, plus two generated **Foundations** sheets
that render the whole type scale and the whole colour system. This ADR records why
a *third* accessibility mechanism earns its place next to the two ADR 0011 already
built, and the five things we deliberately did not do.

**Vite, not webpack.** The Vitest addon only runs on a Vite builder; with
`@storybook/nextjs` you must fall back to `@storybook/test-runner`, which brings
jest. `next.config.ts` carries `images.remotePatterns` and nothing else, so there
was no webpack or babel customisation to preserve.

**The division of labour.** Neither existing check is redundant, and neither
subsumes this one.

| Check | Sees | Blind to |
|---|---|---|
| `check:contrast` | every *declared* token pair, light + dark, no browser | live DOM, anything not a token pair |
| `check:a11y` | the rendered pages, real data, the real admin form and dialog | states the data never produces; anything behind a click |
| `check:stories` | every component state, including ones no article produces | the pages as pages, the admin routes |

The gap that made this worth building is not hypothetical. `ArticleList` keeps an
`aria-live` region so that appending cards is announced (WCAG 4.1.3) — deliberate
work, listed in ADR 0011. Nothing tested it: `check:a11y` crawls the home page but
never clicks "Carica altri", so the region was audited **empty** on every run since
it was written. The `CaricaAltri` story clicks, asserts the announcement, and
asserts the button retires when `nextCursor` is null. Same for the `practice`
accent, which no article maps today — the tag sheet renders all five regardless.

**Light only, on purpose.** `storybookTest({ initialGlobals: { theme: "dark" } })`
exists and a dark pass is a six-line second Vitest project; this is a cost/benefit
call, not a limitation. `check:contrast` already walks every declared pair in both
schemes, instantly and with no dependencies, and the two values that are *not*
tokens — the perla card's `#26292e` fill and the tags' `color-mix` ink — are already
special-cased there (`CARD_FILL`, `TAG_INK`). A dark axe pass would re-cover that
ground and double the suite. The dark scheme is still asserted on live DOM by the
Foundations stories, which pin `globals.theme` per story and show all 21 colour
tokens and all five tags at once — more dark surface than thirteen duplicated
component stories would.

**`/admin` is out of scope.** `check:a11y` already visits `/admin`, `/admin/new`,
`/admin/:id` and the picker dialog *open*, signing a session cookie the way a real
login does. More to the point, ADR 0011 records three MDXEditor violations as
deliberately **not** fixed (unlayered CSS, `input:focus-visible{outline:none}`,
chrome that stays light under `.dark`). A `BodyEditor` story under
`a11y: { test: "error" }` would fail the suite on defects already decided, and
`UnsplashPicker` would need MSW to stub the Unsplash search.

**Out of the release gate, like `check:a11y`.** Same reasoning as ADR 0011 —
a release must not fail for an environmental reason — applied to a check with
*more* environmental dependencies than that one: chromium, a Vite build, and the
network, because `next/font/google` fetches the fonts at build time. Mocking them
with `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` would remove the network from the critical
path at the price of a hand-written `@font-face` file for four families and their
unicode ranges — the kind of file nobody re-checks until it renders wrong.

**What did join the gate: `check:tokens`.** Panda extracts statically, so
`css({ textStyle: variant })` with a runtime value emits nothing. `Wordmark` takes
`variant` as a prop, and `brand-wordmark-sm` — passed from `Footer.tsx` — had **no
class in the output at all**: the footer wordmark rendered at the inherited size
instead of design.md's 32px, for as long as the component existed.
`brand-wordmark-lg` worked only by accident, being the default initialiser in the
same file that Panda could resolve. No linter and no axe run sees this, because a
missing class is not a violation of anything — it is an absence.

`staticCss` now forces `textStyle: ["*"]` (verified: 9 classes before, 16 after,
including the 5 from Panda's own preset), which **fixes the footer as a side
effect** — a change to shipped CSS that arrives with this work rather than on its
own. `scripts/check-tokens.mts` is what keeps it true: it regenerates the CSS and
fails if a declared textStyle has no class. Instant, no browser, no database, no
network, so unlike `check:stories` it belongs in `release.sh`.

**`colorAliases` had to be generated.** design.md declares 13 unique colours and 8
role names pointing at them (`background: '{colors.surface}'`). The DTCG export
resolves references away, so `semanticTokens` shows 21 apparently independent
colours and the shape of the palette disappears. `scripts/dtcg-to-panda.mjs` now
reads that structure from the frontmatter — the same reason it already reads
`shadows` there — and the Colors sheet renders the two groups separately. The
sheet's whole purpose is that distinction; deriving it by comparing hex values
would have mislabelled `on-primary`, which design.md declares as an alias of
`on-dark` but gives its own dark value, because `primary` flips light.

**No `@storybook/addon-themes`, though the Panda docs prescribe it.** Its
`withThemeByClassName` targets `html` by default, which is right. But the four
next/font `.variable` classes must land on `<html>` too — `body`'s own
`font-family: var(--fonts-inter)` is computed on the body, so a var declared any
deeper never reaches it — which means a decorator writing to `documentElement` is
needed regardless. The addon would buy only the toolbar item, which `globalTypes`
gives in six lines, at the price of two mechanisms writing the same element.

**A typing trap worth writing down.** `definePreview` infers the parameter, args
and globals shape from its `addons` array. Omit the array and every generic
collapses to `never`, and *every* story file fails to typecheck with errors that
point at the stories rather than at the preview. `addons: [a11y()]` is load-bearing.

**Deliberately not done:**

- **No MDX docs pages.** Storybook's test build excludes MDX entries by default, so
  a Foundations page written in MDX would be the one view in the project that
  documents the design system and is never audited. They are stories instead.
- **No `play()` on `FilterPill`.** Its `onChange` calls `router.push` and the
  component's own tree does not change — the parent remounts. A play there would
  assert Next's router mock, not this project's accessibility.
- **`ThemeToggle` fights the toolbar, and stays that way.** It writes `.dark`/
  `.light` straight onto `<html>`, the same element the preview decorator owns, so
  clicking it in Storybook really does flip the scheme and desync the control.
  Owning that class is the component's job in the app; faking it would test the fake.
- **No contrast ratios on the Colors sheet.** The ratios live in
  `check-contrast.mts`, which fails the release. Rendering them too would put two
  implementations of the same arithmetic in the repo, and only one of them has teeth.
- **No visual regression.** `scripts/shot.mjs` and `.fallow/shots` already exist for
  before/after comparison; a second screenshot pipeline was not part of this.

**One note on trusting the green.** A suite that renders stories and asserts
nothing also reports 33 passing tests. This one was verified by adding a story with
an `<img>` and no `alt`, confirming it failed on axe's `image-alt`, and removing it.
Worth repeating if the wiring is ever reorganised.
