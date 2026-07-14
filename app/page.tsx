import { getArticoli, getFeatured, getRandomPerla } from "@/lib/data";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PerlaPedagogica } from "@/components/PerlaPedagogica";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Footer } from "@/components/Footer";

// ISR: statically rendered, regenerated at most every 5 minutes.
export const revalidate = 300;

export default async function Home() {
  const [featured, firstPage, perla] = await Promise.all([
    getFeatured(),
    getArticoli(),
    getRandomPerla(),
  ]);

  return (
    <>
      <Nav />
      <main>
        {featured && <Hero articolo={featured} />}
        <PerlaPedagogica initialPerla={perla} />
        <ArticleGrid
          initialArticoli={firstPage.articoli}
          initialCursor={firstPage.nextCursor}
          featuredId={featured?.id ?? null}
        />
      </main>
      <Footer />
    </>
  );
}
