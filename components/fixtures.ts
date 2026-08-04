import type { Article, Perla } from "@/app/content";
import type { ArticlePage } from "@/lib/data";

// Sample content for the stories. Two rules it follows on purpose:
//
// - Covers point at a local file, not Unsplash, so no story needs the network.
// - The `categoria` values are real keys of `categoryAccent` in app/content.ts,
//   because an unmapped category silently falls back to the `secondary` accent —
//   which is exactly the defect docs/todo-list.md records for the live data, and
//   fixtures that reproduce it would hide it instead of showing it.
const COVER = "/placeholder-cover.svg";

const base = {
  copertina: COVER,
  evidenza: false,
  autore: "Antonella Valletta",
} as const;

export const articoloInEvidenza: Article = {
  ...base,
  id: "00000000-0000-4000-8000-000000000001",
  slug: "il-linguaggio-umano",
  titolo: "Il linguaggio umano",
  introduzione:
    "Il linguaggio è una caratteristica dell'essere umano e implica la capacità di fondere i suoni e i significati mediante regole grammaticali. Le discipline dedite al linguaggio sono la fonetica, la fonologia e la morfologia.",
  categoria: "apprendimento",
  evidenza: true,
  body: "Il linguaggio verbale è il sistema di segni più articolato di cui disponiamo, e la sua acquisizione segue tappe riconoscibili che nessun bambino salta.",
};

export const articoli: Article[] = [
  articoloInEvidenza,
  {
    ...base,
    id: "00000000-0000-4000-8000-000000000002",
    slug: "la-pedagogia-nera",
    titolo: "La pedagogia nera",
    introduzione:
      "Katharina Rutschky ha coniato l'espressione «Schwarze Pädagogik» per indicare una pedagogia che pone la violenza fisica e psichica al centro dell'educazione.",
    categoria: "tutela diritti umani",
    body: "L'obbedienza ottenuta con la paura non educa: addestra. La distinzione regge anche quando gli esiti, visti da fuori, si assomigliano.",
  },
  {
    ...base,
    id: "00000000-0000-4000-8000-000000000003",
    slug: "l-assertivita",
    titolo: "L'assertività",
    introduzione:
      "Il termine assertività indica l'area intermedia nella successione aggressività-passività, dove la propria posizione si afferma senza cancellare quella dell'altro.",
    categoria: "crescita personale",
    body: "Non è una dote di carattere ma una competenza comunicativa, e come tutte le competenze si allena in situazioni concrete.",
  },
];

// Empty `introduzione` → `excerpt()` falls back to the generic teaser. Worth a
// story of its own: it is the only branch in that helper.
export const articoloSenzaIntroduzione: Article = {
  ...base,
  id: "00000000-0000-4000-8000-000000000004",
  slug: "acting-out",
  titolo: "Acting out",
  introduzione: "",
  categoria: "curiosità",
  body: "Un agito che prende il posto di un pensiero non ancora dicibile.",
};

// What the mocked `loadMoreArticoli` appends when "Carica altri" is clicked.
// nextCursor null, so the button disappears after one page and the interaction
// has a definite end state to assert.
export const paginaSuccessiva: ArticlePage = {
  articoli: [
    {
      ...base,
      id: "00000000-0000-4000-8000-000000000005",
      slug: "cercando-la-felicita",
      titolo: "Cercando la felicità",
      introduzione:
        "Nel tempo si sono affermate correnti di pensiero filosofico differenti su cosa sia la felicità, e quasi nessuna la tratta come uno stato stabile.",
      categoria: "community",
      body: "Chi la cerca come meta la manca; chi la riconosce come sottoprodotto la incontra più spesso.",
    },
    articoloSenzaIntroduzione,
  ],
  nextCursor: null,
};

export const perla: Perla = {
  contenuto:
    "Il primo abbraccio che dai a una persona è simile al primo bacio: non lo dimentichi mai. Certo, bisogna tener conto anche della persona a cui lo si dà.",
};

// The perla the mocked refresh returns, so the swap is visible and the polite
// live region has something new to announce.
export const perlaAlternativa: Perla = {
  contenuto:
    "Educare non è riempire un secchio, è accendere un fuoco: e il fuoco, a differenza dell'acqua, prende la forma di chi lo riceve.",
};
