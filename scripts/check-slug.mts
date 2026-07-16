// Regression guard for the URL <-> title round-trip (run: npm run check:slug).
// The bug this protects against: Next 16 delivers route params percent-encoded,
// so a title with non-ASCII chars (accents, …) 404'd until fromSlug decoded it.
import assert from "node:assert";
import { toSlug, fromSlug } from "../app/content.ts";

// The exact case that used to 404: an accented title, param arriving encoded.
const accented = "Cercando la felicità";
assert.equal(fromSlug(encodeURIComponent(toSlug(accented))), accented);

// The ellipsis case from the original report.
const ellipsis = "Facciamo finta che…";
assert.equal(fromSlug(encodeURIComponent(toSlug(ellipsis))), ellipsis);

// Pure-ASCII titles must still round-trip (they always worked).
assert.equal(fromSlug(toSlug("Acting out")), "Acting out");

console.log("slug round-trip ok");
