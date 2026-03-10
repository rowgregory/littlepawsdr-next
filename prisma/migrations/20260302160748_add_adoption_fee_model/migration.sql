-- CreateEnum
CREATE TYPE "AdoptionFeeStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AdoptionFee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "emailAddress" TEXT,
    "state" TEXT,
    "feeAmount" DECIMAL(10,2),
    "bypassCode" TEXT,
    "expiresAt" TIMESTAMP(3),
    "status" "AdoptionFeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionFee_pkey" PRIMARY KEY ("id")
);
