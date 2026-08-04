import preview from "../.storybook/preview";
import { ArticleCard } from "./ArticleCard";
import { articoli, articoloSenzaIntroduzione } from "./fixtures";
import { articleGrid } from "@/styled-system/recipes";

const meta = preview.meta({
  title: "Components/ArticleCard",
  component: ArticleCard,
  args: { articolo: articoli[1] },
  decorators: [
    (Story) => (
      // The card is a grid child in the app; giving it the grid's column width
      // here keeps its proportions honest instead of letting it fill the canvas.
      <div className={articleGrid().list} style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
});

// Whole card is the click target via the stretched link's ::after; the title is
// the accessible name, so there is one link per card rather than three.
export const Default = meta.story({});

// Empty `introduzione` → excerpt() returns the generic teaser. The only branch in
// that helper, and invisible from the site unless an author leaves the field blank.
export const SenzaIntroduzione = meta.story({
  args: { articolo: articoloSenzaIntroduzione },
});
