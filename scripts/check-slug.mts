// Regression guard for slug generation (run: npm run check:slug).
// Slugs are now stored in the DB and used verbatim in URLs — never reversed —
// so slugify must always emit URL-safe ASCII: lowercase, no accents, single
// dashes, no leading/trailing dashes.
import assert from "node:assert";
import { slugify } from "../app/content.ts";

// Accented title -> accents stripped, spaces to dashes, lowercased.
assert.equal(slugify("Cercando la felicità"), "cercando-la-felicita");

// Ellipsis and other non-alphanumerics collapse to a single dash and trim.
assert.equal(slugify("Facciamo finta che…"), "facciamo-finta-che");

// Pure-ASCII title.
assert.equal(slugify("Acting out"), "acting-out");

// Literal dashes no longer break anything — runs collapse, edges trim.
assert.equal(slugify("La pedagogia - nera"), "la-pedagogia-nera");

console.log("slugify ok");
