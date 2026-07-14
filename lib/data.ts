import { FieldPath, type DocumentData } from "firebase-admin/firestore";
import { getDb } from "./firebase-admin";
import type { Article, Perla } from "@/app/content";

// Firestore collections carried over from the legacy project.
const ARTICLES = "articoliDinamici";
const PERLE = "pillole";

// Grid page size. Articles have no date field (see content.ts), so pages are
// ordered by document ID — stable, matches the collection's natural order.
export const PAGE_SIZE = 6;

export type ArticlePage = { articoli: Article[]; nextCursor: string | null };

function toArticle(id: string, d: DocumentData): Article {
  return {
    id,
    titolo: d.titolo ?? "",
    introduzione: d.introduzione ?? "",
    copertina: d.copertina ?? "",
    categoria: d.categoria ?? "",
    evidenza: d.evidenza ?? false,
    autore: d.autore ?? "",
    domande: Array.isArray(d.domande) ? d.domande : [],
  };
}

// Look up one article by its title (the URL slug, deslugified). Mirrors the
// legacy repo's `where titolo == id` navigation. Returns null if none matches.
export async function getArticoloByTitolo(titolo: string): Promise<Article | null> {
  try {
    const snap = await getDb()
      .collection(ARTICLES)
      .where("titolo", "==", titolo)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return toArticle(doc.id, doc.data());
  } catch (e) {
    console.error("getArticoloByTitolo failed:", e);
    return null;
  }
}

// The featured (evidenza) article for the Hero. Falls back to the first article
// by ID when none is flagged — mirrors the legacy `?? articoli[0]` behaviour.
export async function getFeatured(): Promise<Article | null> {
  try {
    const db = getDb();
    let snap = await db.collection(ARTICLES).where("evidenza", "==", true).limit(1).get();
    if (snap.empty) {
      snap = await db.collection(ARTICLES).orderBy(FieldPath.documentId()).limit(1).get();
    }
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return toArticle(doc.id, doc.data());
  } catch (e) {
    console.error("getFeatured failed:", e);
    return null;
  }
}

// One page of grid articles. `cursor` is the last article ID from the previous
// page; omit it for the first page. nextCursor is null once the last page is hit.
export async function getArticoli(cursor?: string): Promise<ArticlePage> {
  try {
    let q = getDb().collection(ARTICLES).orderBy(FieldPath.documentId()).limit(PAGE_SIZE);
    if (cursor) q = q.startAfter(cursor);
    const snap = await q.get();
    const articoli = snap.docs.map((doc) => toArticle(doc.id, doc.data()));
    const nextCursor = snap.size === PAGE_SIZE ? snap.docs[snap.size - 1].id : null;
    return { articoli, nextCursor };
  } catch (e) {
    // Degrade to an empty page instead of a 500 on a Firestore/config hiccup.
    console.error("getArticoli failed:", e);
    return { articoli: [], nextCursor: null };
  }
}

export async function getRandomPerla(): Promise<Perla | null> {
  try {
    const snap = await getDb().collection(PERLE).get();
    if (snap.empty) return null;
    const docs = snap.docs;
    const picked = docs[Math.floor(Math.random() * docs.length)].data();
    return { contenuto: picked.contenuto ?? "" };
  } catch (e) {
    console.error("getRandomPerla failed:", e);
    return null;
  }
}
