import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getAuctionItemById = async (id: string) => {
  try {
    const item = await prisma.auctionItem.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }]
        },
        bids: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                anonymousBidding: true
              }
            },
            bidder: {
              select: {
                id: true
              }
            }
          }
        },
        winningBidder: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        instantBuyers: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        auction: {
          select: {
            id: true,
            title: true,
            status: true,
            startDate: true,
            endDate: true,
            customAuctionLink: true
          }
        }
      }
    })

    if (!item) return { success: false, error: 'Auction item not found', data: null }

    return {
      success: true,
      auctionItem: {
        ...item,
        startingPrice: item.startingPrice ? Number(item.startingPrice) : null,
        buyNowPrice: item.buyNowPrice ? Number(item.buyNowPrice) : null,
        currentPrice: item.currentPrice ? Number(item.currentPrice) : null,
        currentBid: item.currentBid ? Number(item.currentBid) : null,
        minimumBid: item.minimumBid ? Number(item.minimumBid) : null,
        highestBidAmount: item.highestBidAmount ? Number(item.highestBidAmount) : null,
        soldPrice: item.soldPrice ? Number(item.soldPrice) : null,
        shippingCosts: item.shippingCosts ? Number(item.shippingCosts) : null,
        bids: item.bids.map((bid) => ({
          ...bid,
          bidAmount: Number(bid.bidAmount)
        })),
        winningBidder: item.winningBidder
          ? {
              ...item.winningBidder,
              processingFee: item.winningBidder.processingFee ? Number(item.winningBidder.processingFee) : null,
              totalPrice: item.winningBidder.totalPrice ? Number(item.winningBidder.totalPrice) : null,
              itemSoldPrice: item.winningBidder.itemSoldPrice ? Number(item.winningBidder.itemSoldPrice) : null,
              shipping: item.winningBidder.shipping ? Number(item.winningBidder.shipping) : null
            }
          : null
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch auction item by id', {
      id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to fetch auction item', data: null }
  }
}
