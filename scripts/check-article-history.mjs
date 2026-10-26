// Real back/forward navigation with a paginated list and a category filter.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const origin = process.env.ARTICLE_HISTORY_ORIGIN || "http://localhost:3102";
let server;
let browser;
let currentPage;
let stage = "startup";

try {
  if (!process.env.ARTICLE_HISTORY_ORIGIN) {
    assert(existsSync(".next/BUILD_ID"), "run npm run build first");
    server = spawn("node_modules/.bin/next", ["start", "--port", "3102"], { stdio: "ignore" });
    for (let attempt = 0; ; attempt++) {
      assert(server.exitCode === null, "history server exited; check that port 3102 is free");
      try { if ((await fetch(origin)).ok) break; } catch { /* server is starting */ }
      assert(attempt < 60, "history server did not start");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  browser = await chromium.launch();
  let sampleHref;
  for (const width of [1440, 390]) {
    for (const colorScheme of ["light", "dark"]) {
      for (const way of ["browser", "link"]) {
        const filtered = colorScheme === "dark";
        const reducedMotion = way === "browser" ? "reduce" : "no-preference";
        const label = `${width}px ${colorScheme} ${way} ${reducedMotion}`;
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, reducedMotion });
        const page = await context.newPage();
        currentPage = page;
        stage = `${label}: load more`;
        await page.goto(origin);
        const allCount = await page.locator("main article").count();
        if (filtered) {
          await page.getByRole("combobox", { name: "Filtra articoli per categoria" }).selectOption("apprendimento");
          await page.waitForURL("**/?categoria=apprendimento");
          await page.waitForFunction(() => document.querySelector("select")?.getAttribute("aria-busy") === "false");
        }
        const homeHref = page.url();
        const initialCount = await page.locator("main article").count();
        await page.getByRole("button", { name: "Carica altri", exact: true }).click();
        await page.waitForFunction((count) => document.querySelectorAll("main article").length > count, initialCount);
        const count = await page.locator("main article").count();
        const link = page.locator("main article").last().locator("a");
        const href = await link.getAttribute("href");
        sampleHref = href;
        await link.scrollIntoViewIfNeeded();
        await page.evaluate(() => Promise.all([document.fonts.ready, ...document.getAnimations().map((a) => a.finished.catch(() => {}))]));
        if (way === "link") await link.focus();
        const y = await page.evaluate(() => scrollY);
        if (way === "link") await page.keyboard.press("Enter"); else await link.click();
        const back = page.getByRole("link", { name: "Torna agli articoli" });
        await back.waitFor();
        await page.waitForURL(origin + href);
        assert.equal(await back.getAttribute("href"), homeHref.slice(origin.length), `${label}: modified-click destination lost filter`);
        if (way === "browser") await page.goBack();
        else { await back.focus(); await page.keyboard.press("Enter"); }
        stage = `${label}: restore`;
        await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
        assert.equal(page.url(), homeHref, `${label}: lost category URL`);
        assert.equal(await page.locator("main article").count(), count, `${label}: lost appended cards`);
        await page.waitForFunction(({ href, y }) => Math.abs(scrollY - Math.min(y, document.documentElement.scrollHeight - innerHeight)) < 2 &&
          document.activeElement?.getAttribute("href") === href, { href, y }, { timeout: 5000 }).catch(async () => {
          const actual = await page.evaluate(() => ({ y: scrollY, max: document.documentElement.scrollHeight - innerHeight, focus: document.activeElement?.getAttribute("href") }));
          throw new Error(`${label}: expected scroll ${y} and focus ${href}; got ${JSON.stringify(actual)}`);
        });
        assert.equal(await page.getByRole("combobox").inputValue(), filtered ? "apprendimento" : "", `${label}: lost filter`);
        assert.equal(await page.getByText(/articoli caricati\. .*in totale\./).count(), 0, `${label}: replayed loading announcement`);

        if (way === "browser") {
          stage = `${label}: forward/back after scrolling`;
          // Wait for the returning paint before starting another interaction.
          await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const newerY = Math.max(0, y - 300);
          await page.evaluate((top) => scrollTo(0, top), newerY);
          // Let the passive scroll event record the new viewport before Forward.
          await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          await page.goForward();
          await back.waitFor();
          await page.goBack();
          await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
          await page.waitForFunction((top) => Math.abs(scrollY - Math.min(top, document.documentElement.scrollHeight - innerHeight)) < 2, newerY);
        }

        // The logo is a fresh visit, not an implicit back to an old list.
        stage = `${label}: fresh home via logo`;
        await link.click();
        await back.waitFor();
        await page.getByRole("link", { name: "PedagogicPoint, pagina iniziale", exact: true }).click();
        await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
        assert.equal(await page.locator("main article").count(), allCount, `${label}: fresh home reused an old list`);
        await page.waitForFunction(() => scrollY === 0);
        await context.close();
        console.log(`article history ok: ${label}`);
      }
    }
  }
  // No originating visit: direct links must stay usable, including new tabs and
  // modified clicks. Do not blindly back into an unrelated page or off-site.
  const page = await browser.newPage();
  currentPage = page;
  stage = "direct entry";
  await page.goto(origin + sampleHref);
  const back = page.getByRole("link", { name: "Torna agli articoli" });
  assert.equal(await back.getAttribute("href"), "/", "direct entry has no safe home fallback");
  await back.click();
  await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
  console.log("article history ok: direct entry fallback");
  stage = "hero return";
  const hero = page.locator("main h1 a");
  const heroHref = await hero.getAttribute("href");
  await hero.focus();
  await page.evaluate(() => scrollTo(0, 80));
  const heroY = await page.evaluate(() => scrollY);
  await page.keyboard.press("Enter");
  await back.waitFor();
  await back.click();
  await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
  await page.waitForFunction(({ href, y }) => Math.abs(scrollY - y) < 2 &&
    document.activeElement?.getAttribute("href") === href, { href: heroHref, y: heroY });
  console.log("article history ok: hero return and focus");
  for (const feature of ["navigation", "startViewTransition"]) {
    stage = `fallback without ${feature}`;
    const fallback = await browser.newPage();
    currentPage = fallback;
    await fallback.addInitScript((feature) => {
      Object.defineProperty(feature === "navigation" ? window : document, feature, { value: undefined, configurable: true });
    }, feature);
    await fallback.goto(origin);
    const link = fallback.locator("main article a").last();
    await link.scrollIntoViewIfNeeded();
    const y = await fallback.evaluate(() => scrollY);
    const href = await link.getAttribute("href");
    await link.click();
    await fallback.getByRole("link", { name: "Torna agli articoli" }).waitFor();
    await fallback.goBack();
    await fallback.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
    await fallback.waitForFunction(({ href, y }) => Math.abs(scrollY - y) < 2 &&
      document.activeElement?.getAttribute("href") === href, { href, y });
    await fallback.close();
    console.log(`article history ok: ${stage}`);
  }
} catch (error) {
  console.error(`✗ article history (${stage}): ${error.message}`);
  if (currentPage && !currentPage.isClosed()) console.error(await currentPage.evaluate(() => ({ url: location.href, y: scrollY, max: document.documentElement.scrollHeight - innerHeight, focus: document.activeElement?.getAttribute("href") })));
  process.exitCode = 1;
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
}
