import assert from "node:assert/strict";
import {
  catalogEntries,
  comparisonHref,
  previewHref,
  representativeEntries,
  storyHref,
} from "../stories/explore/catalog.ts";

const entries = catalogEntries([
  { id: "button", title: "UI/Pulsante", name: "Contorno", tags: [] },
  { id: "pending", title: "UI/Pulsante", name: "In attesa", tags: [] },
  { id: "card", title: "Componenti/Articoli/Scheda articolo", name: "Con introduzione", tags: [] },
  { id: "race", title: "Componenti/Articoli/Perla pedagogica", name: "Caricamento", tags: ["regression"] },
  { id: "manual", title: "UI/Immagine", name: "Remota", tags: ["diagnostic"] },
  { id: "private", title: "UI/Pulsante", name: "Interno", tags: ["!dev"] },
  { id: "public", title: "UI/Pulsante", name: "Pubblico", tags: ["regression", "!regression"] },
  { id: "recursive", title: "Esplora/Galleria", name: "Galleria", tags: [] },
  { id: "welcome", title: "Panoramica", name: "Panoramica", tags: [] },
  { id: "colors", title: "Fondamenti/Colori", name: "Colori", tags: [] },
]);

assert.deepEqual(new Set(entries.map(({ id }) => id)), new Set(["button", "pending", "card", "public"]));
assert.deepEqual(
  representativeEntries(entries).map(({ id }) => id),
  ["card", "button"],
);
assert.equal(entries.find(({ id }) => id === "button")?.group, "UI");
assert.equal(entries.find(({ id }) => id === "card")?.group, "Articoli");
assert.equal(entries.find(({ id }) => id === "card")?.componentTitle, "Scheda articolo");

const base = "https://example.com/catalogo/iframe.html";
const story = new URL(storyHref("ui-pulsante--outline"), base);
assert.equal(story.pathname, "/catalogo/");
assert.equal(story.searchParams.get("path"), "/story/ui-pulsante--outline");
const comparison = new URL(comparisonHref("ui-pulsante--outline"), base);
assert.equal(comparison.pathname, "/catalogo/");
assert.equal(comparison.searchParams.get("args"), "initialStoryId:ui-pulsante--outline");
const preview = new URL(previewHref("ui-pulsante--outline", "dark"), base);
assert.equal(preview.pathname, "/catalogo/iframe.html");
assert.equal(preview.searchParams.get("embed"), "true");
assert.equal(preview.searchParams.get("globals"), "theme:dark");

console.log("catalog ok: public scenarios, recursion guard, representative stories and subpath links");
