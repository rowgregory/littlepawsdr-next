import { PrismaClient } from "@prisma/client";
import ora from "ora";
import readline from "readline";

const prisma = new PrismaClient();

function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

async function main() {
  const userCount = await prisma.user.count();

  console.log(
    `\n⚠️  This will permanently delete ALL ${userCount} users and every record tied to them.`,
  );
  console.log(
    "This includes orders, addresses, payment methods, auction activity, adoption fees, and NextAuth accounts/sessions.\n",
  );

  const confirmed = await confirm('Type "yes" to continue: ');
  if (!confirmed) {
    console.log("Aborted.");
    return;
  }

  const spinner = ora("Wiping all user data...").start();

  try {
    // ── Order matters: delete children before parents ──

    spinner.text = "Deleting order items...";
    await prisma.orderItem.deleteMany({});

    spinner.text = "Deleting orders...";
    await prisma.order.deleteMany({});

    spinner.text = "Deleting auction bids...";
    await prisma.auctionBid.deleteMany({});

    spinner.text = "Deleting auction instant buyers...";
    await prisma.auctionItemInstantBuyer.deleteMany({});

    spinner.text = "Deleting auction winning bidders...";
    await prisma.auctionWinningBidder.deleteMany({});

    spinner.text = "Deleting auction bidders...";
    await prisma.auctionBidder.deleteMany({});

    spinner.text = "Deleting adoption fees...";
    await prisma.adoptionFee.deleteMany({});

    spinner.text = "Deleting payment methods...";
    await prisma.paymentMethod.deleteMany({});

    spinner.text = "Deleting addresses...";
    await prisma.address.deleteMany({});

    spinner.text = "Deleting pending admin invites...";
    await prisma.pendingAdminInvite.deleteMany({});

    spinner.text = "Deleting NextAuth sessions...";
    await prisma.session.deleteMany({});

    spinner.text = "Deleting NextAuth accounts...";
    await prisma.account.deleteMany({});

    spinner.text = "Deleting NextAuth verification tokens...";
    await prisma.verificationToken.deleteMany({}).catch(() => {
      // model name may differ or not exist — safe to ignore
    });

    spinner.text = "Deleting users...";
    await prisma.user.deleteMany({});

    spinner.succeed(`✓ Wiped all users and related data`);
  } catch (err) {
    spinner.fail("Wipe failed");
    console.error(err);
    process.exit(1);
  }
}

main()
  .catch((err) => {
    console.error("❌ Wipe failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
