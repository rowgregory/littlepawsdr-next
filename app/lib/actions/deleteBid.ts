'use server'

import prisma from 'prisma/client'

export default async function deleteBid(bidId: string) {
  try {
    const bid = await prisma.auctionBid.findUnique({
      where: { id: bidId },
      include: { auctionItem: true }
    })

    if (!bid) return { success: false, error: 'Bid not found' }

    await prisma.auctionBid.delete({ where: { id: bidId } })

    // Find the next highest bid on this item
    const nextTopBid = await prisma.auctionBid.findFirst({
      where: { auctionItemId: bid.auctionItemId },
      orderBy: { bidAmount: 'desc' }
    })

    // Update the item to reflect the new top bid
    await prisma.auctionItem.update({
      where: { id: bid.auctionItemId },
      data: {
        currentBid: nextTopBid ? nextTopBid.bidAmount : bid.auctionItem.startingPrice,
        currentPrice: nextTopBid ? nextTopBid.bidAmount : bid.auctionItem.startingPrice,
        highestBidAmount: nextTopBid ? nextTopBid.bidAmount : null,
        topBidder: nextTopBid ? nextTopBid.bidderName : null,
        totalBids: { decrement: 1 }
      }
    })

    // Promote next bid to TOP_BID if it exists
    if (nextTopBid) {
      await prisma.auctionBid.update({
        where: { id: nextTopBid.id },
        data: { status: 'TOP_BID' }
      })
    }

    await prisma.log.create({
      data: {
        level: 'info',
        message: 'Bid deleted by superuser',
        metadata: JSON.stringify({
          bidId,
          auctionItemId: bid.auctionItemId,
          bidAmount: Number(bid.bidAmount),
          userId: bid.userId
        })
      }
    })

    return { success: true }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete bid',
        metadata: JSON.stringify({
          bidId,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
