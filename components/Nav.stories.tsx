import preview from "../.storybook/preview";
import { Nav } from "./Nav";

const meta = preview.meta({
  title: "Layout/Nav",
  component: Nav,
});

// Brand-only header: the wordmark is optically centered and the theme toggle sits
// absolutely on the right, so the two never fight for space. The wordmark's size
// is a clamp, not a token — the script face is ~5.3x as wide as its font size and
// would overflow the margins on a narrow phone at a fixed 64px.
//
// Two tab stops live here (the home link, the toggle), which is the reason ADR
// 0011 records that no skip link is needed: there is no block to bypass.
export const Default = meta.story({});
