import { expect, userEvent, waitFor } from "storybook/test";
import preview from "../../.storybook/preview";
import { loadCatalog } from "./catalog";
import { StoryComparison } from "./StoryComparison";

const meta = preview.meta({
  title: "Esplora/Confronto",
  component: StoryComparison,
  parameters: { layout: "fullscreen", a11y: { options: { iframes: false } } },
  args: {
    previewDocument:
      import.meta.env.MODE === "test"
        ? '<!doctype html><html lang="it"><title>Anteprima in test</title><body></body></html>'
        : undefined,
  },
  argTypes: {
    entries: { table: { disable: true } },
    initialStoryId: { control: false, table: { disable: true } },
    previewDocument: { control: false, table: { disable: true } },
  },
});

const frameUrl = (frame: HTMLElement) => new URL(frame.getAttribute("src") ?? "", document.baseURI);

export const Affiancato = meta.story({
  name: "Confronto",
  beforeEach: async ({ args }) => {
    if (import.meta.env.MODE === "test") args.entries = await loadCatalog();
  },
  play: async ({ canvas, step }) => {
    if (import.meta.env.MODE !== "test") return;

    await step("Lo stesso scenario viene mostrato nei due temi", async () => {
      const light = await canvas.findByTitle(/ — Chiaro$/, {}, { timeout: 5000 });
      const dark = canvas.getByTitle(/ — Scuro$/);
      await expect(frameUrl(light).searchParams.get("id")).toBe(frameUrl(dark).searchParams.get("id"));
      await expect(frameUrl(light).searchParams.get("globals")).toBe("theme:light");
      await expect(frameUrl(dark).searchParams.get("globals")).toBe("theme:dark");
    });

    await step("Lo scenario scelto cambia entrambe le anteprime", async () => {
      await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Scenario" }), "ui-pulsante--outline");
      await waitFor(async () => {
        await expect(frameUrl(canvas.getByTitle("Contorno — Chiaro")).searchParams.get("id")).toBe("ui-pulsante--outline");
        await expect(frameUrl(canvas.getByTitle("Contorno — Scuro")).searchParams.get("id")).toBe("ui-pulsante--outline");
      });
    });

    await step("Il confronto responsive usa due larghezze reali e un tema condiviso", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "Responsive" }));
      await expect(canvas.getByRole("heading", { name: "Telefono · 384 px" })).toBeVisible();
      await expect(canvas.getByRole("heading", { name: "Desktop · 1024 px" })).toBeVisible();
      await waitFor(async () => {
        await expect(canvas.getByTitle("Contorno — Telefono · 384 px").clientWidth).toBe(384);
        await expect(canvas.getByTitle("Contorno — Desktop · 1024 px").clientWidth).toBe(1024);
      });
      await userEvent.click(canvas.getByRole("radio", { name: "Chiaro" }));
      await userEvent.keyboard("{ArrowRight}");
      await expect(canvas.getByRole("radio", { name: "Scuro" })).toBeChecked();
      await expect(frameUrl(canvas.getByTitle("Contorno — Telefono · 384 px")).searchParams.get("globals")).toBe("theme:dark");
      await expect(frameUrl(canvas.getByTitle("Contorno — Desktop · 1024 px")).searchParams.get("globals")).toBe("theme:dark");
    });

    await step("Ricominciare ripristina entrambe le anteprime", async () => {
      const previous = canvas.getByTitle("Contorno — Telefono · 384 px");
      await userEvent.click(canvas.getByRole("button", { name: "Ricomincia le anteprime" }));
      await expect(canvas.getByTitle("Contorno — Telefono · 384 px")).not.toBe(previous);
    });

    await step("La storia resta pronta al confronto dei temi", async () => {
      await userEvent.click(canvas.getByRole("radio", { name: "Temi" }));
      await expect(canvas.getByTitle("Contorno — Chiaro")).toBeVisible();
      await expect(canvas.getByTitle("Contorno — Scuro")).toBeVisible();
    });
  },
});

export const NessunoScenario = meta.story({
  name: "Nessuno scenario",
  tags: ["regression"],
  args: { entries: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Aggiungi un componente");
    await expect(canvas.queryByRole("combobox")).not.toBeInTheDocument();
  },
});
