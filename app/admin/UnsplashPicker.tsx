"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { searchUnsplash, triggerUnsplashDownload, type UnsplashPhoto } from "./unsplash";
import { css } from "@/styled-system/css";

// Cover picker: opens a modal, searches Unsplash server-side (key stays on the
// server), shows a grid, and on select writes urls.regular into the copertina
// field (+ fires the required Unsplash download trigger). See ADR 0010.
//
// A native <dialog> driven by showModal() carries the modal behaviour we'd
// otherwise hand-roll: Escape to dismiss, focus trapped inside, the rest of the
// page inert, role="dialog" + aria-modal implicit, and ::backdrop for the dim.
// It is always rendered (a closed dialog is display:none), so the DOM holds the
// open/closed state and Escape can't desync a React flag.
export function UnsplashPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
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
    ref.current?.close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
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

      <dialog
        ref={ref}
        aria-label="Scegli una copertina da Unsplash"
        // ponytail: no click-outside-to-dismiss. It would take an onClick on the
        // dialog, which jsx-a11y rejects as a mouse-only handler on a
        // non-interactive element — two suppressions for a shortcut that Escape
        // and the Chiudi button already cover.
        className={css({
          // No padding on the dialog itself: the padding belongs to the panel, so
          // a click that lands on the dialog box is a click outside the panel.
          width: "100%",
          maxWidth: "800px",
          maxHeight: "85dvh",
          margin: "auto", // with the UA's inset:0, centres in the viewport
          padding: "0",
          border: "none",
          backgroundColor: "transparent",
          _backdrop: { backgroundColor: "rgba(0,0,0,0.5)" },
        })}
      >
        <div
          className={css({
            maxHeight: "85dvh",
            overflow: "auto",
            backgroundColor: "surface",
            borderRadius: "20px",
            padding: { base: "5", md: "6" },
          })}
        >
          <div className={css({ display: "flex", gap: "2", marginBottom: "4" })}>
            <input
              // Focus must land inside a modal dialog when it opens, and autofocus
              // is how you say which control gets it. The blanket rule can't tell
              // this case from an autofocused field on page load.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              aria-label="Cerca foto su Unsplash"
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
            {/* Was: dismiss only by clicking the overlay, which mouse users had to
                guess at and keyboard users couldn't reach at all. */}
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className={css({
                cursor: "pointer",
                borderRadius: "full",
                border: "1px solid",
                borderColor: "outline-variant",
                color: "muted",
                paddingInline: "5",
                textStyle: "button",
              })}
            >
              Chiudi
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
      </dialog>
    </>
  );
}
