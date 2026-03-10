import prisma from 'prisma/client'
import { createLog } from './createLog'

export const deleteAuction = async (id: string) => {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Missing id',
        data: null
      }
    }

    await prisma.auction.delete({
      where: { id }
    })

    return {
      success: true,
      data: null
    }
  } catch (error) {
    await createLog('error', 'Failed to delete auction', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to delete auction. Please try again.',
      data: null
    }
  }
}
