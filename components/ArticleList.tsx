"use client";

import { useState, useTransition } from "react";
import type { Article } from "@/app/content";
import { loadMoreArticoli } from "@/app/actions";
import { ArticleCard } from "./ArticleCard";
import { Button } from "./Button";
import { css } from "@/styled-system/css";
import { articleGrid } from "@/styled-system/recipes";

// Client list: holds the growing article array, appends the next page (PAGE_SIZE
// articles, see lib/data) per "Carica altri" click via the loadMoreArticoli server
// action. featuredId is filtered out (it's in the Hero), so its page shows one
// fewer card — by design.
export function ArticleList({
  initialArticoli,
  initialCursor,
  featuredId,
  categoria,
}: {
  initialArticoli: Article[];
  initialCursor: string | null;
  featuredId: string | null;
  categoria: string | null;
}) {
  const [articoli, setArticoli] = useState(initialArticoli);
  const [cursor, setCursor] = useState(initialCursor);
  const [pending, startTransition] = useTransition();
  // Starts empty so mounting the live region announces nothing; it only speaks
  // once a click has actually appended cards.
  const [annuncio, setAnnuncio] = useState("");
  const s = articleGrid();

  const onLoadMore = () => {
    // aria-disabled keeps the button focusable, so unlike `disabled` it can still
    // be clicked while pending — the guard is what makes the request idempotent.
    if (pending || !cursor) return;
    startTransition(async () => {
      const page = await loadMoreArticoli(cursor, categoria);
      setArticoli((prev) => [...prev, ...page.articoli]);
      setCursor(page.nextCursor);
      setAnnuncio(`${page.articoli.length} articoli caricati.`);
    });
  };

  const visibili = articoli.filter((a) => a.id !== featuredId);

  if (visibili.length === 0) {
    return (
      <p className={css({ textStyle: "body-md", color: "muted" })}>
        {categoria
          ? "Nessun articolo in questa categoria."
          : "Nessun articolo disponibile."}
      </p>
    );
  }

  return (
    <>
      <div className={s.list}>
        {visibili.map((a) => (
          <ArticleCard key={a.id} articolo={a} />
        ))}
      </div>
      {/* Appending cards changes the page silently otherwise: nothing tells a
          screen reader the click did anything (WCAG 4.1.3). */}
      <span role="status" className={css({ srOnly: true })}>
        {annuncio}
      </span>
      {cursor && (
        <div className={s.footer}>
          {/* aria-disabled, not disabled: a disabled button drops out of the tab
              order mid-interaction, so the focus you were holding lands on <body>
              and you lose your place in the list. */}
          <Button type="button" onClick={onLoadMore} aria-disabled={pending}>
            {pending ? "Caricamento…" : "Carica altri"}
          </Button>
        </div>
      )}
    </>
  );
}
