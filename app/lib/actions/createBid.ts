'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { auth } from '../auth'
import { pusher } from '../pusher'

interface CreateBidInput {
  auctionId: string
  auctionItemId: string
  bidAmount: number
}

export const createBid = async ({ auctionId, auctionItemId, bidAmount }: CreateBidInput) => {
  try {
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        error: 'You must be logged in to place a bid',
        data: null
      }
    }

    if (!auctionId || !auctionItemId || !bidAmount) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found',
        data: null
      }
    }

    // Get auction item to validate bid amount
    const auctionItem = await prisma.auctionItem.findUnique({
      where: { id: auctionItemId }
    })

    if (!auctionItem) {
      return {
        success: false,
        error: 'Auction item not found',
        data: null
      }
    }

    if (auctionItem.minimumBid && bidAmount < auctionItem.minimumBid.toNumber()) {
      return {
        success: false,
        error: `Bid must be at least $${auctionItem.minimumBid}`,
        data: null
      }
    }

    // Get previous top bid before transaction for outbid email
    const previousTopBid = await prisma.auctionBid.findFirst({
      where: {
        auctionItemId,
        status: 'TOP_BID'
      }
    })

    const bidderName = user.anonymousBidding ? 'Anonymous' : user.firstName

    // Run everything in a transaction
    const { bid, totalBids } = await prisma.$transaction(async (tx) => {
      // Get or create bidder
      let bidder = await tx.auctionBidder.findUnique({
        where: {
          auctionId_userId: {
            auctionId,
            userId: user.id
          }
        }
      })

      if (!bidder) {
        bidder = await tx.auctionBidder.create({
          data: {
            auctionId,
            userId: user.id,
            status: 'ACTIVE'
          }
        })
      }

      // Create new bid
      const newBid = await tx.auctionBid.create({
        data: {
          auctionId,
          auctionItemId,
          userId: user.id,
          bidderId: bidder.id,
          bidAmount,
          email: user.email,
          bidderName,
          status: 'TOP_BID'
        }
      })

      // Mark all other bids on this item as outbid
      await tx.auctionBid.updateMany({
        where: {
          auctionItemId,
          id: { not: newBid.id }
        },
        data: { status: 'OUTBID' }
      })

      // Update auction item
      const totalBids = await tx.auctionBid.count({ where: { auctionItemId } })

      await tx.auctionItem.update({
        where: { id: auctionItemId },
        data: {
          currentBid: bidAmount,
          minimumBid: bidAmount + 1,
          totalBids,
          topBidder: bidderName
        }
      })

      return { bid: newBid, totalBids }
    })

    // Send outbid email after transaction
    if (previousTopBid?.email && previousTopBid.userId !== user.id) {
      try {
        // await sendOutbidEmail({ ... })
      } catch (emailError) {
        await createLog('error', 'Failed to send outbid email', {
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          previousTopBidId: previousTopBid.id
        })
      }
    }

    await pusher.trigger(`auction-item-${auctionItemId}`, 'new-bid', {
      confirmedBidAmount: bidAmount,
      totalBids,
      topBidder: bidderName,
      currentBid: bidAmount,
      minimumBid: bidAmount + 1,
      status: bid.status,
      createdAt: bid.createdAt
    })

    return {
      success: true,
      data: { confirmedBidAmount: bidAmount }
    }
  } catch (error) {
    await createLog('error', 'Failed to create bid', {
      error: error instanceof Error ? error.message : 'Unknown error',
      auctionId,
      auctionItemId,
      bidAmount
    })

    return {
      success: false,
      error: 'Failed to place bid. Please try again.',
      data: null
    }
  }
}
