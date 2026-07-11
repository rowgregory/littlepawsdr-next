import { createLog } from 'app/lib/actions/log/createLog'
import { pusherSuperuser } from 'app/lib/pusher/pusher.utils'
import prisma from 'prisma/client'
import Stripe from 'stripe'

export async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  try {
    const customerId = typeof paymentMethod.customer === 'string' ? paymentMethod.customer : paymentMethod.customer?.id

    if (!customerId) {
      return
    }

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      return
    }

    const existing = await prisma.paymentMethod.findUnique({
      where: { stripePaymentId: paymentMethod.id }
    })

    if (existing) {
      return
    }

    await prisma.paymentMethod.create({
      data: {
        stripePaymentId: paymentMethod.id,
        cardholderName: paymentMethod.billing_details?.name || 'Unknown',
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isDefault: false,
        userId: user.id
      }
    })

    await createLog('info', 'Payment method attached via webhook', {
      paymentMethodId: paymentMethod.id,
      userId: user.id
    })

    await pusherSuperuser('payment-method-attached', {
      userId: user.id,
      email: user.email,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4
    })
  } catch (error) {
    await createLog('error', 'Error handling payment method attached', {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentMethodId: paymentMethod.id
    })
  }
}
