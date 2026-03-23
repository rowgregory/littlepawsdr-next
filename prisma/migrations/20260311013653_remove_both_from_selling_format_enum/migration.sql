/*
  Warnings:

  - The values [BOTH] on the enum `SellingFormat` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SellingFormat_new" AS ENUM ('AUCTION', 'FIXED');
ALTER TABLE "AuctionItem" ALTER COLUMN "sellingFormat" TYPE "SellingFormat_new" USING ("sellingFormat"::text::"SellingFormat_new");
ALTER TYPE "SellingFormat" RENAME TO "SellingFormat_old";
ALTER TYPE "SellingFormat_new" RENAME TO "SellingFormat";
DROP TYPE "SellingFormat_old";
COMMIT;
