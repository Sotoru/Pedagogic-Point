---
name: PedagogicPoint Design System
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
    fontStyle: italic
    lineHeight: 36px
    textAlign: center
  brand-wordmark-lg:
    fontFamily: 'Great Vibes, Montez'
    fontSize: 64px
    lineHeight: 56px
    letterSpacing: -0.02em
    note: 'Great Vibes per le "P" iniziali, Montez per il resto della parola. Solo per il logo header.'
  brand-wordmark-sm:
    fontFamily: 'Great Vibes, Montez'
    fontSize: 32px
    lineHeight: 32px
    note: 'Variante footer dello stesso wordmark, stessa logica di alternanza font.'
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
---

## Brand & Style

The brand personality is intellectual, authoritative, yet accessible. As a hub for pedagogical content, the design must prioritize clarity and focus, evoking a sense of structured learning and professional growth. 

The design style follows a **Modern Editorial Minimalism**. It leverages heavy white space, a strict monochromatic base, and high-quality imagery to create an environment conducive to deep reading. The visual language avoids decorative clutter, instead using structural grids and purposeful color accents to categorize complex information. The emotional response should be one of "quiet confidence"—professional enough for academia, but clean enough for modern digital consumption.

## Colors

The palette is anchored by a high-contrast foundation of near-black and near-white. Softening off the absolutes (`primary` #141414, `on-dark` #fafafa) avoids harsh pure-black-on-pure-white glare while preserving legibility for long-form content.

- **Primary & Neutrals:** `primary` (near-black) is used for branding and headlines; `surface` is the page base, and `surface-container` acts as a raised tier to distinguish container backgrounds from the page.
- **Categorical Accents:** Functional tokens are used exclusively for article tagging and navigation indicators. `secondary` (blue), `pedagogy` (green), `theory` (purple), `practice` (orange), and `rights` (red) help users mentally map different pedagogical domains (e.g., theory vs. practice). `rights` is a categorical red distinct from the `error` feedback red — never use `error` as a category color.
- **Interactive States:** `secondary` is reserved for inline links and primary action states within educational tools.

## Typography

This system uses a paired typeface approach to balance character with utility. 

- **Headlines:** Montserrat is used for all display and headline levels. Its geometric clarity provides a modern, professional structure to the editorial layout. For large displays, use tighter letter spacing to create a more "designed" look.
- **Body:** Inter is the workhorse for all long-form reading. It is chosen for its exceptional legibility on digital screens. The line height for `body-lg` is intentionally generous (30px) to prevent eye fatigue during study.
- **Labels:** Small labels and tags use Inter in bold uppercase with increased tracking for clear categorization.
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
- **Borders:** Instead of shadows, use 1px solid borders in `border-subtle` to define boundaries for input fields, cards, and dividers.
- **Default exception — Perla card:** The Perla Pedagogica quote card is the one component that rests with the diffused `hover-active` shadow (`0px 0px 20px rgba(0,0,0,0.15)`) and **no border**, to lift it prominently above the section's tinted background. Its refresh button rests on the lighter `card-subtle` shadow (`0px 1px 1px rgba(0,0,0,0.05)`) on a white chip, lifting to `hover-active` on hover.
- **Active Elevation — `hover-active`:** Only use a very soft, diffused shadow (15% opacity, 20px blur, 0px offset) on primary action cards during hover states to indicate interactivity without breaking the flat editorial feel.

## Shapes

The shape language is "Soft-Professional." A 0.5rem (8px) base radius on standard surfaces (inputs, thumbnails, cards) keeps the UI modern and approachable without appearing overly playful or juvenile; pill/button controls go full-capsule and large feature surfaces step up to 16–32px.

- **Standard Elements:** Input fields and article thumbnails share the base 8px radius.
- **Buttons & Pills:** Buttons and category tags use `rounded-full` for a full-capsule shape, matching the Filter Pill.
- **Large Containers:** Educational modules or "Hero" cards may use the `rounded-lg` (16px) variant to create a distinct visual frame for high-priority content.
- **Media & Feature Cards:** Hero imagery and the Perla Pedagogica card use `rounded-xl` at 32px (an extended step beyond the standard `rounded.xl` token) — reserved for large, full-bleed-adjacent surfaces only.

## Components

- **Buttons:** Primary buttons are solid `primary` with `on-dark` text, featuring Montserrat Bold. Secondary buttons use a 1px `primary` outline.
- **Article Tags:** Small pill-shaped elements using the `label-caps` typography. The background is a 10% opacity version of the domain token (`pedagogy`, `theory`, `practice`, `rights`, or `secondary` for the blue category), with the text being the full-saturation token.
- **Cards:** Content cards should have no background shadow. Use a 1px `border-subtle` border and ensure internal padding is generous (minimum 24px) to maintain the editorial feel.
- **Input Fields:** Use a subtle `surface` background with a bottom-only border (2px) in `outline`. On focus, the border transitions to `primary`.
- **Progress Indicators:** For pedagogical courses, use thin, horizontal bars in `secondary` to show completion status without distracting from the text.
- **Top Nav Bar:** Height-auto bar pinned to `container-max` width, 24px vertical / 48px horizontal padding. The active nav link is marked with a 2px solid `primary` bottom border (no background/color change); inactive links use `on-surface-variant`. Logo uses `brand-wordmark-lg`.
- **Footer:** Same `container-max` width as the nav, 48px padding. Three-way flex layout: wordmark (`brand-wordmark-sm`) left, link list center, copyright right. Links use `label-caps` in `muted`, no separators/dividers.
- **Perla Pedagogica (Quote Card):** Full-width `content-max` card, `rounded-xl` 32px, no border, diffused `hover-active` shadow at rest (see Elevation exception). Centered content: small icon, a `theory` category pill, then the `quote` typography style. Generous internal padding (~49px).
- **Filter Pill:** Rounded-full (`rounded.full`) select-style control, `surface-container-low` background, 1px `border-subtle` outline, leading icon, `button` typography for the label, trailing chevron indicator.
- **Meta / Reading Time:** Small icon (13px) + `label-caps` text in `muted`. Used under the hero header and inside every article card footer (e.g. "5 min read", "3 min").
- **Hero Media:** 4:3 aspect-ratio image container, `rounded-xl` 32px, 1px `outline-variant` border, no shadow.
- **Article Grid:** 2-column layout only (independent from the 12-col hero grid), `gutter` (24px) row and column gap. Row heights are content-driven per card (masonry-like), not a fixed grid-template-row.
- **Category Tag placement:** The category pill's position depends on the surface. In **grid article cards** it *leads* — placed above the title. In the **Hero** it *rides with the metadata* — placed below the title/intro, directly above the reading time. This is intentional: list cards front-load the category for scanning, while the featured hero leads with the title.
- **Article Detail Page (`/articoli/<titolo>`):** Reached by clicking any article card or the hero (whole-surface stretched link; the URL is the title with spaces as dashes). Layout: a full-width cover at `content-max` using the Hero Media treatment (`rounded-xl` 32px, 1px `outline-variant`, `aspect-4/3` on mobile widening to `2/1` from `md`), then a centered **720px reading column** for comfortable line length. Column order: category tag, `headline-md` title, byline (`di <autore>`) + reading time, `body-lg` intro, then the Markdown article body. Markdown headings render as `headline-sm`; paragraphs, lists, links, quotes, and code blocks keep the `body-lg` reading rhythm. Raw HTML inside Markdown is not parsed.
