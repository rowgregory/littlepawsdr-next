'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const validateBypassCode = async (bypassCode: string) => {
  try {
    if (!bypassCode?.trim()) {
      return {
        success: false,
        error: 'Missing bypass code',
        data: null
      }
    }

    const code = await prisma.adoptionApplicationBypassCode.findUnique({
      where: { bypassCode: bypassCode.trim() }
    })

    if (!code) {
      return {
        success: false,
        error: 'Invalid bypass code',
        data: null
      }
    }

    return {
      success: true,
      data: code
    }
  } catch (error) {
    await createLog('error', 'Failed to validate bypass code', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to validate bypass code. Please try again.',
      data: null
    }
  }
}
