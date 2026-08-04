# Accessibility baseline: WCAG 2 AA, guarded by two checks

The site was already in decent shape — `lang="it"`, real landmarks, every icon
`aria-hidden`, icon buttons named, a native `<select>` for the category filter,
alt text everywhere, headings in order, and a Panda reset that leaves focus
outlines alone. What was missing was measurement. This ADR records what we hold
the site to, the one place we deviate from design.md to get there, and what we
deliberately did **not** do.

**The target.** WCAG 2.x level A/AA on the public pages and `/admin`. Normal-text
contrast is therefore 4.5:1, and nothing on this site qualifies as "large" text —
the tags are 12px and the meta row 13px.

**Tag ink deviates from design.md.** design.md specifies the category tag as a
10%-opacity accent background with *full-saturation accent text*. At 12px that
failed AA in light mode: `practice` 2.23:1, `pedagogy` 2.69, `rights` 3.72. The
accents themselves are **not** changed — `theme/recipes/category-tag.ts` mixes the
tag's ink toward `on-surface` instead (`TAG_INK`: 55% / 60% / 80%), reusing the
`color-mix` the tint already uses, and only in light mode, since dark passes at
full saturation. Darkening the canonical accents far enough would have pushed
`rights` next to `error` `#ba1a1a`, which is exactly what ADR 0001 created it to
avoid. This supersedes design.md's ink for tags and nothing else.

Two canonical values did change, in design.md where they belong: `outline`
`#6c757d` → `#646d74` (it is text-only, aliased by `muted` and
`on-surface-variant`, and sat at 4.04:1 on `surface-container`), and `dark-theory`
`#a684e8` → `#ac8dea` (its tag sat at 4.24:1 on PerlaPedagogica's lighter dark
card fill).

**Two checks, because neither is sufficient alone.**

- `npm run check:contrast` walks every *declared* token pair in both schemes.
- `npm run check:a11y` runs axe-core (WCAG 2 A/AA tags) over the production build
  across 10 views, signing an admin cookie so the only real form in the project is
  audited too, and asserting the picker dialog's focus-move and Escape.

The division is not redundancy. Axe only sees what a crawl renders, and when this
was written **no** article mapped to `practice` and two of 74 mapped to
`pedagogy` — because `app/content.ts` keys on `curiosità` while the rows say
`curiositá`. An axe run would have declared the two worst offenders clean.
Conversely, `check:contrast` cannot see MDXEditor's toolbar or a live DOM. Each
found real defects the other missed: the contrast script caught the outline
button's hover label at 1.19:1 in dark mode (a fixed light ink against a `primary`
that flips light — now `on-primary`) and the theory tag on the perla card; axe
caught MDXEditor painting a placeholder with `var(--baseBorderHover)`, a border
colour used as text, at 1.9:1.

**Lint.** `eslint-config-next` enables 6 of ~35 `jsx-a11y` rules, so the checks
for unlabelled controls, dead `href`s and mouse-only handlers were never running.
The recommended set is on as errors, since `npm run lint` is the gate
`release.sh` runs and it ignores warnings.

**Overriding third-party CSS needs `!important`.** MDXEditor's stylesheet is
unlayered; Panda's utilities live in `@layer utilities`. Unlayered declarations
beat layered ones regardless of specificity, so the placeholder fix in
`BodyEditor.tsx` carries `!important` — importance is resolved before layers.
Its colour is a literal, not a token, because MDXEditor's chrome stays light even
under our `.dark`, so a semantic token would flip and reintroduce the failure.

**Deliberately not done**, so a later pass doesn't file these as oversights:

- **No skip link.** Two tab stops precede `<main>` (the wordmark link and the
  theme toggle). There is no block to bypass, and WCAG 2.4.1 is satisfied through
  heading structure (technique G141).
- **No `prefers-reduced-motion`.** The only motion is 150ms colour and box-shadow
  transitions. Nothing moves through space, which is what reduced-motion is for.
- **No guaranteed `h1` fallback.** The only `h1` lives in `Hero`, but
  `getFeatured()` falls back to the first article by id when nothing is flagged
  `evidenza`, so the heading disappears only when the database is empty.
- **MDXEditor's own focus ring.** It ships `input:focus-visible{outline:none}`.
  Third-party CSS inside the admin editor, recorded rather than patched.
