# TODO list

## Front end

- [x] Add 404 page
- [ ] Improve color system (less color e light/dark **same color palette** but **inverted**)
- [ ] Improve card item with border on hover
- [x] Add "fake admin" page, with a private route _/admin_ and hardcoded password (env, see ADR 0010)
  - [x] Under _/admin_ create a page to view/edit all the article (full CRUD + Markdown editor + Unsplash cover picker)

## Back end

- [ ] Migrate to **Neon Db** + **Drizzle** (big-bang, single PR — see ADR 0009)
  - [x] Add deps: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`
  - [x] `lib/db/schema.ts` — `articles` (text PK = Firestore id, 7 fields `NOT NULL DEFAULT`, drop `domande`) + `perle` (`contenuto`)
  - [x] `lib/db/index.ts` — Neon `neon-http` client (replaces `firebase-admin.ts`); `drizzle-kit push`
  - [x] One-time `scripts/seed-from-firestore.mts` — Firestore → Neon, verify, then delete
  - [x] Rewrite `lib/data.ts` on Drizzle (two-query `getFeatured`, `gt(id, cursor)`, `ORDER BY random()`, keep try/catch-degrade)
  - [x] Purge Firebase: remove `firebase-admin`, obsolete scripts, `FIREBASE_*` → `DATABASE_URL`
  - [x] _Later (separate):_ surrogate PK (UUID) + **slug** field for article url search params
  - [x] Migrate all article body content(article.domande) from **html** to **md**
  - [x] Update article.domande into unique field

## Shared

- [ ] Ts **.env** handling with <https://env.t3.gg/docs/nextjs> create **serverEnv.ts** & **clientEnv.ts**
