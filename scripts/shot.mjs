// One-off visual-parity capture over the Chrome DevTools Protocol.
// No Playwright dep: launches headless Chrome with --remote-debugging-port,
// sets the theme via localStorage (the layout pre-paint script reads it),
// navigates, and captures a full-page screenshot.
// Usage: node scripts/shot.mjs <baseUrl> <outDir> <slug>
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { writeFileSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [baseUrl, outDir, slug] = process.argv.slice(2);
const PORT = 9222;

const shots = [
  { name: "home-light", url: baseUrl, theme: "light" },
  { name: "home-dark", url: baseUrl, theme: "dark" },
  { name: "article-light", url: `${baseUrl}/articoli/${slug}`, theme: "light" },
  { name: "article-dark", url: `${baseUrl}/articoli/${slug}`, theme: "dark" },
];

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--hide-scrollbars",
  "--window-size=1440,2400",
  "--user-data-dir=/tmp/pp-shot-profile",
]);

async function cdp(ws, method, params = {}, id) {
  return new Promise((resolve) => {
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) { ws.removeEventListener("message", handler); resolve(msg.result); }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

try {
  // Wait for the debugging endpoint, then open a fresh tab per shot.
  let list;
  for (let i = 0; i < 40; i++) {
    try { list = await (await fetch(`http://localhost:${PORT}/json/version`)).json(); break; }
    catch { await sleep(250); }
  }
  if (!list) throw new Error("Chrome debug endpoint never came up");

  let id = 1;
  for (const shot of shots) {
    const target = await (await fetch(`http://localhost:${PORT}/json/new`, { method: "PUT" })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    await cdp(ws, "Page.enable", {}, id++);
    // Seed the theme choice before any document script runs.
    await cdp(ws, "Page.addScriptToEvaluateOnNewDocument",
      { source: `try{localStorage.setItem('theme','${shot.theme}')}catch(e){}` }, id++);
    await cdp(ws, "Page.navigate", { url: shot.url }, id++);
    await sleep(2500); // let fonts + images settle
    const { data } = await cdp(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: true }, id++);
    writeFileSync(`${outDir}/${shot.name}.png`, Buffer.from(data, "base64"));
    console.log(`captured ${shot.name}`);
    ws.close();
  }
} finally {
  chrome.kill();
}
