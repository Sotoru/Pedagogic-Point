"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { searchUnsplash, triggerUnsplashDownload, type UnsplashPhoto } from "./unsplash";
import { css } from "@/styled-system/css";

// Cover picker: opens a modal, searches Unsplash server-side (key stays on the
// server), shows a grid, and on select writes urls.regular into the copertina
// field (+ fires the required Unsplash download trigger). See ADR 0010.
export function UnsplashPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const doSearch = () =>
    startTransition(async () => {
      setError(null);
      try {
        setPhotos(await searchUnsplash(query));
      } catch {
        setError("Ricerca Unsplash fallita. Controlla la chiave API.");
      }
    });

  const pick = (p: UnsplashPhoto) => {
    onSelect(p.url);
    void triggerUnsplashDownload(p.downloadLocation);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={css({
          flexShrink: 0,
          cursor: "pointer",
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "outline-variant",
          color: "primary",
          paddingInline: "4",
          textStyle: "button",
          whiteSpace: "nowrap",
        })}
      >
        Unsplash
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className={css({
            position: "fixed",
            inset: "0",
            zIndex: "50",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "grid",
            placeItems: "center",
            padding: "4",
          })}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={css({
              width: "100%",
              maxWidth: "800px",
              maxHeight: "85dvh",
              overflow: "auto",
              backgroundColor: "surface",
              borderRadius: "20px",
              padding: { base: "5", md: "6" },
            })}
          >
            <div className={css({ display: "flex", gap: "2", marginBottom: "4" })}>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), doSearch())}
                placeholder="Cerca su Unsplash…"
                className={css({
                  flex: "1",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "outline-variant",
                  backgroundColor: "surface",
                  color: "on-surface",
                  paddingInline: "4",
                  paddingBlock: "3",
                  textStyle: "body-md",
                })}
              />
              <button
                type="button"
                onClick={doSearch}
                disabled={pending}
                className={css({
                  cursor: "pointer",
                  borderRadius: "full",
                  backgroundColor: "primary",
                  color: "surface",
                  paddingInline: "6",
                  textStyle: "button",
                  _disabled: { opacity: 0.5 },
                })}
              >
                {pending ? "…" : "Cerca"}
              </button>
            </div>

            {error && <p className={css({ color: "error", textStyle: "body-sm", marginBottom: "3" })}>{error}</p>}

            <div
              className={css({
                display: "grid",
                gap: "2",
                gridTemplateColumns: { base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              })}
            >
              {photos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pick(p)}
                  title={`Foto di ${p.authorName}`}
                  className={css({
                    position: "relative",
                    aspectRatio: "3/2",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: "outline-variant",
                    _hover: { outline: "2px solid", outlineColor: "primary" },
                  })}
                >
                  <Image src={p.thumb} alt={p.alt} fill sizes="260px" className={css({ objectFit: "cover" })} unoptimized />
                </button>
              ))}
            </div>
            {photos.length === 0 && !pending && (
              <p className={css({ color: "muted", textStyle: "body-sm", textAlign: "center", paddingBlock: "8" })}>
                Cerca per vedere i risultati.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
