import { createLog } from 'app/lib/actions/createLog'
import { NextResponse } from 'next/server'
import prisma from 'prisma/client'

export const GET = async () => {
  try {
    const expired = await prisma.adoptionFee.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        status: { not: 'EXPIRED' }
      },
      data: { status: 'EXPIRED' }
    })

    await createLog('info', 'Adoption fee expiration cron ran', {
      expiredCount: expired.count
    })

    return NextResponse.json({ success: true, expiredCount: expired.count })
  } catch (error) {
    await createLog('error', 'Adoption fee expiration cron failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json({ success: false, error: 'Cron job failed' }, { status: 500 })
  }
}
