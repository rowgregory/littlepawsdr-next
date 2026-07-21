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
  const logCount = await prisma.log.count();

  console.log(
    `\n⚠️  This will permanently delete all ${logCount} log entries.\n`,
  );

  const confirmed = await confirm('Type "yes" to continue: ');
  if (!confirmed) {
    console.log("Aborted.");
    return;
  }

  const spinner = ora("Deleting all logs...").start();

  try {
    const result = await prisma.log.deleteMany({});
    spinner.succeed(`✓ Deleted ${result.count} log entries`);
  } catch (err) {
    spinner.fail("Failed to delete logs");
    console.error(err);
    process.exit(1);
  }
}

main()
  .catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
