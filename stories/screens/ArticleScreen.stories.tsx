import preview from "../../.storybook/preview";
import { ArticleScreen } from "@/components/ArticleScreen";
import { articoli } from "../fixtures";

const meta = preview.meta({
  title: "Schermate/Articolo",
  component: ArticleScreen,
  parameters: { layout: "fullscreen" },
  args: { articolo: articoli[2] },
});

export const Default = meta.story({ name: "Articolo" });
