"use client";

import { useLayoutEffect, useRef } from "react";

// Defined with the Perla's content-size exception in docs/design.md. Height is
// measured only at the swap; WAAPI moves the following content in normal flow.
const easing = "cubic-bezier(0.23, 1, 0.32, 1)";
const reducedMotion = "(prefers-reduced-motion: reduce)";

export function usePerlaMotion(content: string | undefined) {
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const previousHeight = useRef<number | null>(null);
  const mounted = useRef(false);
  const fade = useRef<Animation | null>(null);
  const resize = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    mounted.current = true;
    const preference = matchMedia(reducedMotion);
    const stop = () => {
      fade.current?.cancel();
      resize.current?.cancel();
      previousHeight.current = null;
    };
    // Natural height resumes immediately on resize or a preference change.
    preference.addEventListener("change", stop);
    window.addEventListener("resize", stop);
    return () => {
      mounted.current = false;
      stop();
      preference.removeEventListener("change", stop);
      window.removeEventListener("resize", stop);
    };
  }, []);

  useLayoutEffect(() => {
    const from = previousHeight.current;
    previousHeight.current = null;
    // Release the old text's held opacity before revealing the new live text.
    fade.current?.cancel();
    resize.current?.cancel();
    const card = cardRef.current;
    const quote = quoteRef.current;
    if (from == null || !card?.animate || !quote || matchMedia(reducedMotion).matches) return;
    const to = card.getBoundingClientRect().height;
    if (Math.abs(to - from) > 1) {
      resize.current = card.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 250, easing });
    }
    fade.current = quote.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing });
  }, [content]);

  const prepareChange = async () => {
    const card = cardRef.current;
    const quote = quoteRef.current;
    if (card && quote?.animate && !matchMedia(reducedMotion).matches) {
      // Retarget from the current opacity if another refresh interrupts reveal.
      const opacity = getComputedStyle(quote).opacity;
      fade.current?.cancel();
      const exit = quote.animate([{ opacity }, { opacity: 0 }], { duration: 150, easing, fill: "forwards" });
      fade.current = exit;
      await exit.finished.catch(() => { /* Resize, reduced motion, or unmount. */ });
      if (mounted.current && !matchMedia(reducedMotion).matches) previousHeight.current = card.getBoundingClientRect().height;
    }
    return mounted.current;
  };

  return { cardRef, quoteRef, prepareChange };
}
