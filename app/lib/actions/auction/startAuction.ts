'use server'

import { revalidateTag } from 'next/cache'
import { requireAdmin } from 'app/lib/actions/user/requireAdmin'
import { createLog } from 'app/lib/actions/log/createLog'
import prisma from 'prisma/client'
import { pusherTrigger } from 'app/lib/pusher/pusher.utils'

export async function startAuction(auctionId: string) {
  await requireAdmin()

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      select: {
        id: true,
        title: true,
        status: true,
        endDate: true,
        customAuctionLink: true,
        _count: { select: { items: true } }
      }
    })

    if (!auction) return { success: false, error: 'Auction not found' }
    if (auction.status !== 'DRAFT') return { success: false, error: 'Auction is not in DRAFT status' }

    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: 'ACTIVE' }
    })

    revalidateTag('auction', 'max')

    await pusherTrigger(`auction-${auctionId}`, 'auction-started', {
      auctionId: auction.id,
      auctionTitle: auction.title,
      itemCount: auction._count.items,
      endDate: auction.endDate.toISOString(),
      timestamp: new Date().toISOString(),
      customAuctionLink: auction.customAuctionLink
    })

    await createLog('info', '[ADMIN] start-auction', {
      auctionId,
      auctionTitle: auction.title,
      detail: 'Manually started by admin'
    })

    return { success: true }
  } catch (error) {
    await createLog('error', '[ADMIN] start-auction', {
      auctionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to start auction' }
  }
}
