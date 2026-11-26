#!/usr/bin/env node
/* Guard: this repository carries physics only.
 *
 * Two things are checked, because two different mistakes are possible:
 *   1. a maths code added to books/catalog.json - fails, because the site would then
 *      advertise a maths book on the physics shelf;
 *   2. a folder in books/ that is not in the catalogue - reported, not failed. Those are
 *      the frozen leftovers kept alive for old links (see REPO.md section 3). They must
 *      stay out of the catalogue, and that is exactly what check 1 guards.
 *
 * Usage: node tools/qa/check_subject.mjs      (exit 1 on a blocking problem)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const BOOKS = path.join(ROOT, "books");

/* The physics codes of this repository. A catalogue entry that does not match is a maths
 * or otherwise foreign book that has been moved in by mistake. */
const MINE = /^(phy\d|spem\d|jpfm\d|jpwm\d)/i;

let fail = 0;
const say = (tag, text) => console.log(`  ${tag.padEnd(7)}${text}`);
const bad = (text) => { fail++; say("FAIL", text); };

const catFile = path.join(BOOKS, "catalog.json");
if (!fs.existsSync(catFile)) { bad("books/catalog.json is missing"); process.exit(1); }
const catalog = JSON.parse(fs.readFileSync(catFile, "utf8")).books;
if (!Array.isArray(catalog) || !catalog.length) bad("books/catalog.json has no books");

console.log(`physics-ebooks  (subject: physics)`);
console.log(`  catalogue: ${catalog.length} entries - ${catalog.join(", ")}`);

for (const code of catalog) {
  if (!MINE.test(code)) bad(`${code} is not a physics code (expected phy*, spem*, jpfm*, jpwm*)`);
  const j = path.join(BOOKS, code, "book.json");
  if (!fs.existsSync(j)) bad(`${code} is in the catalogue but books/${code}/book.json is missing`);
}

const folders = fs.readdirSync(BOOKS, { withFileTypes: true })
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();
const frozen = folders.filter((f) => !catalog.includes(f));
if (frozen.length) {
  say("frozen", `${frozen.length} folders are not in the catalogue and are left alone on purpose:`);
  console.log("        " + frozen.join(" "));
}
const foreign = frozen.filter((f) => MINE.test(f));
if (foreign.length) bad(`physics book(s) present but not in the catalogue: ${foreign.join(", ")}`);
if (frozen.some((f) => !MINE.test(f) && !/^(jm\d|m\d)/i.test(f))) {
  say("note", "a folder outside the catalogue is neither physics nor a known maths leftover - check it");
}
const listedNotOnDisk = catalog.filter((c) => !folders.includes(c));
if (listedNotOnDisk.length) bad(`catalogue lists a missing folder: ${listedNotOnDisk.join(", ")}`);

if (fail) { console.log(`FAIL ${fail} blocking problem(s)`); process.exit(1); }
console.log("OK    no blocking problems");
