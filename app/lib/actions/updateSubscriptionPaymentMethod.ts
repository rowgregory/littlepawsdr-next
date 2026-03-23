'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { stripeClient } from '../stripe-client'
import { createLog } from './createLog'

export const updateSubscriptionPaymentMethod = async ({ subscriptionId, paymentMethodId }: { subscriptionId: string; paymentMethodId: string }) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    // Attach payment method to customer
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
    const customerId = subscription.customer as string

    await stripeClient.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    })

    // Set as default on subscription
    await stripeClient.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId
    })

    // Set as default on customer too
    await stripeClient.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    })

    // Update the order record
    await prisma.order.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId,
        userId: session.user.id
      },
      data: { paymentMethodId }
    })

    await createLog('info', 'Subscription payment method updated', {
      subscriptionId,
      userId: session.user.id
    })

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update subscription payment method', {
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriptionId
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment method. Please try again.'
    }
  }
}
