'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const deleteAuctionItemPhoto = async (photoId: string, auctionId: string) => {
  try {
    await prisma.auctionItemPhoto.delete({ where: { id: photoId } })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete auction item photo', {
      photoId,
      auctionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to delete photo' }
  }
}
