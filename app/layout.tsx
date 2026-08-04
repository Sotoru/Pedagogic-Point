import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "PedagogicPoint",
  description: "PedagogicPoint — articoli dinamici e perle pedagogiche.",
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
              "try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.add(d?'dark':'light')}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
