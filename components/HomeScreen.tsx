import type { Article, Perla } from "@/app/content";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { PerlaPedagogica } from "./PerlaPedagogica";
import { Dropdown } from "./Dropdown";
import { ArticleList } from "./ArticleList";
import { Footer } from "./Footer";
import { articleGrid } from "@/styled-system/recipes";

// The home page without its data fetching: the route loads, this renders, and
// Storybook shows the same screen from fixtures.
export function HomeScreen({
  featured,
  articoli,
  nextCursor,
  perla,
  categoria,
}: {
  featured: Article | null;
  articoli: Article[];
  nextCursor: string | null;
  perla: Perla | null;
  categoria: string | null;
}) {
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
          <div className={grid.filter}>
            <span className={grid.filterLabel}>Filtra per:</span>
            <Dropdown categoria={categoria} />
          </div>
          <h2 className={grid.heading}>Ultimi articoli</h2>
          {/* key remounts the list on filter change so its state resets to the
              new first page (a soft nav would otherwise keep it mounted). */}
          <ArticleList
            key={categoria ?? "all"}
            categoria={categoria}
            initialArticoli={articoli}
            initialCursor={nextCursor}
            featuredId={featured?.id ?? null}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
