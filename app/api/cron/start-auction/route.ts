import { createLog } from 'app/lib/actions/createLog'
import { pusherTrigger } from 'app/utils/pusherTrigger'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

async function startAuction() {
  const start = Date.now()
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

    if (auctions.length === 0) {
      await createLog('info', '[CRON] start-auction', {
        cronName: 'start-auction',
        status: 'skipped',
        durationMs: Date.now() - start,
        detail: 'No DRAFT auctions past start date'
      })
      return NextResponse.json({ success: true, activated: 0 })
    }

    await prisma.auction.updateMany({
      where: { id: { in: auctions.map((a) => a.id) } },
      data: { status: 'ACTIVE' }
    })

    for (const auction of auctions) {
      await pusherTrigger(`auction-${auction.id}`, 'auction-started', {
        auctionId: auction.id,
        auctionTitle: auction.title,
        itemCount: auction._count.items,
        endDate: auction.endDate.toISOString(),
        timestamp: new Date().toISOString()
      })
    }

    await createLog('info', '[CRON] start-auction', {
      cronName: 'start-auction',
      status: 'success',
      durationMs: Date.now() - start,
      detail: `${auctions.length} auction(s) started — ${auctions.map((a) => a.title).join(', ')}`
    })

    return NextResponse.json({ success: true, activated: auctions.length })
  } catch (error) {
    await createLog('error', '[CRON] start-auction', {
      cronName: 'start-auction',
      status: 'error',
      durationMs: Date.now() - start,
      detail: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to start auctions' }, { status: 500 })
  }
}

export async function GET() {
  return startAuction()
}

export async function POST() {
  return startAuction()
}
