import { useId, useState } from "react";
import { Button } from "@/components/Button";
import { css, cx } from "@/styled-system/css";
import { previewHref, storyHref, type CatalogEntry } from "./catalog";
import { useCatalog, usePreviewIsolation } from "./useCatalog";
import { CHIP, CHIPS, EMPTY, EYEBROW, LINK, NOTE, PAGE, PANEL, STACK, TITLE, keepInTop } from "./styles";

type Props = {
  entries?: readonly CatalogEntry[];
  initialStoryId?: string;
  previewDocument?: string;
};

type Mode = "themes" | "responsive";
const DEFAULT_TITLE = "Componenti/Articoli/Elenco articoli";
const labelFor = (entry: CatalogEntry) => `${entry.title.replaceAll("/", " / ")} · ${entry.name}`;

function Choice<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className={CHIPS}>
      <legend className={css({ textStyle: "label-caps", color: "muted", marginBottom: "2" })}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={CHIP}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

export function StoryComparison({ entries, initialStoryId, previewDocument }: Props) {
  const catalog = useCatalog(entries);
  const ref = usePreviewIsolation<HTMLElement>();
  const id = useId();
  const [selectedId, setSelectedId] = useState(initialStoryId);
  const [mode, setMode] = useState<Mode>("themes");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [reload, setReload] = useState(0);

  const selected =
    catalog.entries.find((entry) => entry.id === selectedId) ??
    catalog.entries.find((entry) => entry.title === DEFAULT_TITLE) ??
    catalog.entries[0];
  const previews =
    mode === "themes"
      ? [
          { id: "light", label: "Chiaro", theme: "light" as const, width: css({ width: "full" }) },
          { id: "dark", label: "Scuro", theme: "dark" as const, width: css({ width: "full" }) },
        ]
      : [
          { id: "phone", label: "Telefono · 384 px", theme, width: css({ width: "96", maxWidth: "none" }) },
          { id: "desktop", label: "Desktop · 1024 px", theme, width: css({ width: "5xl", maxWidth: "none" }) },
        ];

  return (
    <main ref={ref} className={PAGE}>
      <header className={STACK}>
        <p className={EYEBROW}>Esplora / Confronto</p>
        <h1 className={TITLE}>Uno scenario, due prospettive.</h1>
        <p className={NOTE}>Confronta chiaro e scuro o verifica come cambia l’interfaccia tra telefono e desktop.</p>
      </header>

      {catalog.status === "loading" ? (
        <p className={EMPTY} role="status">Caricamento degli scenari…</p>
      ) : catalog.status === "error" ? (
        <div className={EMPTY}>
          <p role="alert">Non è stato possibile caricare gli scenari.</p>
          <Button type="button" onClick={catalog.retry}>Riprova</Button>
        </div>
      ) : !selected ? (
        <p className={EMPTY} role="status">Aggiungi un componente al catalogo per confrontarlo.</p>
      ) : (
        <>
          <div className={cx(PANEL, css({ display: "flex", flexDirection: "column", gap: "6", padding: "6" }))}>
            <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
              <label className={css({ textStyle: "label-caps", color: "muted" })} htmlFor={`${id}-scenario`}>
                Scenario
              </label>
              <select
                id={`${id}-scenario`}
                value={selected.id}
                onChange={(event) => setSelectedId(event.target.value)}
                className={css({
                  textStyle: "body-md",
                  maxWidth: "full",
                  paddingBlock: "2",
                  paddingInline: "4",
                  borderRadius: "full",
                  border: "1px solid",
                  borderColor: "border-subtle",
                  backgroundColor: "surface",
                  color: "on-surface",
                })}
              >
                {catalog.entries.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {labelFor(entry)}
                  </option>
                ))}
              </select>
            </div>
            <div className={css({ display: "flex", flexWrap: "wrap", alignItems: "end", gap: "6" })}>
              <Choice
                legend="Confronta"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "themes", label: "Temi" },
                  { value: "responsive", label: "Responsive" },
                ]}
              />
              {mode === "responsive" && (
                <Choice
                  legend="Tema delle anteprime"
                  value={theme}
                  onChange={setTheme}
                  options={[
                    { value: "light", label: "Chiaro" },
                    { value: "dark", label: "Scuro" },
                  ]}
                />
              )}
              <Button type="button" className={css({ marginLeft: { md: "auto" } })} onClick={() => setReload((value) => value + 1)}>
                Ricomincia le anteprime
              </Button>
            </div>
          </div>

          <p className={NOTE}>
            Scenario e impostazioni sono condivisi. Puoi interagire con ciascuna anteprima separatamente.
            {mode === "responsive" && " Scorri nel pannello per esplorare la larghezza completa."}
          </p>

          <div className={css({ display: "grid", gridTemplateColumns: { base: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" }, gap: "6", minWidth: "0" })}>
            {previews.map((preview) => (
              <section key={preview.id} aria-labelledby={`${id}-${preview.id}`} className={cx(PANEL, css({ minWidth: "0", overflow: "hidden" }))}>
                <header className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4", padding: "4", borderBottom: "1px solid", borderBottomColor: "border-subtle" })}>
                  <h2 id={`${id}-${preview.id}`} className={css({ textStyle: "headline-sm", color: "primary" })}>
                    {preview.label}
                  </h2>
                  <a className={LINK} href={storyHref(selected.id)} target="_top" onClick={keepInTop}>
                    Apri storia ↗
                  </a>
                </header>
                {/* Scrollable at fixed widths, so keyboard users must be able to reach it. */}
                <div
                  role="region"
                  aria-label={`Anteprima ${preview.label}`}
                  tabIndex={mode === "responsive" ? 0 : undefined}
                  className={css({ overflowX: "auto", maxWidth: "full" })}
                >
                  <iframe
                    key={reload}
                    data-story-preview
                    className={cx(css({ display: "block", height: "2xl", border: "none" }), preview.width)}
                    title={`${selected.name} — ${preview.label}`}
                    src={previewHref(selected.id, preview.theme)}
                    srcDoc={previewDocument}
                    loading="lazy"
                  />
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
