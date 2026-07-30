# Use a single Markdown body for articles

Articles now use `body` as the canonical long-form content field: a single Markdown string, separate from `introduzione`, with raw HTML disabled in the renderer. This deliberately cuts over from the legacy `domande` Q&A array because the editorial model is a continuous article body; the migration script converts each old question into a `##` heading and preserves `domande` in Firestore for rollback rather than deleting it during the first pass.
