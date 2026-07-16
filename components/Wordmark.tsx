import { css } from "@/styled-system/css";
import type { SystemStyleObject } from "@/styled-system/types";

// Brand wordmark: Great Vibes for each capital "P", Montez for the rest
// (design.md). The string is fixed, so the alternation is hardcoded.
// Size comes from a brand-wordmark textStyle; `overrides` tweaks it per use
// (e.g. the nav clamps the size on narrow phones).
const GV = { fontFamily: "var(--font-great-vibes), cursive" } as const;
const MZ = { fontFamily: "var(--font-montez), cursive" } as const;

export function Wordmark({
  variant = "brand-wordmark-lg",
  overrides,
}: {
  variant?: "brand-wordmark-lg" | "brand-wordmark-sm";
  overrides?: SystemStyleObject;
}) {
  return (
    <span
      className={css(
        { textStyle: variant, userSelect: "none", whiteSpace: "nowrap", color: "primary" },
        overrides,
      )}
    >
      <span style={GV}>P</span>
      <span style={MZ}>edagogic</span>
      <span style={GV}>P</span>
      <span style={MZ}>oint</span>
    </span>
  );
}
