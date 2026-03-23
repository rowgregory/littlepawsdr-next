'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { stripeClient } from '../stripe-client'

export async function createStripeCustomer(userId: string, email: string, name: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    // Already has a customer ID
    if (existingUser?.stripeCustomerId) {
      return {
        success: true,
        customerId: existingUser.stripeCustomerId
      }
    }

    // No stored customerId — check Stripe by email first
    const existing = await stripeClient.customers.list({ email, limit: 1 })

    if (existing.data.length > 0) {
      const customerId = existing.data[0].id
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      })
      return { success: true, customerId }
    }

    // No customer in Stripe either — create new one
    const customer = await stripeClient.customers.create({ email, name, metadata: { userId } })

    // Save to database
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id }
    })

    return {
      success: true,
      customerId: customer.id
    }
  } catch (error) {
    await createLog('error', 'Error creating Stripe customer', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      email
    })

    return {
      success: false,
      error: 'Failed to create customer'
    }
  }
}
