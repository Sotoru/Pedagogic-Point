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

// On-demand ISR, same 5-min window as the home page. No generateStaticParams —
// pages render on first request and are cached (mirrors the legacy fallback:"blocking").
export const revalidate = 300;

// Prose styling shared by the sanitized HTML blocks (intro + answers).
const PROSE = "type-body-lg text-on-surface [&_a]:text-primary [&_a]:underline [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1";

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
        <div className="mx-auto max-w-content-max px-margin-mobile pt-8 md:px-margin-desktop md:pt-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-outline-variant md:aspect-[2/1]">
            <Image
              src={articolo.copertina}
              alt={articolo.titolo}
              fill
              priority
              sizes="(min-width: 768px) 1104px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Reading column (~720px for comfortable line length). */}
        <article className="mx-auto max-w-[720px] px-margin-mobile py-12 md:py-16">
          <Link
            href="/"
            className="type-button mb-8 flex w-fit items-center gap-1.5 text-muted transition-colors hover:text-primary"
          >
            <span aria-hidden>&larr;</span> Torna agli articoli
          </Link>
          <CategoryTag categoria={articolo.categoria} />
          <h1 className="type-headline-md mt-4 text-primary">{articolo.titolo}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
            {articolo.autore && <span className="type-body-md">di {articolo.autore}</span>}
            <ReadingTime minutes={letturaTime(articolo)} suffix="min read" />
          </div>

          {articolo.introduzione && (
            <div
              className={`mt-8 ${PROSE}`}
              dangerouslySetInnerHTML={{ __html: cleanHtml(articolo.introduzione) }}
            />
          )}

          {/* The `domande` array is the article body: a Q&A sequence. */}
          {articolo.domande.map((d, i) => (
            <section key={i} className="mt-10">
              <h2 className="type-headline-sm text-primary">{d.domanda}</h2>
              <div
                className={`mt-3 ${PROSE}`}
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
