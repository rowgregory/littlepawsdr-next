import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "lpdrdb.adoptionfees.json");
const legacyFees = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// ─── Compute all-time adoption fee total ──────────────────────────────────────
let total = 0;
let counted = 0;
let skipped = 0;

for (const fee of legacyFees) {
  const amount = Number(fee.feeAmount);
  if (isNaN(amount)) {
    skipped++;
    continue;
  }
  total += amount;
  counted++;
}

// Active vs inactive breakdown, just for context
const active = legacyFees.filter(
  (f) => f.applicationStatus === "Active",
).length;
const inactive = legacyFees.length - active;

console.log("\n─── All-time adoption fee total ───");
console.log(`Records in file:   ${legacyFees.length}`);
console.log(`  Active:          ${active}`);
console.log(`  Inactive:        ${inactive}`);
console.log(`Counted toward total: ${counted}`);
console.log(`Skipped (bad amount): ${skipped}`);
console.log(
  `\nTOTAL COLLECTED:   $${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
);
console.log(`\nHardcode this:     ${total}\n`);
