import { createLog } from 'app/lib/actions/createLog'
import { pusherTrigger } from 'app/utils/pusherTrigger'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export async function GET() {
  const start = Date.now()
  try {
    const auction = await prisma.auction.findFirst({
      where: { status: 'ACTIVE' },
      select: { id: true }
    })

    if (!auction) {
      await createLog('info', '[CRON] auction-updated', {
        cronName: 'auction-updated',
        status: 'skipped',
        durationMs: Date.now() - start,
        detail: 'No active auction'
      })
      return NextResponse.json({ success: true })
    }

    await pusherTrigger(`auction-${auction.id}`, 'auction-updated', {
      auctionId: auction.id,
      timestamp: new Date().toISOString()
    })

    await createLog('info', '[CRON] auction-updated', {
      cronName: 'auction-updated',
      status: 'success',
      durationMs: Date.now() - start
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    await createLog('error', '[CRON] auction-updated', {
      cronName: 'auction-updated',
      status: 'error',
      durationMs: Date.now() - start,
      detail: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to trigger auction update' }, { status: 500 })
  }
}
