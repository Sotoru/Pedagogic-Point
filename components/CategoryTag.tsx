import { categoryAccent } from "@/app/content";

// Literal utility classes per accent token — one line each so Tailwind actually
// emits the color. Referencing colors only via inline `var(--color-X)` gets them
// tree-shaken in Tailwind v4 (the token vars are dropped if no utility uses them).
// design.md tag = 10%-opacity accent background + full-saturation accent text.
const ACCENT: Record<string, string> = {
  secondary: "text-secondary bg-secondary/10",
  pedagogy: "text-pedagogy bg-pedagogy/10",
  theory: "text-theory bg-theory/10",
  practice: "text-practice bg-practice/10",
  rights: "text-rights bg-rights/10",
};

export function CategoryTag({ categoria }: { categoria: string }) {
  const token = categoryAccent[categoria] ?? "secondary";
  return (
    <span
      className={`type-label-caps inline-block rounded px-2.5 py-1 normal-case tracking-normal ${ACCENT[token]}`}
    >
      {categoria}
    </span>
  );
}
