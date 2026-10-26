<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Panda CSS

Before writing Panda CSS, fetch the official docs (don't rely on training data):
- **Always start with the index: `https://panda-css.com/llms.txt`** — first choice, every time.
- Only if the index isn't enough to answer, fall back to full docs: `https://panda-css.com/llms-full.txt`
- Any single page as raw markdown: append `.mdx` to its URL (e.g. `https://panda-css.com/docs/concepts/recipes.mdx`).

Context7 MCP also indexes Panda CSS — prefer it for scoped lookups.

<!-- Nothing hand-written above the END marker: `next dev` rewrites that block. -->

# Guide

- [docs/design.md](docs/design.md): fonte di verità per identità visiva, token Panda, componenti e interazioni; leggere prima di ogni modifica alla UI
- [docs/git.md](docs/git.md): commit, tag di versione, deploy

# Design

- Ogni nuovo componente o interazione parte da [docs/design.md](docs/design.md):
  riusare token, recipe e comportamenti esistenti.
- Se manca una regola, definirla nel documento insieme all'implementazione;
  documentare le eccezioni e il motivo, senza introdurre un secondo design system.
- Non modificare i token generati: aggiornare il documento e usare `npm run tokens`.
- Verificare le modifiche alla UI in Storybook, in chiaro e scuro, su mobile e
  desktop, con tastiera e movimento ridotto; includere gli stati pertinenti.
- `npm run lint` include il lint ufficiale Google del documento; per eseguirlo
  separatamente usare `npm run lint:design`.

# Commit

Conventional Commits; prima di pushare su `main` leggere `docs/git.md`.

# Verifica obbligatoria

```sh
npm run lint
npm run build
npm run check:contrast
npm run check:tokens
```
