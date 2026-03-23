'use server'

import { UpdateAddressInput } from 'types/entities/address'
import { auth } from '../auth'
import prisma from 'prisma/client'
import { createLog } from './createLog'

export const updateAddress = async (data: UpdateAddressInput) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    await prisma.address.upsert({
      where: { userId: session.user.id },
      update: {
        name: data.name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipPostalCode: data.zipPostalCode,
        country: data.country
      },
      create: {
        name: data.name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipPostalCode: data.zipPostalCode,
        country: data.country,
        userId: session.user.id
      }
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update address', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to update address. Please try again.' }
  }
}
