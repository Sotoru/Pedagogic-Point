# Admin area: single-password auth + Markdown editor + Unsplash cover picker

We added an `/admin` area for full article CRUD, gated by a **single shared password** kept in `ADMIN_PASSWORD` (no user accounts, no auth provider). A correct password mints a short-lived JWT signed with `jose` (secret `ADMIN_SESSION_SECRET`), stored in an httpOnly cookie; a `proxy.ts` (Next 16's renamed middleware) verifies it on every `/admin/*` request except the login page, and **every write server action re-verifies it server-side** — hiding the UI is not enough, the mutations are the real trust boundary. This is deliberately lightweight because the site has one editor and public content; a real auth stack would be overkill.

## Considered Options

- **Auth model:** single env password + signed cookie, chosen over HTTP Basic Auth (poor UX, password on every request) and a full auth provider (overkill for one editor). `jose` was picked over `node:crypto` because the proxy runs on the Edge runtime, where jose's Web Crypto backing works and `node:crypto` does not.
- **Body editor:** `@mdxeditor/editor` (Markdown-native, Lexical-based) over TipTap. TipTap is more popular but serializes HTML↔Markdown via a third-party extension with imperfect round-trips; MDXEditor treats Markdown as its native format, so the stored `body` stays clean and consistent with the public `MarkdownBody` renderer. Loaded via `next/dynamic({ ssr: false })` since it has no SSR support.
- **Cover images:** an in-app modal that searches the **official Unsplash API** server-side (key in `UNSPLASH_ACCESS_KEY`, never shipped to the client), rather than embedding unsplash.com (blocked by X-Frame-Options) or the deprecated `source.unsplash.com`. On selection we store `urls.regular` and fire the required Unsplash download-trigger endpoint per their API guidelines.
- **Slug on save:** empty slug field regenerates from the title via `slugify`; a filled field is still normalized through `slugify`. Uniqueness is enforced strictly — a collision with another article fails the save with a message (consistent with ADR 0009).

## Consequences

- Three new secrets (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `UNSPLASH_ACCESS_KEY`) must be set in `.env.local` and in the Vercel project (Production scope).
- Mutations call `revalidatePath("/")` and the article path so edits appear immediately instead of waiting for the 5-minute ISR window.
- No rate-limiting on the login endpoint and no CSRF token beyond the sameSite cookie — acceptable for a low-value single-editor admin, but worth revisiting if the threat model grows.
- `/admin/*` pages are marked `robots: noindex`.
