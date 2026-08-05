import preview from "../.storybook/preview";
import { Wordmark } from "@/components/Wordmark";

const meta = preview.meta({
  title: "Brand/Wordmark",
  component: Wordmark,
});

// The nav's size. Great Vibes on each capital P, Montez on the rest — if the
// next/font vars are missing from <html> this renders in the generic cursive
// fallback, which is the fastest way to notice the decorator broke.
export const Large = meta.story({
  args: { variant: "brand-wordmark-lg" },
});

// The footer's size, and the reason panda.config forces every textStyle: this
// variant arrives as a prop, so Panda never extracted it and the class did not
// exist at all until staticCss made it. Guarded by npm run check:tokens.
export const Small = meta.story({
  args: { variant: "brand-wordmark-sm" },
});
