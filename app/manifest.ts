import type { MetadataRoute } from "next";

// Web app manifest: quel che rende il sito installabile (Chromium pretende
// name/short_name, un'icona 192 e una 512, start_url e display). Il service
// worker non serve all'installazione, quindi non c'è.
// Le PNG in public/ sono il glifo "P" di Great Vibes — lo stesso del wordmark —
// in primary su surface, così l'icona combacia con background_color e theme_color
// qui sotto; apple-icon.png accanto a questo file copre la home screen iOS.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PedagogicPoint",
    short_name: "PedagogicPoint",
    description: "PedagogicPoint — articoli dinamici e perle pedagogiche.",
    lang: "it",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9fb", // surface (light)
    theme_color: "#f9f9fb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // Sfondo a tutto campo e glifo entro la safe zone: la stessa PNG vale anche maskable.
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
