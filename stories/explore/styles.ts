import type { MouseEvent } from "react";
import { css } from "@/styled-system/css";

export const PAGE = css({
  marginInline: "auto",
  maxWidth: "wrapper-max",
  paddingInline: { base: "margin-mobile", md: "margin-desktop" },
  paddingBlock: "12",
  display: "flex",
  flexDirection: "column",
  gap: "8",
});
export const STACK = css({ display: "flex", flexDirection: "column", gap: "2", minWidth: "0" });
export const EYEBROW = css({ textStyle: "label-caps", color: "muted" });
export const TITLE = css({ textStyle: "headline-md", color: "primary" });
export const NOTE = css({ textStyle: "body-md", color: "muted" });
export const PANEL = css({
  borderRadius: "lg",
  border: "1px solid",
  borderColor: "border-subtle",
  backgroundColor: "surface-container",
});
export const EMPTY = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4",
  paddingBlock: "12",
  paddingInline: "6",
  textAlign: "center",
  textStyle: "body-md",
  color: "muted",
  border: "1px dashed",
  borderColor: "border-subtle",
  borderRadius: "lg",
});
export const LINK = css({
  display: "inline-flex",
  alignItems: "center",
  minHeight: "11",
  textStyle: "button",
  color: "secondary",
  _hover: { textDecoration: "underline" },
});
export const CHIPS = css({ display: "flex", flexWrap: "wrap", gap: "2", border: "none" });
// The radio stays the focusable control; the pill around it is only its label.
export const CHIP = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "2",
  minHeight: "11",
  paddingInline: "4",
  borderRadius: "full",
  border: "1px solid",
  borderColor: "border-subtle",
  backgroundColor: "surface",
  color: "on-surface",
  textStyle: "button",
  cursor: "pointer",
  "&:has(:checked)": { borderColor: "primary", backgroundColor: "primary", color: "on-primary" },
  "& input": { accentColor: "currentColor" },
});

// Links open in the manager window, not in the story iframe; stopping the
// click keeps Storybook's own link handler from re-routing it.
export const keepInTop = (event: MouseEvent) => event.stopPropagation();
