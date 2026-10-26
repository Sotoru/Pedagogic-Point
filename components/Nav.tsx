import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { css } from "@/styled-system/css";

// Top header: container-max width, 24px/48px padding. Brand-only and centered
// for now (nav links intentionally omitted until categories/about ship).
export function Nav() {
  return (
    <header>
      <nav className={css({
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
        alignItems: "center",
        gap: "2",
        marginInline: "auto",
        maxWidth: "container-max",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: "6",
      })}>
        <Link href="/" aria-label="PedagogicPoint, pagina iniziale" className={css({ gridColumn: "2" })}>
          <Wordmark
            overrides={css.raw({ fontSize: "clamp(1.75rem,8vw,4rem)", lineHeight: "1", letterSpacing: "-0.02em" })}
          />
        </Link>
        <div className={css({ gridColumn: "3", justifySelf: "end" })}>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
