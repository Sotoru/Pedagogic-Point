import type { Metadata } from "next";
import { MarkdownBody } from "@/components/MarkdownBody";
import { css } from "@/styled-system/css";

// Footer destination; the Nav/column/Footer shell lives in the route group's
// layout. Prose goes through MarkdownBody so it inherits the article typography
// with no new styling.
//
// The text describes only what the code actually does (no analytics, no tracking
// cookies, one localStorage preference, Unsplash images, Vercel logs), so it needs
// revisiting whenever that changes. It is a factual statement of the site's
// behaviour, not legal advice.
export const metadata: Metadata = {
  title: "Informativa sulla privacy",
  description: "Quali dati raccoglie PedagogicPoint e come vengono trattati.",
};

const TESTO = `
PedagogicPoint non usa strumenti di analisi statistica, non profila i visitatori
e non installa cookie di tracciamento. Questa pagina descrive tutto ciò che
accade quando visiti il sito.

## Titolare del trattamento

Paolo Laddomada — per qualsiasi richiesta relativa ai tuoi dati: [paolo.laddomada26@gmail.com](mailto:paolo.laddomada26@gmail.com).

## Cosa resta nel tuo browser

**Preferenza del tema.** Se scegli il tema chiaro o scuro, la scelta viene salvata
nella memoria locale del browser (\`localStorage\`, chiave \`theme\`) per non
riproporti ogni volta il tema sbagliato. Non è un cookie, non viene inviata a
nessun server e puoi cancellarla svuotando i dati del sito dal tuo browser.

**Cookie di sessione dell'area riservata.** Esiste un unico cookie, \`pp_admin\`,
che viene creato solo dopo l'accesso all'area di amministrazione e serve
esclusivamente a chi pubblica gli articoli. Se stai leggendo il sito come
visitatore, questo cookie non viene mai creato.

## Servizi di terze parti

**Immagini (Unsplash).** Le immagini di copertina sono servite da
\`images.unsplash.com\`. Quando una pagina le carica, il tuo browser contatta
direttamente Unsplash, che per poter rispondere vede il tuo indirizzo IP, il tipo
di browser e la pagina di provenienza. Vale la
[privacy policy di Unsplash](https://unsplash.com/privacy).

**Hosting (Vercel).** Il sito è ospitato su Vercel, che come ogni server web
registra log tecnici delle richieste (indirizzo IP, data e ora, pagina richiesta,
tipo di browser) per motivi di sicurezza e diagnostica. Vale la
[privacy policy di Vercel](https://vercel.com/legal/privacy-policy).

**Caratteri tipografici.** I font sono ospitati direttamente da questo sito: il
tuo browser non contatta Google Fonts né altri servizi esterni per scaricarli.

**Base di dati.** Gli articoli sono conservati su un database Neon raggiunto solo
dal server. Non contiene alcun dato relativo ai visitatori.

## Base giuridica e conservazione

I log tecnici dell'hosting sono trattati per l'interesse legittimo a mantenere il
sito sicuro e funzionante, e sono conservati per il tempo previsto dal fornitore.
La preferenza del tema resta nel tuo browser finché non la cancelli tu.

## I tuoi diritti

Puoi chiedere in qualsiasi momento l'accesso, la rettifica, la cancellazione o la
limitazione dei dati che ti riguardano, e opporti al loro trattamento, scrivendo a
[paolo.laddomada26@gmail.com](mailto:paolo.laddomada26@gmail.com). Hai inoltre diritto di reclamo al Garante per la protezione dei dati
personali.

## Modifiche

Se il funzionamento del sito cambia in modo che tocchi questa informativa, la
pagina viene aggiornata.
`;

export default function PrivacyPage() {
  return (
    <>
      <h1 className={css({ textStyle: "headline-md", color: "primary", marginBottom: "6" })}>
        Informativa sulla privacy
      </h1>
      <MarkdownBody>{TESTO}</MarkdownBody>
    </>
  );
}
