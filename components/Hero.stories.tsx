import preview from "../.storybook/preview";
import { Hero } from "./Hero";
import { articoloInEvidenza } from "./fixtures";

const meta = preview.meta({
  title: "Components/Hero",
  component: Hero,
  args: { articolo: articoloInEvidenza },
});

// 5/7 text/media split, stacking text-then-image below md. The focus ring is on
// the grid via `&:has(a:focus-visible)`, not on the stretched link: tab to the
// title and the whole hero rings, which is the only honest indication of what
// the click target actually is.
export const Default = meta.story({});

// The only h1 on the site lives here. ADR 0011 records why there is no fallback:
// getFeatured() degrades to the first article by id, so the heading disappears
// only when the database is empty.
export const TitoloLungo = meta.story({
  args: {
    articolo: {
      ...articoloInEvidenza,
      titolo: "La pedagogia nera e il lungo Novecento dell'obbedienza",
    },
  },
});
