/*
  Warnings:

  - A unique constraint covering the columns `[customAuctionLink]` on the table `Auction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auction_customAuctionLink_key" ON "Auction"("customAuctionLink");
