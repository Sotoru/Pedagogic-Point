import preview from "../.storybook/preview";
import { Dropdown } from "@/components/Dropdown";
import { TUTTE_LE_CATEGORIE, categoriaFiltroArgType } from "./fixtures";

const meta = preview.meta({
  title: "Components/Dropdown",
  component: Dropdown,
  argTypes: { categoria: categoriaFiltroArgType },
});


// The label, not `null`: `mapping` turns it back into null before the component
// sees it, and this way the control shows the option that is actually selected.
export const Tutte = meta.story({
  args: { categoria: TUTTE_LE_CATEGORIE },
});

export const CategoriaSelezionata = meta.story({
  args: { categoria: "crescita personale" },
});
