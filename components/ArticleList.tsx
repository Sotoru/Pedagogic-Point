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
  const s = articleGrid();

  const onLoadMore = () =>
    startTransition(async () => {
      if (!cursor) return;
      const page = await loadMoreArticoli(cursor, categoria);
      setArticoli((prev) => [...prev, ...page.articoli]);
      setCursor(page.nextCursor);
    });

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
      {cursor && (
        <div className={s.footer}>
          <Button type="button" onClick={onLoadMore} disabled={pending}>
            {pending ? "Caricamento…" : "Carica altri"}
          </Button>
        </div>
      )}
    </>
  );
}
