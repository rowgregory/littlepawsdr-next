'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const deleteProduct = async (id: string) => {
  try {
    await prisma.product.delete({
      where: { id }
    })

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to delete product', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to delete product. Please try again.',
      data: null
    }
  }
}
