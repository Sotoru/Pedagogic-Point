# Release semver con un comando (`npm run release:*`)

`npm run release:patch|minor|major` (→ `scripts/release.sh`) fa in un colpo:
bump di `package.json`/`package-lock.json` **accorpato (`git commit --amend`)
nell'ultimo commit di `develop`** — niente commit `vX.Y.Z` a sé su `develop` —
poi **un commit di merge `vX.Y.Z`** su `main` con l'albero di `develop` e due
parent (`main`, `develop`), tag annotato, push atomico e GitHub Release con note
auto-generate. Il livello (patch/minor/major) lo sceglie chi rilascia; il deploy
resta separato (parte dal push su `main`).

## Considered Options

- **Tooling.** Scelto `npm version` (nativo) + uno script bash + `gh`, zero
  dipendenze — coerente con lo stile del repo. Scartati `semantic-release` /
  `standard-version`: presuppongono Conventional Commits e bump automatico, che
  abbiamo escluso, e `standard-version` è deprecato. Scartato `release-it`: una
  dipendenza per ciò che poche righe di script coprono.
- **Bump automatico dai commit.** Scartato: vogliamo scegliere il livello a
  mano al comando, non derivarlo dalla history.
- **Forma della storia su `main`.** ~~Scelto squash: `main` contiene *solo* i
  commit di rilascio.~~ **Rivisto:** lo squash rendeva i commit di `develop` non
  raggiungibili da `main`, cioè la storia granulare di ciò che ogni versione
  contiene si perdeva nel ramo che si rilascia e si deploya. Il commit di rilascio
  ora ha **due parent** — `main` primo, `develop` secondo — quindi si ottengono
  entrambe le proprietà: `git log --first-parent main` resta il log dei soli
  rilasci (uno per versione, la ragione per cui lo squash era stato scelto) e
  `git log main` raggiunge tutta la storia di `develop`. Si continua a usare
  `commit-tree` e non `git merge --no-ff`: l'albero resta per costruzione quello di
  `develop`, non si fa checkout di `main`, e si evitano i conflitti-fantasma dei
  merge-base obsoleti nei rilasci ripetuti.
- **Changelog.** Nessun `CHANGELOG.md` versionato: il changelog sono le note
  auto-generate della GitHub Release (`--generate-notes`).

## Consequences

- **`main` include la storia di `develop`** (secondo parent), e la vista "un
  commit per rilascio" si ottiene con `git log --first-parent main`. I rilasci
  fatti prima di questa revisione restano squashati: le loro lineage sono disgiunte
  da `develop`, quindi un `git log main` senza `--first-parent` mostra le due
  storie affiancate fino al punto in cui il merge è entrato in uso.
- **`develop` riscritto a ogni release.** Il bump è accorpato nell'ultimo commit
  con `--amend`, quindi quel commit (già su `origin`) viene riscritto: il push usa
  `--force-with-lease=refs/heads/develop` (`main` resta fast-forward, il tag è
  nuovo, nessuno dei due è forzato). Il prezzo di un log di `develop` fatto solo di
  commit "di lavoro", senza il rumore dei commit `vX.Y.Z`; sicuro su repo
  solo-autore, da rivedere se `develop` diventasse condiviso.
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
