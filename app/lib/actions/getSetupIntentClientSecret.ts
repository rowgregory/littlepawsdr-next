'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'
import { stripeClient } from '../stripe-client'

export async function getSetupIntentClientSecret() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Get or create Stripe customer
    let customerId: string

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    })

    if (user?.stripeCustomerId) {
      customerId = user.stripeCustomerId
    } else {
      const email = session.user.email

      // Check Stripe for existing customer first
      const existing = email ? await stripeClient.customers.list({ email, limit: 1 }) : { data: [] }

      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
        const customer = await stripeClient.customers.create({
          email: email || undefined,
          metadata: { userId: session.user.id }
        })
        customerId = customer.id
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create setup intent
    const setupIntent = await stripeClient.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card']
    })

    return {
      success: true,
      clientSecret: setupIntent.client_secret
    }
  } catch (error) {
    await createLog('error', 'Failed to create setup intent', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get client secret'
    }
  }
}
