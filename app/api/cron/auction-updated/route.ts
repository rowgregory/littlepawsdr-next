import { createLog } from 'app/lib/actions/createLog'
import { pusher } from 'app/lib/pusher'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export async function GET() {
  try {
    const auction = await prisma.auction.findFirst({
      where: { status: 'ACTIVE' },
      select: { id: true }
    })

    if (!auction) return NextResponse.json({ success: true })

    await pusher.trigger(`auction-${auction.id}`, 'auction-updated', {
      auctionId: auction.id,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    await createLog('error', 'Cron: auction-updated failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to trigger auction update' }, { status: 500 })
  }
}
