'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const updateAuction = async (id: string, data: { startDate: Date; endDate: Date; title: string; goal: number; customAuctionLink: string }) => {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Missing id',
        data: null
      }
    }

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      return {
        success: false,
        error: 'Start date must be before end date',
        data: null
      }
    }

    await prisma.auction.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.goal && { goal: data.goal }),
        ...(data.customAuctionLink && { customAuctionLink: data.customAuctionLink.trim() }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate })
      }
    })

    return {
      success: true
    }
  } catch (error) {
    await createLog('error', 'Failed to update auction', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to update auction. Please try again.',
      data: null
    }
  }
}
