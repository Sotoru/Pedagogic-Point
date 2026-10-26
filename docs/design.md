---
version: alpha
name: PedagogicPoint Design System
description: Editorial design foundations, components, and interaction rules for PedagogicPoint.
colors:
  # --- Canonical values (the only unique colors in the system) ---
  # Neutrals — monochrome editorial foundation
  surface: '#f9f9fb'            # page background & lifted secondary surface
  surface-container: '#edeef0'  # single raised/tinted tier (cards, pills, inputs)
  border-subtle: '#e9ecef'      # 1px borders & dividers
  outline: '#646d74'            # muted gray: captions, metadata, inactive nav. Darkened from #6c757d, which sat at 4.04:1 on surface-container — below AA for normal text; now 4.54. Guarded by npm run check:contrast
  on-surface: '#1a1c1d'         # primary text & headlines on light
  on-dark: '#fafafa'            # near-white inverse ink for text/icons on filled surfaces
  # Primary — near-black ink
  primary: '#141414'
  # Secondary — interactive blue (links, progress, primary-blue actions)
  secondary: '#0059bb'
  # Feedback
  error: '#ba1a1a'
  # Categorical accents — pedagogical domains, tagging only (blue = secondary)
  pedagogy: '#28a745'
  theory: '#6f42c1'
  practice: '#fd7e14'
  rights: '#e03131'             # "tutela diritti umani" category — a categorical red, NOT the error red
  # --- Role aliases (references, add no new colors) ---
  background: '{colors.surface}'
  surface-container-low: '{colors.surface-container}'
  on-surface-variant: '{colors.outline}'
  outline-variant: '{colors.border-subtle}'
  muted: '{colors.outline}'
  on-primary: '{colors.on-dark}'
  on-secondary: '{colors.on-dark}'
  on-error: '{colors.on-dark}'
  # --- Dark scheme (prefix `dark-`) ---
  # Paired with the token of the same name minus the prefix; the build consumes
  # these to emit Panda semantic tokens { base, _dark } and never exposes a
  # `dark-*` color for direct use. Same hues as light, value structure inverted,
  # accents lightened for contrast on dark, elevation by lightness.
  dark-surface: '#1a1c20'
  dark-surface-container: '#212429'
  dark-border-subtle: '#313539'
  dark-outline: '#9aa0a6'
  dark-on-surface: '#e6e7e9'
  dark-primary: '#e6e7e9'
  dark-secondary: '#5aa2ff'
  dark-error: '#ff5449'
  dark-pedagogy: '#3ed66a'
  dark-theory: '#ac8dea'        # lifted from #a684e8: its tag sat at 4.24:1 on the perla card's lighter dark fill
  dark-practice: '#ff9e47'
  dark-rights: '#ff6b6b'
  # Dark role aliases follow their canonical (references, add no new colors)…
  dark-background: '{colors.dark-surface}'
  dark-surface-container-low: '{colors.dark-surface-container}'
  dark-on-surface-variant: '{colors.dark-outline}'
  dark-outline-variant: '{colors.dark-border-subtle}'
  dark-muted: '{colors.dark-outline}'
  # …except on-primary: primary flips to light in dark, so its ink flips dark.
  dark-on-primary: '#121316'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  button:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  quote:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 36px
  brand-wordmark-lg:
    fontFamily: 'Great Vibes, Montez'
    fontSize: 64px
    lineHeight: 56px
    letterSpacing: -0.02em
  brand-wordmark-sm:
    fontFamily: 'Great Vibes, Montez'
    fontSize: 32px
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  wrapper-max: 1280px
  container-max: 1200px
  content-max: 1104px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
shadows:
  card-subtle: '0px 1px 1px rgba(0,0,0,0.05)'
  hover-active: '0px 0px 20px rgba(0,0,0,0.15)'
# Local Panda extension, read by scripts/dtcg-to-panda.mjs rather than the
# Google exporter. Keep non-standard typography properties out of its schema.
x-panda:
  textStyles:
    quote:
      fontStyle: italic
      textAlign: center
---

## Brand & Style

The brand personality is intellectual, authoritative, yet accessible. PedagogicPoint is an editorial hub for people interested in pedagogy and curious readers. Prioritize clarity, reflection, and comfortable long-form reading. Address readers as curious peers, using the warm, elegant, gently playful Italian voice defined in [CONTEXT.md](../CONTEXT.md).

The design style follows a **Modern Editorial Minimalism**. It leverages heavy white space, a strict monochromatic base, and high-quality imagery to create an environment conducive to deep reading. The visual language avoids decorative clutter, instead using structural grids and purposeful color accents to categorize complex information. The emotional response should be one of "quiet confidence"—professional enough for academia, but clean enough for modern digital consumption.

### Scope and source of truth

This is the project's canonical implementation of Google's [DESIGN.md format](https://github.com/google-labs-code/design.md), following its [specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md). Read it before creating or changing any component, page, or interaction. YAML defines exact values; prose defines their roles, behavior, and documented exceptions. Extend this document alongside an implementation when a rule is missing.

The canonical path is `docs/design.md`; all commands use that explicit path. Keep one design source rather than copying it into a second root-level file. This document establishes PedagogicPoint's identity; it does not prescribe Google's Material Design appearance or a component library.

`npm run tokens` exports the YAML through the official `@google/design.md` CLI as DTCG and transforms it with [scripts/dtcg-to-panda.mjs](../scripts/dtcg-to-panda.mjs) into the generated Panda preset. The transformer writes complete changes atomically and leaves unchanged output untouched so a running dev server never reads an empty module during generation. The transformer also reads the local `shadows` and `x-panda.textStyles` extensions, which the Google exporter does not emit. These are project extensions, not standard DESIGN.md token groups. Keep descriptions in prose, and standard typography properties in `typography` so the official lint stays clean.

Use the generated semantic color tokens, text styles, and the shared [recipes](../theme/recipes/). Never hand-edit [the generated preset](../theme/tokens.gen.ts) or [Panda output](../styled-system/). Panda's built-in spacing steps remain available; prefer the named project tokens for container widths, gutters, and page margins. Consult the [official Panda documentation index](https://panda-css.com/llms.txt) before changing styling.

## Colors

The palette is anchored by a high-contrast foundation of near-black and near-white. Softening off the absolutes (`primary` #141414, `on-dark` #fafafa) avoids harsh pure-black-on-pure-white glare while preserving legibility for long-form content.

- **Primary & Neutrals:** `primary` (near-black) is used for branding and headlines; `surface` is the page base, and `surface-container` acts as a raised tier to distinguish container backgrounds from the page.
- **Categorical Accents:** Functional tokens are used exclusively for article tagging and navigation indicators. `secondary` (blue), `pedagogy` (green), `theory` (purple), `practice` (orange), and `rights` (red) help users mentally map different pedagogical domains (e.g., theory vs. practice). `rights` is a categorical red distinct from the `error` feedback red — never use `error` as a category color.
- **Interactive States:** `secondary` is reserved for inline links and primary action states within educational tools.
- **Light and dark:** Use semantic names in components. The transform pairs each `dark-<name>` value with its base token into Panda's `base` / `_dark` values, selected by the `.light` / `.dark` class on the root element. Never use `dark-*` names directly in component styles. Text on a `primary` fill uses `on-primary`, which changes with the fill; the fixed `on-dark` ink is only appropriate on a surface that stays dark.

## Typography

This system uses a paired typeface approach to balance character with utility. 

- **Headlines:** Montserrat is used for all display and headline levels. Its geometric clarity provides a modern, professional structure to the editorial layout. For large displays, use tighter letter spacing to create a more "designed" look.
- **Body:** Inter is the workhorse for all long-form reading. It is chosen for its exceptional legibility on digital screens. The line height for `body-lg` is intentionally generous (30px) to prevent eye fatigue during study.
- **Labels:** Small labels use Inter Bold with increased tracking (`label-caps`). Apply uppercase only where the interface calls for it; tags deliberately preserve their category's casing and use normal letter spacing.
- **Quotes:** Pull-quotes use Montserrat SemiBold Italic at 24px/36px, centered — reserved for the "Perla Pedagogica" component, not used elsewhere in the scale.
- **Brand Wordmark:** The "PedagogicPoint" logo alternates two decorative script fonts letter-group by letter-group — Great Vibes for each capital "P", Montez for the remaining letters. This pairing is exclusive to the logo (header at `brand-wordmark-lg`, footer at `brand-wordmark-sm`) and must never be used for body or UI text.

## Layout & Spacing

The layout is built on a 12-column editorial grid, used specifically for the **Hero section** (5/7 column split between text and media). The article listing below it uses a simpler **2-column grid**, not the 12-col system — see Components.

- **Container widths (3 tiers):** the page wrapper caps at `wrapper-max` (1280px); the header and footer inner content cap at `container-max` (1200px); the hero and article-grid content caps at `content-max` (1104px), which equals `container-max` minus two `margin-desktop` gutters (1200 − 2×48).
- **Desktop:** Line lengths for articles remain within the optimal 65-75 character range for readability, governed by the container tiers above.
- **Imagery:** Use "Bleed" sections where images extend beyond the 1200px container to break the grid and add visual rhythm to long articles.
- **Spacing Rhythm:** An 8px base unit governs all dimensions. Vertical rhythm is strictly enforced; spacing between article sections should be significantly larger (e.g., 80px or 120px) than internal component spacing to signify topical shifts.

## Elevation & Depth

To maintain a clean, professional aesthetic, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Use `surface-container` to lift content cards or sidebars off the main `surface`.
- **Borders:** Use 1px `border-subtle` borders for decorative card edges and dividers. Form controls use `outline` so their boundaries have at least 3:1 contrast against the surrounding surface in both themes.
- **Default exception — Perla card:** The Perla Pedagogica quote card is the one component that rests with the diffused `hover-active` shadow (`0px 0px 20px rgba(0,0,0,0.15)`) and **no border**, to lift it prominently above the section's tinted background. Its refresh button rests on the lighter `card-subtle` shadow (`0px 1px 1px rgba(0,0,0,0.05)`) with the same fill as the card, lifting to `hover-active` on hover. Dark mode uses the local elevation adjustments documented under Components.
- **Active Elevation — `hover-active`:** Only use a very soft, diffused shadow (15% opacity, 20px blur, 0px offset) on primary action cards during hover states to indicate interactivity without breaking the flat editorial feel.

## Shapes

The shape language is "Soft-Professional." A 0.5rem (8px) base radius on standard surfaces (inputs, thumbnails, cards) keeps the UI modern and approachable without appearing overly playful or juvenile; pill/button controls go full-capsule and large feature surfaces step up to 16–32px.

- **Standard Elements:** The standard surface radius is 8px. Existing admin form fields use 12px and article-card shells use `rounded.lg` (16px); preserve these documented contexts rather than treating every surface as the same size.
- **Buttons & Pills:** Buttons and category tags use `rounded-full` for a full-capsule shape, matching the filter Dropdown.
- **Large Containers:** Educational modules or "Hero" cards may use the `rounded-lg` (16px) variant to create a distinct visual frame for high-priority content.
- **Media & Feature Cards:** Hero imagery and the Perla Pedagogica card use an explicit 32px radius, reserved for large feature surfaces. This is a documented exception; the `rounded.xl` token remains 1.5rem (24px at the default root size).

## Components

- **Buttons:** The shared [Button](../components/Button.tsx) defaults to a 1px `primary` outline with `primary` text, full-capsule corners, and Montserrat SemiBold (`button`, weight 600). Hover fills it with `primary` and switches the text to `on-primary`. Filled primary actions must use the same foreground/background pairing.
- **Article Tags:** Small pill-shaped elements based on `label-caps`, with sentence case and normal letter spacing as intentional overrides. The background is a 10% opacity version of the accent token (`pedagogy`, `theory`, `practice`, `rights`, or `secondary`). In light mode, the [category-tag recipe](../theme/recipes/category-tag.ts) mixes green, orange, and red text toward `on-surface` for AA contrast; blue and purple stay pure. Dark mode uses the pure dark-scheme accent. Reuse this recipe rather than recreating the mix.
- **Cards:** Content cards should have no background shadow. Use a 1px `border-subtle` border and ensure internal padding is generous (minimum 24px) to maintain the editorial feel.
- **Input Fields:** Admin forms use `surface` with `on-surface` text, a 1px `outline` border, a 12px radius, `body-md` typography, and 16px horizontal / 12px vertical padding. Focus uses a 2px `primary` outline. The Markdown editor maps its public theme variables to these same semantic colors, including text, placeholder, toolbar, and popups; it must remain readable while typing in either theme.
- **Editor controls:** Use the editor's public extension API for a native block-type select and a native link dialog. The bundled block menu hides active form controls from assistive technology, and the bundled link popup lacks an associated URL label and exceeds a 320px viewport. The local controls retain headings, quotes, link editing, preview, copying, and removal. Link fields have explicit Italian labels; the modal contains focus, closes with Escape, and never submits the surrounding article form. Its layout uses the same form tokens and fits narrow screens.
- **Progress Indicators:** For pedagogical courses, use thin, horizontal bars in `secondary` to show completion status without distracting from the text.
- **Top Nav Bar:** Height-auto bar pinned to `container-max`, 24px vertical padding and `margin-mobile` / `margin-desktop` horizontal padding. A three-column grid centers the wordmark and reserves space for the theme toggle on the right. The logo starts from `brand-wordmark-lg` with a responsive 28–64px clamp (`8vw`) so the logo and the 44px toggle remain separate at 320px. Overrides passed through custom component props use Panda's `css.raw()` so they are extracted. Navigation links are not rendered; if added, mark the active link with a 2px `primary` bottom border and use `on-surface-variant` for inactive links.
- **Footer:** Same `container-max` width as the nav, 48px vertical padding and `margin-mobile` / `margin-desktop` horizontal padding. Three-way flex layout from `md`: wordmark (`brand-wordmark-sm`) left, link list center, copyright right; stacked on mobile. Links use `label-caps` in `muted`, with no separators between them; the footer has a 1px `border-subtle` top divider.
- **Perla Pedagogica (Quote Card):** Card within the `content-max` section, full width on mobile and 75% from `md`, explicit 32px radius, no border, diffused `hover-active` shadow at rest (see Elevation exception). Centered content: decorative quote mark, a `theory` category pill, then the `quote` typography style. Internal padding is 32px on mobile and 49px from `md`. Its existing dark elevation uses a local `#26292e` fill and stronger shadows in [PerlaPedagogica](../components/PerlaPedagogica.tsx); these are checked for contrast. Promote them into shared tokens if another component needs them.
- **Dropdown (category filter):** Native `select`, full-capsule (`rounded.full`), `surface-container-low` background, 1px `border-subtle` outline, `button` typography for the label, trailing decorative chevron. The control only: the "Filtra per:" caption beside it is page layout, not part of the component. Earlier revisions call this the *Filter Pill*.
- **Meta / Reading Time:** Small icon (13px) + `label-caps` text in `muted`. Used under the hero header and inside every article card footer (e.g. "5 min read", "3 min").
- **Hero Media:** 4:3 aspect-ratio image container, explicit 32px radius, 1px `outline-variant` border, no shadow.
- **Article Grid:** One column on mobile, two from `md` (independent from the 12-col hero grid), `gutter` (24px) row and column gap. Standard CSS Grid rows take the height of the tallest card in each row; this is not a masonry layout.
- **Category Tag placement:** The category pill's position depends on the surface. In **grid article cards** it *leads* — placed above the title. In the **Hero** it *rides with the metadata* — placed below the title/intro, directly above the reading time. This is intentional: list cards front-load the category for scanning, while the featured hero leads with the title.
- **Article Detail Page (`/articoli/<titolo>`):** Reached by clicking any article card or the hero (whole-surface stretched link; the URL is the title with spaces as dashes). Layout: a full-width cover at `content-max` using the Hero Media treatment (explicit 32px radius, 1px `outline-variant`, `aspect-4/3` on mobile widening to `2/1` from `md`), then a centered **720px reading column** for comfortable line length. Column order: category tag, `headline-md` title, byline (`di <autore>`) + reading time, `body-lg` intro, then the Markdown article body. Markdown headings render as `headline-sm`; paragraphs, lists, links, quotes, and code blocks keep the `body-lg` reading rhythm. Raw HTML inside Markdown is not parsed.
- **Unsplash Dialog:** Use the native modal dialog for focus containment, Escape dismissal, and focus restoration. At narrow widths, the search input occupies its own full-width row above the search and close buttons; controls must stay visible within the viewport. Search progress, errors, and empty results use explicit Italian text.

### Interaction and accessibility rules

These rules apply to new work; existing components provide the starting patterns. For every interaction, define its trigger, visible feedback, focus behavior, pending state, result, and recovery from failure before implementing it.

- **Semantics and keyboard:** Use links for navigation, buttons for actions, and native controls for selection and input. Every control needs an accessible name and keyboard operation. Decorative icons are hidden from assistive technology. Keep the global 2px `primary` focus ring with a 2px offset; whole-surface card links show the ring around the card. Do not add nested interactive controls inside a stretched-link target.
- **Pointer and touch:** Hover provides additional feedback only; the same action must work by touch and keyboard. Panda scopes `_hover` to devices with hover support. Provide immediate press feedback without moving surrounding content or relying on hover to reveal essential controls.
- **Async actions:** Keep existing content visible during loading and preserve the user's focus. For an action already in progress, use `aria-disabled` when retaining focus matters and guard the handler against duplicate submissions; the attribute alone does not block clicks. The category select uses `aria-busy` and allows a newer choice to supersede the pending navigation. Announce appended content or refreshed text through a persistent polite status region. Show a clear Italian failure message and a retry path when an action fails.
- **End of pagination:** After loading, keep focus on the trigger. On the final page, keep the same button focusable with `aria-disabled` and the label "Tutti gli articoli sono caricati" instead of removing the focused element. Live announcements include the visible total so consecutive equal-sized pages still produce different messages.
- **Returning from an article:** Browser Back and "Torna agli articoli" return to the same home visit, preserving the category, appended articles, and scroll position. Restore the originating card or hero link's focus without scrolling it into a new position, and do not replay entrance animations or loading announcements. Keep recent list snapshots and viewport positions in the shared client layout, scoped by Next's public `bfcacheId` and category/URL; retain at most ten of each for the current session. Restore the viewport once the full list height exists and reconcile it before paint after the router's layout effects, including after category changes. Direct article visits fall back to a normal home link. Modified clicks keep normal link behavior; the logo remains a fresh home navigation.
- **Pending Perla:** Use the refresh icon's spinner and busy state as visible feedback; do not show a loading caption or reserve space for one. Keep "Caricamento…" in a persistent screen-reader-only status region, also when reduced motion hides the spinner. Keep the current quote visible; a failed refresh explains that the reader can retry.
- **States:** Cover default, hover, focus-visible, pressed, disabled, loading, empty, error, and success states where they apply. Empty content is a useful explanation, not a blank surface. Form errors use `error`, a text explanation, and association with the affected field; color alone never communicates status. Distinguish an unavailable page from a genuine failure, following [CONTEXT.md](../CONTEXT.md).
- **Theme:** The initial theme follows a saved choice or the system preference before first paint, including when storage is blocked. The toggle's accessible name describes the next action ("Attiva tema scuro" / "Attiva tema chiaro"). An explicit toggle persists the choice when storage is available and still works when storage is unavailable. Verify every new surface and foreground in both themes.

### Motion

Use motion to explain a result, a state change, or spatial continuity. Reading content stays still until the reader acts. Reuse these existing timings instead of introducing arbitrary values:

| Interaction | Existing treatment | Purpose |
| --- | --- | --- |
| Buttons, cards, icon controls | 150ms `ease-out` transition; press scale 0.97 for buttons, 0.99 for article cards, 0.9 for small icon buttons | Immediate action feedback |
| Refreshed Perla | 150ms text exit, 250ms card-height adjustment with a concurrent 200ms text entrance; `cubic-bezier(0.23, 1, 0.32, 1)` | Keep shorter and longer quotes from jumping |
| Appended article cards | 300ms `ease-out`, opacity and 8px upward entrance, staggered by 30ms | Show only the newly loaded results |
| Pending Perla refresh | 0.8s linear spinner while pending | Indicate work in progress |
| Article cover navigation | 400ms shared cover transition in both directions when the destination is ready | Preserve spatial continuity |

Perla refresh keeps the old text readable while the request is pending, then fades it out before replacing it. Measure the card's old and new natural heights at the swap and animate between them, keeping its top edge and refresh button anchored. This is a local exception to the preference for transform/opacity: height must move the article list below in normal document flow without stretching text or shadows. Keep it to 250ms, clip content during resizing, and release the measured height after the animation so wrapping remains responsive. Use the Web Animations API without an extra library; cancel motion on unmount, viewport resize, or a reduced-motion preference change. The persistent live region changes once, focus stays on the button, and a repeated identical quote does not fade. Under reduced motion or without animation support, update immediately.

Cover snapshots must fill the animated bounds, use a centered `cover` crop, and clip overflow. Card, hero, and article covers have different aspect ratios: leaving snapshots at automatic height produces a visible strip or flash outside the moving image. Keep this rule scoped to the shared cover's `morph` class so theme transitions retain their own treatment. Verify route navigation with `npm run check:transitions` after a production build; a component story alone cannot exercise a shared pair across routes.

Browser Back and "Torna agli articoli" reverse the cover morph into the originating card or hero at the saved viewport position, including filtered and appended cards. Use an asynchronous Navigation API precommit boundary for this history traversal so React can capture its shared pair; Next retains control of the route and history. Leave focus and scroll restoration to the existing return behavior. Without support for the navigation/view-transition APIs, return immediately with the same state restoration. Reduced motion also keeps the immediate return.

Theme changes use a page cross-fade when View Transitions are available. Navigation and theme changes must also work with an immediate update when the browser cannot animate them. Under `prefers-reduced-motion: reduce`, remove entrance animations, spinners, and view transitions; keep textual loading feedback. Small press feedback may remain. Prefer opacity and transform for new motion, specify transition properties explicitly, and avoid `transition: all` or animation of layout dimensions.

### Component review

Reuse [components](../components/) and [recipes](../theme/recipes/) before introducing a new primitive. Add or update the corresponding [Storybook stories](../stories/) for new components, variants, and changed interactions. Use the Foundations color and typography views to inspect the generated tokens; do not maintain a second palette or type scale in stories.

Review the relevant states in light and dark, at mobile and desktop widths, with keyboard navigation, long Italian labels, missing content, and reduced motion. These are review criteria, not guarantees supplied by a successful build. Run `npm run check:stories` when changing component behavior or stories; use the live-page accessibility check when the change needs verification in its page context.

## Do's and Don'ts

- Do start every UI change from this document and the existing component patterns. Update the rule and implementation together when the system needs to grow.
- Do use semantic color tokens and named `textStyle` values. Keep decorative script fonts exclusive to the wordmark and the `quote` style exclusive to the Perla Pedagogica.
- Do preserve readable line lengths, the mobile layout, keyboard focus, and meaningful loading feedback.
- Do document a local exception with its purpose. Promote it into the shared system when reuse makes it a common rule.
- Don't introduce new hex colors, font families, radii, shadows, or motion conventions in components without first documenting the decision here.
- Don't use `error` as a category accent, use color alone as feedback, or assume a base accent is readable without checking the actual foreground/background pair.
- Don't hand-edit generated files or duplicate this document. The Google CLI checks format and token references; [the contrast check](../scripts/check-contrast.mts) verifies the actual light/dark pairs, including tag mixes and the Perla fill, and [the token check](../scripts/check-tokens.mts) verifies emitted typography classes. The format lint does not validate a browser interaction or every rendered contrast pair.

### Contribution workflow

1. Read this document and [CONTEXT.md](../CONTEXT.md), identify the existing patterns to reuse, and describe the intended states.
2. If a rule or token is missing, define it here alongside the component or interaction. Keep the Google schema fields standard and the Panda extensions explicit.
3. After changing tokens, run `npm run tokens`. Development, build, and Storybook startup also regenerate tokens and Panda output automatically; restart a running server after changing the document so it picks up the new source values.
4. Review the relevant Storybook states, then run the required checks:

   ```sh
   npm run lint
   npm run build
   npm run check:contrast
   npm run check:tokens
   ```

   `npm run lint` runs ESLint and the official Google format lint. Use `npm run lint:design` for the document alone. These checks do not replace the component review above.
5. Follow [the Git guide](git.md) for Conventional Commits and releases. Record later design decisions in this same document.
