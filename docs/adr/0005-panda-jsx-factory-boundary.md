# Panda JSX factory: components for single-element recipes and layout patterns only

We enabled Panda's JSX factory (`jsxFramework: "react"`) and adopted it for
**single-element recipes** and **layout patterns** — but deliberately *not*
for one-off styling. This refines the authoring convention in ADR 0004
("layout uses `css()` and the flex/grid patterns"): those patterns are now
consumed as JSX components, while everything else stays on `className`.

**The line.**

| Style source | How it's authored |
|---|---|
| Single-element recipe (`button`) | factory component — `<Button>` = `styled("button", button)` |
| Layout pattern (`flex`, `grid`) | factory component — `<Flex>`, `<Grid>` |
| One-off text/surface (`css({...})`) | `className={css({...})}` |
| Slot recipe (`articleCard`, `articleGrid`) | `className={s.slot}` |
| Category tag (has `categoria → accent` mapping) | hand component, `className` inside |

**Why factory is not zero-cost.** Panda has no bundler transform, so `css()`
already runs at runtime (style object → class string). A factory element does
`css()` **plus** prop-splitting (style-props vs DOM props) **plus** an extra
component wrapper. It is never cheaper than `className={css()}`, only more. So
the factory earns its cost only where it buys a real semantic/ergonomic win.

**Why one-offs stay `css()`.** Rewriting `<h1 className={css({...})}>` to
`<styled.h1 …>` produces identical CSS but adds runtime and gives a *second*
way to write one-offs. With `jsxStyleProps` at its default (`all`), inline
style-props are the easy path to sprawl. Keeping one-offs on `css()` holds one
syntax for one-offs and keeps the token/recipe discipline central.

**Why slot recipes stay `className`.** The JSX form of a slot recipe is a
compound component via `createStyleContext`, which needs a React context
provider (`'use client'`). `articleGrid` is used across a server/client
boundary (`app/page.tsx` renders `grid.root`/`grid.heading`; `ArticleList`
renders `s.list`/`s.footer`) — a single provider cannot span that split
without pushing the page (and its ISR) into the client. `articleCard` is a
server component with fixed markup that gains nothing from context. So slot
recipes stay on `className`.

**Semantics.** Pattern components render a `div` by default; where the element
must stay semantic (`Nav`'s `<nav>`), the factory's `as` prop preserves it:
`<Flex as="nav" …>`.

**Scope of the change.** `<Button>` (new), and `flex()` → `<Flex>` in
`FilterPill`, `Footer`, `Nav`. Nothing else moved.
