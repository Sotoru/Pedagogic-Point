"use client";

import { useState, useTransition } from "react";
import type { Perla } from "@/app/content";
import { refreshPerla } from "@/app/actions";
import { RefreshIcon } from "./icons";
import { css } from "@/styled-system/css";
import { categoryTag } from "@/styled-system/recipes";
import { usePerlaMotion } from "./usePerlaMotion";

// Perla elevation. Light rests on the design.md shadow tokens; dark retunes them
// (deeper shadows, a card fill lighter than the band so it still lifts) — these
// dark tweaks aren't design.md tokens, they're this component's elevation.
// ponytail: inlined here; promote to semantic shadow tokens if a 2nd component
// ever needs dark-retuned elevation.
const cardFill = { base: "surface", _dark: "#26292e" } as const;
const restShadow = { base: "hover-active", _dark: "0 0 24px rgba(0,0,0,0.6)" } as const;
const chipShadow = { base: "card-subtle", _dark: "0 1px 2px rgba(0,0,0,0.5)" } as const;

// Perla Pedagogica: content-max tinted band, centered card resting on the diffused
// 20px shadow (hover-active value), theory pill, quote type (design.md exception).
// Refresh button (top-right) fetches a fresh random perla per click via a server action.
export function PerlaPedagogica({ initialPerla }: { initialPerla: Perla | null }) {
  const [perla, setPerla] = useState(initialPerla);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { cardRef, quoteRef, prepareChange } = usePerlaMotion(perla?.contenuto);

  if (!perla) return null;

  const onRefresh = () => {
    // See ArticleList: aria-disabled keeps focus, so the guard replaces what
    // `disabled` used to prevent.
    if (pending) return;
    startTransition(async () => {
      setError(null);
      try {
        const next = await refreshPerla();
        if (!next) throw new Error("No quote returned");
        if (next.contenuto !== perla.contenuto && await prepareChange()) {
          // Updates after an awaited animation need their own transition. Clear
          // any retry error in the same commit as the new live-region text.
          startTransition(() => { setError(null); setPerla(next); });
        }
      } catch {
        setError("La nuova perla non è arrivata. Riprova con il pulsante di aggiornamento.");
      }
    });
  };

  return (
    <section className={css({ backgroundColor: "surface-container", paddingBlock: { base: "16", md: "20" } })}>
      <div
        className={css({
          marginInline: "auto",
          maxWidth: "content-max",
          paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        })}
      >
        <div
          ref={cardRef}
          className={css({
            position: "relative",
            marginInline: "auto",
            width: { base: "100%", md: "75%" },
            borderRadius: "32px",
            backgroundColor: cardFill,
            padding: { base: "8", md: "49px" },
            textAlign: "center",
            boxShadow: restShadow,
            overflow: "clip",
          })}
        >
          <button
            type="button"
            onClick={onRefresh}
            aria-disabled={pending}
            aria-busy={pending}
            aria-label="Mostra un'altra perla"
            className={css({
              position: "absolute",
              right: "5",
              top: "5",
              cursor: "pointer",
              borderRadius: "full",
              backgroundColor: cardFill,
              padding: "2",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "11",
              minHeight: "11",
              color: "primary",
              boxShadow: chipShadow,
              transitionProperty: "box-shadow, transform",
              transitionDuration: "150ms",
              transitionTimingFunction: "ease-out",
              _hover: { boxShadow: restShadow },
              _active: { transform: "scale(0.9)" },
              _disabled: { cursor: "default", opacity: 0.5 },
            })}
          >
            {/* Spins while the server action runs: status feedback, not decoration. */}
            <RefreshIcon className={pending ? css({ animation: "spin 0.8s linear infinite" }) : undefined} />
          </button>
          {/* Decorative closing double-quote mark (looks like "99"), not the digits. */}
          <div
            className={css({ fontFamily: "montserrat", fontSize: "56px", fontWeight: "700", lineHeight: "1", color: "theory" })}
            aria-hidden
          >
            &rdquo;
          </div>
          <span className={categoryTag({ categoria: "theory" })}>Perla Pedagogica</span>
          {/* role="status" (= polite + atomic) so the refresh button reads out the
              new perla instead of swapping it in silently. The region ships with
              its content already in place, so mounting announces nothing. */}
          <p ref={quoteRef} role="status" className={css({ textStyle: "quote", marginTop: "4", color: "primary" })}>
            &ldquo;{perla.contenuto}&rdquo;
          </p>
          <p role="status" aria-label="Aggiornamento perla" className={css({ srOnly: true })}>
            {pending ? "Caricamento…" : ""}
          </p>
          {error && <p role="alert" className={css({ textStyle: "body-md", color: "error", marginTop: "2" })}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
