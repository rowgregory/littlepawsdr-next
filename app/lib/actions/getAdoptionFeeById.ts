'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getAdoptionFeeById = async (id: string) => {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Missing id',
        data: null
      }
    }

    const adoptionFee = await prisma.adoptionFee.findUnique({
      where: { id }
    })

    if (!adoptionFee) {
      return {
        success: false,
        error: 'Adoption fee not found',
        data: null
      }
    }

    return {
      success: true,
      data: adoptionFee
    }
  } catch (error) {
    await createLog('error', 'Failed to get adoption fee', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to get adoption fee. Please try again.',
      data: null
    }
  }
}
