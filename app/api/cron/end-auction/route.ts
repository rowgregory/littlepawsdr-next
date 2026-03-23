import { createLog } from 'app/lib/actions/createLog'
import { auctionWinningBidderTemplate } from 'app/lib/email-templates/winning-bidder'
import { pusher } from 'app/lib/pusher'
import { resend } from 'app/lib/resend'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export async function GET() {
  try {
    const now = new Date()

    const [auction, topBidsAggregate] = await Promise.all([
      prisma.auction.findFirst({
        where: { status: 'ACTIVE', endDate: { lte: now } },
        select: {
          id: true,
          title: true,
          customAuctionLink: true,
          _count: {
            select: {
              items: true,
              bidders: true
            }
          }
        }
      }),
      prisma.auctionBid.aggregate({
        where: {
          auction: { status: 'ACTIVE', endDate: { lte: now } },
          status: 'TOP_BID'
        },
        _sum: { bidAmount: true }
      })
    ])

    if (!auction) return NextResponse.json({ error: 'No auctions found with ACTIVE status past their end date' }, { status: 500 })

    // 1. End immediately and fire Pusher
    await prisma.auction.update({
      where: { id: auction.id },
      data: { status: 'ENDED' }
    })

    await pusher.trigger(`auction-${auction.id}`, 'auction-ended', {
      customAuctionLink: auction.customAuctionLink,
      auctionTitle: auction.title,
      totalRaised: Number(topBidsAggregate._sum.bidAmount ?? 0),
      itemCount: auction._count.items,
      bidderCount: auction._count.bidders,
      endedAt: now.toISOString()
    })

    // 2. Process winners, create records, update items
    const winners = await endAuction(auction.id)

    // 3. Send winner emails
    for (const winner of winners) {
      await sendWinnerEmail({
        email: winner.user.email,
        firstName: winner.user.firstName ?? 'Friend',
        auctionId: auction.id,
        winningBidderId: winner.winningBidderId,
        items: winner.items,
        totalPrice: winner.totalPrice
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    await createLog('error', 'Cron: end-auctions failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to end auctions' }, { status: 500 })
  }
}

export async function endAuction(auctionId: string) {
  // 1. Get all TOP_BID bids for this auction, grouped by userId
  const topBids = await prisma.auctionBid.findMany({
    where: { auctionId, status: 'TOP_BID' },
    include: {
      auctionItem: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true } }
    }
  })

  // 2. Group by userId
  const byUser = topBids.reduce<Record<string, typeof topBids>>((acc, bid) => {
    if (!acc[bid.userId]) acc[bid.userId] = []
    acc[bid.userId].push(bid)
    return acc
  }, {})

  const winningBidderMap: Record<string, string> = {}

  await prisma.$transaction(async (tx) => {
    for (const [userId, bids] of Object.entries(byUser)) {
      const totalPrice = bids.reduce((sum, b) => {
        const shipping = b.auctionItem.requiresShipping ? Number(b.auctionItem.shippingCosts ?? 0) : 0
        return sum + Number(b.bidAmount) + shipping
      }, 0)

      const totalShipping = bids.reduce((sum, b) => {
        return sum + (b.auctionItem.requiresShipping ? Number(b.auctionItem.shippingCosts ?? 0) : 0)
      }, 0)

      // 3. Create one AuctionWinningBidder per user
      const winningBidder = await tx.auctionWinningBidder.create({
        data: {
          auctionId,
          userId,
          totalPrice,
          shipping: totalShipping,
          winningBidPaymentStatus: 'AWAITING_PAYMENT',
          auctionItemPaymentStatus: 'PENDING',
          shippingStatus: 'PENDING_PAYMENT_CONFIRMATION'
        }
      })

      // Collect the IDs during the transaction loop:
      winningBidderMap[userId] = winningBidder.id

      // 4. Update each won AuctionItem — set status SOLD, soldPrice, link to winningBidder
      for (const bid of bids) {
        await tx.auctionItem.update({
          where: { id: bid.auctionItemId },
          data: {
            status: 'SOLD',
            soldPrice: bid.bidAmount,
            auctionWinningBidderId: winningBidder.id
          }
        })
      }

      // 5. Any item that wasn't just set to SOLD in the winner loop gets marked UNSOLD in one shot
      await tx.auctionItem.updateMany({
        where: {
          auctionId,
          status: { not: 'SOLD' }
        },
        data: { status: 'UNSOLD' }
      })

      // 6. Update winner's AuctionBidder status to ACTIVE (they won)
      await tx.auctionBidder.updateMany({
        where: { auctionId, userId },
        data: { status: 'WINNER' }
      })
    }

    // 6. Set all non-winning bidders to LOST
    const winnerIds = Object.keys(byUser)
    await tx.auctionBidder.updateMany({
      where: {
        auctionId,
        userId: { notIn: winnerIds }
      },
      data: { status: 'LOST' }
    })
  })

  // 8. Return winners grouped for email sending
  return Object.entries(byUser).map(([userId, bids]) => ({
    userId,
    winningBidderId: winningBidderMap[userId],
    user: bids[0].user,
    items: bids.map((b) => ({
      id: b.auctionItemId,
      name: b.auctionItem.name,
      soldPrice: Number(b.bidAmount)
    })),
    totalPrice: bids.reduce((sum, b) => sum + Number(b.bidAmount), 0)
  }))
}

export const sendWinnerEmail = async ({
  email,
  firstName,
  auctionId,
  winningBidderId,
  items,
  totalPrice
}: {
  email: string
  firstName: string
  auctionId: string
  winningBidderId: string
  items: { name: string; soldPrice: number }[]
  totalPrice: number
}) => {
  const BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://littlepawsdr.org'
  const url = `${BASE}/auctions/winner/${winningBidderId}`

  try {
    const result = await resend.emails.send({
      from: `Little Paws Dachshund Rescue <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: 'You won items in the Little Paws Auction!',
      html: auctionWinningBidderTemplate({ url, firstName, items, totalPrice })
    })
    await createLog('info', 'Winner email sent successfully', {
      location: ['sendWinnerEmail.ts'],
      email,
      auctionId,
      winningBidderId,
      messageId: result.data?.id
    })
  } catch (error) {
    await createLog('error', 'Failed to send winner email', {
      location: ['sendWinnerEmail.ts'],
      email,
      auctionId,
      winningBidderId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
