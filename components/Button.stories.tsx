import preview from "../.storybook/preview";
import { Button } from "./Button";
import { button } from "@/styled-system/recipes";

const meta = preview.meta({
  title: "Components/Button",
  component: Button,
  args: { children: "Carica altri" },
  // `Button` is `styled("button", button)`, and react-docgen can't see through a
  // Panda factory — with no argTypes the Controls panel comes up empty. Only the
  // props this button actually reacts to are listed; the recipe's own variantMap
  // supplies the options so they can't drift from theme/recipes/button.ts.
  // ponytail: the hundreds of inherited Panda style props stay out on purpose.
  argTypes: {
    variant: { control: "select", options: button.variantMap.variant },
    children: { control: "text" },
    // Two different states: `disabled` takes the recipe's _disabled styling and
    // drops the button out of the tab order; `aria-disabled` keeps it focusable,
    // which is the one ArticleList uses while a request is pending.
    disabled: { control: "boolean" },
    "aria-disabled": { control: "boolean" },
    type: { control: "inline-radio", options: ["button", "submit", "reset"] },
    onClick: { action: "click" },
  },
});

// design.md's secondary button: 1px primary outline that fills on hover, full
// capsule per ADR 0006. The hover label is `on-primary`, not a fixed light ink —
// primary flips near-white in dark mode and a fixed ink sat at 1.19:1 there.
export const Outline = meta.story({});

// aria-disabled, not disabled: ArticleList needs the button to stay focusable
// while pending, so the guard — not the attribute — is what makes the request
// idempotent. Rendered here because the two states look different.
export const Pending = meta.story({
  args: { children: "Caricamento…", "aria-disabled": true },
});
