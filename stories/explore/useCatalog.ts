import { useEffect, useRef, useState } from "react";
import { installPreviewIsolation, loadCatalog, type CatalogEntry } from "./catalog";

type CatalogState = { status: "loading" | "ready" | "error"; entries: readonly CatalogEntry[] };

// `entries` short-circuits the virtual module, so stories can pin a catalog.
export function useCatalog(entries?: readonly CatalogEntry[]) {
  const [state, setState] = useState<CatalogState>({ status: "loading", entries: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (entries) return;
    const controller = new AbortController();
    loadCatalog(controller.signal).then(
      (result) => setState({ status: "ready", entries: result }),
      () => {
        if (!controller.signal.aborted) setState({ status: "error", entries: [] });
      },
    );
    return () => controller.abort();
  }, [entries, attempt]);

  const retry = () => {
    setState({ status: "loading", entries: [] });
    setAttempt((value) => value + 1);
  };
  return { ...(entries ? { status: "ready" as const, entries } : state), retry };
}

export function usePreviewIsolation<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => (ref.current ? installPreviewIsolation(ref.current) : undefined), []);
  return ref;
}
