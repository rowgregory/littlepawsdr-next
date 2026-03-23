import prisma from 'prisma/client'
import { createLog } from './createLog'
import { IAuction } from 'types/entities/auction'

export const getAuctionById = async (id: string) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
          include: { photos: true }
        },
        bidders: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, anonymousBidding: true }
            }
          }
        },
        bids: { orderBy: { createdAt: 'desc' } },
        winningBidders: { include: { auctionItems: true, user: true } },
        instantBuyers: true
      }
    })

    if (!auction) return { success: false, data: null }

    return {
      success: true,
      data: {
        ...auction,
        goal: Number(auction.goal),
        totalAuctionRevenue: Number(auction.totalAuctionRevenue),
        items: auction.items.map((item) => ({
          ...item,
          retailValue: item.retailValue ? Number(item.retailValue) : null,
          startingPrice: item.startingPrice ? Number(item.startingPrice) : null,
          buyNowPrice: item.buyNowPrice ? Number(item.buyNowPrice) : null,
          currentPrice: item.currentPrice ? Number(item.currentPrice) : null,
          currentBid: item.currentBid ? Number(item.currentBid) : null,
          minimumBid: item.minimumBid ? Number(item.minimumBid) : null,
          highestBidAmount: item.highestBidAmount ? Number(item.highestBidAmount) : null,
          soldPrice: item.soldPrice ? Number(item.soldPrice) : null,
          shippingCosts: item.shippingCosts ? Number(item.shippingCosts) : null
        })),
        bids: auction.bids.map((bid) => ({
          ...bid,
          bidAmount: Number(bid.bidAmount)
        })),
        winningBidders: auction.winningBidders.map((wb) => ({
          ...wb,
          processingFee: wb.processingFee ? Number(wb.processingFee) : null,
          totalPrice: wb.totalPrice ? Number(wb.totalPrice) : null,
          itemSoldPrice: wb.itemSoldPrice ? Number(wb.itemSoldPrice) : null,
          shipping: wb.shipping ? Number(wb.shipping) : null,
          auctionItems: wb.auctionItems.map((item) => ({
            ...item,
            retailValue: item.retailValue ? Number(item.retailValue) : null,
            startingPrice: item.startingPrice ? Number(item.startingPrice) : null,
            buyNowPrice: item.buyNowPrice ? Number(item.buyNowPrice) : null,
            currentPrice: item.currentPrice ? Number(item.currentPrice) : null,
            currentBid: item.currentBid ? Number(item.currentBid) : null,
            minimumBid: item.minimumBid ? Number(item.minimumBid) : null,
            highestBidAmount: item.highestBidAmount ? Number(item.highestBidAmount) : null,
            soldPrice: item.soldPrice ? Number(item.soldPrice) : null,
            shippingCosts: item.shippingCosts ? Number(item.shippingCosts) : null
          }))
        })),
        instantBuyers: auction.instantBuyers.map((buyer) => ({
          ...buyer,
          totalPrice: buyer.totalPrice ? Number(buyer.totalPrice) : null
        }))
      } as unknown as IAuction
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch auction by id', {
      id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, data: null }
  }
}
