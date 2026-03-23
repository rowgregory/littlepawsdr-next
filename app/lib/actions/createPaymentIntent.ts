'use server'

import { getOrCreateStripeCustomer } from 'app/utils/getOrCreateCustomer'
import { validateSavedCard } from 'app/utils/validateSavedCard'
import Stripe from 'stripe'
import { createLog } from './createLog'
import { stripeClient } from '../stripe-client'
import { OrderType } from '@prisma/client'

type PaymentAddress = {
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zipPostalCode: string | null
  country: string
}

export type CreatePaymentIntentParams = {
  amount: number
  name: string
  email: string
  orderType: OrderType
  userId?: string
  saveCard?: boolean
  coverFees?: boolean
  feesCovered?: number
  savedCardId?: string | null
  address?: PaymentAddress | null
  items?: any
  winningBidderId?: string
}

export async function createPaymentIntent({
  amount,
  name,
  email,
  orderType,
  userId,
  saveCard = false,
  coverFees = false,
  feesCovered = 0,
  savedCardId,
  address,
  items,
  winningBidderId
}: CreatePaymentIntentParams) {
  try {
    if (orderType === 'ONE_TIME_DONATION') {
      if (amount < 500) throw new Error('Minimum donation is $5')
    }

    const customerId = await getOrCreateStripeCustomer({ userId, email })

    const descriptions: Record<string, string> = {
      ONE_TIME_DONATION: `One-time donation from ${name}`,
      RECURRING_DONATION: `Recurring donation from ${name}`,
      WELCOME_WIENER: `Welcome Wiener donation from ${name}`,
      PRODUCT: `Product purchase from ${name}`,
      ADOPTION_FEE: `Adoption fee from ${name}`,
      AUCTION_PURCHASE: `Auction payment from ${name}`,
      MIXED: `Order from ${name}`
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      customer: customerId,
      receipt_email: email,
      description: descriptions[orderType] ?? `Payment from ${name}`,
      setup_future_usage: saveCard ? 'on_session' : undefined,
      metadata: {
        orderType,
        userId: userId ?? 'guest',
        name,
        email,
        saveCard: saveCard ? 'true' : 'false',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered.toString(),
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        state: address?.state || '',
        zipPostalCode: address?.zipPostalCode || '',
        country: address?.country || 'US',
        items: items
          ? JSON.stringify(
              items?.map((i) => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                shippingPrice: i.shippingPrice,
                image: i.image,
                isPhysicalProduct: i.isPhysicalProduct
              }))
            )
          : '',
        winningBidderId
      }
    }

    if (savedCardId) {
      const paymentMethodId = await validateSavedCard({
        savedCardId,
        userId: userId!,
        customerId
      })
      paymentIntentParams.payment_method = paymentMethodId
      paymentIntentParams.off_session = true
      paymentIntentParams.confirm = true
    }

    const paymentIntent = await stripeClient.paymentIntents.create(paymentIntentParams)

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    await createLog('error', 'Failed to create payment intent', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name,
      email,
      userId,
      savedCardId
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment intent creation error. Please try again.'
    }
  }
}
