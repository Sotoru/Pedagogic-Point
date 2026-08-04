import type { Metadata } from "next";
import { MarkdownBody } from "@/components/MarkdownBody";
import { css } from "@/styled-system/css";

// Footer destination, same shape as /privacy (shell in the route group layout).
// Ordinary terms for a personal editorial site, not legal advice.
export const metadata: Metadata = {
  title: "Termini di servizio",
  description: "Condizioni d'uso dei contenuti di PedagogicPoint.",
};

const TESTO = `
PedagogicPoint è un sito editoriale che pubblica articoli e spunti di carattere
pedagogico. Usandolo accetti le condizioni descritte qui.

## Contenuti del sito

Gli articoli e le perle pedagogiche sono opera di Paolo Laddomada e sono tutelati dal
diritto d'autore. Puoi leggerli, stamparli e condividerli per uso personale, e
citarne brani indicando la fonte con un collegamento alla pagina originale. Non è
consentita la ripubblicazione integrale, né l'uso commerciale, senza autorizzazione
scritta.

Le immagini di copertina provengono da [Unsplash](https://unsplash.com) e sono
soggette alla [licenza Unsplash](https://unsplash.com/license), non alle condizioni
di questo sito.

## Natura dei contenuti

I testi hanno finalità informativa e divulgativa. Non costituiscono consulenza
educativa, psicologica o sanitaria e non sostituiscono il parere di un
professionista qualificato nel merito di una situazione specifica.

## Nessuna garanzia

Il sito è messo a disposizione così com'è. Pur curando i contenuti con attenzione,
Paolo Laddomada non garantisce che siano completi, aggiornati o privi di errori, né che
il servizio sia sempre raggiungibile e senza interruzioni.

## Collegamenti esterni

Alcune pagine rimandano a siti di terze parti. Su quei contenuti Paolo Laddomada non ha
alcun controllo e non risponde di ciò che vi si trova.

## Modifiche

Queste condizioni possono essere aggiornate: la versione valida è quella
pubblicata su questa pagina.

## Contatti e legge applicabile

Per qualsiasi comunicazione: [paolo.laddomada26@gmail.com](mailto:paolo.laddomada26@gmail.com). Si applica la legge italiana.
`;

export default function TerminiPage() {
  return (
    <>
      <h1 className={css({ textStyle: "headline-md", color: "primary", marginBottom: "6" })}>
        Termini di servizio
      </h1>
      <MarkdownBody>{TESTO}</MarkdownBody>
    </>
  );
}
