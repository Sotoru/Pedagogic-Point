import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/app/content";
import { letturaTime, toSlug } from "@/app/content";
import { CategoryTag } from "./CategoryTag";
import { ReadingTime } from "./ReadingTime";

// Hero: 5/7 text/media split (design.md). Stacks text-then-image below md.
export function Hero({ articolo }: { articolo: Article }) {
  return (
    <section className="mx-auto max-w-content-max px-margin-mobile py-12 md:px-margin-desktop md:py-16">
      <div className="relative grid gap-gutter md:grid-cols-12 md:items-center">
        <div className="text-center md:col-span-5 md:text-left">
          <h1 className="type-hero-title text-primary">
            {/* Stretched link: whole hero is the target, title is the link text. */}
            <Link href={`/articoli/${toSlug(articolo.titolo)}`} className="after:absolute after:inset-0">
              {articolo.titolo}
            </Link>
          </h1>
          <p className="type-body-lg mt-4 line-clamp-4 text-on-surface">{articolo.introduzione}</p>
          <div className="mt-6">
            <CategoryTag categoria={articolo.categoria} />
            <div className="mt-3">
              <ReadingTime minutes={letturaTime(articolo)} suffix="min read" />
            </div>
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-outline-variant">
            <Image
              src={articolo.copertina}
              alt={articolo.titolo}
              fill
              priority
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
