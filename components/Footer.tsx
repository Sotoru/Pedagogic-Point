import { Wordmark } from "./Wordmark";

// Footer (design.md): container-max, three-way flex — wordmark left, links center,
// copyright right. Links in muted label-caps, no dividers. Stacks below md.
export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-6 px-margin-mobile py-12 md:flex-row md:px-margin-desktop">
        <Wordmark className="wordmark-sm" />
        <nav className="type-label-caps flex flex-wrap items-center justify-center gap-6 normal-case text-muted">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">RSS Feed</a>
        </nav>
        <p className="type-label-caps normal-case text-muted">
          © 2024 PedagogicPoint. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
