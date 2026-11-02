import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticoloBySlug } from "@/lib/data";
import { ArticleScreen } from "@/components/ArticleScreen";
import { excerpt } from "@/app/content";

// On-demand ISR, same 5-min window as the home page. No generateStaticParams —
// pages render on first request and are cached (mirrors the legacy fallback:"blocking").
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const articolo = await getArticoloBySlug((await params).slug);
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
  const articolo = await getArticoloBySlug((await params).slug);
  if (!articolo) notFound();

  return <ArticleScreen articolo={articolo} />;
}
