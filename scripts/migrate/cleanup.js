import { PrismaClient } from "@prisma/client";
import ora from "ora";

const prisma = new PrismaClient();
const EMAIL = "it.little.paws@gmail.com";

async function main() {
  const spinner = ora(`Cleaning up migration data for ${EMAIL}...`).start();

  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) {
    spinner.fail("User not found");
    return;
  }

  const userId = user.id;

  spinner.text = "Deleting bids...";
  await prisma.auctionBid.deleteMany({ where: { userId } });

  spinner.text = "Deleting instant buyers...";
  await prisma.auctionItemInstantBuyer.deleteMany({ where: { userId } });

  spinner.text = "Deleting winning bidders...";
  await prisma.auctionWinningBidder.deleteMany({ where: { userId } });

  spinner.text = "Deleting bidders...";
  await prisma.auctionBidder.deleteMany({ where: { userId } });

  spinner.text = "Deleting auction items...";
  await prisma.auctionItem.deleteMany({
    where: { auction: { source: "MONGO_MIGRATION" } },
  });

  spinner.text = "Deleting historical auctions...";
  await prisma.auction.deleteMany({ where: { source: "MONGO_MIGRATION" } });

  spinner.text = "Deleting order items...";
  await prisma.orderItem.deleteMany({
    where: { order: { userId, source: "MONGO_MIGRATION" } },
  });

  spinner.text = "Deleting orders...";
  await prisma.order.deleteMany({
    where: { userId, source: "MONGO_MIGRATION" },
  });

  spinner.text = "Deleting address...";
  await prisma.address.deleteMany({ where: { userId } });

  spinner.succeed(`✓ Migration data cleared for ${EMAIL}`);
}

main()
  .catch((err) => {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
