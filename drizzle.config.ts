import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load env from .env.local the same way Next.js does, so `drizzle-kit push`
// and the app share one DATABASE_URL source.
loadEnvConfig(process.cwd());

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
