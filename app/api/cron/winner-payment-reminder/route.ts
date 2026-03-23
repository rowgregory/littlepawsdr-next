import { NextResponse } from 'next/server'
import prisma from 'prisma/client'
import { sendWinnerEmail } from '../end-auction/route'
import { createLog } from 'app/lib/actions/createLog'

export async function GET() {
  try {
    const unpaidWinners = await prisma.auctionWinningBidder.findMany({
      where: {
        winningBidPaymentStatus: 'AWAITING_PAYMENT',
        auction: {
          endDate: {
            lte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      },
      include: {
        user: {
          select: { firstName: true, email: true }
        },
        auction: {
          select: { id: true, title: true }
        },
        auctionItems: {
          select: { id: true, name: true, soldPrice: true }
        }
      }
    })

    if (unpaidWinners.length === 0) {
      return NextResponse.json({ success: true, reminded: 0 })
    }

    for (const winner of unpaidWinners) {
      await sendWinnerEmail({
        email: winner.user.email,
        firstName: winner.user.firstName ?? 'Friend',
        auctionId: winner.auctionId,
        winningBidderId: winner.id,
        items: winner.auctionItems.map((item) => ({
          name: item.name,
          soldPrice: Number(item.soldPrice)
        })),
        totalPrice: Number(winner.totalPrice ?? 0)
      })

      await prisma.auctionWinningBidder.update({
        where: { id: winner.id },
        data: {
          emailNotificationCount: { increment: 1 },
          auctionPaymentNotificationEmailHasBeenSent: true
        }
      })
    }

    await createLog('info', 'Cron: winner-payment-reminders', {
      reminded: unpaidWinners.length,
      ids: unpaidWinners.map((w) => w.id),
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true, reminded: unpaidWinners.length })
  } catch (error) {
    await createLog('error', 'Cron: winner-payment-reminders failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to send payment reminders' }, { status: 500 })
  }
}
