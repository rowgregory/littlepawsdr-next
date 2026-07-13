'use server'

import { createLog } from '../log/createLog'
import { stripeClient } from '../../stripe/stripe-client'
import { RecurringFrequency } from '@prisma/client'
import { getOrCreateStripeCustomer } from './getOrCreateCustomer'

interface SetupIntentParams {
  userId?: string
  email: string
  name: string
  amount: number // in cents
  frequency: RecurringFrequency
  coverFees?: boolean
  feesCovered?: number
  tierName: string
}

export async function createSetupIntentForSubscription({
  userId,
  email,
  name,
  amount,
  frequency,
  coverFees = false,
  feesCovered = 0,
  tierName
}: SetupIntentParams) {
  try {
    if (amount < 500) throw new Error('Minimum donation is $5')
    if (!userId) throw new Error('Please sign in to start a subscription.')

    const customerId = await getOrCreateStripeCustomer({ userId, email })

    const setupIntent = await stripeClient.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId,
        email,
        name,
        frequency,
        amount: amount.toString(),
        type: 'RECURRING_DONATION',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered.toString(),
        tierName
      }
    })

    return {
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      customerId
    }
  } catch (error) {
    await createLog('error', 'SetupIntent creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email,
      name
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create setup intent'
    }
  }
}
