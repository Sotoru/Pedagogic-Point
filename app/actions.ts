"use server";

import { getArticoli, getRandomPerla, type ArticlePage } from "@/lib/data";
import type { Perla } from "@/app/content";

// Called by the Perla refresh button — fetches a fresh random perla per click.
export async function refreshPerla(): Promise<Perla | null> {
  return getRandomPerla();
}

// Called by the "Carica altri" button — fetches the next page of grid articles.
export async function loadMoreArticoli(cursor: string): Promise<ArticlePage> {
  return getArticoli(cursor);
}
