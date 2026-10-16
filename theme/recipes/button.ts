import { defineRecipe } from "@pandacss/dev";

export const button = defineRecipe({
  className: "button",
  base: {
    textStyle: "button",
    borderRadius: "full",
    cursor: "pointer",
    transitionProperty: "background-color, border-color, color, transform",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease-out",
    // Feedback on press, not release: hover never fires on touch.
    _active: { transform: "scale(0.97)" },
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
        // on-primary, not on-dark: primary flips to near-white in dark mode, so a
        // fixed light ink left the label at 1.19:1 against its own hover fill —
        // invisible. on-primary is the token that flips with it (15.01:1).
        _hover: { backgroundColor: "primary", color: "on-primary" },
      },
    },
  },
  defaultVariants: { variant: "outline" },
});
