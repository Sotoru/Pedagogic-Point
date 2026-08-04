import preview from "../.storybook/preview";
import { MarkdownBody } from "./MarkdownBody";

const meta = preview.meta({
  title: "Components/MarkdownBody",
  component: MarkdownBody,
});

// Every element the prose styles actually target, in one body. Raw HTML parsing
// is disabled in the component (`disableParsingRawHTML`), so the markdown here is
// the whole surface — ADR 0008 keeps article bodies free of inline HTML.
const CAMPIONE = `
## Il linguaggio come sistema

Il linguaggio verbale è il sistema di segni più articolato di cui disponiamo, e la
sua acquisizione segue tappe riconoscibili che nessun bambino salta.

### Le tappe

1. La lallazione, dove il suono precede il significato.
2. La parola-frase, dove una parola porta un'intenzione intera.
3. La frase, dove la grammatica comincia a fare il lavoro.

> Chi non sa nominare una cosa, di quella cosa non può ancora ragionare.

Alcuni termini restano tecnici: la *fonetica*, la **fonologia**, la morfologia. Il
campo li tratta come \`discipline\` distinte, e vale la pena tenerle separate.

- Fonetica: i suoni come fatti fisici.
- Fonologia: i suoni come sistema.
- Morfologia: la forma delle parole.

E un rimando, perché i link vivono nel corpo del testo: [la pedagogia nera](/articoli/la-pedagogia-nera).
`;

export const Completo = meta.story({
  args: { children: CAMPIONE },
});

// A body that is a single paragraph — the common case by a wide margin.
export const SoloTesto = meta.story({
  args: {
    children:
      "L'obbedienza ottenuta con la paura non educa: addestra. La distinzione regge anche quando gli esiti, visti da fuori, si assomigliano.",
  },
});
