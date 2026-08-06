import preview from "../.storybook/preview";
import { Footer } from "@/components/Footer";

const meta = preview.meta({
  title: "Layout/Footer",
  component: Footer,
});

// The wordmark here is `brand-wordmark-sm`, and until staticCss forced every
// textStyle that class did not exist: Panda cannot extract a value that arrives
// as a prop, so this rendered at the inherited 16px instead of design.md's 32px
// for as long as the component existed. If it ever looks small again,
// npm run check:tokens is the check that says why.
export const Default = meta.story({});
