/*
  Warnings:

  - You are about to drop the column `emailAddress` on the `AdoptionFee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdoptionFee" DROP COLUMN "emailAddress",
ADD COLUMN     "email" TEXT,
ALTER COLUMN "feeAmount" SET DEFAULT 15;
