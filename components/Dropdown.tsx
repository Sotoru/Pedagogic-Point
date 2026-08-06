"use client";

import type { ChangeEvent } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIE } from "@/app/content";
import { ChevronDown } from "./icons";
import { css } from "@/styled-system/css";

// The dropdown, and only the dropdown: design.md calls this shape the Filter Pill
// (rounded-full select-style control, trailing chevron), while the "Filtra per:"
// caption beside it belongs to the page — articleGrid's `filter`/`filterLabel`.
// A native <select> carries all the keyboard / mobile / a11y behaviour for free;
// picking a category navigates to /?categoria=… (or / for "All"), which the
// server page reads to filter the grid. defaultValue (+ the parent's key remount
// on nav) avoids a controlled-value flicker during the pending navigation.
export function Dropdown({ categoria }: { categoria: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    // scroll: false keeps the viewport put so the dropdown stays in view;
    // Next scrolls to top on nav by default. Nothing above the filter changes
    // height on a category change, so preserving the offset is enough.
    startTransition(() =>
      router.push(v ? `/?categoria=${encodeURIComponent(v)}` : "/", {
        scroll: false,
      }),
    );
  };

  return (
    <div className={css({ position: "relative", display: "inline-flex", alignItems: "center" })}>
      <select
        defaultValue={categoria ?? ""}
        onChange={onChange}
        disabled={pending}
        aria-label="Filtra articoli per categoria"
        className={css({
          textStyle: "button",
          appearance: "none",
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "full",
          border: "1px solid",
          borderColor: "border-subtle",
          backgroundColor: "surface-container-low",
          color: "on-surface",
          paddingBlock: "2",
          paddingInline: "4",
          paddingRight: "9", // room for the chevron overlay
          cursor: "pointer",
          _disabled: { opacity: 0.6, cursor: "wait" },
        })}
      >
        <option value="">Tutte le categorie</option>
        {CATEGORIE.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {/* Overlay chevron: a native <select> can't hold an SVG child, so it
          sits absolutely on top and lets clicks fall through to the select. */}
      <ChevronDown
        className={css({
          color: "muted",
          position: "absolute",
          right: "4",
          pointerEvents: "none",
        })}
      />
    </div>
  );
}
