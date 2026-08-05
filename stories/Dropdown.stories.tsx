import preview from "../.storybook/preview";
import { Dropdown } from "@/components/Dropdown";
import { TUTTE_LE_CATEGORIE, categoriaFiltroArgType } from "./fixtures";

const meta = preview.meta({
  title: "Components/Dropdown",
  component: Dropdown,
  argTypes: { categoria: categoriaFiltroArgType },
});

// A native <select> under a capsule skin: it carries the keyboard handling, the
// mobile picker and the accessible name for free, and the chevron is an overlay
// with pointer-events none because a <select> cannot hold an SVG child.
//
// No play function on purpose. Changing the value calls router.push, and the
// component's own tree does not change — the parent remounts. A play here would
// assert Next's router mock, not this project's accessibility. See ADR 0012.

// The label, not `null`: `mapping` turns it back into null before the component
// sees it, and this way the control shows the option that is actually selected.
export const Tutte = meta.story({
  args: { categoria: TUTTE_LE_CATEGORIE },
});

export const CategoriaSelezionata = meta.story({
  args: { categoria: "crescita personale" },
});
