import { NextResponse } from 'next/server'
import prisma from 'prisma/client'
import { sendWinnerEmail } from '../end-auction/route'
import { createLog } from 'app/lib/actions/createLog'

export async function GET() {
  const start = Date.now()
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
      await createLog('info', '[CRON] winner-payment-reminder', {
        cronName: 'winner-payment-reminder',
        status: 'skipped',
        durationMs: Date.now() - start,
        detail: 'No unpaid winners past 24hrs'
      })
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

    await createLog('info', '[CRON] winner-payment-reminder', {
      cronName: 'winner-payment-reminder',
      status: 'success',
      durationMs: Date.now() - start,
      detail: `${unpaidWinners.length} reminder(s) sent — ${unpaidWinners.map((w) => w.user.email).join(', ')}`
    })

    return NextResponse.json({ success: true, reminded: unpaidWinners.length })
  } catch (error) {
    await createLog('error', '[CRON] winner-payment-reminder', {
      cronName: 'winner-payment-reminder',
      status: 'error',
      durationMs: Date.now() - start,
      detail: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to send payment reminders' }, { status: 500 })
  }
}
