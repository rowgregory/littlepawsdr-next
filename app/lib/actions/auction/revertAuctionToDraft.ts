'use server'

import { revalidateTag } from 'next/cache'
import { requireAdmin } from 'app/lib/actions/user/requireAdmin'
import { createLog } from 'app/lib/actions/log/createLog'
import prisma from 'prisma/client'

export async function revertAuctionToDraft(auctionId: string) {
  await requireAdmin()

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      select: { id: true, title: true, status: true }
    })

    if (!auction) return { success: false, error: 'Auction not found' }
    if (auction.status !== 'ACTIVE') return { success: false, error: 'Auction is not ACTIVE' }

    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: 'DRAFT' }
    })

    revalidateTag('auction', 'max')

    await createLog('info', '[ADMIN] revert-auction-to-draft', {
      auctionId,
      auctionTitle: auction.title,
      detail: 'Manually reverted to DRAFT by admin'
    })

    return { success: true }
  } catch (error) {
    await createLog('error', '[ADMIN] revert-auction-to-draft', {
      auctionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to revert auction' }
  }
}
