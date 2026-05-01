'use server'

import prisma from 'prisma/client'
import { auth } from '../../auth'
import { createLog } from '../createLog'
import { resend } from '../../resend'
import { auctionOutBidTemplate } from '../../email-templates/out-bid'
import { pusherSuperuser, pusherTrigger } from 'app/utils/pusherTrigger'

export async function placeBid(auctionItemId: string, bidAmount: number) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return { success: false, error: 'You must be logged in to place a bid.' }
    }

    const userId = session.user.id
    const email = session.user.email

    let previousTopBid: Awaited<
      ReturnType<
        typeof prisma.auctionBid.findFirst<{
          include: { user: { select: { email: true; firstName: true } } }
        }>
      >
    > = null

    const result = await prisma.$transaction(
      async (tx) => {
        // ── Lock the auction item row for this transaction ──
        // No other transaction can read or write this row until we're done
        await tx.$queryRaw`
        SELECT id FROM "AuctionItem"
        WHERE id = ${auctionItemId}
        FOR UPDATE
      `

        // ── Re-fetch inside the transaction with the lock held ──
        const auctionItem = await tx.auctionItem.findUnique({
          where: { id: auctionItemId },
          include: { auction: true }
        })

        if (!auctionItem) throw new Error('Auction item not found.')
        if (auctionItem.auction.status !== 'ACTIVE') throw new Error('This auction is not currently active.')

        const auctionId = auctionItem.auctionId
        const currentMinimum = Number(auctionItem.minimumBid ?? auctionItem.startingPrice ?? 0)

        // ── Re-validate amount against the freshest minimumBid ──
        // If two bids came in simultaneously, the second one will
        // see the updated minimumBid from the first and fail here
        if (bidAmount < currentMinimum) {
          throw new Error(`Minimum bid is now $${currentMinimum.toLocaleString()}. Please increase your bid.`)
        }

        previousTopBid = await tx.auctionBid.findFirst({
          where: {
            auctionItemId,
            status: 'TOP_BID'
          },
          include: {
            user: {
              select: { email: true, firstName: true }
            }
          }
        })

        // ── Upsert AuctionBidder ──
        const bidder = await tx.auctionBidder.upsert({
          where: { auctionId_userId: { auctionId, userId } },
          update: {},
          create: { auctionId, userId, status: 'REGISTERED' }
        })

        // ── Demote previous TOP_BID on this item ──
        await tx.auctionBid.updateMany({
          where: { auctionItemId, status: 'TOP_BID' },
          data: { status: 'OUTBID' }
        })

        // ── Fetch user for display name ──
        const user = await tx.user.findUnique({ where: { id: userId } })

        // ── Create the bid ──
        const bid = await tx.auctionBid.create({
          data: {
            auctionId,
            auctionItemId,
            userId,
            bidderId: bidder.id,
            bidAmount,
            email,
            bidderName: user?.anonymousBidding ? null : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || null,
            status: 'TOP_BID'
          }
        })

        // ── Update AuctionItem with new currentBid and minimumBid ──
        await tx.auctionItem.update({
          where: { id: auctionItemId },
          data: {
            currentBid: bidAmount,
            minimumBid: bidAmount + 1,
            highestBidAmount: bidAmount,
            totalBids: { increment: 1 },
            topBidder: user?.anonymousBidding ? 'Anonymous' : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Anonymous'
          }
        })

        return bid
      },
      {
        // Serialize concurrent transactions on the same rows
        isolationLevel: 'Serializable'
      }
    )

    const updatedItem = await prisma.auctionItem.findUnique({
      where: { id: auctionItemId },
      select: {
        id: true,
        currentBid: true,
        minimumBid: true,
        highestBidAmount: true,
        totalBids: true,
        topBidder: true,
        name: true,
        auction: true
      }
    })

    try {
      await pusherTrigger(`auction-item-${auctionItemId}`, 'bid-placed', {
        bid: {
          ...result,
          bidAmount: Number(result.bidAmount)
        },
        auctionItem: {
          ...updatedItem,
          currentBid: Number(updatedItem?.currentBid),
          minimumBid: Number(updatedItem?.minimumBid),
          highestBidAmount: Number(updatedItem?.highestBidAmount)
        }
      })

      const sessionUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, email: true }
      })

      const bidderName = sessionUser?.firstName
        ? `${sessionUser.firstName}${sessionUser.lastName ? ` ${sessionUser.lastName}` : ''}`
        : (sessionUser?.email ?? 'Unknown')

      await createLog('info', 'Bid placed', {
        auctionItemId,
        bidAmount: Number(result.bidAmount),
        bidderId: userId,
        bidderName
      })

      await pusherSuperuser('bid-placed', {
        auctionItemId,
        bidAmount: Number(result.bidAmount),
        bidderName,
        email: sessionUser?.email ?? null,
        itemName: updatedItem?.name ?? null,
        currentBid: Number(updatedItem?.currentBid),
        topBidder: updatedItem?.topBidder ?? null
      })
    } catch (error) {
      console.error('Pusher trigger failed:', error)
    }

    const BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.littlepawsdr.org'

    if (previousTopBid && previousTopBid.userId !== userId) {
      await sendOutbidEmail({
        email: previousTopBid.user.email,
        firstName: previousTopBid.user.firstName ?? 'Friend',
        itemName: updatedItem.name,
        yourBid: Number(previousTopBid.bidAmount),
        newBid: bidAmount,
        minimumBid: bidAmount + 1,
        url: `${BASE}/auctions/${updatedItem.auction.customAuctionLink}/${updatedItem.id}`
      })
    }

    return { success: true }
  } catch (error: any) {
    createLog('error', '[placeBid]', error)

    // Prisma serialization failure — another bid won the race
    if (error?.code === 'P2034') {
      const freshItem = await prisma.auctionItem.findUnique({
        where: { id: auctionItemId },
        select: { minimumBid: true, currentBid: true }
      })
      return {
        success: false,
        error: 'LOCK_NOT_ACQUIRED',
        data: {
          newMinimumBid: freshItem?.minimumBid ? Number(freshItem.minimumBid) : null,
          currentBid: freshItem?.currentBid ? Number(freshItem.currentBid) : null
        }
      }
    }

    return { success: false, error: error?.message ?? 'Something went wrong. Please try again.' }
  }
}

export const sendOutbidEmail = async ({
  email,
  firstName,
  itemName,
  yourBid,
  newBid,
  minimumBid,
  url
}: {
  email: string
  firstName: string
  itemName: string
  yourBid: number
  newBid: number
  minimumBid: number
  url: string
}) => {
  try {
    const result = await resend.emails.send({
      from: `Little Paws Dachshund Rescue <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: `You've been outbid on ${itemName}`,
      html: auctionOutBidTemplate({ firstName, itemName, yourBid, newBid, minimumBid, url })
    })

    await createLog('info', 'Outbid email sent successfully', {
      location: ['sendOutbidEmail.ts'],
      email,
      itemName,
      messageId: result.data?.id
    })

    await pusherSuperuser('outbid-email-sent', {
      email,
      name: firstName,
      itemName,
      yourBid,
      newBid,
      minimumBid
    })
  } catch (error) {
    await createLog('error', 'Failed to send outbid email', {
      location: ['sendOutbidEmail.ts'],
      email,
      itemName,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
