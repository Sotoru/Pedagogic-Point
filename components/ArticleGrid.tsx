"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/app/content";
import { excerpt, letturaTime, toSlug } from "@/app/content";
import { loadMoreArticoli } from "@/app/actions";
import { CategoryTag } from "./CategoryTag";
import { ReadingTime } from "./ReadingTime";
import { FilterPill } from "./FilterPill";

// Card (design.md): 1px border-subtle, no shadow, ≥24px padding.
function ArticleCard({ articolo }: { articolo: Article }) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-border-subtle bg-surface transition-colors hover:border-primary">
      <div className="relative aspect-[16/10]">
        <Image
          src={articolo.copertina}
          alt={articolo.titolo}
          fill
          sizes="(min-width: 768px) 540px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 text-center md:text-left">
        <CategoryTag categoria={articolo.categoria} />
        <h3 className="type-headline-sm mt-3 text-primary">
          {/* Stretched link: whole card is the target, title is the link text. */}
          <Link href={`/articoli/${toSlug(articolo.titolo)}`} className="after:absolute after:inset-0">
            {articolo.titolo}
          </Link>
        </h3>
        <p className="type-body-md mt-2 text-muted">{excerpt(articolo)}</p>
        <div className="mt-4">
          <ReadingTime minutes={letturaTime(articolo)} />
        </div>
      </div>
    </article>
  );
}

// Article grid: independent 2-col layout (design.md), 1-col below md.
// Loads PAGE_SIZE (6) articles at a time; "Carica altri" fetches the next page
// via a server action. The featured article is filtered out (it's in the Hero),
// so the page containing it shows one fewer card — by design.
export function ArticleGrid({
  initialArticoli,
  initialCursor,
  featuredId,
}: {
  initialArticoli: Article[];
  initialCursor: string | null;
  featuredId: string | null;
}) {
  const [articoli, setArticoli] = useState(initialArticoli);
  const [cursor, setCursor] = useState(initialCursor);
  const [pending, startTransition] = useTransition();

  const onLoadMore = () =>
    startTransition(async () => {
      if (!cursor) return;
      const page = await loadMoreArticoli(cursor);
      setArticoli((prev) => [...prev, ...page.articoli]);
      setCursor(page.nextCursor);
    });

  const visibili = articoli.filter((a) => a.id !== featuredId);

  return (
    <section className="mx-auto max-w-content-max px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <FilterPill />
      <h2 className="type-headline-md mt-6 border-b border-border-subtle pb-4 text-primary">
        Latest Articles
      </h2>
      <div className="mt-8 grid gap-gutter md:grid-cols-2">
        {visibili.map((a) => (
          <ArticleCard key={a.id} articolo={a} />
        ))}
      </div>
      {cursor && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={pending}
            className="type-button rounded border border-primary px-6 py-2.5 text-primary transition-colors hover:bg-primary hover:text-on-dark disabled:opacity-50"
          >
            {pending ? "Caricamento…" : "Carica altri"}
          </button>
        </div>
      )}
    </section>
  );
}
