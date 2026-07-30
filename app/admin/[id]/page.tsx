import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticoloById } from "@/lib/data";
import { ArticleForm } from "../ArticleForm";
import { updateArticolo } from "../actions";
import { css } from "@/styled-system/css";

export const metadata: Metadata = { title: "Admin — Modifica articolo", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articolo = await getArticoloById(id);
  if (!articolo) notFound();

  // Bind the id so ArticleForm can call a uniform (formData) => Promise action.
  const action = updateArticolo.bind(null, articolo.id);

  return (
    <main
      className={css({
        marginInline: "auto",
        maxWidth: "820px",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: { base: "8", md: "12" },
      })}
    >
      <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4" })}>
        <Link href="/admin" className={css({ textStyle: "button", color: "muted", _hover: { color: "primary" } })}>
          &larr; Tutti gli articoli
        </Link>
        <Link
          href={`/articoli/${articolo.slug}`}
          target="_blank"
          className={css({ textStyle: "button", color: "primary" })}
        >
          Vedi pubblico &nearr;
        </Link>
      </div>
      <h1 className={css({ textStyle: "headline-md", color: "primary", marginBlock: "6" })}>Modifica articolo</h1>
      <ArticleForm action={action} initial={articolo} submitLabel="Salva" />
    </main>
  );
}
