import Image from "next/image";
import type { Article } from "@/app/content";
import { letturaTime } from "@/app/content";
import { cleanHtml } from "@/lib/html";
import { BackToArticles } from "./ArticleNavigation";
import { CategoryTag } from "./CategoryTag";
import { CoverTransition } from "./CoverTransition";
import { ReadingTime } from "./ReadingTime";
import { MarkdownBody } from "./MarkdownBody";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { css } from "@/styled-system/css";

// The article page without its data fetching, so Storybook can render the screen.
export function ArticleScreen({ articolo }: { articolo: Article }) {
  return (
    <>
      <Nav />
      <main>
        {/* Full-width cover: Hero Media treatment (rounded-32, 1px border). */}
        <div
          className={css({
            marginInline: "auto",
            maxWidth: "content-max",
            paddingInline: { base: "margin-mobile", md: "margin-desktop" },
            paddingTop: { base: "8", md: "12" },
          })}
        >
          <CoverTransition slug={articolo.slug}>
            <div
              data-article-cover={articolo.slug}
              className={css({
                position: "relative",
                aspectRatio: { base: "4/3", md: "2/1" },
                overflow: "hidden",
                borderRadius: "32px",
                border: "1px solid",
                borderColor: "outline-variant",
              })}
            >
              <Image
                src={articolo.copertina}
                alt={articolo.titolo}
                fill
                // LCP element: eager + high, no <link rel=preload> (`priority` is deprecated in Next 16).
                loading="eager"
                fetchPriority="high"
                // content-max 1104 minus the 48px inline padding on each side.
                sizes="(min-width: 1104px) 1008px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 40px)"
                className={css({ objectFit: "cover" })}
              />
            </div>
          </CoverTransition>
        </div>

        {/* Reading column (~720px for comfortable line length). */}
        <article
          className={css({
            marginInline: "auto",
            maxWidth: "720px",
            paddingInline: "margin-mobile",
            paddingBlock: { base: "12", md: "16" },
          })}
        >
          <BackToArticles />
          <CategoryTag categoria={articolo.categoria} />
          <h1 className={css({ textStyle: "headline-md", marginTop: "4", color: "primary" })}>{articolo.titolo}</h1>
          <div
            className={css({
              marginTop: "4",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: "4",
              rowGap: "2",
              color: "muted",
            })}
          >
            {articolo.autore && <span className={css({ textStyle: "body-md" })}>di {articolo.autore}</span>}
            <ReadingTime minutes={letturaTime(articolo)} suffix="min di lettura" />
          </div>

          {articolo.introduzione && (
            <div
              className={css({
                textStyle: "body-lg",
                marginTop: "8",
                color: "on-surface",
                "& a": { color: "primary", textDecoration: "underline" },
                "& p": { marginTop: "4" },
              })}
              dangerouslySetInnerHTML={{ __html: cleanHtml(articolo.introduzione) }}
            />
          )}

          {articolo.body && <MarkdownBody>{articolo.body}</MarkdownBody>}
        </article>
      </main>
      <Footer />
    </>
  );
}
