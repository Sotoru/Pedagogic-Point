// Exercise real route navigation: Storybook cannot form a shared-element pair
// across Next pages. Freeze the browser's snapshots mid-morph to catch overflow.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const origin = process.env.COVER_TRANSITION_ORIGIN || "http://localhost:3101";
let server;
let browser;

async function settle(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await Promise.all(window.coverTransitions);
  });
}

async function reset(page) {
  await settle(page);
  await page.evaluate(() => {
    window.coverSamples = []; window.coverDurations = []; window.coverTransitions = [];
  });
}

async function checkMorph(page, label, reducedMotion, slug) {
  await settle(page);
  const samples = await page.evaluate(() => window.coverSamples);
  if (reducedMotion === "reduce") {
    assert(samples.every((sample) => sample.duration === 0), `${label}: reduced motion still morphs`);
    const durations = await page.evaluate(() => window.coverDurations);
    assert(durations.every((duration) => duration === 0), `${label}: reduced motion still animates snapshots`);
    return;
  }
  const covers = samples.filter((sample) => sample.name === `cover-${slug}`);
  assert(covers.length > 0, `${label}: shared cover did not animate`);
  const rect = await page.locator(`[data-article-cover="${slug}"]`).boundingBox();
  assert(rect, `${label}: destination cover is missing`);
  for (const { frames, destination } of covers) {
    for (const frame of frames) {
      for (const kind of ["old", "new"]) {
        assert(["clip", "hidden"].includes(frame[kind].overflow), `${label}: ${kind} snapshot paints outside its bounds`);
        assert(Math.abs(frame[kind].width - frame.group.width) <= 1 &&
          Math.abs(frame[kind].height - frame.group.height) <= 1,
        `${label}: ${kind} snapshot ${frame[kind].width}×${frame[kind].height} escapes morph ${frame.group.width}×${frame.group.height}`);
      }
    }
    for (const axis of ["x", "y", "width", "height"]) {
      assert(Math.abs(destination[axis] - rect[axis]) <= 2,
        `${label}: morph ends at ${axis}=${destination[axis]}, actual cover is at ${rect[axis]}`);
    }
  }
}

try {
  if (!process.env.COVER_TRANSITION_ORIGIN) {
    assert(existsSync(".next/BUILD_ID"), "run npm run build first");
    server = spawn("node_modules/.bin/next", ["start", "--port", "3101"], { stdio: "ignore" });
    for (let attempt = 0; ; attempt++) {
      assert(server.exitCode === null, "transition server exited; check that port 3101 is free");
      try { if ((await fetch(origin)).ok) break; } catch { /* server is starting */ }
      assert(attempt < 60, "transition server did not start");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  browser = await chromium.launch();
  for (const width of [1440, 390]) {
    for (const colorScheme of ["light", "dark"]) {
      for (const reducedMotion of ["no-preference", "reduce"]) {
        const label = `${width}px ${colorScheme} ${reducedMotion}`;
        const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, reducedMotion });
        const page = await context.newPage();
        await page.addInitScript(() => {
          const start = document.startViewTransition.bind(document);
          window.coverSamples = [];
          window.coverDurations = [];
          window.coverTransitions = [];
          document.startViewTransition = (...args) => {
            const transition = start(...args);
            window.coverTransitions.push(transition.finished.catch(() => {}));
            transition.ready.then(() => {
              const animations = document.getAnimations();
              window.coverDurations.push(...animations.filter((a) => a.effect?.pseudoElement?.includes("cover-"))
                .map((a) => Number(a.effect.getTiming().duration)));
              const group = animations.find((a) => a.effect?.pseudoElement?.startsWith("::view-transition-group(cover-"));
              if (!group) return;
              const name = group.effect.pseudoElement.match(/\((.+)\)/)[1];
              const duration = Number(group.effect.getTiming().duration);
              const last = group.effect.getKeyframes().at(-1);
              const matrix = new DOMMatrix(last.transform);
              const destination = { x: matrix.e, y: matrix.f, width: parseFloat(last.width), height: parseFloat(last.height) };
              const sample = { name, duration, destination, frames: [] };
              window.coverSamples.push(sample);
              // Sampling exact times avoids wall-clock timing and slow CI races.
              for (const progress of [0.1, 0.5, 0.9]) {
                for (const a of animations) { a.pause(); a.currentTime = duration * progress; }
                sample.frames.push(Object.fromEntries(["group", "old", "new"].map((kind) => {
                  const style = getComputedStyle(document.documentElement, `::view-transition-${kind}(${name})`);
                  return [kind, { width: parseFloat(style.width), height: parseFloat(style.height), overflow: style.overflow }];
                })));
              }
              for (const a of animations) a.play();
            }).catch(() => { /* React may skip unrelated transitions. */ });
            return transition;
          };
        });
        await page.goto(origin);
        await page.evaluate(() => document.fonts.ready);
        if (colorScheme === "dark") {
          await page.getByRole("combobox", { name: "Filtra articoli per categoria" }).selectOption("apprendimento");
          await page.waitForURL("**/?categoria=apprendimento");
          await page.waitForFunction(() => document.querySelector("select")?.getAttribute("aria-busy") === "false");
        }
        const initialCount = await page.locator("main article").count();
        await page.getByRole("button", { name: "Carica altri", exact: true }).click();
        await page.waitForFunction((count) => document.querySelectorAll("main article").length > count, initialCount);
        const card = page.locator("main article").last();
        const link = card.locator("a");
        const href = await link.getAttribute("href");
        const slug = href.slice("/articoli/".length);
        // Warm the router cache and the destination's responsive image. The
        // regression concerns the morph itself, rather than the uncached fallback.
        await link.click();
        await page.waitForURL(origin + href);
        const back = page.getByRole("link", { name: "Torna agli articoli" });
        await back.waitFor();
        await page.locator("main img").evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
        await page.evaluate(() => Promise.all(window.coverTransitions));
        await page.goBack();
        await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
        await settle(page);
        await link.waitFor();
        await link.scrollIntoViewIfNeeded();
        await card.locator("img").evaluate((img) => img.decode());
        await reset(page);
        const savedY = await page.evaluate(() => scrollY);
        // Include keyboard activation as well as the stretched card click.
        if (colorScheme === "dark") { await link.focus(); await page.keyboard.press("Enter"); }
        else await link.click();
        await page.waitForURL(origin + href);
        await back.waitFor();
        await checkMorph(page, `${label} card → article`, reducedMotion, slug);
        for (const way of ["browser", "link"]) {
          await reset(page);
          if (way === "browser") await page.goBack();
          else { await back.focus(); await page.keyboard.press("Enter"); }
          await page.getByRole("heading", { name: "Ultimi articoli" }).waitFor();
          await checkMorph(page, `${label} article → card (${way})`, reducedMotion, slug);
          assert(Math.abs(await page.evaluate(() => scrollY) - savedY) <= 2, `${label}: reverse morph lost saved scroll`);
          if (way === "browser") {
            await link.click();
            await back.waitFor();
            await settle(page);
          }
        }

        // The featured cover uses a different ratio and sits outside the list.
        await page.goto(origin);
        await page.evaluate(() => document.fonts.ready);
        const hero = page.locator("main h1 a");
        const heroHref = await hero.getAttribute("href");
        const heroSlug = heroHref.slice("/articoli/".length);
        await hero.click();
        await back.waitFor();
        await page.locator("main img").evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
        await settle(page);
        await page.goBack();
        await hero.waitFor();
        await reset(page);
        await hero.click();
        await back.waitFor();
        await checkMorph(page, `${label} hero → article`, reducedMotion, heroSlug);
        await reset(page);
        await back.click();
        await hero.waitFor();
        await checkMorph(page, `${label} article → hero`, reducedMotion, heroSlug);
        await context.close();
        console.log(`cover transition ok: ${label}`);
      }
    }
  }
} catch (error) {
  console.error(`✗ cover transition: ${error.message}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
}
