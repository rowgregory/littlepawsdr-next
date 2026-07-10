'use server'

import Stripe from 'stripe'
import { createLog } from '../log/createLog'
import { stripeClient } from '../../stripe/stripe-client'
import { OrderType } from '@prisma/client'
import prisma from 'prisma/client'
import { ProductSizeEntry } from 'types/entities/product'
import { WelcomeWienerProduct } from 'types/entities/welcome-wiener'
import { stampUserGeo } from '../user/stampUserGeo'
import { getRequestGeo } from 'app/utils/log.server.utils'
import { validateSavedCard } from './validateSavedCard'
import { getOrCreateStripeCustomer } from './getOrCreateCustomer'

type PaymentAddress = {
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zipPostalCode: string | null
  country: string
}

type PaymentItem = {
  id: string
  name: string
  price: number
  quantity: number
  shippingPrice?: number
  isPhysicalProduct: boolean
  size?: string | null
  welcomeWienerId?: string | null
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
  items?: PaymentItem[]
  winningBidderId?: string
  auctionItemId?: string
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
  winningBidderId,
  auctionItemId
}: CreatePaymentIntentParams) {
  try {
    if (orderType === 'ONE_TIME_DONATION' && amount < 500) {
      throw new Error('Minimum donation is $5')
    }

    // ── 1. Validate items + compute amount from the DB (unchanged) ──────────
    let computedBase = 0 // dollars

    if (items?.length) {
      const ids = items.map((i) => i.id)
      const wienerIds = items.map((i) => i.welcomeWienerId).filter(Boolean) as string[]

      const [products, wieners] = await Promise.all([
        prisma.product.findMany({ where: { id: { in: ids } } }),
        wienerIds.length ? prisma.welcomeWiener.findMany({ where: { id: { in: wienerIds } } }) : Promise.resolve([])
      ])

      for (const item of items) {
        const product = products.find((p) => p.id === item.id)

        if (product) {
          if (!product.isLive) throw new Error(`${product.name} is no longer available`)
          const sizes = product.sizes as ProductSizeEntry[] | null
          const available = item.size ? (sizes?.find((s) => s.size === item.size)?.quantity ?? 0) : product.countInStock
          if (item.quantity > available) {
            throw new Error(`Only ${available} of ${product.name}${item.size ? ` (${item.size})` : ''} available`)
          }
          computedBase += (Number(product.price) + Number(product.shippingPrice)) * item.quantity
          continue
        }

        const wiener = wieners.find((w) => w.id === item.welcomeWienerId)
        if (!wiener) throw new Error(`Item unavailable: ${item.name}`)
        if (!wiener.isLive) throw new Error(`${wiener.name} is no longer accepting donations`)

        const options = wiener.associatedProducts as unknown as WelcomeWienerProduct[]
        const option = options.find((o) => o.id === item.id)
        if (!option) throw new Error(`Invalid donation option for ${wiener.name}`)

        computedBase += Number(option.price) * item.quantity
      }
    }

    let finalCents: number

    if (items?.length) {
      // computedBase IS used here — it's the DB-validated total for items
      const baseCents = Math.round(computedBase * 100)
      finalCents = coverFees ? baseCents + Math.round(feesCovered * 100) : baseCents
    } else {
      // No items → computedBase is irrelevant, client sent the final total
      finalCents = amount
    }

    const geo = await getRequestGeo()
    await stampUserGeo(userId, geo)

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

    // ── 2. Create the intent — items as compact ids, DB is the source of truth ──
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: finalCents,
      currency: 'usd',
      customer: customerId,
      receipt_email: email,
      description: descriptions[orderType] ?? `Payment from ${name}`,
      setup_future_usage: saveCard ? 'on_session' : undefined,
      metadata: {
        orderType,
        userId: userId ?? '',
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
        items: items?.length
          ? JSON.stringify(
              items.map((i) => ({ i: i.id, q: i.quantity, s: i.size ?? null, w: i.welcomeWienerId ?? null }))
            )
          : '',
        winningBidderId: winningBidderId ?? '',
        auctionItemId: auctionItemId ?? ''
      }
    }

    if (savedCardId) {
      const paymentMethodId = await validateSavedCard({ savedCardId, userId: userId!, customerId })
      paymentIntentParams.payment_method = paymentMethodId
      paymentIntentParams.off_session = true
      paymentIntentParams.confirm = true // no pending order to wait for — confirm at creation
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
    }).catch(console.error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment intent creation error. Please try again.'
    }
  }
}
