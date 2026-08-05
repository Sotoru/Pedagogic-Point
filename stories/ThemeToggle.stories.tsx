import preview from "../.storybook/preview";
import { ThemeToggle } from "@/components/ThemeToggle";

const meta = preview.meta({
  title: "Components/ThemeToggle",
  component: ThemeToggle,
});

// Heads-up for whoever opens this: the toggle writes `.dark`/`.light` straight
// onto <html>, which is the same element the preview decorator owns. Clicking it
// here really does flip the scheme, and the toolbar control will disagree until
// you change it too. Left as is on purpose — the component's job in the app is
// precisely to own that class, and faking it would test the fake.
//
// No play function: the icon swap is pure CSS (`_dark` condition), so there is no
// React state to assert and nothing about the accessibility tree changes.
export const Default = meta.story({});
