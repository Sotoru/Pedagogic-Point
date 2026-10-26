import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { ArticleNavigationProvider } from "@/components/ArticleNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "PedagogicPoint",
  description: "PedagogicPoint — articoli dinamici e perle pedagogiche.",
};

// Tinta la chrome del browser e della finestra standalone col colore di pagina.
// Segue prefers-color-scheme, non il tema pinnato in localStorage: una meta non
// si aggiorna a runtime e la differenza è solo cosmetica.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1c20" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={fontVariables.join(" ")}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-paint: resolve theme (pinned choice, else OS preference) and set the
            class on <html> before first paint so there's no flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var t;try{t=localStorage.getItem('theme')}catch(e){}var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light')",
          }}
        />
      </head>
      <body><ArticleNavigationProvider>{children}</ArticleNavigationProvider></body>
    </html>
  );
}
