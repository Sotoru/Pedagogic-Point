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
- [x] Aggiornare tutte le dipendenze possibili (minor/patch + `next` 16.3.0, poi `@types/node` allineato al runtime)
- [ ] **TypeScript 7** (compilatore nativo Go): riaprire quando Next dichiara il supporto al porting nativo **e** `typescript-eslint` alza il peer a `<8.0.0`. Oggi il pacchetto non espone più `lib/typescript.js` (l'API vive sotto `unstable/*`), quindi il type-check di `next build` e le regole type-aware si romperebbero; inoltre tsgo scarta l'opzione tsconfig `plugins`, rendendo inerte `{ "name": "next" }`
- [ ] **ESLint 10**: riaprire quando `eslint-plugin-react`, `eslint-plugin-import` e `eslint-plugin-jsx-a11y` dichiarano peer `^10` (oggi si fermano a `^9` e `npm install` va in `ERESOLVE`). `eslint-config-next` è già pronto (`eslint: >=9.0.0`)
- [ ] **Node 24** (Active LTS) + `@types/node@^24`: è un cambio di runtime, non un aggiornamento di dipendenze — richiede `.nvmrc`, eventuale `engines.node` e la stessa versione nelle impostazioni Vercel
- [ ] Advisory residui di `npm audit` senza fix reale: `postcss` (high, path traversal via `sourceMappingURL`, solo build-time) e il cluster `@pandacss/*`/`drizzle-kit`. npm propone downgrade (`@pandacss/dev@0.31.0`, `drizzle-kit@0.18.1`): **mai** `npm audit fix --force` qui
