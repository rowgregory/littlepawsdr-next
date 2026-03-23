'use server'

import prisma from 'prisma/client'
import { stripeClient } from '../stripe-client'
import { savePaymentMethod } from './savePaymentMethod'
import { createLog } from './createLog'
import { createStripeCustomer } from './createStripeCustomer'
import { RecurringFrequency } from '@prisma/client'

interface CreateSubscriptionParams {
  setupIntentId: string
  name?: string
  email?: string
  frequency: RecurringFrequency
  amount: number // in cents
  coverFees?: boolean
  feesCovered?: number
}

export async function createSubscriptionAfterSetup({
  setupIntentId,
  email,
  name,
  frequency,
  amount,
  coverFees,
  feesCovered
}: CreateSubscriptionParams) {
  try {
    // Get the confirmed setup intent
    const setupIntent = await stripeClient.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== 'succeeded') {
      throw new Error('Card confirmation failed. Please try again.')
    }

    const customerId = setupIntent.customer as string
    const paymentMethodId = setupIntent.payment_method as string
    const existingUserId = setupIntent.metadata?.userId

    let userId = existingUserId && existingUserId !== 'guest' ? existingUserId : undefined

    // Auto-create account for recurring donations if no userId
    if (!userId && email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        userId = existingUser.id
      } else {
        const newUser = await prisma.user.create({
          data: {
            email,
            firstName: name?.split(' ')[0] || '',
            lastName: name?.split(' ')[1] || '',
            role: 'SUPPORTER'
          }
        })

        userId = newUser.id

        // Create Stripe customer
        await createStripeCustomer(newUser.id, newUser.email, name)

        // Save the payment method to database
        await savePaymentMethod(newUser.id, paymentMethodId, true)

        await createLog('info', 'Auto-created account for recurring donor', {
          userId: newUser.id,
          email: newUser.email
        })
      }
    }

    // Create product for this recurring donation
    const product = await stripeClient.products.create({
      name: `${frequency === 'MONTHLY' ? 'Monthly' : 'Yearly'} Donation`,
      description: `Recurring donation of $${(amount / 100).toFixed(2)}/${frequency === 'MONTHLY' ? 'month' : 'year'}`,
      metadata: {
        userId: userId || 'guest',
        donorName: setupIntent.metadata?.name || ''
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
        default_payment_method: paymentMethodId,
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        metadata: {
          userId: userId || 'guest',
          email: email || '',
          name: name || '',
          orderType: 'RECURRING_DONATION',
          frequency,
          coverFees: coverFees ? 'true' : 'false',
          feesCovered: feesCovered.toString()
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
    await createLog('error', 'Subscription creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name,
      email
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    }
  }
}
