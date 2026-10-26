import { expect, fn, screen, within, waitFor } from "storybook/test";
import preview from "../.storybook/preview";
import { BodyEditor } from "@/app/admin/BodyEditor";

const meta = preview.meta({
  title: "Admin/BodyEditor",
  component: BodyEditor,
  args: { markdown: "", onChange: fn() },
});

export const Chiaro = meta.story({
  play: async ({ canvas, userEvent, args }) => {
    const editor = canvas.getByRole("textbox", { name: "editable markdown" });
    await userEvent.click(editor);
    await userEvent.type(editor, "Un testo leggibile mentre scriviamo.");
    await expect(editor).toHaveTextContent("Un testo leggibile mentre scriviamo.");
    await expect(args.onChange).toHaveBeenCalled();
  },
});

export const Scuro = meta.story({
  globals: { theme: "dark" },
  play: async ({ canvas, userEvent, args }) => {
    const editor = canvas.getByRole("textbox", { name: "editable markdown" });
    await userEvent.click(editor);
    await userEvent.type(editor, "Un testo leggibile anche al buio.");
    await expect(editor).toHaveTextContent("Un testo leggibile anche al buio.");
    await expect(args.onChange).toHaveBeenCalled();
  },
});

export const Titoli = meta.story({
  args: { markdown: "Un titolo da formattare" },
  play: async ({ canvas, userEvent, args }) => {
    const editor = canvas.getByRole("textbox", { name: "editable markdown" });
    await userEvent.click(editor);
    await userEvent.selectOptions(canvas.getByRole("combobox", { name: "Tipo di blocco" }), "h2");
    await expect(await canvas.findByRole("heading", { level: 2 })).toHaveTextContent("Un titolo da formattare");
    await expect(args.onChange).toHaveBeenCalledWith("## Un titolo da formattare", false);
    await expect(editor).toHaveFocus();
  },
});

export const Collegamento = meta.story({
  globals: { theme: "dark" },
  play: async ({ canvas, userEvent, args }) => {
    const editor = canvas.getByRole("textbox", { name: "editable markdown" });
    await userEvent.click(editor);
    await userEvent.click(canvas.getByRole("button", { name: "Create link" }));
    const dialog = await screen.findByRole("dialog", { name: "Modifica collegamento" });
    const fields = within(dialog);
    await expect(fields.getByRole("textbox", { name: "Indirizzo URL" })).toHaveFocus();
    await userEvent.type(fields.getByRole("textbox", { name: "Indirizzo URL" }), "https://example.com");
    await userEvent.clear(fields.getByRole("textbox", { name: "Testo del collegamento" }));
    await userEvent.type(fields.getByRole("textbox", { name: "Testo del collegamento" }), "Approfondimento");
    await userEvent.click(fields.getByRole("button", { name: "Salva link" }));
    await expect(await within(editor).findByRole("link", { name: "Approfondimento" })).toHaveAttribute("href", "https://example.com");
    await expect(args.onChange).toHaveBeenCalledWith("[Approfondimento](https://example.com)", false);
    const preview = within(await canvas.findByRole("group", { name: "Collegamento" }));
    await userEvent.click(preview.getByRole("button", { name: "Modifica link" }));
    await expect(await screen.findByRole("textbox", { name: "Indirizzo URL" })).toHaveValue("https://example.com");
    // Browser-native Escape is covered with trusted keys in check:a11y.
    await userEvent.click(screen.getByRole("button", { name: "Annulla" }));
    await expect(screen.queryByRole("dialog")).toBeNull();
    await expect(editor).toHaveFocus();
    const restoredPreview = within(await canvas.findByRole("group", { name: "Collegamento" }));
    await userEvent.click(restoredPreview.getByRole("button", { name: "Rimuovi link" }));
    await waitFor(() => expect(within(editor).queryByRole("link")).toBeNull());
    await expect(editor).toHaveTextContent("Approfondimento");
  },
});
