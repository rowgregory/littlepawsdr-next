import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const auctionsPath = path.join(__dirname, "lpdrdb.auctions.json");
const campaignsPath = path.join(__dirname, "lpdrdb.campaigns.json");

const auctions = JSON.parse(fs.readFileSync(auctionsPath, "utf-8"));
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, "utf-8"));

// ─── Generic summer ───────────────────────────────────────────────────────────
function sumField(records, field) {
  let total = 0;
  let counted = 0;
  let skipped = 0;

  for (const record of records) {
    const amount = Number(record[field]);
    if (isNaN(amount)) {
      skipped++;
      continue;
    }
    total += amount;
    counted++;
  }

  return { total, counted, skipped };
}

const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

// ─── Auctions ─────────────────────────────────────────────────────────────────
const auctionResult = sumField(auctions, "totalAuctionRevenue");

console.log("\n─── All-time auction revenue ───");
console.log(`Records in file:      ${auctions.length}`);
console.log(`Counted toward total: ${auctionResult.counted}`);
console.log(`Skipped (bad amount): ${auctionResult.skipped}`);
console.log(`Auction total:        $${fmt(auctionResult.total)}`);

// ─── Campaigns ────────────────────────────────────────────────────────────────
const campaignResult = sumField(campaigns, "totalCampaignRevenue");

console.log("\n─── All-time campaign revenue ───");
console.log(`Records in file:      ${campaigns.length}`);
console.log(`Counted toward total: ${campaignResult.counted}`);
console.log(`Skipped (bad amount): ${campaignResult.skipped}`);
console.log(`Campaign total:       $${fmt(campaignResult.total)}`);

// ─── Combined ─────────────────────────────────────────────────────────────────
const combined = auctionResult.total + campaignResult.total;

console.log("\n─── Combined ───");
console.log(`Auctions + Campaigns: $${fmt(combined)}`);
console.log(`\nHardcode auctions:    ${auctionResult.total}`);
console.log(`Hardcode campaigns:   ${campaignResult.total}`);
console.log(`Hardcode combined:    ${combined}\n`);
