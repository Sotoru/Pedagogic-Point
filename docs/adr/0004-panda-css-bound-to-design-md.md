# Panda CSS, bound to design.md via a DTCG transform (Tailwind removed)

We replaced Tailwind v4 with **Panda CSS** for all styling — typography,
components, colours, grid/layout — while keeping `docs/design.md` the single
source of truth for tokens. Tailwind is gone as if it never existed (no
dependency, no `@theme`, no generated `app/theme.css`).

**Binding.** `@google/design.md` has no Panda exporter, so the `tokens` script
exports the **DTCG** format and pipes it through `scripts/dtcg-to-panda.mjs`,
which emits `theme/tokens.gen.ts` (a Panda token/semanticToken/textStyle
module, git-ignored, regenerated in `predev`/`prebuild` alongside
`panda codegen`). DTCG v0.3 drops `shadows` and the `fontStyle`/`textAlign` of
type styles, so the transform reads those two from the design.md frontmatter in
the same pass — every token stays bound to design.md, nothing is hand-mirrored.

**Dark mode lives in design.md.** The format has no notion of modes, so we
adopted a `dark-` prefix convention (`dark-surface`, `dark-primary`, …): the
transform pairs each `dark-<name>` with `<name>` and emits a Panda semantic
token `{ base, _dark }`, never exposing a `dark-*` colour for direct use. The
`_dark` condition is class-based (`.dark &`) to match the existing pre-paint
theme script; `on-primary` flips to dark ink because `primary` flips light.

**Authoring.** Layout uses Panda `css()` and the `flex`/`grid` patterns;
`CategoryTag` and the outline `button` are config recipes (the tag's 10% tint
is `color-mix` on the live token var, so it follows dark mode for free); named
typography is `textStyles`. We keep Panda's base numeric scale (`py`, `gap`)
and layer design.md's named tokens (`gutter`, `content-max`, accents) on top.
Integration is the `@pandacss/dev/postcss` plugin (Turbopack reads the root
`postcss.config`), with `app/globals.css` reduced to the `@layer` declaration
and base body styles moved into `panda.config.ts`.

The Perla card's dark elevation retune (deeper shadows, a fill lighter than the
band) is not a design.md concept, so it's inlined in the component.
