# PedagogicPoint

Un progetto editoriale in italiano per appassionati di pedagogia e lettori
curiosi. Realizzato con Next.js, React e Panda CSS.

## Prima di creare componenti o interazioni

Leggere [docs/design.md](docs/design.md): è la fonte di verità per identità
visiva, colori, tipografia, layout, componenti, stati e interazioni, inclusi
accessibilità, movimento e temi chiaro/scuro. Ogni nuova UI parte da lì e
riutilizza i componenti e le recipe esistenti. Se manca una regola, aggiornare il
documento insieme all'implementazione; documentare le eccezioni e il motivo.

- [Design system](docs/design.md): valori esatti in YAML e regole d'uso in prosa.
- [Contesto e voce editoriale](CONTEXT.md): pubblico, linguaggio e termini del dominio.
- [Istruzioni per gli agenti](AGENTS.md): convenzioni e verifiche obbligatorie.
- [Guida Git](docs/git.md): Conventional Commits, versioni e deploy.

### Formato e strumenti Google

Il documento segue il formato [DESIGN.md](https://github.com/google-labs-code/design.md)
e la relativa [specifica](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md).
Il pacchetto ufficiale [`@google/design.md`](https://www.npmjs.com/package/@google/design.md)
è già una dipendenza del progetto: fornisce lint, confronto tra versioni ed
esportazione dei token. Il formato è ancora `alpha`.

Google Labs pubblica anche la skill
[`design-md`](https://github.com/google-labs-code/stitch-skills/tree/main/plugins/stitch-utilities/skills/design-md),
dedicata all'estrazione di un design system da un progetto Stitch. Richiede un
progetto e il server MCP Stitch; non è necessaria per mantenere questo documento.
Qui usiamo il CLI ufficiale e il design già implementato nel sito.

### Dai token a Panda

La sorgente resta [docs/design.md](docs/design.md). `npm run tokens` esegue
l'export DTCG di Google e il
[trasformatore Panda](scripts/dtcg-to-panda.mjs), che produce
[theme/tokens.gen.ts](theme/tokens.gen.ts). Il trasformatore legge anche le
estensioni locali `shadows` e `x-panda.textStyles`, descritte nel documento.
Le [recipe](theme/recipes/) applicano gli stili condivisi dei componenti.

I file generati sono ignorati da Git e non vanno modificati a mano.
L'avvio di sviluppo, la build e Storybook rigenerano token e codice Panda.
Dopo una modifica al documento, riavviare il server già aperto per rigenerarli.

## Sviluppo

Installare le dipendenze con la versione Node.js richiesta da Next.js
(almeno 20.9):

```sh
npm ci
npm run dev
```

Aprire [localhost:3000](http://localhost:3000). Le funzioni che accedono ai servizi
esterni richiedono la configurazione d'ambiente locale del progetto.

Per revisionare i componenti e le viste Foundations, con selettore chiaro/scuro:

```sh
npm run storybook
```

Aprire [localhost:6006](http://localhost:6006). Aggiungere o aggiornare le
[storie](stories/) per nuovi componenti, varianti e interazioni; verificare gli
stati pertinenti, mobile e desktop, tastiera e movimento ridotto secondo la
checklist del [design system](docs/design.md#component-review).

## Verifiche

Prima di considerare conclusa una modifica:

```sh
npm run lint
npm run build
npm run check:contrast
npm run check:tokens
```

`npm run lint` esegue ESLint e il lint ufficiale Google sul documento.
Per controllare solo il formato DESIGN.md:

```sh
npm run lint:design
```

Il lint del formato non verifica ogni coppia di colori renderizzata o il
comportamento nel browser: i controlli di contrasto e dei token completano la
verifica. Per modifiche a componenti e storie eseguire anche `npm run check:stories`;
`npm run check:a11y` verifica le pagine con la configurazione d'ambiente locale.
Il controllo usa la build di produzione, include l'area admin senza salvare
contenuti, e copre chiaro/scuro, mobile/desktop, testo digitato e link nell'editor,
dialogo Unsplash, tastiera, movimento ridotto e memoria locale bloccata.
Le storie verificano anche caricamento, errore, riprova e focus a fine paginazione.
Per la Perla coprono anche il passaggio tra testi brevi e lunghi, il ritorno
all'altezza naturale e la ripetizione della stessa citazione.

Dopo modifiche alla navigazione delle copertine, eseguire `npm run check:transitions`
dopo la build. Il controllo apre un server di produzione sulla porta 3101 e
verifica il morph card/hero ↔ articolo in chiaro/scuro, su mobile e desktop,
anche con tastiera e movimento ridotto. Include il ritorno tramite browser e
“Torna agli articoli”, filtri e card aggiunte. Controlla i limiti dei fotogrammi
durante il cambio di proporzioni e l'arrivo alla posizione salvata.

`npm run check:history` verifica sulla porta 3102 il ritorno dall'articolo alla
stessa posizione nell'elenco, anche dopo “Carica altri” e con un filtro attivo,
tramite Indietro del browser e “Torna agli articoli”. Controlla anche il focus,
l'accesso diretto e il ritorno alla home dal logo.

## Git e pubblicazione

Seguire [docs/git.md](docs/git.md): commit Conventional Commits, verifiche verdi
prima del rilascio, produzione Vercel da `main` e versioni nei tag. La guida
contiene la procedura completa di fast-forward e tagging.
