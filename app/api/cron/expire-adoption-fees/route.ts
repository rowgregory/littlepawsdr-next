import { createLog } from 'app/lib/actions/createLog'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export const GET = async () => {
  const start = Date.now()
  try {
    const expired = await prisma.adoptionFee.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        status: { not: 'EXPIRED' }
      },
      data: { status: 'EXPIRED' }
    })

    await createLog('info', '[CRON] expire-adoption-fees', {
      cronName: 'expire-adoption-fees',
      status: expired.count === 0 ? 'skipped' : 'success',
      durationMs: Date.now() - start,
      detail: `${expired.count} fee(s) expired`
    })

    return NextResponse.json({ success: true, expiredCount: expired.count })
  } catch (error) {
    await createLog('error', '[CRON] expire-adoption-fees', {
      cronName: 'expire-adoption-fees',
      status: 'error',
      durationMs: Date.now() - start,
      detail: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json({ success: false, error: 'Cron job failed' }, { status: 500 })
  }
}
