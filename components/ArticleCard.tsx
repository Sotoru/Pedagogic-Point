import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/app/content";
import { excerpt, letturaTime, toSlug } from "@/app/content";
import { CategoryTag } from "./CategoryTag";
import { ReadingTime } from "./ReadingTime";
import { css } from "@/styled-system/css";
import { articleCard } from "@/styled-system/recipes";

// Presentational article card. Styling lives in the articleCard slot recipe;
// only the stretched-link ::after stays inline (it's the whole-card click target).
export function ArticleCard({ articolo }: { articolo: Article }) {
  const s = articleCard();
  return (
    <article className={s.root}>
      <div className={s.media}>
        <Image
          src={articolo.copertina}
          alt={articolo.titolo}
          fill
          sizes="(min-width: 768px) 540px, 100vw"
          className={s.image}
        />
      </div>
      <div className={s.body}>
        <CategoryTag categoria={articolo.categoria} />
        <h3 className={s.title}>
          {/* Stretched link: whole card is the target, title is the link text. */}
          <Link
            href={`/articoli/${toSlug(articolo.titolo)}`}
            className={css({ _after: { content: '""', position: "absolute", inset: "0" } })}
          >
            {articolo.titolo}
          </Link>
        </h3>
        <p className={s.excerpt}>{excerpt(articolo)}</p>
        <div className={s.meta}>
          <ReadingTime minutes={letturaTime(articolo)} />
        </div>
      </div>
    </article>
  );
}
