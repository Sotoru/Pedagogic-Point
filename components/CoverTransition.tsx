/// <reference types="react/canary" />
import type { ReactNode } from "react";
import { ViewTransition } from "react";

// Same cover on the card/hero and on the article page: naming both with the
// slug makes the browser morph one into the other on navigation.
// default="none" stops it cross-fading on unrelated transitions; the explicit
// share is what keeps the pair morphing despite that (Next view-transitions guide).
// Forward navigation pairs cached destinations here. useCoverReturn bridges
// eager history traversal with the same native morph after scroll restoration.
export function CoverTransition({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`cover-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
