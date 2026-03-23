import prisma from 'prisma/client'
import { createLog } from './createLog'
import { AuctionStatus } from '@prisma/client'

export default async function getAuctions({ status }: { status: AuctionStatus[] }) {
  try {
    const auctions = await prisma.auction.findMany({
      where: { status: { in: status } },
      include: {
        items: {
          include: {
            photos: true
          }
        },
        bids: {
          select: {
            id: true,
            bidAmount: true,
            auctionId: true,
            auctionItemId: true,
            userId: true,
            bidderId: true,
            status: true,
            sentWinnerEmail: true,
            emailCount: true,
            createdAt: true,
            updatedAt: true
          }
        },
        bidders: true,
        instantBuyers: true,
        winningBidders: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return auctions.map((a) => ({
      ...a,
      goal: Number(a.goal),
      totalAuctionRevenue: Number(a.totalAuctionRevenue),
      instantBuyers: a.instantBuyers.map((b) => ({
        ...b,
        totalPrice: b.totalPrice ? Number(b.totalPrice) : null
      })),
      winningBidders: a.winningBidders.map((b) => ({
        ...b,
        totalPrice: b.totalPrice ? Number(b.totalPrice) : null
      })),
      items: a.items.map((item) => ({
        ...item,
        startingPrice: item.startingPrice ? Number(item.startingPrice) : null,
        buyNowPrice: item.buyNowPrice ? Number(item.buyNowPrice) : null,
        currentPrice: item.currentPrice ? Number(item.currentPrice) : null,
        currentBid: item.currentBid ? Number(item.currentBid) : null,
        minimumBid: item.minimumBid ? Number(item.minimumBid) : null,
        highestBidAmount: item.highestBidAmount ? Number(item.highestBidAmount) : null,
        soldPrice: item.soldPrice ? Number(item.soldPrice) : null,
        shippingCosts: item.shippingCosts ? Number(item.shippingCosts) : null
      })),
      bids: a.bids.map((bid) => ({
        ...bid,
        bidAmount: Number(bid.bidAmount)
      }))
    }))
  } catch (error) {
    await createLog('error', 'Failed to get auctions', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return []
  }
}
