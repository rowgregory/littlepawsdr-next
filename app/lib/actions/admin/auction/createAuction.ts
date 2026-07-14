'use server'

import prisma from 'prisma/client'
import { pusherSuperuser } from 'app/lib/pusher/pusher.utils'
import { AdminFailure, requireAdmin } from '../../auth/requireAdmin'
import { createLog } from '../../log/createLog'

type CreateAuctionInput = {
  title: string
  startDate: Date
  endDate: Date
  status?: 'DRAFT' | 'ACTIVE' | 'ENDED'
  goal?: number
  customAuctionLink?: string
}

export const createAuction = async (data: CreateAuctionInput) => {
  const gate = await requireAdmin()
  if (!gate.ok) return { success: false, error: (gate as AdminFailure).error, data: null }

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

    const auction = await prisma.auction.create({
      data: {
        title: data.title.trim(),
        status: data.status ?? 'DRAFT',
        goal: data.goal ?? 1000,
        customAuctionLink: data.customAuctionLink?.trim(),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }
    })

    const sessionUser = await prisma.user.findUnique({
      where: { id: gate.userId },
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

    return { success: true, data: { id: auction.id } }
  } catch (error) {
    await createLog('error', 'Failed to create auction', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return { success: false, error: 'Failed to create auction. Please try again.', data: null }
  }
}
