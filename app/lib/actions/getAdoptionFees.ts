'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getAdoptionFees = async () => {
  try {
    const adoptionFees = await prisma.adoptionFee.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      data: adoptionFees
    }
  } catch (error) {
    await createLog('error', 'Failed to get adoption fees', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get adoption fees. Please try again.',
      data: null
    }
  }
}
