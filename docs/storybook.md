# Storybook

Storybook è l'unica vetrina dei componenti. Le storie vivono in `stories/`, non
accanto ai componenti: `components/` contiene solo componenti.

## Catalogo

La prima voce, **Panoramica**, introduce la vetrina e collega gli esempi principali.
La navigazione segue l'uso dell'interfaccia:

| Sezione    | Contenuto                                                                   |
| ---------- | --------------------------------------------------------------------------- |
| Esplora    | Galleria visiva e confronto affiancato degli scenari                        |
| Schermate  | Pagine intere del sito (Home, Articolo) composte con le fixture             |
| Componenti | Parti del sito per area: Articoli, Perla pedagogica, Navigazione, Amministrazione |
| UI         | Controlli e primitive riutilizzabili                                        |
| Fondamenti | Colori, tipografia, icone e marchio generati da `docs/design.md`            |

Titoli e nomi visibili sono in italiano; i nomi degli export restano stabili
perché formano identificatori e URL. Quando cambia un nome visibile, mantenere
l'export. Cambiare il titolo della meta cambia il percorso e gli URL: aggiornare
anche i collegamenti della Panoramica (`stories/Overview.stories.tsx`).

Quando un gruppo ha una sola storia visibile, il suo `name` coincide con l'ultimo
segmento del titolo: Storybook la mostra come collegamento diretto, senza una
cartella aggiuntiva.

Nei gruppi con più storie ogni nome descrive uno scenario riconoscibile:
caricamento, dati disponibili, vuoto, errore o un'interazione con esito distinto.
Non creare varianti che ripetono lo stesso esempio; usare i Controls per le
combinazioni semplici delle proprietà.

## Temi

Il tema predefinito della vetrina è **Sistema** e segue `prefers-color-scheme`;
la toolbar **Tema** forza chiaro o scuro per la verifica manuale. Non creare due
storie identiche solo per chiaro e scuro e non bloccare `globals.theme` sulla
singola storia: la suite le esegue già in entrambi i temi.

## Tag

- `regression`: test tecnici (animazioni, stati limite). Esclusi dalla sidebar
  iniziale, eseguiti sempre. Per consultarli rimuovere l'esclusione nel filtro dei
  tag. Non usare `!test` per nasconderli.
- `diagnostic`: prove manuali che dipendono da servizi esterni. Nascoste e con
  `!test` per escluderle dalla suite automatica.

## Esplora

**Esplora/Galleria** mostra un esempio per componente, con ricerca e filtro per
area, nove anteprime alla volta. Ogni scheda apre la storia o il confronto.
**Esplora/Confronto** affianca lo stesso scenario in chiaro e scuro oppure a 384 px
e 1024 px; i due pannelli sono interattivi e indipendenti.

Il catalogo è generato dagli indexer ufficiali di Storybook tramite il modulo
`virtual:storybook-catalog` (`.storybook/catalog-plugin.ts`): nuove storie e
rinominazioni vengono recepite senza elenchi da mantenere. Entrano nel catalogo
solo `Componenti` e `UI`, senza `regression` e `diagnostic`. `npm run check:catalog`
verifica filtri e collegamenti.

I `play` di galleria e confronto girano solo in modalità test, così la navigazione
non cambia filtri o scenario. In Vitest le anteprime usano un documento vuoto e
l'accessibilità esclude i frame annidati, già coperti dalle rispettive storie.

## Test

`npm run check:stories` esegue le storie con Vitest e Chromium: render, `play` e
accessibilità (violazioni WCAG bloccanti). Ogni storia gira nelle istanze
`storybook-light` e `storybook-dark`: Playwright emula la preferenza del sistema
e il tema `system` la segue. Chromium si installa con
`npx playwright install chromium`. Il report a11y conserva violazioni e risultati
inconclusivi, non tutte le regole superate.

Prima di consegnare modifiche visive, aprire la storia nei due temi e verificare
il pannello Accessibilità. Le regole aggiornate per scrivere le storie vengono dal
MCP Storybook (`.mcp.json`, attivo con `npm run storybook`).

## Deploy

Storybook si pubblica con il secondo progetto Vercel `pedagogic-point-storybook`,
collegato alla stessa repository. La vetrina pubblicata richiede il login Vercel
con la protezione predefinita del progetto.

| Impostazione      | Valore                    |
| ----------------- | ------------------------- |
| Framework Preset  | Other                     |
| Root Directory    | Root della repository     |
| Install Command   | `npm ci --include=dev`    |
| Build Command     | `npm run build:storybook` |
| Output Directory  | `storybook-static`        |
| Node.js           | 24.x                      |
| Production Branch | `main`                    |

`build:storybook` rigenera token e Panda prima della vetrina statica; per questo
servono le `devDependencies`. Non servono variabili d'ambiente: le azioni server
sono mockate e il database non entra nel bundle. Non copiare le credenziali del
sito nel progetto Storybook. `develop` produce solo una Preview, come per il sito
([git.md](git.md)).
