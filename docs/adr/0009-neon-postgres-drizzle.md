# Migrate the datastore from Firestore to Neon Postgres via Drizzle

---
Status: accepted — supersedes ADR 0002, revisits ADR 0003
---

We are replacing Firestore with **Neon (serverless Postgres)** accessed through **Drizzle ORM**, because a relational store fits the content model better and removes the Firebase service-account credential and lock-in. This supersedes ADR 0002 (mirror the legacy Firestore schema) and revisits ADR 0003 (Firebase Admin for SSR): the read path moves to Drizzle, but the SSR/ISR shape (`revalidate = 300`) and the server actions (`refreshPerla`, `loadMoreArticoli`) carry over unchanged, and all UI/call sites stay the same. The two collections become two tables — `articles` (the 7 active fields; `domande` is dropped for good) and `perle` (`contenuto`) — with columns `NOT NULL DEFAULT` so `lib/data.ts` can drop its null-coalescing mapper.

## Considered Options

- **Driver:** chose `@neondatabase/serverless` + `drizzle-orm/neon-http` (HTTP, one round-trip per query, no pooling) over the WebSocket serverless Pool or a Node `pg` pool — every current query is a single-statement read on a serverless target, so HTTP is the lowest-friction fit.
- **Primary key:** now a **DB-generated `uuid`** (`defaultRandom()`). The initial cutover kept the opaque Firestore document IDs as a `text` PK to make the swap byte-for-byte like-for-like, then switched to UUID once the datastore was stable. Keyset pagination stays `ORDER BY id` with `gt(cursor)` — arbitrary but stable order, same as before.
- **Article lookup:** articles are fetched by a stored, unique **`slug`** column (`text NOT NULL UNIQUE`), normalized from `titolo` by a pure `slugify` (lowercase, diacritics stripped, non-alphanumerics collapsed to single dashes). This replaces the legacy scheme of reversing the URL back into a title, eliminating the literal-`-` round-trip fragility. Slug uniqueness is enforced strictly (no de-dup suffix); the seed fails loudly on any collision.
- **Cutover:** big-bang single PR with a full Firebase purge (Admin SDK, `firebase-admin` dep, `FIREBASE_*` env vars all removed), rather than a feature-flag or phased rollout — justified by the tiny surface. A one-time `scripts/seed-from-firestore.mts` reads Firestore via the Admin SDK, inserts into Neon, and is deleted in the same PR (recoverable from git history). The old Firestore data is left physically intact as the ultimate re-seed fallback.
- **Migration workflow:** `drizzle-kit push` (no versioned migration files) for now — solo project, empty tables, pre-launch on this datastore; adopt `generate`/`migrate` later once the schema stabilizes.

## Consequences

- `firebase-admin` and the obsolete Firestore maintenance scripts (`migrate-article-body.mts`, `remove-unused-article-fields.mts`) are removed; env config collapses from three `FIREBASE_*` vars to a single `DATABASE_URL`.
- URLs changed shape with the slug switch (e.g. `La-pedagogia-nera` → `la-pedagogia-nera`); acceptable since the site was not yet in production.
