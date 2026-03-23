-- AlterTable
ALTER TABLE "AdoptionFee" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "AdoptionFee" ADD CONSTRAINT "AdoptionFee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
