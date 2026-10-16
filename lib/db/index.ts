import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;
let cached: DB | null = null;

export function getDb(): DB {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Missing DATABASE_URL (Neon connection string).");
  }
  cached = drizzle({ client: neon(url), schema });
  return cached;
}
