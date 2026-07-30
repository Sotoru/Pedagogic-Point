"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import {
  isAuthed,
  passwordOk,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";
import { slugify } from "@/app/content";

// --- Auth ---

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!passwordOk(password)) return "Password errata.";
  await setSessionCookie(await createSessionToken());
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

// --- Article CRUD ---

export type ArticleInput = {
  titolo: string;
  slug: string;
  introduzione: string;
  copertina: string;
  categoria: string;
  autore: string;
  evidenza: boolean;
  body: string;
};

export type ActionResult = { ok: true } | { ok: false; error: string } | null;

function parseForm(formData: FormData): ArticleInput {
  return {
    titolo: String(formData.get("titolo") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    introduzione: String(formData.get("introduzione") ?? ""),
    copertina: String(formData.get("copertina") ?? "").trim(),
    categoria: String(formData.get("categoria") ?? "").trim(),
    autore: String(formData.get("autore") ?? "").trim(),
    evidenza: formData.get("evidenza") === "on" || formData.get("evidenza") === "true",
    body: String(formData.get("body") ?? ""),
  };
}

// Slug rule (see grilling): empty field -> regenerate from titolo; otherwise
// normalize the provided value through slugify. Always normalized so an admin
// can't save a slug with spaces/accents that would break URLs.
function resolveSlug(input: ArticleInput): string {
  const raw = input.slug ? input.slug : input.titolo;
  return slugify(raw);
}

// Fails if the slug is already used by a *different* article (UNIQUE strict).
async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .select({ id: articles.id })
    .from(articles)
    .where(exceptId ? and(eq(articles.slug, slug), ne(articles.id, exceptId)) : eq(articles.slug, slug))
    .limit(1);
  return rows.length > 0;
}

function revalidatePublic(slug: string) {
  revalidatePath("/");
  revalidatePath(`/articoli/${slug}`);
}

export async function createArticolo(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: "Non autorizzato." };
  const input = parseForm(formData);
  if (!input.titolo) return { ok: false, error: "Il titolo è obbligatorio." };

  const slug = resolveSlug(input);
  if (!slug) return { ok: false, error: "Slug non valido (titolo o slug richiesto)." };
  if (await slugTaken(slug)) return { ok: false, error: `Slug "${slug}" già in uso.` };

  const [{ id }] = await getDb()
    .insert(articles)
    .values({ ...input, slug })
    .returning({ id: articles.id });

  revalidatePublic(slug);
  redirect(`/admin/${id}`);
}

export async function updateArticolo(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!(await isAuthed())) return { ok: false, error: "Non autorizzato." };
  const input = parseForm(formData);
  if (!input.titolo) return { ok: false, error: "Il titolo è obbligatorio." };

  const slug = resolveSlug(input);
  if (!slug) return { ok: false, error: "Slug non valido." };
  if (await slugTaken(slug, id)) return { ok: false, error: `Slug "${slug}" già in uso.` };

  await getDb().update(articles).set({ ...input, slug }).where(eq(articles.id, id));

  revalidatePublic(slug);
  return { ok: true };
}

export async function deleteArticolo(id: string): Promise<void> {
  if (!(await isAuthed())) throw new Error("Non autorizzato.");
  await getDb().delete(articles).where(eq(articles.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
