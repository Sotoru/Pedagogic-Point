# Release semver con un comando (`npm run release:*`)

`npm run release:patch|minor|major` (→ `scripts/release.sh`) fa in un colpo:
bump di `package.json`/`package-lock.json` su `develop`, poi **un solo commit
`vX.Y.Z`** su `main` con l'albero di `develop`, tag annotato, push atomico e
GitHub Release con note auto-generate. Il livello (patch/minor/major) lo sceglie
chi rilascia; il deploy resta separato (parte dal push su `main`).

## Considered Options

- **Tooling.** Scelto `npm version` (nativo) + uno script bash + `gh`, zero
  dipendenze — coerente con lo stile del repo. Scartati `semantic-release` /
  `standard-version`: presuppongono Conventional Commits e bump automatico, che
  abbiamo escluso, e `standard-version` è deprecato. Scartato `release-it`: una
  dipendenza per ciò che poche righe di script coprono.
- **Bump automatico dai commit.** Scartato: vogliamo scegliere il livello a
  mano al comando, non derivarlo dalla history.
- **Forma della storia su `main`.** Scelto **squash via `git commit-tree`**:
  `main` contiene *solo* i commit di rilascio (uno per versione), non i commit
  granulari di `develop`. Scartato `git merge --no-ff` (i commit di `develop`
  sarebbero raggiungibili da `main`, "uno per release" solo con
  `--first-parent`). Si usa `commit-tree` invece di `git merge --squash` per
  evitare i conflitti-fantasma dei merge-base obsoleti nei rilasci ripetuti.
- **Changelog.** Nessun `CHANGELOG.md` versionato: il changelog sono le note
  auto-generate della GitHub Release (`--generate-notes`).

## Consequences

- **`main` diverge da `develop`** per costruzione: non condividono la storia
  granulare, solo la radice. È il prezzo voluto per un `main` = log dei rilasci.
- **Fonte della versione = `package.json` di `develop`.** `develop` viene
  bumpato per primo e resta la base del prossimo numero; `main` riceve quello
  stesso valore nello snapshot.
- **`gh auth login` una tantum** serve solo per lo step GitHub Release; se
  manca, push e tag sono comunque completi e consistenti e la release si crea
  dopo a mano.
- **Schema tag `vX.Y.Z`** (default di `npm version`). Il tag legacy `1.0` è un
  residuo che non collide e viene ignorato dal flusso.
- **Nessun rollback automatico** se il push atomico fallisce (raro, di rete):
  recupero manuale documentato nello script.
