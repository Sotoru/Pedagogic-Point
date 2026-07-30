// Drizzle schema for the Neon (Postgres) datastore. Replaces the two legacy
// Firestore collections (`articoliDinamici`, `pillole`) — see ADR 0009.
// Italian field names are carried over from the app model in `app/content.ts`.
import { pgTable, text, boolean, uuid } from "drizzle-orm/pg-core";

// Articles. PK `id` is a DB-generated UUID. Articles are looked up by their
// unique `slug` (normalized from `titolo` — see slugify in app/content.ts),
// which removes the legacy title-reversal fragility. Keyset pagination orders
// by the UUID PK: arbitrary but stable, matching the prior behaviour.
// Columns are NOT NULL with defaults so `lib/data.ts` needn't null-coalesce.
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titolo: text("titolo").notNull().default(""),
  introduzione: text("introduzione").notNull().default(""),
  copertina: text("copertina").notNull().default(""),
  categoria: text("categoria").notNull().default(""),
  evidenza: boolean("evidenza").notNull().default(false),
  autore: text("autore").notNull().default(""),
  body: text("body").notNull().default(""),
});

// Perle pedagogiche (pull-quotes). One random row is shown per page load /
// refresh click. PK is a DB-generated UUID.
export const perle = pgTable("perle", {
  id: uuid("id").primaryKey().defaultRandom(),
  contenuto: text("contenuto").notNull().default(""),
});
