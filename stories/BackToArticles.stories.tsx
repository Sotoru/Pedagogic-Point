import preview from "../.storybook/preview";
import { BackToArticles } from "@/components/ArticleNavigation";

const meta = preview.meta({
  title: "Componenti/Articoli/Torna agli articoli",
  component: BackToArticles,
});

// An article opened directly has no originating home visit. Its return control
// remains a normal home link. History restoration needs the live Next router;
// scripts/check-article-history.mjs exercises that cross-page behavior.
export const AccessoDiretto = meta.story({ name: "Torna agli articoli" });
