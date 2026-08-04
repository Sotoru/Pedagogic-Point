import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { css } from "@/styled-system/css";

// Shell for the footer's legal destinations (/privacy, /termini): the same
// Nav + reading column + Footer the article page uses. The route group keeps the
// URLs at the root while the two pages stay pure content.
export default function LegaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main
        className={css({
          marginInline: "auto",
          maxWidth: "720px",
          paddingInline: "margin-mobile",
          paddingBlock: { base: "12", md: "16" },
        })}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
