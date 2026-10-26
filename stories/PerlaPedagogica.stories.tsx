import { expect, mocked, waitFor } from "storybook/test";
import preview from "../.storybook/preview";
import { PerlaPedagogica } from "@/components/PerlaPedagogica";
import { refreshPerla } from "@/app/actions";
import { perla, perlaAlternativa, perlaBreve, perlaLunga } from "./fixtures";

const meta = preview.meta({
  title: "Components/PerlaPedagogica",
  component: PerlaPedagogica,
  args: { initialPerla: perla },
});

// The card's dark elevation is not a design.md concept — deeper shadows and a
// fill lighter than the band, inlined in the component. That inlined `#26292e`
// is also why check-contrast.mts carries a CARD_FILL special case: real text sits
// on a colour that is not a token.
export const Default = meta.story({});

export const Scura = meta.story({ globals: { theme: "dark" } });

// Keep both extremes available for mobile/desktop and reduced-motion review.
export const Breve = meta.story({ args: { initialPerla: perlaBreve } });
export const Lunga = meta.story({ args: { initialPerla: perlaLunga }, globals: { theme: "dark" } });

export const CambioLunghezza = meta.story({
  args: { initialPerla: perlaBreve },
  play: async ({ canvas, userEvent }) => {
    const button = await canvas.findByRole("button", { name: "Mostra un'altra perla" });
    const card = button.parentElement!;
    const quote = canvas.getByRole("status", { name: "" });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    await document.fonts.ready;
    for (const next of [perlaLunga, perlaBreve]) {
      mocked(refreshPerla).mockResolvedValueOnce(next);
      const before = card.getBoundingClientRect().height;
      await userEvent.click(button);
      await expect(await canvas.findByText(next.contenuto, { exact: false })).toBeInTheDocument();
      // A real intermediate height must exist in both directions. Freeze the
      // browser animation rather than racing a 250ms wall-clock interval.
      const sizeChange = card.getAnimations().find((animation) => animation.effect instanceof KeyframeEffect &&
        animation.effect.getKeyframes().some((frame) => frame.height));
      if (reduce) {
        await expect(sizeChange).toBeUndefined();
      } else {
        await expect(sizeChange).toBeDefined();
        sizeChange!.pause();
        const duration = Number(sizeChange!.effect!.getTiming().duration);
        sizeChange!.currentTime = duration / 2;
        const middle = card.getBoundingClientRect().height;
        sizeChange!.finish();
        await sizeChange!.finished;
        const after = card.getBoundingClientRect().height;
        await expect(middle).toBeGreaterThan(Math.min(before, after));
        await expect(middle).toBeLessThan(Math.max(before, after));
      }
      await Promise.all(quote.getAnimations().map((animation) => animation.finished));
      await waitFor(() => expect(button).toHaveAttribute("aria-busy", "false"));
      await expect(getComputedStyle(quote).opacity).toBe("1");
      await expect(card.style.height).toBe("");
      await expect(quote.getBoundingClientRect().bottom).toBeLessThan(card.getBoundingClientRect().bottom);
      await expect(button).toHaveFocus();
    }
    // The random query can repeat the same quote: do not leave it faded out.
    mocked(refreshPerla).mockResolvedValueOnce(perlaBreve);
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "false"));
    await expect(getComputedStyle(quote).opacity).toBe("1");
    await expect(canvas.getByText(perlaBreve.contenuto, { exact: false })).toBeInTheDocument();
  },
});

// The refresh swaps the quote inside a role="status" region, so the new perla is
// read out instead of appearing silently. The region ships with its content
// already in place, which is why mounting announces nothing and only a click does.
export const Refresh = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Mostra un'altra perla" }));
    await expect(await canvas.findByText(perlaAlternativa.contenuto, { exact: false })).toBeInTheDocument();
  },
});

export const Caricamento = meta.story({
  play: async ({ canvas, userEvent }) => {
    let complete!: (value: typeof perlaAlternativa) => void;
    mocked(refreshPerla).mockImplementationOnce(() => new Promise((resolve) => { complete = resolve; }));
    const button = await canvas.findByRole("button", { name: "Mostra un'altra perla" });
    await userEvent.click(button);
    try {
      await expect(canvas.getByRole("status", { name: "Aggiornamento perla" })).toHaveTextContent("Caricamento…");
      await expect(button).toHaveAttribute("aria-busy", "true");
      await expect(canvas.getByText(perla.contenuto, { exact: false })).toBeInTheDocument();
      const calls = mocked(refreshPerla).mock.calls.length;
      await userEvent.click(button);
      await expect(refreshPerla).toHaveBeenCalledTimes(calls);
    } finally {
      complete(perlaAlternativa);
    }
    await expect(await canvas.findByText(perlaAlternativa.contenuto, { exact: false })).toBeInTheDocument();
    await expect(button).toHaveFocus();
  },
});

export const ErroreERiprova = meta.story({
  globals: { theme: "dark" },
  play: async ({ canvas, userEvent }) => {
    mocked(refreshPerla).mockResolvedValueOnce(null);
    const button = await canvas.findByRole("button", { name: "Mostra un'altra perla" });
    await userEvent.click(button);
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Riprova");
    await expect(canvas.getByText(perla.contenuto, { exact: false })).toBeInTheDocument();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(await canvas.findByText(perlaAlternativa.contenuto, { exact: false })).toBeInTheDocument();
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
});

// No perla in the database → the component renders nothing rather than an empty
// card. Kept as a story because "renders nothing" is a decision, not an accident.
export const Assente = meta.story({
  args: { initialPerla: null },
});
