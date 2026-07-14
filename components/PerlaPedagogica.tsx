"use client";

import { useState, useTransition } from "react";
import type { Perla } from "@/app/content";
import { refreshPerla } from "@/app/actions";
import { RefreshIcon } from "./icons";

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
    <section className="bg-surface-container py-16 md:py-20">
      <div className="mx-auto max-w-content-max px-margin-mobile md:px-margin-desktop">
        <div className="relative mx-auto w-full rounded-[32px] bg-[var(--pp-card)] p-8 text-center shadow-[var(--pp-shadow-rest)] md:w-3/4 md:p-[49px]">
          <button
            type="button"
            onClick={onRefresh}
            disabled={pending}
            aria-label="Mostra un'altra perla"
            className="absolute right-5 top-5 cursor-pointer rounded-full bg-[var(--pp-card)] p-2 text-primary shadow-[var(--pp-shadow-chip)] transition-shadow hover:shadow-[var(--pp-shadow-rest)] disabled:cursor-default disabled:opacity-50"
          >
            <RefreshIcon />
          </button>
          {/* Decorative closing double-quote mark (looks like "99"), not the digits. */}
          <div
            className="text-theory"
            style={{ fontFamily: "var(--font-quote)", fontSize: "56px", fontWeight: 700, lineHeight: 1 }}
            aria-hidden
          >
            &rdquo;
          </div>
          <span className="type-label-caps inline-block rounded bg-theory/10 px-2.5 py-1 normal-case tracking-normal text-theory">
            Perla Pedagogica
          </span>
          <p className="type-quote mt-4 text-primary">&ldquo;{perla.contenuto}&rdquo;</p>
        </div>
      </div>
    </section>
  );
}
