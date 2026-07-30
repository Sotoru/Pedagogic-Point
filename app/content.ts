// Domain types + pure helpers for home-page content. Live data comes from
// `lib/data.ts`; field names still mirror Firestore except the canonical article
// body, which replaces the old `domande` Q&A structure.

export type Article = {
  id: string; // uuid, DB-generated
  slug: string; // URL-safe, normalized from titolo (see slugify); unique
  titolo: string;
  introduzione: string; // "" => card excerpt falls back to a generic teaser
  copertina: string; // Unsplash photo URL
  categoria: string;
  evidenza: boolean; // featured => renders in the hero
  autore: string;
  body: string; // Markdown article body, separate from introduzione
};

export type Perla = { contenuto: string };

// Normalized URL slug from a title: lowercase, accents stripped, any run of
// non-alphanumerics collapsed to a single dash, trimmed. Deterministic and
// pure — the single source of truth used both at seed time (stored in the
// `slug` column) and never reversed, so the old `-` round-trip fragility is
// gone. Example: "La pedagogia nera" -> "la-pedagogia-nera".
export const slugify = (titolo: string): string =>
  titolo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (accents)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics -> dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

// Categoria -> design.md accent token. Multiple categorie may share a token.
export const categoryAccent: Record<string, string> = {
  apprendimento: "secondary",
  community: "pedagogy",
  "crescita personale": "theory",
  curiosità: "practice",
  "tutela diritti umani": "rights",
};

// The filter dropdown's options — same source of truth as the tag accents, so
// the filter and the CategoryTag palette can't drift.
export const CATEGORIE = Object.keys(categoryAccent);

// Narrow a raw `?categoria=` search param to a known category, else null (= no
// filter). Absent, array, or unknown values all degrade to "All" so junk URLs
// render the full list instead of an empty grid or a 404.
export function resolveCategoria(raw: string | string[] | undefined): string | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && categoryAccent[v] ? v : null;
}

// Reading-time estimate: intro characters + Markdown body words, /120, floored.
export function letturaTime(a: Article): number {
  let count = a.introduzione ? a.introduzione.length : 0;
  count += a.body.trim() ? a.body.trim().split(/\s+/).length : 0;
  return Math.floor(count / 120);
}

// First sentence of the intro, else a generic teaser (matches the legacy behaviour).
export function excerpt(a: Article): string {
  if (!a.introduzione) return "Scopri di più in questo articolo!";
  const end = a.introduzione.indexOf(".");
  return end === -1 ? a.introduzione : a.introduzione.slice(0, end + 1);
}
