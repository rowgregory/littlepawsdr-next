import prisma from 'prisma/client'
import { createLog } from './createLog'

export const addAuctionItemPhoto = async (
  itemId: string,
  auctionId: string,
  data: { url: string; name?: string; size?: string; isPrimary?: boolean }
) => {
  try {
    // If this is primary, demote all others first
    if (data.isPrimary) {
      await prisma.auctionItemPhoto.updateMany({
        where: { itemId },
        data: { isPrimary: false }
      })
    }

    // Get current max sortOrder
    const last = await prisma.auctionItemPhoto.findFirst({
      where: { itemId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true }
    })

    const photo = await prisma.auctionItemPhoto.create({
      data: {
        itemId,
        url: data.url,
        name: data.name || null,
        size: data.size || null,
        isPrimary: data.isPrimary ?? false,
        sortOrder: (last?.sortOrder ?? -1) + 1
      }
    })

    return { success: true, data: photo }
  } catch (error) {
    await createLog('error', 'Failed to add auction item photo', {
      itemId,
      auctionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to add photo', data: null }
  }
}
