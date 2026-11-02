import { getArticoli, getFeatured, getRandomPerla } from "@/lib/data";
import { resolveCategoria } from "@/app/content";
import { HomeScreen } from "@/components/HomeScreen";

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
  return (
    <HomeScreen
      featured={featured}
      articoli={firstPage.articoli}
      nextCursor={firstPage.nextCursor}
      perla={perla}
      categoria={categoria}
    />
  );
}
