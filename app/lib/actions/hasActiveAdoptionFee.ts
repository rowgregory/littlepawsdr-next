'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { auth } from '../auth'

export const hasActiveAdoptionFee = async () => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { isActive: false, expiresAt: null }

    const fee = await prisma.adoptionFee.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() }
      },
      select: { id: true, expiresAt: true }
    })

    if (!fee) return { isActive: false, expiresAt: null }

    return {
      isActive: true,
      expiresAt: fee.expiresAt
    }
  } catch (error) {
    await createLog('error', 'Failed to check active adoption fee', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { isActive: false, expiresAt: null }
  }
}
