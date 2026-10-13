import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/app/content";
import { excerpt, letturaTime } from "@/app/content";
import { CategoryTag } from "./CategoryTag";
import { CoverTransition } from "./CoverTransition";
import { ReadingTime } from "./ReadingTime";
import { css, cx } from "@/styled-system/css";
import { articleCard } from "@/styled-system/recipes";

// Presentational article card. Styling lives in the articleCard slot recipe;
// only the stretched-link ::after stays inline (it's the whole-card click target).
// enterDelay (ms) is set only on cards appended by "Carica altri": they rise in,
// staggered, while the server-rendered first page just appears.
export function ArticleCard({ articolo, enterDelay }: { articolo: Article; enterDelay?: number }) {
  const s = articleCard();
  return (
    <article
      // Literal css(), not a recipe variant: Panda only emits what it can read
      // statically. `backwards`, not `both`: holding the end state would pin
      // `transform` and swallow the _active press-scale for good.
      className={cx(s.root, enterDelay != null && css({ animation: "fadeUp 300ms ease-out backwards" }))}
      style={enterDelay ? { animationDelay: `${enterDelay}ms` } : undefined}
    >
      <CoverTransition slug={articolo.slug}>
        <div className={s.media}>
          <Image
            src={articolo.copertina}
            alt={articolo.titolo}
            fill
            sizes="(min-width: 768px) 540px, 100vw"
            className={s.image}
          />
        </div>
      </CoverTransition>
      <div className={s.body}>
        <CategoryTag categoria={articolo.categoria} />
        <h3 className={s.title}>
          {/* Stretched link: whole card is the target, title is the link text. */}
          <Link
            href={`/articoli/${articolo.slug}`}
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
