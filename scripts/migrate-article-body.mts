// Migrates legacy article Q&A blocks (`domande`) into the canonical Markdown
// `body` field. Dry-run by default; pass --write to update Firestore.
import TurndownService from "turndown";
import nextEnv from "@next/env";
import { getDb } from "../lib/firebase-admin.ts";

const ARTICLES = "articoliDinamici";

nextEnv.loadEnvConfig(process.cwd());

type LegacyQuestion = { domanda?: unknown; risposta?: unknown };

const write = process.argv.includes("--write");
const overwrite = process.argv.includes("--overwrite");

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
  strongDelimiter: "**",
});

turndown.remove(["script", "style"]);

function legacyQuestions(value: unknown): LegacyQuestion[] {
  return Array.isArray(value) ? value : [];
}

function htmlToMarkdown(html: string): string {
  return turndown.turndown(html).replace(/\n{3,}/g, "\n\n").trim();
}

function escapeMarkdownText(text: string): string {
  return text.replace(/[\\`*_[\]{}()#+.!|>-]/g, "\\$&");
}

function toMarkdownBody(domande: LegacyQuestion[]): string {
  return domande
    .map((d) => {
      const question = typeof d.domanda === "string" ? d.domanda.trim() : "";
      const answer = typeof d.risposta === "string" ? htmlToMarkdown(d.risposta) : "";
      if (!question && !answer) return "";
      if (!question) return answer;
      const heading = `## ${escapeMarkdownText(question)}`;
      if (!answer) return heading;
      return `${heading}\n\n${answer}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

const snap = await getDb().collection(ARTICLES).get();
let changed = 0;
let skipped = 0;

for (const doc of snap.docs) {
  const data = doc.data();
  if (typeof data.body === "string" && data.body.trim() && !overwrite) {
    skipped += 1;
    console.log(`skip ${doc.id}: body already exists`);
    continue;
  }

  const body = toMarkdownBody(legacyQuestions(data.domande));
  if (!body) {
    skipped += 1;
    console.log(`skip ${doc.id}: no legacy domande content`);
    continue;
  }

  changed += 1;
  console.log(`${write ? "update" : "dry-run"} ${doc.id}: ${data.titolo ?? "(untitled)"}`);
  console.log(body.slice(0, 300));
  console.log("---");

  if (write) await doc.ref.update({ body });
}

console.log(`${write ? "updated" : "would update"}: ${changed}`);
console.log(`skipped: ${skipped}`);
console.log(write ? "done" : "dry-run only; re-run with --write to update Firestore");
