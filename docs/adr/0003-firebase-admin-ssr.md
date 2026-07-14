# Firebase Admin SDK for SSR reads, ISR, server-action perla refresh

The home page reads public content (articles + perle) from the legacy Firestore
project (`pedagogicpoint`, collections `articoliDinamici` / `pillole`). We read
it server-side with the **Firebase Admin SDK** through a small data layer
(`lib/data.ts`), not the client Web SDK: the content is public and read at SSR,
so Admin is the standard, zero-client-bundle path and doesn't depend on how the
Firestore security rules are written. The cost is a service-account credential,
supplied via `.env.local` (`FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` /
`FIREBASE_PRIVATE_KEY`); the admin app is a lazy singleton so missing creds fail
at call time (caught, page degrades to empty) rather than breaking the build.

Rendering uses **ISR** (`export const revalidate = 300`) — static-fast loads,
Firestore hit at most every 5 minutes, content staleness invisible for this
domain; on-demand revalidation can be layered on later. The Perla shows a random
doc per revalidation, and its refresh button calls a **server action**
(`refreshPerla`) that returns a fresh random perla per click.
