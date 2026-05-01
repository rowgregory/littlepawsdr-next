'use server'

import prisma from 'prisma/client'
import { createLog } from '../createLog'
import { serializeAuction } from 'app/utils/serializers'
import { auth } from '../../auth'
import { pusherSuperuser } from 'app/utils/pusherTrigger'

type CreateAuctionInput = {
  title: string
  startDate: Date
  endDate: Date
  status?: 'DRAFT' | 'ACTIVE' | 'ENDED'
  goal?: number
  customAuctionLink?: string
}

export const createAuction = async (data: CreateAuctionInput) => {
  try {
    if (!data.title?.trim()) {
      return { success: false, error: 'Title is required', data: null }
    }

    if (!data.startDate || !data.endDate) {
      return { success: false, error: 'Start and end date are required', data: null }
    }

    if (data.startDate >= data.endDate) {
      return { success: false, error: 'Start date must be before end date', data: null }
    }

    const [auction, session] = await Promise.all([
      prisma.auction.create({
        data: {
          title: data.title.trim(),
          status: data.status ?? 'DRAFT',
          goal: data.goal ?? 1000,
          customAuctionLink: data.customAuctionLink?.trim(),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        }
      }),
      auth()
    ])

    const sessionUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: { firstName: true, lastName: true, email: true }
    })

    const createdBy = sessionUser?.firstName
      ? `${sessionUser.firstName}${sessionUser.lastName ? ` ${sessionUser.lastName}` : ''}`
      : (sessionUser?.email ?? 'Unknown')

    await createLog('info', 'Auction created', {
      auctionId: auction.id,
      title: auction.title,
      status: auction.status,
      startDate: auction.startDate,
      endDate: auction.endDate,
      createdBy
    })

    await pusherSuperuser('auction-created', {
      auctionId: auction.id,
      title: auction.title,
      status: auction.status,
      startDate: auction.startDate,
      endDate: auction.endDate,
      createdBy
    })

    return { success: true, data: serializeAuction(auction) }
  } catch (error) {
    await createLog('error', 'Failed to create auction', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return { success: false, error: 'Failed to create auction. Please try again.', data: null }
  }
}
