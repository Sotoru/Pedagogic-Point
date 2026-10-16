import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { textStyles } from "../theme/tokens.gen.ts";

// Generated fresh rather than read from styled-system/styles.css: that file is
// written by `panda cssgen`, while a Next build routes Panda through PostCSS and
// leaves it untouched, so on-disk it is routinely stale.
const out = join(tmpdir(), "pp-check-tokens.css");
try {
  execFileSync("node_modules/.bin/panda", ["cssgen", "--silent", "--outfile", out], { stdio: "inherit" });
} catch {
  console.error("✗ panda cssgen failed — run `npm run tokens` first");
  process.exit(1);
}

const css = readFileSync(out, "utf8");
rmSync(out, { force: true });

const names = Object.keys(textStyles);
const missing = names.filter((name) => !css.includes(`.textStyle_${name}`));

if (missing.length) {
  console.error(
    `✗ ${missing.length} textStyle declared in design.md with no CSS class:\n  ` +
      missing.map((n) => `${n} (expected .textStyle_${n})`).join("\n  "),
  );
  process.exit(1);
}
console.log(`tokens ok (${names.length} textStyles, all emitted)`);
