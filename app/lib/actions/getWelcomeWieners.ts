'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getWelcomeWieners = async () => {
  try {
    const welcomeWieners = await prisma.welcomeWiener.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return welcomeWieners
  } catch (error) {
    await createLog('error', 'Failed to get welcome wieners', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get welcome wieners. Please try again.',
      data: null
    }
  }
}
