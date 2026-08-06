import { defineSlotRecipe } from "@pandacss/dev";

// Article grid (design.md): independent 2-col layout, 1-col below md.
// The page renders root+heading (server); ArticleList renders list+footer (client).
export const articleGrid = defineSlotRecipe({
  className: "articleGrid",
  slots: ["root", "heading", "filter", "filterLabel", "list", "footer"],
  base: {
    root: {
      marginInline: "auto",
      maxWidth: "content-max",
      paddingInline: { base: "margin-mobile", md: "margin-desktop" },
      paddingBlock: { base: "12", md: "16" },
    },
    heading: {
      textStyle: "headline-md",
      marginTop: "6",
      borderBottom: "1px solid",
      borderColor: "border-subtle",
      paddingBottom: "4",
      color: "primary",
    },
    // Dropdown is the control alone (design.md's Filter Pill). The caption
    // beside it is page furniture, so the row that pairs the two lives here with
    // the rest of the grid shell rather than inside the control.
    filter: { display: "flex", alignItems: "center", gap: "3" },
    filterLabel: { textStyle: "body-md", color: "muted" },
    list: {
      display: "grid",
      gridTemplateColumns: { base: "repeat(1, minmax(0, 1fr))", md: "repeat(2, minmax(0, 1fr))" },
      gap: "gutter",
      marginTop: "8",
    },
    footer: { display: "flex", justifyContent: "center", marginTop: "10" },
  },
});
