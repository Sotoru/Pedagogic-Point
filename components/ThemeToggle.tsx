"use client";

import { SunIcon, MoonIcon } from "./icons";
import { css } from "@/styled-system/css";

// Two-state theme toggle. Initial state comes from the pre-paint script in
// layout.tsx (reads localStorage, else the OS preference) which sets `.dark`/
// `.light` on <html>. Clicking pins an explicit choice. Icon swap is CSS-driven
// (_dark condition), so no React state and no hydration mismatch.
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    root.classList.toggle("light", !next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ponytail: private-mode / storage-blocked — choice just won't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambia tema chiaro/scuro"
      className={css({
        cursor: "pointer",
        borderRadius: "full",
        padding: "2",
        color: "on-surface-variant",
        transitionProperty: "color",
        transitionDuration: "150ms",
        _hover: { color: "primary" },
      })}
    >
      <SunIcon className={css({ display: { base: "block", _dark: "none" } })} />
      <MoonIcon className={css({ display: { base: "none", _dark: "block" } })} />
    </button>
  );
}
