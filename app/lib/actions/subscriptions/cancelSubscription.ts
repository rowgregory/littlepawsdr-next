'use server'

import prisma from 'prisma/client'
import { auth } from '../../auth'
import { stripeClient } from '../../stripe-client'
import { createLog } from '../createLog'

export const cancelSubscription = async ({ subscriptionId }: { subscriptionId: string }) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    // Verify the subscription belongs to this user
    const order = await prisma.order.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        userId: session.user.id
      }
    })

    if (!order) return { success: false, error: 'Subscription not found.' }

    // Cancel at period end — user keeps access until next billing date
    await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })

    await createLog('info', 'Subscription cancelled at period end', {
      subscriptionId,
      userId: session.user.id
    })

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to cancel subscription', {
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriptionId
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription. Please try again.'
    }
  }
}
