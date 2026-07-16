import { getArticoli, getFeatured, getRandomPerla } from "@/lib/data";
import { resolveCategoria } from "@/app/content";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PerlaPedagogica } from "@/components/PerlaPedagogica";
import { FilterPill } from "@/components/FilterPill";
import { ArticleList } from "@/components/ArticleList";
import { Footer } from "@/components/Footer";
import { articleGrid } from "@/styled-system/recipes";

// ISR: statically rendered, regenerated at most every 5 minutes.
export const revalidate = 300;

export default async function Home({
  searchParams,
}: {
  // Reading searchParams opts this route into dynamic rendering (Next 16).
  searchParams: Promise<{ categoria?: string | string[] }>;
}) {
  const categoria = resolveCategoria((await searchParams).categoria);
  const [featured, firstPage, perla] = await Promise.all([
    getFeatured(), // Hero = the site's featured piece, unaffected by the filter.
    getArticoli(undefined, categoria),
    getRandomPerla(),
  ]);
  const grid = articleGrid();

  return (
    <>
      <Nav />
      <main>
        {featured && <Hero articolo={featured} />}
        <PerlaPedagogica initialPerla={perla} />
        {/* Grid shell (server): styling from the articleGrid recipe; the list +
            "Carica altri" interactivity live in the ArticleList client component. */}
        <section className={grid.root}>
          <FilterPill categoria={categoria} />
          <h2 className={grid.heading}>Ultimi articoli</h2>
          {/* key remounts the list on filter change so its state resets to the
              new first page (a soft nav would otherwise keep it mounted). */}
          <ArticleList
            key={categoria ?? "all"}
            categoria={categoria}
            initialArticoli={firstPage.articoli}
            initialCursor={firstPage.nextCursor}
            featuredId={featured?.id ?? null}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
