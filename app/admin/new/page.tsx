import type { Metadata } from "next";
import Link from "next/link";
import { ArticleForm } from "../ArticleForm";
import { createArticolo } from "../actions";
import { css } from "@/styled-system/css";

export const metadata: Metadata = { title: "Admin — Nuovo articolo", robots: { index: false } };

export default function NewArticlePage() {
  return (
    <main
      className={css({
        marginInline: "auto",
        maxWidth: "820px",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: { base: "8", md: "12" },
      })}
    >
      <Link href="/admin" className={css({ textStyle: "button", color: "muted", _hover: { color: "primary" } })}>
        &larr; Tutti gli articoli
      </Link>
      <h1 className={css({ textStyle: "headline-md", color: "primary", marginBlock: "6" })}>Nuovo articolo</h1>
      <ArticleForm action={createArticolo} submitLabel="Crea" />
    </main>
  );
}
