'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { stripeClient } from '../stripe-client'
import { RecurringFrequency } from '@prisma/client'

interface SetupIntentParams {
  userId?: string
  email: string
  name: string
  amount: number // in cents
  frequency: RecurringFrequency
  coverFees?: boolean
  feesCovered?: number
}

export async function createSetupIntentForSubscription({ userId, email, name, amount, frequency, coverFees, feesCovered }: SetupIntentParams) {
  try {
    // VALIDATE MINIMUM AMOUNT
    if (amount < 500) {
      // Stripe uses cents, so $5 = 500
      throw new Error('Minimum donation is $5')
    }

    let customerId: string | undefined

    if (userId) {
      // Logged-in user - customer should already exist from signup
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true }
      })

      if (user?.stripeCustomerId) {
        customerId = user.stripeCustomerId
      }
    }

    // If no customer ID yet (logged in user without one, or guest), create customer
    if (!customerId) {
      // Check if customer exists in Stripe by email
      const stripeCustomers = await stripeClient.customers.list({
        email,
        limit: 1
      })

      if (stripeCustomers.data.length > 0) {
        // Found existing customer - use it
        customerId = stripeCustomers.data[0].id
      } else {
        // No customer exists - create new one
        const customer = await stripeClient.customers.create({
          email,
          name,
          description: userId ? 'Platform user' : `Guest donor: ${name}`,
          metadata: {
            userId: userId || 'guest',
            createdAt: new Date().toISOString()
          }
        })
        customerId = customer.id

        // If logged-in user, save the customer ID to database
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId }
          })
        }
      }
    }

    // Create SetupIntent - customer is guaranteed to exist now
    const setupIntent = await stripeClient.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId: userId || 'guest',
        email,
        name,
        frequency,
        amount: amount.toString(),
        type: 'recurring_donation',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered?.toString() || '0'
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
      error: 'Failed to create setup intent'
    }
  }
}
