import preview from "../../.storybook/preview";
import { HomeScreen } from "@/components/HomeScreen";
import { articoli, articoloInEvidenza, perla } from "../fixtures";

const meta = preview.meta({
  title: "Schermate/Home",
  component: HomeScreen,
  parameters: { layout: "fullscreen" },
  args: {
    featured: articoloInEvidenza,
    articoli,
    nextCursor: "00000000-0000-4000-8000-000000000003",
    perla,
    categoria: null,
  },
});

export const Default = meta.story({ name: "Home" });
