"use client";

import { useEffect } from "react";

type Origin = { homeHref: string; articleHref: string };

// An async precommit boundary avoids React's eager popstate commit, allowing
// its ViewTransition to capture both covers and the restored viewport. Next
// still handles history. Unsupported browsers retain their instant return.
export function useCoverReturn(origin: Origin | null) {
  useEffect(() => {
    const navigation = window.navigation;
    if (!navigation || !document.startViewTransition || !origin) return;
    const prepare = (event: NavigateEvent) => {
      if (event.navigationType !== "traverse" || !event.destination.sameDocument ||
          !event.canIntercept || !event.cancelable ||
          location.pathname !== origin.articleHref ||
          matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const destination = new URL(event.destination.url);
      if (destination.pathname + destination.search !== origin.homeHref) return;
      event.intercept({
        focusReset: "manual", scroll: "manual",
        precommitHandler: () => Promise.resolve(),
      });
    };
    navigation.addEventListener("navigate", prepare);
    return () => navigation.removeEventListener("navigate", prepare);
  }, [origin]);
}
