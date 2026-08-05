import { eq, and, gt, asc, sql } from "drizzle-orm";
import { getDb } from "./db";
import { articles, perle } from "./db/schema";
import type { Article, Perla } from "@/app/content";

// Grid page size. Articles have no date field (see content.ts), so pages are
// ordered by primary key — stable, matches the collection's natural order.
export const PAGE_SIZE = 6;

export type ArticlePage = { articoli: Article[]; nextCursor: string | null };

// Admin: every article, ordered by title. Used by the /admin list. No paging —
// the collection is small (~74). Throws are NOT swallowed here so the admin
// sees real errors rather than a silently empty list.
export async function getAllArticoli(): Promise<Article[]> {
  return getDb().select().from(articles).orderBy(asc(articles.titolo));
}

// Admin: one article by its UUID PK, for the edit form. Null if not found.
export async function getArticoloById(id: string): Promise<Article | null> {
  const rows = await getDb().select().from(articles).where(eq(articles.id, id)).limit(1);
  return rows[0] ?? null;
}

// Look up one article by its unique slug (the URL segment, taken verbatim).
// Returns null if none matches.
export async function getArticoloBySlug(slug: string): Promise<Article | null> {
  try {
    const rows = await getDb().select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return rows[0] ?? null;
  } catch (e) {
    console.error("getArticoloBySlug failed:", e);
    return null;
  }
}

// The featured (evidenza) article for the Hero. Falls back to the first article
// by id when none is flagged — mirrors the legacy `?? articoli[0]` behaviour.
export async function getFeatured(): Promise<Article | null> {
  try {
    const db = getDb();
    const featured = await db.select().from(articles).where(eq(articles.evidenza, true)).limit(1);
    if (featured[0]) return featured[0];
    const fallback = await db.select().from(articles).orderBy(asc(articles.id)).limit(1);
    return fallback[0] ?? null;
  } catch (e) {
    console.error("getFeatured failed:", e);
    return null;
  }
}

// One page of grid articles. `cursor` is the last article id from the previous
// page; omit it for the first page. nextCursor is null once the last page is
// hit. `categoria` (when set) filters to one category. Ordering by the text PK
// with a lexicographic cursor matches the legacy Firestore documentId order.
export async function getArticoli(cursor?: string, categoria?: string | null): Promise<ArticlePage> {
  try {
    const conditions = [
      categoria ? eq(articles.categoria, categoria) : undefined,
      cursor ? gt(articles.id, cursor) : undefined,
    ].filter(Boolean);

    const articoli = await getDb()
      .select()
      .from(articles)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(articles.id))
      .limit(PAGE_SIZE);

    const nextCursor = articoli.length === PAGE_SIZE ? articoli[articoli.length - 1].id : null;
    return { articoli, nextCursor };
  } catch (e) {
    // Degrade to an empty page instead of a 500 on a DB/config hiccup.
    console.error("getArticoli failed:", e);
    return { articoli: [], nextCursor: null };
  }
}

export async function getRandomPerla(): Promise<Perla | null> {
  try {
    const rows = await getDb()
      .select({ contenuto: perle.contenuto })
      .from(perle)
      .orderBy(sql`random()`)
      .limit(1);
    return rows[0] ?? null;
  } catch (e) {
    console.error("getRandomPerla failed:", e);
    return null;
  }
}
