import { categoryAccent } from "@/app/content";
import { categoryTag } from "@/styled-system/recipes";

type Accent = NonNullable<Parameters<typeof categoryTag>[0]>["categoria"];

// design.md tag: 10%-opacity accent background + full-saturation accent text.
// The accent is a recipe variant (see categoryTag in panda.config); the tint
// follows dark mode automatically via color-mix on the live token var.
export function CategoryTag({ categoria }: { categoria: string }) {
  const token = (categoryAccent[categoria] ?? "secondary") as Accent;
  return <span className={categoryTag({ categoria: token })}>{categoria}</span>;
}
