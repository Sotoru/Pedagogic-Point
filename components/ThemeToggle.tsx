"use client";

import { SunIcon, MoonIcon } from "./icons";

// Two-state theme toggle. Initial state comes from the pre-paint script in
// layout.tsx (reads localStorage, else the OS preference) which sets `.dark`/
// `.light` on <html>. Clicking pins an explicit choice. Icon swap is CSS-driven
// (dark: variant), so no React state and no hydration mismatch.
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
      className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:text-primary"
    >
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </button>
  );
}
