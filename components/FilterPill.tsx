import { ChevronDown } from "./icons";

// Filter Pill (design.md): rounded-full select-style control, trailing chevron.
// Visual-only this step — wired to real filtering when the backend lands.
export function FilterPill() {
  return (
    <div className="flex items-center gap-3">
      <span className="type-body-md text-muted">Filter by:</span>
      <span className="type-button inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-container-low px-4 py-2 text-on-surface">
        All Categories
        <ChevronDown className="text-muted" />
      </span>
    </div>
  );
}
