import preview from "../.storybook/preview";
import { Wordmark } from "@/components/Wordmark";
import { css } from "@/styled-system/css";
import { keepInTop } from "./explore/styles";

const EXPLORERS = [
  {
    title: "Galleria visiva",
    label: "Trova il componente giusto",
    description: "Sfoglia le anteprime, cerca per nome e filtra per area del sito.",
    href: "./?path=/story/esplora-galleria--componenti",
  },
  {
    title: "Confronto affiancato",
    label: "Uno scenario, due prospettive",
    description: "Confronta chiaro e scuro o telefono e desktop, con anteprime interattive.",
    href: "./?path=/story/esplora-confronto--affiancato",
  },
];
const FEATURED = [
  {
    title: "Elenco articoli",
    description: "La griglia della home, con caricamento progressivo ed errori.",
    href: "./?path=/story/componenti-articoli-elenco-articoli--default",
  },
  {
    title: "Perla pedagogica",
    description: "La citazione del giorno e il suo aggiornamento.",
    href: "./?path=/story/componenti-perla-pedagogica--default",
  },
  {
    title: "Editor del testo",
    description: "La scrittura degli articoli nell’area riservata.",
    href: "./?path=/story/componenti-amministrazione-editor-del-testo--chiaro",
  },
];
const SECTIONS = [
  { title: "Esplora", description: "La galleria visiva e il confronto degli scenari." },
  { title: "Componenti", description: "Le parti del sito, organizzate per area." },
  { title: "UI", description: "I controlli condivisi e i loro stati." },
  { title: "Fondamenti", description: "Colori, tipografia, icone e marchio da docs/design.md." },
];

const STACK = css({ display: "flex", flexDirection: "column", gap: "4" });
const SECTION_TITLE = css({ textStyle: "headline-sm", color: "primary" });
const NOTE = css({ textStyle: "body-md", color: "muted" });
const GRID = css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: "6" });
const CARD = css({
  display: "flex",
  flexDirection: "column",
  gap: "2",
  padding: "6",
  borderRadius: "lg",
  border: "1px solid",
  borderColor: "border-subtle",
  backgroundColor: "surface-container",
  color: "on-surface",
  transitionProperty: "border-color",
  transitionDuration: "150ms",
  _hover: { borderColor: "primary" },
});

function Overview() {
  return (
    <main
      className={css({
        marginInline: "auto",
        maxWidth: "content-max",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: "12",
        display: "flex",
        flexDirection: "column",
        gap: "12",
      })}
    >
      <header className={STACK}>
        <p className={css({ textStyle: "label-caps", color: "muted" })}>Il catalogo dell’interfaccia</p>
        <h1>
          <Wordmark variant="brand-wordmark-lg" />
        </h1>
        <p className={NOTE}>
          Articoli e perle di pedagogia. Esplora i componenti che danno forma al sito, nei due temi e a ogni
          larghezza.
        </p>
      </header>

      <section className={STACK} aria-labelledby="overview-explorers">
        <h2 id="overview-explorers" className={SECTION_TITLE}>Guarda da vicino</h2>
        <nav aria-label="Strumenti per esplorare" className={css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: "6" })}>
          {EXPLORERS.map((explorer) => (
            <a key={explorer.href} className={CARD} href={explorer.href} target="_top" onClick={keepInTop}>
              <span className={css({ textStyle: "label-caps", color: "muted" })}>{explorer.label}</span>
              <span className={SECTION_TITLE}>{explorer.title} →</span>
              <span className={NOTE}>{explorer.description}</span>
            </a>
          ))}
        </nav>
      </section>

      <section className={STACK} aria-labelledby="overview-featured">
        <h2 id="overview-featured" className={SECTION_TITLE}>Parti principali</h2>
        <nav aria-label="Componenti in evidenza" className={GRID}>
          {FEATURED.map((item) => (
            <a key={item.href} className={CARD} href={item.href} target="_top" onClick={keepInTop}>
              <span className={SECTION_TITLE}>{item.title} →</span>
              <span className={NOTE}>{item.description}</span>
            </a>
          ))}
        </nav>
      </section>

      <section className={STACK} aria-labelledby="overview-guide">
        <h2 id="overview-guide" className={SECTION_TITLE}>Orientarsi nel catalogo</h2>
        <dl className={css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: "6" })}>
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <dt className={css({ textStyle: "label-caps", color: "primary", marginBottom: "1" })}>{section.title}</dt>
              <dd className={NOTE}>{section.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className={css({ display: "flex", flexDirection: "column", gap: "2", borderTop: "1px solid", borderTopColor: "border-subtle", paddingTop: "6" })}>
        <p className={NOTE}>
          Usa <strong>Tema</strong> nella barra degli strumenti per confrontare chiaro e scuro.
        </p>
        <p className={NOTE}>
          I casi tecnici restano disponibili: attiva il tag <strong>regression</strong> nei filtri della barra
          laterale.
        </p>
      </footer>
    </main>
  );
}

const meta = preview.meta({
  title: "Panoramica",
  component: Overview,
  parameters: { layout: "fullscreen" },
});

export const Benvenuto = meta.story({ name: "Panoramica" });
