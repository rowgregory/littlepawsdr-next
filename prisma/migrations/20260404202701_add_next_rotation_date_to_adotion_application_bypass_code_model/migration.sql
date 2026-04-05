-- AlterTable
ALTER TABLE "AdoptionApplicationBypassCode" ADD COLUMN     "nextRotationAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
