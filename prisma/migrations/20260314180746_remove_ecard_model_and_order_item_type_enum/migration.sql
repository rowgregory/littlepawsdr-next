/*
  Warnings:

  - The values [ECARD] on the enum `OrderType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `age` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `dateToSend` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `recipientName` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `recipientsEmail` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `recipientsFullName` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Ecard` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderType_new" AS ENUM ('ONE_TIME_DONATION', 'RECURRING_DONATION', 'ADOPTION_FEE', 'PRODUCT', 'WELCOME_WIENER', 'AUCTION_PURCHASE', 'MIXED');
ALTER TABLE "Order" ALTER COLUMN "type" TYPE "OrderType_new" USING ("type"::text::"OrderType_new");
ALTER TYPE "OrderType" RENAME TO "OrderType_old";
ALTER TYPE "OrderType_new" RENAME TO "OrderType";
DROP TYPE "OrderType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "addressLine1" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "age",
DROP COLUMN "dateToSend",
DROP COLUMN "email",
DROP COLUMN "recipientName",
DROP COLUMN "recipientsEmail",
DROP COLUMN "recipientsFullName",
DROP COLUMN "senderName",
DROP COLUMN "type";

-- DropTable
DROP TABLE "Ecard";

-- DropEnum
DROP TYPE "EcardBackground";

-- DropEnum
DROP TYPE "EcardFont";

-- DropEnum
DROP TYPE "EcardIcon";

-- DropEnum
DROP TYPE "EcardTheme";

-- DropEnum
DROP TYPE "OrderItemType";
