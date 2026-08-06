import { expect } from "storybook/test";
import preview from "../.storybook/preview";
import { PerlaPedagogica } from "@/components/PerlaPedagogica";
import { perla, perlaAlternativa } from "./fixtures";

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

// The refresh swaps the quote inside a role="status" region, so the new perla is
// read out instead of appearing silently. The region ships with its content
// already in place, which is why mounting announces nothing and only a click does.
export const Refresh = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: "Mostra un'altra perla" }));
    await expect(await canvas.findByText(perlaAlternativa.contenuto, { exact: false })).toBeInTheDocument();
  },
});

// No perla in the database → the component renders nothing rather than an empty
// card. Kept as a story because "renders nothing" is a decision, not an accident.
export const Assente = meta.story({
  args: { initialPerla: null },
});
