import type { Metadata } from "next";
import { Montserrat, Inter, Great_Vibes, Montez } from "next/font/google";
import "./globals.css";

// design.md fonts. Montserrat/Inter are variable (no weight needed);
// Great Vibes + Montez are single-weight display scripts for the wordmark only.
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes" });
const montez = Montez({ subsets: ["latin"], weight: "400", variable: "--font-montez" });

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
      className={`${montserrat.variable} ${inter.variable} ${greatVibes.variable} ${montez.variable}`}
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
