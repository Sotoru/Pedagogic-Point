import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { css } from "@/styled-system/css";
import { button } from "@/styled-system/recipes";

// Global 404: shown for unmatched URLs and any notFound() without a closer
// boundary. Renders inside the root layout, so it inherits the fonts, theme
// pre-paint, and globals.css. The layout has no Nav/Footer (every page brings
// its own), so we render the same shell here. Next returns 404 + noindex on its
// own — no metadata export (that's only wired for global-not-found in Next 16).
export default function NotFound() {
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
          <h1 className={css({ textStyle: "headline-md", color: "primary" })}>Questa pagina ha fatto le valigie</h1>
          <p className={css({ textStyle: "body-lg", color: "on-surface" })}>
            Ti sei perso? Capita anche ai più curiosi.
          </p>
        </div>
        <Link href="/" className={button()}>
          Torna alla home
        </Link>
      </main>
      <Footer />
    </>
  );
}
