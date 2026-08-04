import { defineSlotRecipe } from "@pandacss/dev";

// Card (design.md): 1px border-subtle, no shadow, ≥24px padding.
// Slots hold only styling; the stretched-link ::after stays inline on the <Link>
// (it's the whole-card click target, coupled to markup — see ArticleCard).
export const articleCard = defineSlotRecipe({
  className: "articleCard",
  slots: ["root", "media", "image", "body", "title", "excerpt", "meta"],
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "lg",
      border: "1px solid",
      borderColor: "border-subtle",
      backgroundColor: "surface",
      transitionProperty: "border-color",
      transitionDuration: "150ms",
      _hover: { borderColor: "primary" },
      // The stretched link's own ring would outline just the title text, leaving
      // a keyboard user unsure what they are about to activate. Ring the card
      // instead. Nesting the link's outline:none inside the :has() means a
      // browser without :has() support drops the whole block and keeps the
      // global ring, rather than ending up with no visible focus at all.
      "&:has(a:focus-visible)": {
        outline: "2px solid",
        outlineColor: "primary",
        outlineOffset: "2px",
        "& a:focus-visible": { outline: "none" },
      },
    },
    media: { position: "relative", aspectRatio: "16/10" },
    image: { objectFit: "cover" },
    body: { padding: "6", textAlign: { base: "center", md: "left" } },
    title: { textStyle: "headline-sm", marginTop: "3", color: "primary" },
    excerpt: { textStyle: "body-md", marginTop: "2", color: "muted" },
    meta: { marginTop: "4" },
  },
});
