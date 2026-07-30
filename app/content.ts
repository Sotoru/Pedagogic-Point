// Domain types + pure helpers for home-page content. Live data comes from
// `lib/data.ts`; field names still mirror Firestore except the canonical article
// body, which replaces the old `domande` Q&A structure.

export type Article = {
  id: string;
  titolo: string;
  introduzione: string; // "" => card excerpt falls back to a generic teaser
  copertina: string; // Unsplash photo URL
  categoria: string;
  evidenza: boolean; // featured => renders in the hero
  autore: string;
  body: string; // Markdown article body, separate from introduzione
};

export type Perla = { contenuto: string };

// URL <-> title mapping, mirrored from the legacy repo: the article slug is just
// the title with spaces as dashes, and lookup reverses it. Kept in one place so
// the link and the Firestore query can't drift.
// ponytail: a title containing a literal "-" won't round-trip (deslug turns it
// into a space) — same limitation as the old repo, accepted for URL parity.
export const toSlug = (titolo: string): string => titolo.split(" ").join("-");
// Next 16 hands route params in canonical percent-ENCODED form (see its
// canonicalizeURLPart). Decode before deslugging or non-ASCII titles (accents,
// …) never match the Firestore titolo lookup. Do NOT remove the decode.
export const fromSlug = (slug: string): string => {
  try {
    slug = decodeURIComponent(slug);
  } catch {
    /* malformed %-sequence: fall back to the raw param */
  }
  return slug.split("-").join(" ");
};

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
