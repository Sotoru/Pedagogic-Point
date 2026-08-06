import { Montserrat, Inter, Great_Vibes, Montez } from "next/font/google";

// design.md fonts, extracted from layout.tsx because two roots need them now:
// the site (app/layout.tsx) and the stories (.storybook/preview). Panda's font
// tokens are `var(--font-montserrat)` etc., so without these classes on <html>
// every textStyle silently falls back to system fonts — and the brand wordmark,
// which reads the vars inline, loses its script faces entirely.
//
// Montserrat/Inter are variable (no weight needed); Great Vibes + Montez are
// single-weight display scripts for the wordmark only.
export const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes" });
export const montez = Montez({ subsets: ["latin"], weight: "400", variable: "--font-montez" });

// The generated class names, each of which declares one CSS var. They belong on
// <html>: `body { font-family: var(--fonts-inter) }` is computed on the body, so
// a var declared any deeper never reaches it.
export const fontVariables = [montserrat, inter, greatVibes, montez].map((f) => f.variable);
