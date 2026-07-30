# Mirror the legacy Firestore schema (superseded for article body by ADR 0008)

Step 2 wired this home page to the same Firestore backend as the previous
project (`Sotoru/PedadgogicPoint-ssr`, collections `articoliDinamici` and
`pillole`). The initial integration mirrored the legacy doc shape verbatim —
Italian field names (`titolo`, `introduzione`, `copertina`, `categoria`,
`evidenza`, `autore`, `domande`) — and computed reading time from legacy answer
content rather than storing it. ADR 0008 supersedes this for the article body:
`domande` is no longer the application model, `body` is the canonical long-form
content field, and reading time is estimated from `introduzione` plus Markdown
`body`.
