'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { IAuction } from 'types/entities/auction'

export const createAuction = async (data: Omit<IAuction, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    if (!data.title?.trim()) {
      return {
        success: false,
        error: 'Title is required',
        data: null
      }
    }

    if (!data.startDate || !data.endDate) {
      return {
        success: false,
        error: 'Start and end date are required',
        data: null
      }
    }

    if (data.startDate >= data.endDate) {
      return {
        success: false,
        error: 'Start date must be before end date',
        data: null
      }
    }

    const auction = await prisma.auction.create({
      data: {
        title: data.title.trim(),
        status: data.status ?? 'DRAFT',
        goal: data.goal,
        customAuctionLink: data.customAuctionLink?.trim(),
        anonymousBidding: data.anonymousBidding,
        startDate: data.startDate,
        endDate: data.endDate
      }
    })

    return {
      success: true,
      data: auction
    }
  } catch (error) {
    await createLog('error', 'Failed to create auction', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create auction. Please try again.',
      data: null
    }
  }
}
