'use server'

import Stripe from 'stripe'
import { auth } from '../auth'
import prisma from 'prisma/client'
import { createLog } from './createLog'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const deletePaymentMethod = async (id: string) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    // Verify ownership
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
      select: { userId: true, stripePaymentId: true, isDefault: true }
    })

    if (!paymentMethod) return { success: false, error: 'Payment method not found' }
    if (paymentMethod.userId !== session.user.id) return { success: false, error: 'Unauthorized' }

    // Check if card is tied to an active subscription
    const activeSubscription = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        isRecurring: true,
        type: 'RECURRING_DONATION',
        status: 'CONFIRMED',
        paymentMethodId: paymentMethod.stripePaymentId
      },
      select: { id: true }
    })

    if (activeSubscription) {
      return {
        success: false,
        error: 'This card is tied to an active subscription. Please update your subscription payment method before removing this card.'
      }
    }

    // Detach from Stripe
    await stripe.paymentMethods.detach(paymentMethod.stripePaymentId)

    // Delete from DB
    await prisma.paymentMethod.delete({ where: { id } })

    // If it was the default, set the next most recent as default
    if (paymentMethod.isDefault) {
      const next = await prisma.paymentMethod.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: { id: true }
      })
      if (next) {
        await prisma.paymentMethod.update({
          where: { id: next.id },
          data: { isDefault: true }
        })
      }
    }

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete payment method', {
      id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to delete payment method' }
  }
}
