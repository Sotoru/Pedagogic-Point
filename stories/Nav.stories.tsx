import preview from "../.storybook/preview";
import { Nav } from "@/components/Nav";

const meta = preview.meta({
  title: "Componenti/Navigazione/Barra di navigazione",
  component: Nav,
});

export const Default = meta.story({ name: "Barra di navigazione" });
