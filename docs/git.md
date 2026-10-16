# Git

- Ogni commit usa Conventional Commits (`feat`, `fix`, `perf`, `refactor`,
  `style`, `build`, `chore`, `docs`, `test`), anche su `develop`.
- Vercel pubblica la produzione da `main`.
- Si rilascia in fast-forward: verifica obbligatoria verde, poi
  `git push origin develop:main`.
- Si tagga solo `main`. Dopo il push, calcolare il bump dai commit
  `git log <ultimo-tag-vX.Y.Z>..main`; vince il più alto:

  | Commit                   | Bump       |
  | ------------------------ | ---------- |
  | `!` o `BREAKING CHANGE:` | major      |
  | `feat`                   | minor      |
  | `fix`, `perf`            | patch      |
  | altri tipi               | nessun tag |

- Tag annotato `vX.Y.Z`, poi `git push origin vX.Y.Z`. Il tag legacy `1.0` senza
  `v` si ignora.
- La versione vive solo nei tag: `version` in `package.json` resta `0.0.0`.
