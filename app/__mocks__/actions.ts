// fallow-ignore-file unused-file -- resolved by Storybook's __mocks__ convention from sb.mock(), never imported
import { fn } from "storybook/test";
import type { Perla } from "@/app/content";
import type { ArticlePage } from "@/lib/data";
import { paginaSuccessiva, perlaAlternativa } from "@/stories/fixtures";

// Automock target for `sb.mock(import("../app/actions.ts"))` in
// .storybook/preview. The real module is "use server" and pulls lib/db →
// @neondatabase/serverless, so this file is what keeps the database client out of
// the story bundle. Both types are imported as types only, which erases at
// compile time — importing lib/data for real would defeat the point.
//
// These return fixtures rather than being bare spies: the ArticleList and
// PerlaPedagogica stories click their buttons, and a spy resolving to undefined
// would throw on `page.articoli` instead of exercising the live region.
export const loadMoreArticoli = fn(async (): Promise<ArticlePage> => paginaSuccessiva).mockName("loadMoreArticoli");

export const refreshPerla = fn(async (): Promise<Perla | null> => perlaAlternativa).mockName("refreshPerla");
