import { expect, userEvent } from "storybook/test";
import preview from "../../.storybook/preview";
import { loadCatalog } from "./catalog";
import { StoryGallery } from "./StoryGallery";

const TEST_DOCUMENT = '<!doctype html><html lang="it"><title>Anteprima in test</title><body></body></html>';

const meta = preview.meta({
  title: "Esplora/Galleria",
  component: StoryGallery,
  // Nested previews have their own stories and a11y runs in both themes there.
  parameters: { layout: "fullscreen", a11y: { options: { iframes: false } } },
  argTypes: {
    entries: { control: false, table: { disable: true } },
    previewTheme: { control: false, table: { disable: true } },
    previewDocument: { control: false, table: { disable: true } },
  },
  render: (args, { globals }) => (
    <StoryGallery
      {...args}
      previewTheme={globals.theme === "light" || globals.theme === "dark" ? globals.theme : "system"}
      previewDocument={import.meta.env.MODE === "test" ? TEST_DOCUMENT : undefined}
    />
  ),
});

export const Componenti = meta.story({
  name: "Galleria",
  beforeEach: async () => {
    if (import.meta.env.MODE === "test") await loadCatalog();
  },
  // Only in tests, so browsing the gallery never changes its filters.
  play: async ({ canvas }) => {
    if (import.meta.env.MODE !== "test") return;
    const search = await canvas.findByRole("searchbox", { name: "Cerca un componente" }, { timeout: 5000 });
    await expect(canvas.getAllByRole("link", { name: /^Apri storia:/ })).toHaveLength(9);
    await userEvent.click(canvas.getByRole("button", { name: "Mostra altri componenti" }));
    await expect(canvas.getAllByRole("link", { name: /^Apri storia:/ }).length).toBeGreaterThan(9);

    await userEvent.click(canvas.getByRole("radio", { name: "UI" }));
    await userEvent.type(search, "Pulsante");
    await expect(canvas.getByRole("heading", { name: "Pulsante" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Apri storia: Pulsante" })).toHaveAttribute(
      "href",
      expect.stringContaining("ui-pulsante--"),
    );
    await expect(canvas.getByRole("link", { name: "Confronta: Pulsante" })).toHaveAttribute(
      "href",
      expect.stringContaining("esplora-confronto--affiancato"),
    );

    await userEvent.click(canvas.getByRole("radio", { name: "Articoli" }));
    await userEvent.clear(search);
    await userEvent.type(search, "componente-inesistente");
    await expect(canvas.getByRole("heading", { name: "Nessun componente trovato" })).toBeVisible();
    await expect(canvas.queryByRole("link", { name: /^Apri storia:/ })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Azzera filtri" }));
    await expect(search).toHaveValue("");
    await expect(canvas.getByRole("radio", { name: "Tutti" })).toBeChecked();
    await expect(canvas.getAllByRole("link", { name: /^Apri storia:/ })).toHaveLength(9);
  },
});

export const Empty = meta.story({
  name: "Catalogo vuoto",
  tags: ["regression"],
  args: { entries: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Il catalogo non contiene componenti.")).toBeVisible();
    await expect(canvas.queryByRole("searchbox")).not.toBeInTheDocument();
  },
});
