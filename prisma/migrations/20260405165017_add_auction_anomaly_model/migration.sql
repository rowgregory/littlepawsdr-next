-- CreateTable
CREATE TABLE "AuctionAnomaly" (
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionAnomaly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuctionAnomaly_auctionId_idx" ON "AuctionAnomaly"("auctionId");

-- AddForeignKey
ALTER TABLE "AuctionAnomaly" ADD CONSTRAINT "AuctionAnomaly_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
