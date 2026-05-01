'use server'

import prisma from 'prisma/client'
import { createLog } from '../createLog'
import { auth } from '../../auth'
import { pusherSuperuser } from 'app/utils/pusherTrigger'

export const createAdoptionFee = async (data: { firstName: string; lastName: string; state: string; bypassCode: string }) => {
  const session = await auth()
  try {
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      return { success: false, error: 'Missing required fields', data: null }
    }

    const adoptionFee = await prisma.adoptionFee.create({
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: session.user.email,
        state: data.state,
        bypassCode: data.bypassCode,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: session?.user?.id ?? null
      }
    })

    await createLog('info', 'Adoption fee created', {
      adoptionFeeId: adoptionFee.id,
      userId: session?.user?.id ?? null,
      email: session.user.email,
      state: data.state
    })

    await pusherSuperuser('adoption-fee-created', {
      userId: session?.user?.id ?? null,
      email: session.user.email,
      name: `${data.firstName} ${data.lastName}`,
      state: data.state,
      adoptionFeeId: adoptionFee.id
    })

    return { success: true, id: adoptionFee.id }
  } catch (error) {
    await createLog('error', 'Failed to create adoption fee', {
      error: error instanceof Error ? error.message : 'Unknown error',
      firstName: data.firstName,
      lastName: data.lastName,
      email: session.user.email
    })

    return { success: false, error: 'Failed to create adoption fee. Please try again.', data: null }
  }
}
