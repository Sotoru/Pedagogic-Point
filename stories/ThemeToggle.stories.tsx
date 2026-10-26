import preview from "../.storybook/preview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { expect } from "storybook/test";

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
export const Default = meta.story({
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Attiva tema scuro" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("button", { name: "Attiva tema chiaro" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("button", { name: "Attiva tema scuro" })).toHaveFocus();
  },
});
