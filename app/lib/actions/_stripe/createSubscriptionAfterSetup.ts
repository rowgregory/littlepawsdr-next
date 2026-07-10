'use server'

import { stripeClient } from '../../stripe/stripe-client'
import { createLog } from '../log/createLog'
import { RecurringFrequency } from '@prisma/client'
import { stampUserGeo } from '../user/stampUserGeo'
import { getRequestGeo } from 'app/utils/log.server.utils'

interface CreateSubscriptionParams {
  setupIntentId: string
  name?: string
  email?: string
  frequency: RecurringFrequency
  amount: number // in cents
  coverFees?: boolean
  feesCovered?: number
  tierName: string
}

export async function createSubscriptionAfterSetup({
  setupIntentId,
  email,
  name,
  frequency,
  amount,
  coverFees = false,
  feesCovered = 0,
  tierName
}: CreateSubscriptionParams) {
  try {
    // Get the confirmed setup intent
    const setupIntent = await stripeClient.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== 'succeeded') {
      throw new Error('Card confirmation failed. Please try again.')
    }

    const customerId = setupIntent.customer as string
    const paymentMethodId = setupIntent.payment_method as string
    const userId = setupIntent.metadata?.userId

    if (!userId) {
      // Unreachable in practice — createSetupIntentForSubscription rejects userless requests
      throw new Error('Please sign in to start a subscription.')
    }

    const geo = await getRequestGeo()
    await stampUserGeo(userId, geo)

    // Create product + price for this recurring donation
    const product = await stripeClient.products.create({
      name: `${frequency === 'MONTHLY' ? 'Monthly' : 'Yearly'} Donation`,
      description: `Recurring donation of $${(amount / 100).toFixed(2)}/${frequency === 'MONTHLY' ? 'month' : 'year'}`,
      metadata: {
        userId,
        donorName: setupIntent.metadata?.name || ''
      }
    })

    const price = await stripeClient.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      recurring: {
        interval: frequency === 'MONTHLY' ? 'month' : 'year',
        usage_type: 'licensed'
      },
      metadata: { frequency }
    })

    // Create subscription with the saved payment method
    const subscription = await stripeClient.subscriptions.create(
      {
        customer: customerId,
        items: [{ price: price.id }],
        default_payment_method: paymentMethodId,
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        metadata: {
          userId,
          email: email || '',
          name: name || '',
          orderType: 'RECURRING_DONATION',
          frequency,
          coverFees: coverFees ? 'true' : 'false',
          feesCovered: feesCovered.toString(),
          tierName
        }
      },
      {
        idempotencyKey: `sub_${setupIntentId}`
      }
    )

    return {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status
    }
  } catch (error) {
    await createLog('error', 'Subscription creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name,
      email
    }).catch(console.error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    }
  }
}
