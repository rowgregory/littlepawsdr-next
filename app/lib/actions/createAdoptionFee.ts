'use server'

import prisma from 'prisma/client'
import { IAdoptionFee } from 'types/entities/adoption-fee'
import { createLog } from './createLog'
import { emailRegex } from '../../utils/regex'

export const createAdoptionFee = async (data: Omit<IAdoptionFee, 'id' | 'createdAt'>) => {
  try {
    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.emailAddress?.trim()) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null
      }
    }

    if (!emailRegex.test(data.emailAddress)) {
      return {
        success: false,
        error: 'Invalid email format',
        data: null
      }
    }

    const adoptionFee = await prisma.adoptionFee.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        emailAddress: data.emailAddress.trim(),
        state: data.state,
        feeAmount: data.feeAmount,
        bypassCode: data.bypassCode,
        expiresAt: data.expiresAt,
        status: data.status
      }
    })

    return {
      success: true,
      data: adoptionFee
    }
  } catch (error) {
    await createLog('error', 'Failed to create adoption fee', {
      error: error instanceof Error ? error.message : 'Unknown error',
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.emailAddress
    })

    return {
      success: false,
      error: 'Failed to create adoption fee. Please try again.',
      data: null
    }
  }
}
