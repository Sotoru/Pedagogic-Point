# TODO list

## Front end

- [x] Add 404 page
- [ ] Improve color system (less color e light/dark **same color palette** but **inverted**)
- [ ] Improve card item with border on hover
- [x] **`brand-wordmark-sm` non è mai stata generata**: `Wordmark` fa `css({ textStyle: variant })` con una variabile a runtime, quindi Panda non estrae il valore che arriva dal call site. `brand-wordmark-lg` esisteva solo perché è il default del parametro, risolto nello stesso file; `"brand-wordmark-sm"` è passata da `Footer.tsx:22` e la classe non c'era (`grep -c` → 0). Effetto: il wordmark del footer perdeva font-size (32px), line-height e letter-spacing, e rendeva alla dimensione ereditata. Risolto con `staticCss` `textStyle: ["*"]` in `panda.config.ts`, più `npm run check:tokens` nel cancello di `release.sh` perché una classe assente non è una violazione che linter o axe possano vedere — vedi ADR 0012
- [x] **Storybook** (`@storybook/nextjs-vite`) con axe per story (`addon-a11y` + addon Vitest): 13 componenti di `components/`, 33 story, più due fogli **Foundations** generati dai token (tutta la typography, tutto il color system, canonici vs alias, Categoria→accento) in light e dark. `npm run check:stories` resta manuale come `check:a11y` — vedi ADR 0012
  - [ ] Passata dark della suite: un secondo project Vitest con `storybookTest({ initialGlobals: { theme: "dark" } })`, ~6 righe. Non fatto perché `check:contrast` copre già ogni coppia dichiarata nei due schemi; riaprire se un difetto dark sfugge a entrambi
  - [ ] Story per `app/admin/*`: servono il mock di `searchUnsplash` (MSW) e una deroga esplicita per le violazioni MDXEditor che ADR 0011 registra come non risolte
  - [x] **Pannello Controls vuoto per `Button`**: `styled("button", button)` è una factory Panda e react-docgen non ci vede dentro, quindi nessuna prop veniva inferita. `argTypes` esplicite in `Button.stories.tsx` (`variant` letta da `button.variantMap`, più `children`, `disabled`, `aria-disabled`, `type`, `onClick`); le props di stile Panda restano fuori per scelta
- [x] Add "fake admin" page, with a private route _/admin_ and hardcoded password (env, see ADR 0010)
  - [x] Under _/admin_ create a page to view/edit all the article (full CRUD + Markdown editor + Unsplash cover picker)
- [x] Predisporre l'a11y: target WCAG 2 AA, regole `jsx-a11y` complete, contrasti a norma, focus ring tokenizzato, cambi asincroni annunciati, due controlli (`check:contrast` + `check:a11y`) — vedi ADR 0011
  - [x] Destinazioni reali per i tre link del footer (`/privacy`, `/termini`, `/rss.xml`) al posto di `href="#"`
  - [x] Compilare titolare ed email in `/privacy` e `/termini` (bozze fattuali, **non** consulenza legale: da rileggere se il sito cambia comportamento)
  - [ ] Collegare il tema scuro di MDXEditor (oggi la sua chrome resta chiara sotto il nostro `.dark`): poi il literal `#646d74` in `BodyEditor.tsx` può tornare al token `muted`
- [ ] **Categorie disallineate fra codice e dati**: `app/content.ts` mappa `curiosità` (à) mentre le righe dicono `curiositá` (á, 14 articoli) più una `Curiositá` (1), e `bes` (10 articoli) non è mappata affatto. Effetti: l'opzione "curiosità" del filtro dà zero risultati, i `bes` non sono filtrabili, e 25 articoli mostrano il tag col colore di fallback (`secondary`). Da decidere: normalizzare le righe con un `UPDATE` e/o aggiungere `bes` a `categoryAccent` con un accento assegnato. NB: sistemandolo, `practice` verrà reso per la prima volta — i contrasti sono già a norma, quindi si può fare senza far emergere difetti

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
- [ ] **Node 24** (Active LTS) + `@types/node@^24`: è un cambio di runtime, non un aggiornamento di dipendenze — richiede la versione nelle impostazioni del progetto Vercel e, se la si vuole fissare nel repo, un `engines.node` in `package.json` (oggi non esiste né quello né un `.nvmrc`: il riferimento è solo il Node installato in locale)
- [x] `scripts/release.sh`: aggiunto `npm run check:contrast` al cancello (istantaneo, zero dipendenze); `check:a11y` resta manuale perché pretende chromium e il DB
- [x] `scripts/release.sh`: il commit di rilascio su `main` ha ora **due parent**, così la storia granulare di `develop` non si perde più (prima lo squash la rendeva non raggiungibile da `main`). `git log --first-parent main` resta il log dei soli rilasci — vedi ADR 0007
- [ ] Advisory residui di `npm audit` senza fix reale: `postcss` (high, path traversal via `sourceMappingURL`, solo build-time) e il cluster `@pandacss/*`/`drizzle-kit`. npm propone downgrade (`@pandacss/dev@0.31.0`, `drizzle-kit@0.18.1`): **mai** `npm audit fix --force` qui
