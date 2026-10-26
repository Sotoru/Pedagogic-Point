// Audit the production build: Next's development overlay is not application UI.
// Includes authenticated editor routes without saving or changing database data.
// Complements token contrast checks and mocked Storybook interaction tests.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { SignJWT } from "jose";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { WCAG_TAGS } from "./a11y-tags.mjs";

const ORIGIN = "http://localhost:3100";
const PORT = "3100";
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
    if (server.exitCode !== null) throw new Error("audit server exited; check that port 3100 is free");
    try {
      if ((await fetch(ORIGIN)).ok) return;
    } catch { /* not listening yet */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`server never came up on ${ORIGIN}`);
};

const violations = [];
let views = 0;
const check = (ok, label) => { if (!ok) violations.push(label); };
const audit = async (page, label) => {
  const { violations: found } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  views++;
  for (const v of found) {
    violations.push(`${label}: ${v.id} (${v.impact}) — ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`);
  }
};
const inViewport = async (page, locator, label) => {
  const rect = await locator.boundingBox();
  check(rect && rect.x >= -1 && rect.x + rect.width <= page.viewportSize().width + 1, `${label}: control extends outside viewport`);
};
const checkHeader = async (page, label) => {
  const logo = page.getByRole("link", { name: "PedagogicPoint, pagina iniziale", exact: true });
  const toggle = page.getByRole("button", { name: /^Attiva tema/ });
  await inViewport(page, logo, `${label} logo`);
  await inViewport(page, toggle, `${label} theme toggle`);
  const [a, b] = await Promise.all([logo.boundingBox(), toggle.boundingBox()]);
  check(a && b && a.x + a.width + 4 <= b.x, `${label}: logo overlaps theme toggle`);
  check(b && b.width >= 44 && b.height >= 44, `${label}: theme toggle target smaller than 44px`);
};
const modalOwnsPageFocus = (el) =>
  // Native dialogs allow Tab to reach browser chrome. In that case Chromium
  // reports BODY as activeElement but document.hasFocus() is false. Background
  // controls must never receive focus while the page itself is focused.
  !document.hasFocus() || el.contains(document.activeElement);

let browser;
try {
  await waitForServer();
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET));
  const home = await (await fetch(ORIGIN)).text();
  const slug = home.match(/href="\/articoli\/([^"]+)"/)?.[1];
  const adminList = await (await fetch(`${ORIGIN}/admin`, { headers: { Cookie: `pp_admin=${token}` } })).text();
  const id = adminList.match(/href="\/admin\/([0-9a-f-]{36})"/)?.[1];
  if (!slug || !id) throw new Error("could not find a sample article slug/id in the rendered pages");
  const routes = ["/", `/articoli/${slug}`, "/privacy", "/termini", "/non-esiste", "/admin/login", "/admin", "/admin/new", `/admin/${id}`];

  browser = await chromium.launch();
  for (const colorScheme of ["light", "dark"]) {
    for (const width of [1440, 320]) {
      const label = `${colorScheme} ${width}px`;
      const context = await browser.newContext({ colorScheme, viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      await context.addCookies([{ name: "pp_admin", value: token, url: ORIGIN }]);
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(ORIGIN + route, { waitUntil: "networkidle" });
        if (route === "/") await checkHeader(page, label);
        if (route === "/admin/new" || route === `/admin/${id}`) {
          // Empty content previously hid the editor's unreadable dark text.
          const editor = page.getByRole("textbox", { name: "editable markdown" });
          await editor.fill("Testo di verifica: leggibile anche nel tema scuro.");
        }
        await audit(page, `${label} ${route}`);
        if (route === "/admin/new") {
          const editor = page.getByRole("textbox", { name: "editable markdown" });
          await editor.focus();
          await page.getByRole("combobox", { name: "Tipo di blocco" }).selectOption("h2");
          await editor.getByRole("heading", { level: 2 }).waitFor();
          await page.getByRole("combobox", { name: "Tipo di blocco" }).selectOption("paragraph");
          await page.getByRole("button", { name: "Create link" }).click();
          const linkDialog = page.getByRole("dialog", { name: "Modifica collegamento" });
          await linkDialog.waitFor();
          for (const field of await linkDialog.locator("input, button").all()) {
            await inViewport(page, field, `${label} link dialog`);
          }
          await audit(page, `${label} editor link dialog`);
          await linkDialog.getByRole("textbox", { name: "Indirizzo URL" }).fill("https://example.com/approfondimento");
          await linkDialog.getByRole("button", { name: "Salva link" }).click();
          const preview = page.getByRole("group", { name: "Collegamento", exact: true });
          await preview.waitFor();
          await audit(page, `${label} editor link preview`);
          await preview.getByRole("button", { name: "Modifica link" }).click();
          await linkDialog.waitFor();
          await page.keyboard.press("Escape");
          check(await page.locator("dialog[open]").count() === 0, `${label}: Escape did not close link editor`);
          check(await editor.evaluate((el) => el === document.activeElement), `${label}: link editor did not restore focus`);
        }
      }
      await page.goto(`${ORIGIN}/admin/new`, { waitUntil: "networkidle" });
      const trigger = page.getByRole("button", { name: "Unsplash", exact: true });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      check(await dialog.evaluate((el) => el.contains(document.activeElement)), `${label}: modal did not receive focus`);
      for (const control of [dialog.getByRole("textbox"), dialog.getByRole("button", { name: "Cerca", exact: true }), dialog.getByRole("button", { name: "Chiudi" })]) {
        await inViewport(page, control, `${label} Unsplash`);
      }
      // Native focus containment must also hold while tabbing past both ends.
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
        check(await dialog.evaluate(modalOwnsPageFocus), `${label}: Tab reached background content`);
      }
      await page.keyboard.press("Shift+Tab");
      check(await dialog.evaluate(modalOwnsPageFocus), `${label}: Shift+Tab reached background content`);
      await audit(page, `${label} Unsplash open`);
      await page.keyboard.press("Escape");
      check(await page.locator("dialog[open]").count() === 0, `${label}: Escape did not close modal`);
      check(await trigger.evaluate((el) => el === document.activeElement), `${label}: modal did not restore focus`);

      // Hold a real read-only action while checking reduced-motion feedback.
      await page.goto(ORIGIN, { waitUntil: "networkidle" });
      const refresh = page.getByRole("button", { name: "Mostra un'altra perla" });
      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      await page.route("**/*", async (route) => {
        if (route.request().method() === "POST" && route.request().headers()["next-action"]) await gate;
        await route.continue();
      });
      await refresh.click();
      try {
        await page.getByRole("status", { name: "Aggiornamento perla" }).getByText("Caricamento…").waitFor();
        const statusSize = await page.getByRole("status", { name: "Aggiornamento perla" }).boundingBox();
        check(statusSize && statusSize.width <= 1 && statusSize.height <= 1, `${label}: Perla loading caption is visually exposed`);
        check(await refresh.getAttribute("aria-busy") === "true", `${label}: refresh missing busy state`);
        const animation = await refresh.locator("svg").evaluate((el) => getComputedStyle(el).animationName);
        check(animation === "none", `${label}: reduced-motion spinner still animates`);
        await audit(page, `${label} Perla pending, reduced motion`);
      } finally { release(); }
      await page.waitForFunction(() => document.querySelector('button[aria-label="Mostra un\'altra perla"]')?.getAttribute("aria-busy") === "false");
      check(await refresh.evaluate((el) => el === document.activeElement), `${label}: refresh lost focus`);
      await context.close();
      console.log(`checked ${label}: routes, editor, modal, reduced motion`);
    }
  }

  // Intermediate mobile sizes and storage-blocked initial theme are independent
  // regressions: system dark must still work when localStorage throws.
  const context = await browser.newContext({ colorScheme: "dark", reducedMotion: "reduce" });
  await context.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("Storage blocked", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("Storage blocked", "SecurityError"); };
  });
  const page = await context.newPage();
  for (const width of [375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(ORIGIN, { waitUntil: "networkidle" });
    check(await page.locator("html").evaluate((el) => el.classList.contains("dark")), `${width}px: blocked storage ignored system dark`);
    await checkHeader(page, `dark ${width}px blocked storage`);
    const toggle = page.getByRole("button", { name: "Attiva tema chiaro" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    const toggled = page.getByRole("button", { name: "Attiva tema scuro" });
    await toggled.waitFor();
    check(await toggled.evaluate((el) => el === document.activeElement), `${width}px: theme toggle lost keyboard focus`);
    await checkHeader(page, `light ${width}px blocked storage`);
  }
  await context.close();
  if (violations.length) {
    console.error(`✗ ${violations.length} accessibility failure(s):\n  ${violations.join("\n  ")}`);
    process.exitCode = 1;
  } else {
    console.log(`a11y ok (${views} views, light + dark, 320px + desktop; layout at 375/390px, keyboard, reduced motion, blocked storage)`);
  }
} catch (e) {
  console.error("✗ check:a11y failed:", e.message);
  process.exitCode = 1;
} finally {
  await browser?.close();
  stop();
}
