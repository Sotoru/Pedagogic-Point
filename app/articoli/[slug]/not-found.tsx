import Link from "next/link";
import { getFeatured } from "@/lib/data";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { css } from "@/styled-system/css";
import { button } from "@/styled-system/recipes";

// Article-specific 404: the nearest not-found boundary for /articoli/[slug], so
// it wins over the global app/not-found.tsx when the article page calls
// notFound() (slug that resolves to no article). async so it can fetch the
// featured article and recommend it in place of the missing one.
export default async function ArticoloNotFound() {
  const featured = await getFeatured();
  return (
    <>
      <Nav />
      <main
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8",
          textAlign: "center",
          minHeight: { base: "60vh", md: "70vh" },
          marginInline: "auto",
          maxWidth: "content-max",
          paddingInline: { base: "margin-mobile", md: "margin-desktop" },
          paddingBlock: { base: "16", md: "20" },
        })}
      >
        <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
          <h1 className={css({ textStyle: "headline-md", color: "primary" })}>Questo articolo non esiste</h1>
          <p className={css({ textStyle: "body-lg", color: "on-surface" })}>
            Ma abbiamo qualcosa che potrebbe interessarti.
          </p>
        </div>
        {/* getFeatured() falls back to the first article, then null (empty/error):
            no card in that case, just message + home button. */}
        {featured && (
          <div className={css({ width: "100%", maxWidth: "540px", textAlign: "left" })}>
            <ArticleCard articolo={featured} />
          </div>
        )}
        <Link href="/" className={button()}>
          Torna alla home
        </Link>
      </main>
      <Footer />
    </>
  );
}
