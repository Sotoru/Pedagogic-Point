// The conformance target, in one place because two runners hold the site to it:
// scripts/check-a11y.mjs (axe over the rendered pages) and .storybook/preview
// (axe over each story). Axe's "best-practice" tag is advice, not conformance,
// and would drown the signal — see ADR 0011.
export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
