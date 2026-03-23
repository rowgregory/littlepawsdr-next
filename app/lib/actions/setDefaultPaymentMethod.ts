'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const setDefaultPaymentMethod = async (id: string) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    // Verify the payment method belongs to the session user
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!paymentMethod) return { success: false, error: 'Payment method not found' }
    if (paymentMethod.userId !== session.user.id) return { success: false, error: 'Unauthorized' }

    // Unset all defaults then set the new one
    await prisma.$transaction([
      prisma.paymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      }),
      prisma.paymentMethod.update({
        where: { id },
        data: { isDefault: true }
      })
    ])

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to set default payment method', {
      id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to update payment method' }
  }
}
