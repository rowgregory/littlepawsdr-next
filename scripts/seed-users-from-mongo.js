/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// ─── Transform ────────────────────────────────────────────────────────────────
function transformUser(mongo) {
  const firstName = mongo.firstName ?? mongo.name?.split(" ")[0] ?? null;
  const lastName =
    mongo.lastName ?? (mongo.name?.split(" ").slice(1).join(" ") || null);
  const role = mongo.isAdmin ? "ADMIN" : "SUPPORTER";

  let lastLoginAt = null;
  if (mongo.lastLoginTime) {
    const parsed = new Date(mongo.lastLoginTime);
    if (!isNaN(parsed.getTime())) lastLoginAt = parsed;
  }

  const metadata = {
    mongoId: mongo._id?.$oid ?? null,
    workSchedule: mongo.workSchedule ?? null,
    jobTitle: mongo.jobTitle ?? null,
    lastSeenChangelogVersion: mongo.lastSeenChangelogVersion ?? null,
    dachshundPreferences: mongo.dachshundPreferences ?? null,
    yourHome: mongo.yourHome ?? null,
  };

  return {
    email: mongo.email.toLowerCase().trim(),
    role,
    firstName,
    lastName,
    phone: mongo.phone ?? null,
    anonymousBidding: mongo.anonymousBidding ?? true,
    emailVerified: mongo.confirmed
      ? new Date(mongo.createdAt?.$date ?? Date.now())
      : null,
    lastLoginAt,
    metadata,
    createdAt: mongo.createdAt?.$date
      ? new Date(mongo.createdAt.$date)
      : new Date(),
    updatedAt: mongo.updatedAt?.$date
      ? new Date(mongo.updatedAt.$date)
      : new Date(),
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const filePath = path.join(__dirname, "mongo-users.json");

  if (!fs.existsSync(filePath)) {
    throw new Error(`mongo-users.json not found at scripts/mongo-users.json`);
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(`Found ${raw.length} users to migrate...`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const mongo of raw) {
    try {
      if (!mongo.email) {
        console.warn(`Skipping user with no email: ${mongo._id?.$oid}`);
        skipped++;
        continue;
      }

      const data = transformUser(mongo);

      await prisma.user.upsert({
        where: { email: data.email },
        update: data,
        create: data,
      });

      created++;
    } catch (err) {
      console.error(
        `Failed to migrate user ${mongo.email}:`,
        err instanceof Error ? err.message : err,
      );
      failed++;
    }
  }

  console.log(`\nMigration complete:`);
  console.log(`  ✓ Created/updated: ${created}`);
  console.log(`  ⚠ Skipped:         ${skipped}`);
  console.log(`  ✕ Failed:          ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
