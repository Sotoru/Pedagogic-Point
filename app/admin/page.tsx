import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticoli } from "@/lib/data";
import { logout } from "./actions";
import { ArticleRow } from "./ArticleRow";
import { css } from "@/styled-system/css";

export const metadata: Metadata = { title: "Admin — Articoli", robots: { index: false } };
export const dynamic = "force-dynamic"; // always fresh for the editor

export default async function AdminListPage() {
  const articoli = await getAllArticoli();

  return (
    <main
      className={css({
        marginInline: "auto",
        maxWidth: "content-max",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: { base: "8", md: "12" },
      })}
    >
      <header
        className={css({
          display: "flex",
          flexWrap: "wrap",
          gap: "4",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8",
        })}
      >
        <h1 className={css({ textStyle: "headline-md", color: "primary" })}>Articoli ({articoli.length})</h1>
        <div className={css({ display: "flex", gap: "3", alignItems: "center" })}>
          <Link
            href="/admin/new"
            className={css({
              borderRadius: "full",
              backgroundColor: "primary",
              color: "surface",
              paddingInline: "5",
              paddingBlock: "2.5",
              textStyle: "button",
            })}
          >
            + Nuovo
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className={css({
                cursor: "pointer",
                borderRadius: "full",
                border: "1px solid",
                borderColor: "outline-variant",
                color: "muted",
                paddingInline: "5",
                paddingBlock: "2.5",
                textStyle: "button",
              })}
            >
              Esci
            </button>
          </form>
        </div>
      </header>

      <ul className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
        {articoli.map((a) => (
          <ArticleRow key={a.id} id={a.id} titolo={a.titolo} slug={a.slug} categoria={a.categoria} evidenza={a.evidenza} />
        ))}
      </ul>
    </main>
  );
}
