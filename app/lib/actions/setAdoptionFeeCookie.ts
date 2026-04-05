'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { cookies } from 'next/headers'
import { createLog } from './createLog'

export const setAdoptionFeeCookie = async (adoptionFeeId: string) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const fee = await prisma.adoptionFee.findFirst({
      where: { id: adoptionFeeId, userId: session.user.id },
      select: { expiresAt: true }
    })

    if (!fee?.expiresAt) return { success: false, error: 'Adoption fee not found' }

    const cookieStore = await cookies()
    cookieStore.set('lpdr_active_adoption_fee', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor((fee.expiresAt.getTime() - Date.now()) / 1000)
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to set adoption fee cookie', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to set adoption fee cookie.' }
  }
}
