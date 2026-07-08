import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../prisma/client.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "lpdrdb.newsletters.json");
const legacyNewsletters = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// ─── Flags ────────────────────────────────────────────────────────────────────
// npm run seed:newsletters            → import (skips existing)
// npm run seed:newsletters -- --wipe  → delete all, then import
const args = process.argv.slice(2);
const WIPE = args.includes("--wipe");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDate(value) {
  // Handles both { $date: "..." } (Mongo extended JSON) and plain strings
  const raw = value?.$date ?? value;
  if (!raw) return undefined;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? undefined : d;
}

function renderProgress(done, total) {
  const width = 30;
  const pct = total === 0 ? 1 : done / total;
  const filled = Math.round(pct * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const percent = String(Math.round(pct * 100)).padStart(3, " ");
  process.stdout.write(`\r  [${bar}] ${percent}%  ${done}/${total}`);
}

// ─── Migration ────────────────────────────────────────────────────────────────
async function migrate() {
  if (WIPE) {
    const { count } = await prisma.newsletter.deleteMany({});
    console.log(
      `Wiped ${count} existing newsletter${count === 1 ? "" : "s"}.\n`,
    );
  }

  console.log(`Preparing ${legacyNewsletters.length} newsletter records...\n`);

  // Build clean, deduplicated rows in memory
  const seen = new Set();
  const rows = [];
  let skipped = 0;

  for (const n of legacyNewsletters) {
    // ── ADJUST THIS if your old field isn't `email` ──
    const email = (n.email ?? n.newsletterEmail ?? n.emailAddress ?? "")
      .toLowerCase()
      .trim();

    if (!email || !email.includes("@")) {
      skipped++;
      continue;
    }

    if (seen.has(email)) {
      skipped++; // duplicate within the export
      continue;
    }
    seen.add(email);

    const createdAt = toDate(n.createdAt);

    rows.push({
      newsletterEmail: email,
      ...(createdAt ? { createdAt } : {}),
    });
  }

  console.log(
    `Prepared ${rows.length} unique valid emails (${skipped} skipped).\n`,
  );

  // Batch insert — skipDuplicates ignores any that already exist in the DB
  const BATCH = 500;
  let inserted = 0;

  renderProgress(0, rows.length);
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const result = await prisma.newsletter.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += result.count;
    renderProgress(Math.min(i + BATCH, rows.length), rows.length);
  }
  process.stdout.write("\n");

  console.log(`\n─── Import complete ───`);
  console.log(`Prepared:  ${rows.length}`);
  console.log(`Inserted:  ${inserted}`);
  console.log(
    `Skipped as duplicates (already in DB): ${rows.length - inserted}`,
  );
  console.log(`Skipped from file (blank/invalid/dupe): ${skipped}`);
}

migrate()
  .catch((e) => {
    console.error("\nImport failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
