// Accessibility audit of the rendered pages (run: npm run check:a11y).
//
// Runs axe-core against the production build — `next dev` injects its own dev
// overlay into the DOM and axe would audit that too. Covers the admin routes by
// signing a session cookie the way a real login does, so the only real form in
// the project is not silently skipped.
//
// This complements npm run check:contrast, which it cannot replace: axe only sees
// the combinations the current data happens to render, and colour contrast is a
// property of the token pairs whether or not an article currently uses them.
//
// Prerequisites: npm run build, and `npx playwright install chromium` once.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { SignJWT } from "jose";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ORIGIN = "http://localhost:3100"; // not 3000: leaves your dev server alone
const PORT = "3100";

// Only the WCAG 2 A/AA rule sets — the target we hold the site to. Axe's
// "best-practice" tag is advice, not conformance, and would drown the signal.
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

if (!existsSync(".next/BUILD_ID")) {
  console.error("✗ no production build found — run `npm run build` first");
  process.exit(1);
}
if (!process.env.ADMIN_SESSION_SECRET) {
  console.error("✗ ADMIN_SESSION_SECRET missing — run via `npm run check:a11y`, which loads .env.local");
  process.exit(1);
}

const server = spawn("node_modules/.bin/next", ["start", "--port", PORT], { stdio: "ignore" });
const stop = () => server.kill("SIGTERM");
process.on("exit", stop);

const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(ORIGIN)).ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server never came up on ${ORIGIN}`);
};

const violations = [];
const record = (route, found) => {
  for (const v of found) {
    violations.push(
      `${(v.impact ?? "?").padEnd(8)} ${route}\n           ${v.id}: ${v.help}\n           ${v.nodes.length} node(s), first: ${v.nodes[0]?.target?.join(" ")}`,
    );
  }
};

let browser;
try {
  await waitForServer();

  // Same claim and secret as lib/auth.ts mints on a successful password login.
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET));

  // Real slug and id, so the dynamic routes audit actual content.
  const home = await (await fetch(ORIGIN)).text();
  const slug = home.match(/href="\/articoli\/([^"]+)"/)?.[1];
  const adminList = await (await fetch(`${ORIGIN}/admin`, { headers: { Cookie: `pp_admin=${token}` } })).text();
  const id = adminList.match(/href="\/admin\/([0-9a-f-]{36})"/)?.[1];
  if (!slug || !id) throw new Error("could not find a sample article slug/id in the rendered pages");

  browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([{ name: "pp_admin", value: token, url: ORIGIN }]);
  const page = await context.newPage();

  const routes = [
    "/",
    `/articoli/${slug}`,
    "/privacy",
    "/termini",
    "/non-esiste", // the 404 page
    "/admin/login",
    "/admin",
    "/admin/new",
    `/admin/${id}`,
  ];

  for (const route of routes) {
    await page.goto(ORIGIN + route, { waitUntil: "networkidle" });
    record(route, (await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations);
  }

  // The Unsplash picker's modal behaviour, which only a browser can confirm:
  // showModal() must move focus inside the dialog and Escape must dismiss it.
  // Audited open, too — a modal's contents are invisible to a crawl otherwise.
  await page.goto(`${ORIGIN}/admin/new`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Unsplash" }).click();
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor({ timeout: 5000 });
  const focusInside = await page.evaluate(() => document.activeElement?.closest("dialog") !== null);
  if (!focusInside) violations.push(`critical  /admin/new\n           showModal() did not move focus into the dialog`);
  record("/admin/new (dialog open)", (await new AxeBuilder({ page }).withTags(TAGS).analyze()).violations);
  await page.keyboard.press("Escape");
  if ((await page.locator("dialog[open]").count()) > 0) {
    violations.push(`critical  /admin/new\n           Escape did not close the dialog`);
  }

  if (violations.length) {
    console.error(`✗ ${violations.length} accessibility violation(s):\n  ` + violations.join("\n  "));
    process.exit(1);
  }
  console.log(`a11y ok (${routes.length + 1} views audited against WCAG 2 A/AA)`);
} catch (e) {
  console.error("✗ check:a11y failed:", e.message);
  process.exit(1);
} finally {
  await browser?.close();
  stop();
}
