"use client";

import { useState, useTransition } from "react";
import type { Article } from "@/app/content";
import { loadMoreArticoli } from "@/app/actions";
import { ArticleCard } from "./ArticleCard";
import { useRememberedArticleList } from "./ArticleNavigation";
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
  const [{ articoli, cursor, hasLoadedMore }, setList] = useRememberedArticleList({
    articoli: initialArticoli, cursor: initialCursor, hasLoadedMore: false,
  }, categoria);
  // Index in `articoli` where the latest appended page begins; null until the
  // first "Carica altri", so the server-rendered cards never animate.
  const [batchStart, setBatchStart] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  // Starts empty so mounting the live region announces nothing; it only speaks
  // once a click has actually appended cards.
  const [annuncio, setAnnuncio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const s = articleGrid();

  const onLoadMore = () => {
    // aria-disabled keeps the button focusable, so unlike `disabled` it can still
    // be clicked while pending — the guard is what makes the request idempotent.
    if (pending || !cursor) return;
    startTransition(async () => {
      setError(null);
      try {
        const page = await loadMoreArticoli(cursor, categoria);
        const added = page.articoli.filter((a) => a.id !== featuredId).length;
        const total = [...articoli, ...page.articoli].filter((a) => a.id !== featuredId).length;
        setBatchStart(articoli.length);
        setList((prev) => ({ articoli: [...prev.articoli, ...page.articoli], cursor: page.nextCursor, hasLoadedMore: true }));
        setAnnuncio(`${added} articoli caricati. ${total} in totale.`);
      } catch {
        setError("Non è stato possibile caricare gli articoli. Riprova con Carica altri.");
      }
    });
  };

  const enterDelay = (a: Article) => {
    if (batchStart == null) return undefined;
    const i = articoli.indexOf(a);
    return i < batchStart ? undefined : (i - batchStart) * 30;
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
          <ArticleCard key={a.id} articolo={a} enterDelay={enterDelay(a)} />
        ))}
      </div>
      {/* Appending cards changes the page silently otherwise: nothing tells a
          screen reader the click did anything (WCAG 4.1.3). */}
      <span role="status" className={css({ srOnly: true })}>
        {annuncio}
      </span>
      {error && <p role="alert" className={css({ textStyle: "body-md", color: "error", marginTop: "4" })}>{error}</p>}
      {(cursor || hasLoadedMore) && (
        <div className={s.footer}>
          {/* aria-disabled, not disabled: a disabled button drops out of the tab
              order mid-interaction, so the focus you were holding lands on <body>
              and you lose your place in the list. */}
          <Button type="button" onClick={onLoadMore} aria-disabled={pending || !cursor} aria-busy={pending}>
            {pending ? "Caricamento…" : cursor ? "Carica altri" : "Tutti gli articoli sono caricati"}
          </Button>
        </div>
      )}
    </>
  );
}
