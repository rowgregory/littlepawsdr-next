import prisma from 'prisma/client'
import { createLog } from './createLog'

export const deleteAuctionItem = async (id: string, auctionId: string) => {
  try {
    await prisma.auctionItem.delete({ where: { id } })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete auction item', {
      id,
      auctionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to delete auction item' }
  }
}
