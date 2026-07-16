import { defineRecipe } from "@pandacss/dev";

// design.md: secondary button = 1px primary outline, fills on hover.
// Radius: full capsule (ADR 0006) — supersedes design.md's 8px for buttons.
export const button = defineRecipe({
  className: "button",
  base: {
    textStyle: "button",
    borderRadius: "full",
    cursor: "pointer",
    transitionProperty: "background-color, border-color, color",
    transitionDuration: "150ms",
    _disabled: { opacity: 0.5, cursor: "default" },
  },
  variants: {
    variant: {
      outline: {
        border: "1px solid",
        borderColor: "primary",
        color: "primary",
        paddingInline: "6",
        paddingBlock: "2.5",
        _hover: { backgroundColor: "primary", color: "on-dark" },
      },
    },
  },
  defaultVariants: { variant: "outline" },
});
