# Pills and buttons are full-capsule (`rounded-full`)

Category tags (`categoryTag`) and buttons (`button`) now use `borderRadius:
"full"` (9999px), matching the Filter Pill. This **supersedes** design.md's
earlier radius guidance for those two elements:

- design.md gave **buttons** the base 8px (`DEFAULT`) radius and deliberately
  kept them *non-capsule* to distinguish them from tags.
- design.md gave **category tags** `rounded-xl` (24px) for a partial "pill"
  effect, again distinct from buttons.

**The decision.** One capsule shape across all pill/button controls. The
Filter Pill was already `rounded-full`; tags and buttons now match it, so the
interactive-control shape language is uniform rather than three different radii
(8px button / 24px tag / full filter).

**Scope.** Two recipes: `theme/recipes/button.ts` and
`theme/recipes/category-tag.ts` (`DEFAULT` → `full`). No component markup
changed. The `rounded.full` token already existed. design.md's radius section
was annotated to point here.

**Unchanged.** Cards, hero/media surfaces, and inputs keep their design.md
radii — this ADR is only about pill/button controls.
