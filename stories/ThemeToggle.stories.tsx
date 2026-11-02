import preview from "../.storybook/preview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { expect } from "storybook/test";

const meta = preview.meta({
  title: "UI/Selettore tema",
  component: ThemeToggle,
});

// Heads-up for whoever opens this: the toggle writes `.dark`/`.light` straight
// onto <html>, which is the same element the preview decorator owns. Clicking it
// here really does flip the scheme, and the toolbar control will disagree until
// you change it too. Left as is on purpose — the component's job in the app is
// precisely to own that class, and faking it would test the fake.
//
export const Default = meta.story({
  name: "Selettore tema",
  play: async ({ canvas, userEvent }) => {
    // The suite runs in both schemes, so the starting label depends on which.
    const [first, second] = document.documentElement.classList.contains("dark")
      ? ["Attiva tema chiaro", "Attiva tema scuro"]
      : ["Attiva tema scuro", "Attiva tema chiaro"];
    canvas.getByRole("button", { name: first }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("button", { name: second })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByRole("button", { name: first })).toHaveFocus();
  },
});
