"use client";

import { SunIcon, MoonIcon } from "./icons";
import { css } from "@/styled-system/css";

// Two-state theme toggle. Initial state comes from the pre-paint script in
// layout.tsx (reads localStorage, else the OS preference) which sets `.dark`/
// `.light` on <html>. Clicking pins an explicit choice. Icon swap is CSS-driven
// (_dark condition), so no React state and no hydration mismatch.
export function ThemeToggle() {
  const apply = () => {
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

  // Cross-fade the whole page instead of an instant light↔dark brightness jump.
  // Browsers without View Transitions, and reduced motion, just swap.
  const toggle = () => {
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) apply();
    else {
      // Rapid toggles can skip an unfinished transition. The theme still
      // changes; only its animation's `ready` promise rejects.
      void document.startViewTransition(apply).ready.catch(() => {});
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={css({
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "11",
        minHeight: "11",
        borderRadius: "full",
        padding: "2",
        color: "on-surface-variant",
        transitionProperty: "color, transform",
        transitionDuration: "150ms",
        transitionTimingFunction: "ease-out",
        _hover: { color: "primary" },
        _active: { transform: "scale(0.9)" },
      })}
    >
      <span className={css({ display: { base: "inline", _dark: "none" } })}>
        <span className={css({ srOnly: true })}>Attiva tema scuro</span>
      </span>
      <span className={css({ display: { base: "none", _dark: "inline" } })}>
        <span className={css({ srOnly: true })}>Attiva tema chiaro</span>
      </span>
      <SunIcon className={css({ display: { base: "block", _dark: "none" } })} />
      <MoonIcon className={css({ display: { base: "none", _dark: "block" } })} />
    </button>
  );
}
