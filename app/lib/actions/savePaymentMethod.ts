'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { stripeClient } from '../stripe-client'

export async function savePaymentMethod(userId: string, paymentMethodId: string, isDefault: boolean = false) {
  try {
    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      return {
        success: false,
        error: 'Customer not found.'
      }
    }

    // Get payment method details
    const paymentMethod = await stripeClient.paymentMethods.retrieve(paymentMethodId)

    // If setting as default, unset previous default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    // Save to database
    await prisma.paymentMethod.upsert({
      where: { stripePaymentId: paymentMethodId },
      update: { isDefault },
      create: {
        stripePaymentId: paymentMethodId,
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isDefault,
        userId
      }
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to save payment method', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to save payment method. Please try again.'
    }
  }
}
