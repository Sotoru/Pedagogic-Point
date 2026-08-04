import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/app/content";
import { letturaTime } from "@/app/content";
import { CategoryTag } from "./CategoryTag";
import { ReadingTime } from "./ReadingTime";
import { css } from "@/styled-system/css";

// Hero: 5/7 text/media split (design.md). Stacks text-then-image below md.
export function Hero({ articolo }: { articolo: Article }) {
  return (
    <section
      className={css({
        marginInline: "auto",
        maxWidth: "content-max",
        paddingInline: { base: "margin-mobile", md: "margin-desktop" },
        paddingBlock: { base: "12", md: "16" },
      })}
    >
      <div
        className={css({
          position: "relative",
          display: "grid",
          gap: "gutter",
          gridTemplateColumns: { md: "repeat(12, 1fr)" },
          alignItems: { md: "center" },
          // Same reasoning as the card (see articleCard): ring the whole target,
          // not just the title line the stretched link happens to occupy.
          "&:has(a:focus-visible)": {
            outline: "2px solid",
            outlineColor: "primary",
            outlineOffset: "8px",
            borderRadius: "8px",
            "& a:focus-visible": { outline: "none" },
          },
        })}
      >
        <div className={css({ textAlign: { base: "center", md: "left" }, gridColumn: { md: "span 5" } })}>
          <h1 className={css({ textStyle: { base: "display-lg-mobile", md: "display-lg" }, color: "primary" })}>
            {/* Stretched link: whole hero is the target, title is the link text. */}
            <Link
              href={`/articoli/${articolo.slug}`}
              className={css({ _after: { content: '""', position: "absolute", inset: "0" } })}
            >
              {articolo.titolo}
            </Link>
          </h1>
          <p className={css({ textStyle: "body-lg", marginTop: "4", lineClamp: "4", color: "on-surface" })}>
            {articolo.introduzione}
          </p>
          <div className={css({ marginTop: "6" })}>
            <CategoryTag categoria={articolo.categoria} />
            <div className={css({ marginTop: "3" })}>
              <ReadingTime minutes={letturaTime(articolo)} suffix="min di lettura" />
            </div>
          </div>
        </div>
        <div className={css({ gridColumn: { md: "span 7" } })}>
          <div
            className={css({
              position: "relative",
              aspectRatio: "4/3",
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
              sizes="(min-width: 768px) 58vw, 100vw"
              className={css({ objectFit: "cover" })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
