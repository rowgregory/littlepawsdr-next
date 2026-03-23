/*
  Warnings:

  - You are about to drop the `_AuctionItemToAuctionWinningBidder` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "BidderStatus" ADD VALUE 'LOST';

-- DropForeignKey
ALTER TABLE "_AuctionItemToAuctionWinningBidder" DROP CONSTRAINT "_AuctionItemToAuctionWinningBidder_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuctionItemToAuctionWinningBidder" DROP CONSTRAINT "_AuctionItemToAuctionWinningBidder_B_fkey";

-- AlterTable
ALTER TABLE "AuctionItem" ADD COLUMN     "auctionWinningBidderId" TEXT;

-- DropTable
DROP TABLE "_AuctionItemToAuctionWinningBidder";

-- AddForeignKey
ALTER TABLE "AuctionItem" ADD CONSTRAINT "AuctionItem_auctionWinningBidderId_fkey" FOREIGN KEY ("auctionWinningBidderId") REFERENCES "AuctionWinningBidder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
