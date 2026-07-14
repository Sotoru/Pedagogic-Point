# Mirror the legacy Firestore schema (Italian field names + word-count reading time)

Step 2 wires this home page to the same Firestore backend as the previous
project (`Sotoru/PedadgogicPoint-ssr`, collections `articoliDinamici` and
`pillole`). To make that a zero-transform swap, the hardcoded `Article` type
mirrors the legacy doc shape verbatim — Italian field names (`titolo`,
`introduzione`, `copertina`, `categoria`, `evidenza`, `autore`, `domande`) — and
reading time is *computed* with the legacy formula (`introduzione` char count +
sum of answer word counts, ÷ 120, floored) rather than stored. The field names
are flagged in `content.ts` for a later cleanup pass once the migration is
proven; the formula's quirk (mixing characters and words) is preserved
deliberately so hardcoded and Firebase-fed reading times agree.
