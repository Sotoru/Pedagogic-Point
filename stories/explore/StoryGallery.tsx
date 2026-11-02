import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { css, cx } from "@/styled-system/css";
import { comparisonHref, previewHref, representativeEntries, storyHref, type CatalogEntry, type PreviewTheme } from "./catalog";
import { useCatalog, usePreviewIsolation } from "./useCatalog";
import { CHIP, CHIPS, EMPTY, EYEBROW, LINK, NOTE, PAGE, PANEL, STACK, TITLE, keepInTop } from "./styles";

const PAGE_SIZE = 9;

type Props = {
  entries?: readonly CatalogEntry[];
  previewTheme?: PreviewTheme;
  // Vitest serves no iframe.html: the play functions swap in an empty document.
  previewDocument?: string;
};

export function StoryGallery({ entries, previewTheme = "system", previewDocument }: Props) {
  const catalog = useCatalog(entries);
  const ref = usePreviewIsolation<HTMLElement>();
  const id = useId();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const components = representativeEntries(catalog.entries);
  const groups = [...new Set(components.map((entry) => entry.group))];
  const search = query.trim().toLocaleLowerCase("it");
  const filtered = components.filter(
    (entry) =>
      (area === "all" || entry.group === area) &&
      `${entry.componentTitle} ${entry.title} ${entry.name}`.toLocaleLowerCase("it").includes(search),
  );
  const visible = filtered.slice(0, visibleCount);

  let body: ReactNode;
  if (catalog.status === "loading") {
    body = <p className={EMPTY} role="status">Caricamento del catalogo…</p>;
  } else if (catalog.status === "error") {
    body = (
      <div className={EMPTY}>
        <p role="alert">Non è stato possibile caricare il catalogo.</p>
        <Button type="button" onClick={catalog.retry}>Riprova</Button>
      </div>
    );
  } else if (components.length === 0) {
    body = <p className={EMPTY}>Il catalogo non contiene componenti.</p>;
  } else {
    body = (
      <>
        <div className={cx(PANEL, css({ display: "flex", flexDirection: "column", gap: "6", padding: "6" }))}>
          <div className={css({ display: "flex", flexDirection: "column", gap: "2", maxWidth: "xl" })}>
            <label className={css({ textStyle: "label-caps", color: "muted" })} htmlFor={`${id}-search`}>
              Cerca un componente
            </label>
            <input
              id={`${id}-search`}
              type="search"
              placeholder="Nome, area o scenario…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className={css({
                textStyle: "body-md",
                paddingBlock: "2",
                paddingInline: "4",
                borderRadius: "full",
                border: "1px solid",
                borderColor: "border-subtle",
                backgroundColor: "surface",
                color: "on-surface",
              })}
            />
          </div>
          <fieldset className={CHIPS}>
            <legend className={css({ textStyle: "label-caps", color: "muted", marginBottom: "2" })}>Area</legend>
            {[{ value: "all", label: "Tutti" }, ...groups.map((group) => ({ value: group, label: group }))].map(
              (filter) => (
                <label key={filter.value} className={CHIP}>
                  <input
                    type="radio"
                    name={`${id}-area`}
                    value={filter.value}
                    checked={area === filter.value}
                    onChange={() => {
                      setArea(filter.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                  />
                  {filter.label}
                </label>
              ),
            )}
          </fieldset>
        </div>

        <div className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4", flexWrap: "wrap" })}>
          <p className={NOTE} role="status" aria-live="polite" aria-atomic="true">
            {filtered.length === 1 ? "1 componente trovato" : `${filtered.length} componenti trovati`} ·{" "}
            {visible.length} in anteprima
          </p>
          {(query || area !== "all") && (
            <Button
              type="button"
              onClick={() => {
                setQuery("");
                setArea("all");
                setVisibleCount(PAGE_SIZE);
              }}
            >
              Azzera filtri
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className={EMPTY}>
            <h2 className={css({ textStyle: "headline-sm", color: "primary" })}>Nessun componente trovato</h2>
            <p className={NOTE}>Prova un altro nome oppure azzera i filtri per rivedere il catalogo.</p>
          </div>
        ) : (
          <ul
            aria-label="Componenti in anteprima"
            className={css({
              listStyleType: "none",
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
              gap: "6",
            })}
          >
            {visible.map((entry) => (
              <li key={entry.id} className={cx(PANEL, css({ minWidth: "0", overflow: "hidden", display: "flex", flexDirection: "column" }))}>
                <div
                  aria-hidden="true"
                  inert
                  className={css({
                    aspectRatio: "landscape",
                    overflow: "hidden",
                    backgroundColor: "background",
                    borderBottom: "1px solid",
                    borderBottomColor: "border-subtle",
                  })}
                >
                  <iframe
                    data-story-preview
                    data-story-thumbnail
                    className={css({ width: "full", height: "full", border: "none", pointerEvents: "none" })}
                    src={previewHref(entry.id, previewTheme)}
                    srcDoc={previewDocument}
                    title={`Anteprima ${entry.componentTitle}: ${entry.name}`}
                    loading="lazy"
                    tabIndex={-1}
                  />
                </div>
                <div className={css({ display: "flex", flexDirection: "column", gap: "4", padding: "6", flex: "1" })}>
                  <div className={STACK}>
                    <p className={EYEBROW}>{entry.group}</p>
                    <h2 className={css({ textStyle: "headline-sm", color: "primary", overflowWrap: "anywhere" })}>
                      {entry.componentTitle}
                    </h2>
                    <p className={NOTE}>{entry.name}</p>
                  </div>
                  <div className={css({ display: "flex", justifyContent: "space-between", gap: "4", flexWrap: "wrap", marginTop: "auto" })}>
                    <a className={LINK} href={storyHref(entry.id)} target="_top" onClick={keepInTop} aria-label={`Apri storia: ${entry.componentTitle}`}>
                      Apri storia →
                    </a>
                    <a className={LINK} href={comparisonHref(entry.id)} target="_top" onClick={keepInTop} aria-label={`Confronta: ${entry.componentTitle}`}>
                      Confronta
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {visible.length < filtered.length && (
          <div className={css({ display: "flex", justifyContent: "center" })}>
            <Button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
              Mostra altri componenti
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <main ref={ref} className={PAGE}>
      <header className={css({ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6", flexWrap: "wrap" })}>
        <div className={STACK}>
          <p className={EYEBROW}>Esplora l’interfaccia</p>
          <h1 className={TITLE}>Galleria dei componenti</h1>
          <p className={NOTE}>Trova il componente che cerchi, guardalo in anteprima e apri la storia per provarlo.</p>
        </div>
        {catalog.status === "ready" && (
          <span className={css({ textStyle: "label-caps", color: "primary", backgroundColor: "surface-container", borderRadius: "full", paddingBlock: "2", paddingInline: "4" })}>
            {components.length} componenti
          </span>
        )}
      </header>
      {body}
    </main>
  );
}
