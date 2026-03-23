'use server'

import { RecurringFrequency } from '@prisma/client'
import { stripeClient } from '../stripe-client'
import { createLog } from './createLog'

interface CreateSubscriptionWithSavedCardParams {
  userId: string
  email: string
  name: string
  amount: number
  frequency: RecurringFrequency
  coverFees?: boolean
  feesCovered?: number
  savedCardId?: string
}

export async function createSubscriptionWithSavedCard({
  userId,
  email,
  name,
  amount,
  frequency,
  coverFees,
  feesCovered,
  savedCardId
}: CreateSubscriptionWithSavedCardParams) {
  try {
    // Get the payment method to find the customer
    const paymentMethod = await stripeClient.paymentMethods.retrieve(savedCardId)

    if (!paymentMethod.customer) {
      throw new Error('Payment method is not attached to a customer')
    }

    const customerId = paymentMethod.customer as string

    // Create product for this recurring donation
    const product = await stripeClient.products.create({
      name: `${frequency === 'MONTHLY' ? 'Monthly' : 'Yearly'} Donation`,
      description: `Recurring donation of $${(amount / 100).toFixed(2)}/${frequency === 'MONTHLY' ? 'month' : 'year'}`,
      metadata: {
        userId,
        donorName: name || ''
      }
    })

    // Create price for the subscription
    const price = await stripeClient.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      recurring: {
        interval: frequency === 'MONTHLY' ? 'month' : 'year',
        usage_type: 'licensed'
      },
      metadata: {
        frequency
      }
    })

    // Create subscription with the saved payment method
    const subscription = await stripeClient.subscriptions.create(
      {
        customer: customerId,
        items: [{ price: price.id }],
        default_payment_method: savedCardId,
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        metadata: {
          userId,
          email: email || '',
          name: name || '',
          frequency,
          orderType: 'RECURRING_DONATION',
          coverFees: coverFees ? 'true' : 'false',
          feesCovered: feesCovered?.toString() || '0'
        }
      },
      {
        idempotencyKey: `sub_${customerId}_general_${Date.now()}`
      }
    )

    return {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status
    }
  } catch (error) {
    await createLog('error', 'Subscription creation with saved card error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription with saved card'
    }
  }
}
