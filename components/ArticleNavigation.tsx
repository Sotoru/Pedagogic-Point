"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Article } from "@/app/content";
import { css } from "@/styled-system/css";
import { useCoverReturn } from "./useCoverReturn";

type ListState = { articoli: Article[]; cursor: string | null; hasLoadedMore: boolean };
type Origin = { homeHref: string; homeId: string; articleHref: string };
type Position = { x: number; y: number };
type NavigationState = {
  lists: Record<string, ListState>;
  saveList: (key: string, state: ListState) => void;
  origin: Origin | null;
  rememberOrigin: (origin: Origin) => void;
  savePosition: (key: string, position: Position) => void;
  getPosition: (key: string) => Position | undefined;
};

const ArticleNavigationContext = createContext<NavigationState | null>(null);

// This shared layout outlives pages. Keep list height available on the first
// returning render so Next can restore history's scroll without clamping it to
// a shorter first page. Nothing is persisted to browser storage or the server.
export function ArticleNavigationProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<Record<string, ListState>>({});
  const [origin, rememberOrigin] = useState<Origin | null>(null);
  useCoverReturn(origin);
  const positions = useRef(new Map<string, Position>());
  const savePosition = useCallback((key: string, position: Position) => {
    positions.current.delete(key);
    positions.current.set(key, position);
    if (positions.current.size > 10) positions.current.delete(positions.current.keys().next().value!);
  }, []);
  const getPosition = useCallback((key: string) => positions.current.get(key), []);
  const saveList = useCallback((key: string, state: ListState) => {
    setLists((previous) => previous[key] === state ? previous : Object.fromEntries(
      [...Object.entries(previous).filter(([id]) => id !== key), [key, state]].slice(-10),
    ));
  }, []);
  const value = useMemo(() => ({ lists, saveList, origin, rememberOrigin, savePosition, getPosition }),
    [lists, saveList, origin, savePosition, getPosition]);
  return <ArticleNavigationContext.Provider value={value}>{children}</ArticleNavigationContext.Provider>;
}

export function useRememberedArticleList(initial: ListState, categoria: string | null) {
  const navigation = useContext(ArticleNavigationContext);
  const { bfcacheId } = useRouter();
  // Public Next API: unchanged on back/forward, fresh on a new route visit.
  // Category changes share an id, so they need their own list within that visit.
  const key = bfcacheId ? JSON.stringify([bfcacheId, categoria]) : null;
  const [state, setState] = useState(() => (key && navigation?.lists[key]) || initial);
  const saveList = navigation?.saveList;
  useEffect(() => {
    if (key && saveList) saveList(key, state);
  }, [key, saveList, state]);

  const origin = navigation?.origin;
  const savePosition = navigation?.savePosition;
  const getPosition = navigation?.getPosition;
  useLayoutEffect(() => {
    if (!bfcacheId || !savePosition || !getPosition) return;
    const homeHref = location.pathname + location.search;
    const positionKey = JSON.stringify([bfcacheId, homeHref]);
    const saved = getPosition(positionKey);
    const returning = origin?.homeId === bfcacheId && origin.homeHref === homeHref;
    const restore = () => {
      if (!returning || !saved) return;
      const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="/articoli/"]'))
        .find((a) => a.getAttribute("href") === origin.articleHref);
      link?.focus({ preventScroll: true });
      window.scrollTo({ left: saved.x, top: saved.y, behavior: "instant" });
    };
    const capture = () => {
      if (location.pathname + location.search === homeHref) savePosition(positionKey, { x: scrollX, y: scrollY });
    };
    restore();
    // Next can restore the category-change offset instead of the later card
    // offset. Reconcile after its layout effects, still before the next paint.
    const frame = requestAnimationFrame(restore);
    window.addEventListener("scroll", capture, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", capture); };
  }, [bfcacheId, origin, savePosition, getPosition]);
  return [state, setState] as const;
}

type ArticleLinkProps = { href: string; className?: string; children: ReactNode };

export function ArticleLink({ href, ...props }: ArticleLinkProps) {
  const navigation = useContext(ArticleNavigationContext);
  const { bfcacheId } = useRouter();
  return <Link {...props} href={href} onNavigate={() => {
    if (location.pathname === "/" && bfcacheId) {
      const homeHref = location.pathname + location.search;
      navigation?.savePosition(JSON.stringify([bfcacheId, homeHref]), { x: scrollX, y: scrollY });
      navigation?.rememberOrigin({ homeHref, homeId: bfcacheId, articleHref: href });
    }
  }} />;
}

export function BackToArticles() {
  const navigation = useContext(ArticleNavigationContext);
  const pathname = usePathname();
  const router = useRouter();
  const origin = navigation?.origin?.articleHref === pathname ? navigation.origin : null;
  return (
    <Link href={origin?.homeHref ?? "/"} className={css({
      textStyle: "button", marginBottom: "8", display: "flex", width: "fit-content",
      alignItems: "center", gap: "1.5", color: "muted", transitionProperty: "color",
      transitionDuration: "150ms", _hover: { color: "primary" },
    })} onNavigate={(event) => {
      if (origin) { event.preventDefault(); router.back(); }
    }}>
      <span aria-hidden>&larr;</span> Torna agli articoli
    </Link>
  );
}
