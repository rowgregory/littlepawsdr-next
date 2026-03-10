import prisma from 'prisma/client'
import { IAuction } from 'types/entities/auction'
import { createLog } from './createLog'

export const updateAuction = async (id: string, data: Partial<Omit<IAuction, 'id' | 'createdAt' | 'updatedAt'>>) => {
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

    const auction = await prisma.auction.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.goal && { goal: data.goal }),
        ...(data.customAuctionLink && { customAuctionLink: data.customAuctionLink.trim() }),
        ...(data.anonymousBidding !== undefined && { anonymousBidding: data.anonymousBidding }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate })
      }
    })

    return {
      success: true,
      data: auction
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
