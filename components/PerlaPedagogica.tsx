"use client";

import { useState, useTransition } from "react";
import type { Perla } from "@/app/content";
import { refreshPerla } from "@/app/actions";
import { RefreshIcon } from "./icons";
import { css } from "@/styled-system/css";
import { categoryTag } from "@/styled-system/recipes";

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

  if (!perla) return null;

  const onRefresh = () =>
    startTransition(async () => {
      const next = await refreshPerla();
      if (next) setPerla(next);
    });

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
          className={css({
            position: "relative",
            marginInline: "auto",
            width: { base: "100%", md: "75%" },
            borderRadius: "32px",
            backgroundColor: cardFill,
            padding: { base: "8", md: "49px" },
            textAlign: "center",
            boxShadow: restShadow,
          })}
        >
          <button
            type="button"
            onClick={onRefresh}
            disabled={pending}
            aria-label="Mostra un'altra perla"
            className={css({
              position: "absolute",
              right: "5",
              top: "5",
              cursor: "pointer",
              borderRadius: "full",
              backgroundColor: cardFill,
              padding: "2",
              color: "primary",
              boxShadow: chipShadow,
              transitionProperty: "box-shadow",
              transitionDuration: "150ms",
              _hover: { boxShadow: restShadow },
              _disabled: { cursor: "default", opacity: 0.5 },
            })}
          >
            <RefreshIcon />
          </button>
          {/* Decorative closing double-quote mark (looks like "99"), not the digits. */}
          <div
            className={css({ fontFamily: "montserrat", fontSize: "56px", fontWeight: "700", lineHeight: "1", color: "theory" })}
            aria-hidden
          >
            &rdquo;
          </div>
          <span className={categoryTag({ categoria: "theory" })}>Perla Pedagogica</span>
          <p className={css({ textStyle: "quote", marginTop: "4", color: "primary" })}>
            &ldquo;{perla.contenuto}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
