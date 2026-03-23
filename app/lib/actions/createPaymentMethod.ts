'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { stripeClient } from '../stripe-client'
import { createLog } from './createLog'

export async function createPaymentMethod({
  stripePaymentMethodId,
  isDefault,
  cardholderName
}: {
  stripePaymentMethodId: string
  isDefault: boolean
  cardholderName: string
}) {
  const session = await auth()

  if (!session?.user?.id) {
    await createLog('warn', 'Unauthorized createPaymentMethod attempt', {
      stripePaymentMethodId
    })
    throw new Error('Unauthorized')
  }

  try {
    // 1️⃣ Retrieve payment method from Stripe
    const paymentMethod = await stripeClient.paymentMethods.retrieve(stripePaymentMethodId)

    if (paymentMethod.type !== 'card' || !paymentMethod.card) {
      await createLog('error', 'Invalid Stripe payment method type', {
        stripePaymentMethodId,
        type: paymentMethod.type
      })
      throw new Error('Invalid payment method')
    }

    // 2️⃣ Prevent duplicates
    const existing = await prisma.paymentMethod.findUnique({
      where: { stripePaymentId: paymentMethod.id }
    })

    if (existing) {
      await createLog('info', 'Payment method already exists', {
        paymentMethodId: existing.id,
        userId: session.user.id
      })

      return { success: true, id: existing.id }
    }

    // 3️⃣ If setting as default, unset other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true
        },
        data: { isDefault: false }
      })
    } else {
      // If not setting as default, check if user has a default
      const hasDefault = await prisma.paymentMethod.findFirst({
        where: {
          userId: session.user.id,
          isDefault: true
        }
      })

      // Make this the default if user doesn't have one
      if (!hasDefault) {
        isDefault = true
      }
    }

    // 4️⃣ Save to DB
    const created = await prisma.paymentMethod.create({
      data: {
        stripePaymentId: paymentMethod.id,
        cardholderName: cardholderName || null, // Add this
        cardBrand: paymentMethod.card.brand,
        cardLast4: paymentMethod.card.last4,
        cardExpMonth: paymentMethod.card.exp_month,
        cardExpYear: paymentMethod.card.exp_year,
        isDefault,
        userId: session.user.id
      }
    })

    // 7️⃣ Log success
    await createLog('info', 'Payment method created', {
      paymentMethodId: created.id,
      stripePaymentMethodId: paymentMethod.id,
      userId: session.user.id,
      brand: created.cardBrand,
      last4: created.cardLast4,
      cardholderName: cardholderName || 'Not provided',
      isDefault
    })

    return { success: true, id: created.id }
  } catch (error) {
    await createLog('error', 'Failed to create payment method', {
      stripePaymentMethodId,
      userId: session.user.id,
      error: error instanceof Error ? error.message : error
    })

    return {
      success: false,
      error: 'Failed to save payment method. Please try again.'
    }
  }
}
