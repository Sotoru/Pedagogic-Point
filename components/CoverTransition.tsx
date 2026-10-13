/// <reference types="react/canary" />
import type { ReactNode } from "react";
import { ViewTransition } from "react";

// Same cover on the card/hero and on the article page: naming both with the
// slug makes the browser morph one into the other on navigation.
// default="none" stops it cross-fading on unrelated transitions; the explicit
// share is what keeps the pair morphing despite that (Next view-transitions guide).
// The morph needs the destination in the client cache at click time, so it plays
// card → article (links prefetch once in the viewport) but not on the way back:
// the home reads ?categoria, is dynamic, and is never fully prefetched.
export function CoverTransition({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`cover-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
