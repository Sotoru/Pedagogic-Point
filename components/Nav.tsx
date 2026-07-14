import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

// Top header: container-max width, 24px/48px padding. Brand-only and centered
// for now — the nav links are commented out below (see momentaneamente note).
export function Nav() {
  return (
    <header>
      <nav className="relative mx-auto flex max-w-container-max items-center justify-center gap-4 px-margin-mobile py-6 md:px-margin-desktop">
        <Link href="/" aria-label="PedagogicPoint home" className="shrink-0">
          {/* Uniform 64px, but clamp scales it down on narrow phones so the
              wide script wordmark never overflows the margins (~5.3x font width). */}
          <Wordmark className="text-[clamp(2.5rem,16vw,4rem)] leading-none tracking-[-0.02em]" />
        </Link>
        {/* Absolute so the wordmark stays optically centered (design: brand centered for now). */}
        <div className="absolute right-margin-mobile top-1/2 -translate-y-1/2 md:right-margin-desktop">
          <ThemeToggle />
        </div>
        {/* momentaneamente disabilitata: brand centrato senza link
        <div className="type-button flex shrink-0 items-center gap-4 text-on-surface-variant md:gap-8">
          <span aria-disabled="true" className="cursor-not-allowed opacity-50">
            Categories
          </span>
          <span aria-disabled="true" className="cursor-not-allowed opacity-50">
            About
          </span>
        </div>
        */}
      </nav>
    </header>
  );
}
