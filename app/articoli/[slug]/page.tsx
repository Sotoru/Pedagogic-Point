import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticoloByTitolo } from "@/lib/data";
import { fromSlug, letturaTime, excerpt } from "@/app/content";
import { cleanHtml } from "@/lib/html";
import { CategoryTag } from "@/components/CategoryTag";
import { ReadingTime } from "@/components/ReadingTime";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { css } from "@/styled-system/css";

// On-demand ISR, same 5-min window as the home page. No generateStaticParams —
// pages render on first request and are cached (mirrors the legacy fallback:"blocking").
export const revalidate = 300;

// Prose styling shared by the sanitized HTML blocks (intro + answers).
const prose = {
  textStyle: "body-lg",
  color: "on-surface",
  "& a": { color: "primary", textDecoration: "underline" },
  "& p": { marginTop: "4" },
  "& ul": { marginTop: "4", listStyleType: "disc", paddingLeft: "6" },
  "& li": { marginTop: "1" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const articolo = await getArticoloByTitolo(fromSlug((await params).slug));
  if (!articolo) return {};
  const description = excerpt(articolo);
  return {
    title: articolo.titolo,
    description,
    openGraph: {
      title: articolo.titolo,
      description,
      type: "article",
      images: articolo.copertina ? [articolo.copertina] : undefined,
    },
  };
}

export default async function ArticoloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const articolo = await getArticoloByTitolo(fromSlug((await params).slug));
  if (!articolo) notFound();

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
          <div
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
              priority
              sizes="(min-width: 768px) 1104px, 100vw"
              className={css({ objectFit: "cover" })}
            />
          </div>
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
          <Link
            href="/"
            className={css({
              textStyle: "button",
              marginBottom: "8",
              display: "flex",
              width: "fit-content",
              alignItems: "center",
              gap: "1.5",
              color: "muted",
              transitionProperty: "color",
              transitionDuration: "150ms",
              _hover: { color: "primary" },
            })}
          >
            <span aria-hidden>&larr;</span> Torna agli articoli
          </Link>
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
              className={css(prose, { marginTop: "8" })}
              dangerouslySetInnerHTML={{ __html: cleanHtml(articolo.introduzione) }}
            />
          )}

          {/* The `domande` array is the article body: a Q&A sequence. */}
          {articolo.domande.map((d, i) => (
            <section key={i} className={css({ marginTop: "10" })}>
              <h2 className={css({ textStyle: "headline-sm", color: "primary" })}>{d.domanda}</h2>
              <div
                className={css(prose, { marginTop: "3" })}
                dangerouslySetInnerHTML={{ __html: cleanHtml(d.risposta) }}
              />
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
