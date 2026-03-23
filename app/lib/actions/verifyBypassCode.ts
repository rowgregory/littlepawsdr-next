'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { auth } from '../auth'

export const verifyBypassCode = async (bypassCode: string) => {
  try {
    if (!bypassCode?.trim()) {
      return { isValid: false, error: 'Missing bypass code', data: null }
    }

    const session = await auth()

    const code = await prisma.adoptionApplicationBypassCode.findUnique({
      where: { bypassCode: bypassCode.trim() }
    })

    if (!code) {
      return { isValid: false, error: 'Invalid bypass code', data: null }
    }

    let adoptionFeeId: string | null = null

    if (session?.user?.id) {
      // Check for existing active non-expired fee
      const existingFee = await prisma.adoptionFee.findFirst({
        where: {
          userId: session.user.id,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() }
        },
        select: { id: true }
      })

      if (existingFee) {
        adoptionFeeId = existingFee.id
      } else {
        // No active fee — create one
        const newFee = await prisma.adoptionFee.create({
          data: {
            bypassCode: bypassCode.trim(),
            feeAmount: 0,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            userId: session.user.id
          }
        })
        adoptionFeeId = newFee.id
      }
    }

    return {
      isValid: true,
      data: { adoptionFeeId }
    }
  } catch (error) {
    await createLog('error', 'Failed to verify bypass code', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { isValid: false, error: 'Failed to verify bypass code. Please try again.', data: null }
  }
}
