import { getArticoliByPk } from "@/lib/data";
import { excerpt } from "@/app/content";

// RSS 2.0 feed for the footer's "Feed RSS" link. Same 5-min window as the pages.
// No <pubDate>: articles have no date field (see content.ts), and RSS makes it
// optional — readers fall back to the moment they first see an item. Items are
// emitted in the grid's order so the feed's sequence matches the site's.
export const revalidate = 300;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(request: Request) {
  // Absolute URLs are required by RSS. Derive them from the request rather than
  // an env var, so localhost, Vercel previews and production each self-describe.
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = host ? `${proto}://${host}` : new URL(request.url).origin;

  const articoli = await getArticoliByPk();
  const items = articoli
    .map((a) => {
      const url = `${origin}/articoli/${a.slug}`;
      return `    <item>
      <title>${esc(a.titolo)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <description>${esc(excerpt(a))}</description>${a.categoria ? `
      <category>${esc(a.categoria)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PedagogicPoint</title>
    <link>${esc(origin)}</link>
    <description>PedagogicPoint — articoli dinamici e perle pedagogiche.</description>
    <language>it</language>
    <atom:link href="${esc(`${origin}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
