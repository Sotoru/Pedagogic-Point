"use server";

import { isAuthed } from "@/lib/auth";

// Unsplash photo search for the cover picker (see ADR 0010). Runs server-side
// so UNSPLASH_ACCESS_KEY never reaches the client. Admin-gated. Also fires the
// required download trigger when a photo is picked, per Unsplash API guidelines.

export type UnsplashPhoto = {
  id: string;
  url: string; // urls.regular — what we store in copertina
  thumb: string; // urls.thumb — grid preview
  alt: string;
  authorName: string;
  authorLink: string;
  downloadLocation: string; // links.download_location — trigger on select
};

type UnsplashApiPhoto = {
  id: string;
  urls: { regular: string; thumb: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
  links: { download_location: string };
};

function accessKey(): string {
  const k = process.env.UNSPLASH_ACCESS_KEY;
  if (!k) throw new Error("Missing UNSPLASH_ACCESS_KEY");
  return k;
}

export async function searchUnsplash(query: string): Promise<UnsplashPhoto[]> {
  if (!(await isAuthed())) throw new Error("Non autorizzato.");
  const q = query.trim();
  if (!q) return [];

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", q);
  url.searchParams.set("per_page", "24");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey()}`, "Accept-Version": "v1" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Unsplash search failed: ${res.status}`);

  const data = (await res.json()) as { results: UnsplashApiPhoto[] };
  return data.results.map((p) => ({
    id: p.id,
    url: p.urls.regular,
    thumb: p.urls.thumb,
    alt: p.alt_description ?? "",
    authorName: p.user.name,
    authorLink: p.user.links.html,
    downloadLocation: p.links.download_location,
  }));
}

// Unsplash guideline: trigger a download event when a photo is actually used.
export async function triggerUnsplashDownload(downloadLocation: string): Promise<void> {
  if (!(await isAuthed())) throw new Error("Non autorizzato.");
  if (!downloadLocation) return;
  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${accessKey()}`, "Accept-Version": "v1" },
      cache: "no-store",
    });
  } catch {
    /* best-effort; a failed trigger must not block saving */
  }
}
