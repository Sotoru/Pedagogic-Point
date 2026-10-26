import { expect, mocked } from "storybook/test";
import preview from "../.storybook/preview";
import { loadMoreArticoli } from "@/app/actions";
import { ArticleList } from "@/components/ArticleList";
import { TUTTE_LE_CATEGORIE, articoli, categoriaFiltroArgType } from "./fixtures";
import { articleGrid } from "@/styled-system/recipes";

const meta = preview.meta({
  title: "Components/ArticleList",
  component: ArticleList,
  argTypes: { categoria: categoriaFiltroArgType },
  args: {
    initialArticoli: articoli,
    // Non-null, so the "Carica altri" button renders at all.
    initialCursor: "00000000-0000-4000-8000-000000000003",
    // The featured article lives in the Hero, so the grid drops it — this page
    // shows one card fewer than PAGE_SIZE by design.
    featuredId: articoli[0].id,
    // `mapping` hands the component null for this label — see fixtures.ts.
    categoria: TUTTE_LE_CATEGORIE,
  },
  decorators: [
    (Story) => (
      // The component renders the `list` and `footer` slots; the page owns `root`.
      <div className={articleGrid().root}>
        <Story />
      </div>
    ),
  ],
});

export const Default = meta.story({});

export const CaricaAltri = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Carica altri" }));

    // The categoria arg is the label "Tutte le categorie" and the action was
    // called with null: proof that the argTypes `mapping` runs here too, not just
    // in the Controls panel.
    await expect(loadMoreArticoli).toHaveBeenCalledWith(expect.any(String), null);

    // The appended page arrived…
    await expect(await canvas.findByText("Cercando la felicità")).toBeInTheDocument();
    // …and said so out loud, which is the part a crawl cannot see (WCAG 4.1.3).
    await expect(canvas.getByRole("status")).toHaveTextContent("2 articoli caricati. 4 in totale.");
    // Keep the same focusable node on the final page: removing it loses focus.
    const complete = canvas.getByRole("button", { name: "Tutti gli articoli sono caricati" });
    await expect(complete).toHaveAttribute("aria-disabled", "true");
    await expect(complete).toHaveFocus();
    const calls = mocked(loadMoreArticoli).mock.calls.length;
    await userEvent.keyboard("{Enter}");
    await expect(loadMoreArticoli).toHaveBeenCalledTimes(calls);
  },
});

export const ErroreERiprova = meta.story({
  play: async ({ canvas, userEvent }) => {
    mocked(loadMoreArticoli).mockRejectedValueOnce(new Error("Network unavailable"));
    const button = await canvas.findByRole("button", { name: "Carica altri" });
    await userEvent.click(button);
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Riprova con Carica altri");
    await expect(button).toHaveFocus();
    await expect(canvas.getByText(articoli[1].titolo)).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByText("Cercando la felicità")).toBeInTheDocument();
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
});

export const Vuota = meta.story({
  args: { initialArticoli: [], initialCursor: null, featuredId: null },
});

// Same empty list, different copy: the filter case names the filter, so the reader
// knows the category is empty rather than the site.
export const VuotaConFiltro = meta.story({
  args: { initialArticoli: [], initialCursor: null, featuredId: null, categoria: "curiosità" },
});
