'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const markWinningBidAsPaidManually = async (id: string) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.$transaction(async (tx) => {
      const winningBidder = await tx.auctionWinningBidder.update({
        where: { id },
        data: {
          winningBidPaymentStatus: 'PAID',
          auctionItemPaymentStatus: 'PAID',
          shippingStatus: 'PENDING_FULFILLMENT',
          paidOn: new Date()
        },
        include: {
          user: { select: { email: true } },
          auction: {
            select: { id: true, supporterEmails: true, totalAuctionRevenue: true }
          }
        }
      })

      const auction = winningBidder.auction
      const userEmail = winningBidder.user?.email

      const updatedEmails =
        userEmail && !auction.supporterEmails.includes(userEmail) ? [...auction.supporterEmails, userEmail] : auction.supporterEmails

      await tx.auction.update({
        where: { id: auction.id },
        data: {
          supporterEmails: updatedEmails,
          supporters: updatedEmails.length,
          totalAuctionRevenue: { increment: winningBidder.totalPrice ?? 0 }
        }
      })
    })

    await createLog('info', 'Winning bid marked as paid manually', {
      winningBidderId: id,
      markedBy: session.user.id
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to mark winning bid as paid manually', {
      winningBidderId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to mark as paid. Please try again.' }
  }
}
