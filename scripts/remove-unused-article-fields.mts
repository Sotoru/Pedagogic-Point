// Removes fields that are no longer part of the application Article model.
// Dry-run by default; pass --write to update Firestore.
import nextEnv from "@next/env";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "../lib/firebase-admin.ts";

const ARTICLES = "articoliDinamici";
const USED_FIELDS = new Set(["titolo", "introduzione", "copertina", "categoria", "evidenza", "autore", "body"]);

nextEnv.loadEnvConfig(process.cwd());

const write = process.argv.includes("--write");

const snap = await getDb().collection(ARTICLES).get();
let changed = 0;
let skipped = 0;

for (const doc of snap.docs) {
  const data = doc.data();
  const unusedFields = Object.keys(data).filter((field) => !USED_FIELDS.has(field));

  if (unusedFields.length === 0) {
    skipped += 1;
    console.log(`skip ${doc.id}: no unused fields`);
    continue;
  }

  changed += 1;
  console.log(`${write ? "update" : "dry-run"} ${doc.id}: remove ${unusedFields.join(", ")}`);

  if (write) {
    await doc.ref.update(Object.fromEntries(unusedFields.map((field) => [field, FieldValue.delete()])));
  }
}

console.log(`${write ? "updated" : "would update"}: ${changed}`);
console.log(`skipped: ${skipped}`);
console.log(write ? "done" : "dry-run only; re-run with --write to update Firestore");
