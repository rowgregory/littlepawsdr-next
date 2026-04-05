import { createLog } from 'app/lib/actions/createLog'
import { pusher } from 'app/lib/pusher'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        status: 'DRAFT',
        startDate: { lte: new Date() }
      },
      select: {
        id: true,
        title: true,
        endDate: true,
        _count: { select: { items: true } }
      }
    })

    if (auctions.length === 0) return NextResponse.json({ success: true, activated: 0 })

    await prisma.auction.updateMany({
      where: { id: { in: auctions.map((a) => a.id) } },
      data: { status: 'ACTIVE' }
    })

    for (const auction of auctions) {
      await pusher.trigger(`auction-${auction.id}`, 'auction-started', {
        auctionId: auction.id,
        auctionTitle: auction.title,
        itemCount: auction._count.items,
        endDate: auction.endDate.toISOString(),
        timestamp: new Date().toISOString()
      })
    }

    await createLog('info', 'Cron: start-auctions', {
      activated: auctions.map((a) => a.id),
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true, activated: auctions.length })
  } catch (error) {
    await createLog('error', 'Cron: start-auctions failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to start auctions' }, { status: 500 })
  }
}
