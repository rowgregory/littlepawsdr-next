import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const MONGO_DIR = path.join(__dirname, "mongo");

function read(filename) {
  const filepath = path.join(MONGO_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  ${filename} not found — skipping`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function mongoId(doc) {
  return doc._id?.$oid ?? doc._id?.toString() ?? doc._id;
}

function mongoEmail(doc) {
  const email = doc.email ?? doc.emailAddress ?? null;
  return email ? email.toLowerCase().trim() : null;
}

function parseMongoDate(val) {
  if (!val) return null;
  if (val.$date) return new Date(val.$date);
  return new Date(val);
}

async function seedUsers() {
  const docs = read("users.json");
  await prisma.mongoUser.deleteMany();

  // Build a map of email → most recent user document
  // This deduplicates users who registered twice with the same email
  // keeping the most recently created account as the canonical one
  const byEmail = new Map();
  for (const doc of docs) {
    const email = mongoEmail(doc);

    // Skip docs with no email
    if (!email) continue;

    const existing = byEmail.get(email);
    if (!existing) {
      // First time we've seen this email — add it
      byEmail.set(email, doc);
    } else {
      // We've seen this email before — compare creation dates
      // and keep whichever account was created more recently
      const existingDate = new Date(
        existing.createdAt?.$date ?? existing.createdAt,
      );
      const docDate = new Date(doc.createdAt?.$date ?? doc.createdAt);
      if (docDate > existingDate) byEmail.set(email, doc);
    }
  }

  // Convert the map values back to an array for createMany
  const valid = Array.from(byEmail.values());

  await prisma.mongoUser.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      data: doc,
    })),
  });
  return valid.length;
}

async function seedDonations() {
  const docs = read("donations.json");
  await prisma.mongoDonation.deleteMany();

  const valid = docs.filter((doc) => mongoEmail(doc));
  await prisma.mongoDonation.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      data: doc,
    })),
  });
  return valid.length;
}

async function seedOrders() {
  const orders = read("orders.json");
  const orderItems = read("orderitems.json");

  await prisma.mongoOrderItem.deleteMany();
  await prisma.mongoOrder.deleteMany();

  const itemsByOrderId = new Map();
  for (const item of orderItems) {
    const orderId =
      item.orderId?.$oid ?? item.orderId?.toString() ?? item.orderId;
    if (!orderId) continue;
    if (!itemsByOrderId.has(orderId)) itemsByOrderId.set(orderId, []);
    itemsByOrderId.get(orderId).push(item);
  }

  const validOrders = orders.filter((doc) => {
    const email = mongoEmail(doc);
    return email && doc.status !== "pending" && doc.status !== "refunded";
  });

  await prisma.mongoOrder.createMany({
    data: validOrders.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      data: doc,
    })),
  });

  const allItems = validOrders.flatMap((doc) => {
    const id = mongoId(doc);
    return (itemsByOrderId.get(id) ?? []).map((item) => ({
      mongoId: mongoId(item),
      mongoOrderId: id,
      data: item,
    }));
  });

  await prisma.mongoOrderItem.createMany({ data: allItems });
  return { orders: validOrders.length, items: allItems.length };
}

async function seedProductOrders() {
  const docs = read("productorders.json");
  await prisma.mongoProductOrder.deleteMany();

  const valid = docs.filter((doc) => {
    const email = mongoEmail(doc);
    const orderId = doc.orderId?.$oid ?? doc.orderId?.toString() ?? doc.orderId;
    return email && orderId;
  });

  await prisma.mongoProductOrder.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      mongoOrderId: doc.orderId?.$oid ?? doc.orderId?.toString() ?? doc.orderId,
      data: doc,
    })),
  });
  return valid.length;
}

async function seedWelcomeWienerOrders() {
  const docs = read("welcomewienerorders.json");
  await prisma.mongoWelcomeWienerOrder.deleteMany();

  const valid = docs.filter((doc) => mongoEmail(doc));
  await prisma.mongoWelcomeWienerOrder.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      data: doc,
    })),
  });
  return valid.length;
}

async function seedAdoptionFees() {
  const docs = read("adoptionfees.json");
  await prisma.mongoAdoptionFee.deleteMany();

  const valid = docs.filter((doc) => mongoEmail(doc));
  await prisma.mongoAdoptionFee.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      data: doc,
    })),
  });
  return valid.length;
}

async function seedAuctionItems() {
  const docs = read("auctionitems.json");
  await prisma.mongoAuctionItem.deleteMany();

  await prisma.mongoAuctionItem.createMany({
    data: docs.map((doc) => ({ mongoId: mongoId(doc), data: doc })),
  });
  return docs.length;
}

async function seedAuctionItemPhotos() {
  const docs = read("auctionitemphotos.json");
  await prisma.mongoAuctionItemPhoto.deleteMany();

  await prisma.mongoAuctionItemPhoto.createMany({
    data: docs.map((doc) => ({ mongoId: mongoId(doc), data: doc })),
  });
  return docs.length;
}

async function seedAuctionWinners() {
  const users = read("users.json");
  const userEmailById = new Map();
  for (const u of users) {
    const email = mongoEmail(u);
    if (email) userEmailById.set(mongoId(u), email);
  }

  const docs = read("auctionwinningbidders.json");
  await prisma.mongoAuctionWinner.deleteMany();

  const valid = docs.filter((doc) => {
    if (doc.winningBidPaymentStatus !== "Paid") return false;
    const userId = doc.user?.$oid ?? doc.user?.toString() ?? doc.user;
    return !!userEmailById.get(userId);
  });

  await prisma.mongoAuctionWinner.createMany({
    data: valid.map((doc) => {
      const userId = doc.user?.$oid ?? doc.user?.toString() ?? doc.user;
      return {
        mongoId: mongoId(doc),
        email: userEmailById.get(userId),
        data: doc,
      };
    }),
  });
  return valid.length;
}

async function seedInstantBuyers() {
  const docs = read("auctioniteminstantbuyers.json");
  await prisma.mongoInstantBuyer.deleteMany();

  const valid = docs.filter(
    (doc) => mongoEmail(doc) && doc.paymentStatus === "Paid",
  );
  await prisma.mongoInstantBuyer.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      data: doc,
    })),
  });
  return valid.length;
}

async function seedAddresses() {
  const docs = read("addresses.json");
  await prisma.mongoAddress.deleteMany();

  await prisma.mongoAddress.createMany({
    data: docs.map((doc) => ({
      mongoId: mongoId(doc),
      data: doc,
    })),
  });
  return docs.length;
}

async function seedEcardOrders() {
  const docs = read("ecardorders.json");
  await prisma.mongoEcardOrder.deleteMany();

  const valid = docs.filter((doc) => {
    const email = mongoEmail(doc);
    const orderId = doc.orderId?.$oid ?? doc.orderId?.toString() ?? doc.orderId;
    return email && orderId;
  });

  await prisma.mongoEcardOrder.createMany({
    data: valid.map((doc) => ({
      mongoId: mongoId(doc),
      email: mongoEmail(doc),
      mongoOrderId: doc.orderId?.$oid ?? doc.orderId?.toString() ?? doc.orderId,
      data: doc,
    })),
  });
  return valid.length;
}

async function seedAuctions() {
  const docs = read("auctions.json");
  await prisma.mongoAuction.deleteMany();

  await prisma.mongoAuction.createMany({
    data: docs.map((doc) => ({ mongoId: mongoId(doc), data: doc })),
  });
  return docs.length;
}

async function seedCampaigns() {
  const docs = read("campaigns.json");
  await prisma.mongoCampaign.deleteMany();

  await prisma.mongoCampaign.createMany({
    data: docs.map((doc) => ({ mongoId: mongoId(doc), data: doc })),
  });
  return docs.length;
}

async function seedBids() {
  const docs = read("bids.json");
  await prisma.mongoBid.deleteMany();

  const users = read("users.json");
  const userEmailById = new Map();
  for (const u of users) {
    const email = mongoEmail(u);
    if (email) userEmailById.set(mongoId(u), email);
  }

  const valid = docs.filter((doc) => {
    const userId = doc.user?.$oid ?? doc.user?.toString() ?? doc.user;
    return !!userEmailById.get(userId);
  });

  await prisma.mongoBid.createMany({
    data: valid.map((doc) => {
      const userId = doc.user?.$oid ?? doc.user?.toString() ?? doc.user;
      return {
        mongoId: mongoId(doc),
        email: userEmailById.get(userId),
        data: doc,
      };
    }),
  });
  return valid.length;
}

async function seedHistoricalAuctions() {
  const auctions = read("auctions.json");
  const campaigns = read("campaigns.json");

  await prisma.$transaction([
    prisma.auctionWinningBidder.deleteMany({
      where: { auction: { source: "MONGO_MIGRATION" } },
    }),
    prisma.auctionItemInstantBuyer.deleteMany({
      where: { auction: { source: "MONGO_MIGRATION" } },
    }),
    prisma.auctionBid.deleteMany({
      where: { auction: { source: "MONGO_MIGRATION" } },
    }),
    prisma.auctionItemPhoto.deleteMany({
      where: { item: { auction: { source: "MONGO_MIGRATION" } } },
    }),
    prisma.auctionItem.deleteMany({
      where: { auction: { source: "MONGO_MIGRATION" } },
    }),
    prisma.auction.deleteMany({ where: { source: "MONGO_MIGRATION" } }),
  ]);

  // Index campaigns by auction mongoId
  const campaignByAuctionId = new Map();
  for (const c of campaigns) {
    const auctionId = c.auction?.$oid ?? c.auction?.toString() ?? c.auction;
    if (auctionId) campaignByAuctionId.set(auctionId, c);
  }

  console.log(`\nSeeding ${auctions.length} historical auctions...`);
  let count = 0;

  for (const doc of auctions) {
    const id = mongoId(doc);
    const campaign = campaignByAuctionId.get(id);

    const existing = await prisma.auction.findUnique({
      where: { mongoId: id },
    });
    if (existing) continue;

    await prisma.auction.create({
      data: {
        mongoId: id,
        title: campaign?.title ?? doc.title ?? "Past Auction",
        goal: campaign?.goal ?? doc.goal ?? 0,
        totalAuctionRevenue:
          campaign?.totalCampaignRevenue ?? doc.totalAuctionRevenue ?? 0,
        customAuctionLink: doc.customAuctionLink ?? null,
        startDate:
          parseMongoDate(doc.settings?.startDate ?? doc.startDate) ??
          new Date(),
        endDate:
          parseMongoDate(doc.settings?.endDate ?? doc.endDate) ?? new Date(),
        status: "ENDED",
        source: "MONGO_MIGRATION",
        historicalItemCount: doc.items?.length ?? 0,
        historicalBidderCount: doc.bidders?.length ?? 0,
        historicalBidCount: doc.winningBids?.length ?? 0,
      },
    });
    count++;
  }

  console.log(`✓ ${count} historical auctions seeded`);

  return count;
}

async function main() {
  const spinner = ora("Starting Mongo seed...").start();

  spinner.text = "Seeding users...";
  const users = await seedUsers();

  spinner.text = "Seeding donations...";
  const donations = await seedDonations();

  spinner.text = "Seeding orders...";
  const { orders, items } = await seedOrders();

  spinner.text = "Seeding product orders...";
  const productOrders = await seedProductOrders();

  spinner.text = "Seeding welcome wiener orders...";
  const wwOrders = await seedWelcomeWienerOrders();

  spinner.text = "Seeding adoption fees...";
  const adoptionFees = await seedAdoptionFees();

  spinner.text = "Seeding auction items...";
  const auctionItems = await seedAuctionItems();

  spinner.text = "Seeding auction item photos...";
  const auctionItemPhotos = await seedAuctionItemPhotos();

  spinner.text = "Seeding auction winners...";
  const auctionWinners = await seedAuctionWinners();

  spinner.text = "Seeding instant buyers...";
  const instantBuyers = await seedInstantBuyers();

  spinner.text = "Seeding addresses...";
  const addresses = await seedAddresses();

  spinner.text = "Seeding auctions...";
  const auctions = await seedAuctions();

  spinner.text = "Seeding campaigns...";
  const campaigns = await seedCampaigns();

  spinner.text = "Seeding bids...";
  const bids = await seedBids();

  spinner.text = "Seeding ecard orders...";
  const ecardOrders = await seedEcardOrders();

  spinner.text = "Seeding historical auctions...";
  const historicalAuctions = await seedHistoricalAuctions();

  spinner.succeed("Seed complete 🌱\n");

  console.table({
    users,
    donations,
    orders,
    orderItems: items,
    productOrders,
    welcomeWienerOrders: wwOrders,
    adoptionFees,
    auctionItems,
    auctionItemPhotos,
    auctionWinners,
    instantBuyers,
    addresses,
    ecardOrders,
    auctions,
    campaigns,
    bids,
    historicalAuctions,
  });
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
