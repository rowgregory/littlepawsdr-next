import { OrderType, RecurringFrequency } from '@prisma/client'
import { createLog } from 'app/lib/actions/createLog'
import { pusher } from 'app/lib/pusher'
import { stripeClient } from 'app/lib/stripe-client'
import sendConfirmationEmail from 'app/utils/sendConfirmationEmail'
import { NextRequest, NextResponse } from 'next/server'
import prisma from 'prisma/client'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    await createLog('error', 'Webhook signature verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type as string) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Skip if this is part of a subscription
        if ((paymentIntent as any).invoice) {
          break
        }

        await handlePaymentIntentSucceeded(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod)
        break

      case 'payment_method.detached':
        await handlePaymentMethodDetached(event.data.object as Stripe.PaymentMethod)
        break

      case 'payment_method.updated':
        await handlePaymentMethodUpdated(event.data.object as Stripe.PaymentMethod)
        break

      case 'customer.subscription.created':
        const newSub = event.data.object as Stripe.Subscription

        // Fetch the full subscription
        const fullSub = await stripeClient.subscriptions.retrieve(newSub.id)

        if (fullSub.status === 'incomplete') {
          break
        }
        if (fullSub.status === 'active') {
          await handleSubscriptionCreated(fullSub)
        }
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as Stripe.Subscription

        // Handle status changes that affect the order
        const statusesToHandle = ['active', 'past_due', 'canceled', 'unpaid', 'incomplete']

        if (statusesToHandle.includes(updatedSub.status)) {
          await handleSubscriptionUpdated(updatedSub)
        }
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      default:
        await createLog('info', 'Unhandled webhook event', {
          eventType: event.type,
          eventId: event.id
        })
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    await createLog('error', 'Webhook handler failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { id, amount, metadata } = paymentIntent

  try {
    if (!metadata?.orderType) return

    const existingOrder = await prisma.order.findFirst({
      where: { paymentIntentId: id }
    })
    if (existingOrder) return

    const orderType = (metadata?.orderType as OrderType) || 'ONE_TIME_DONATION'

    const userId = metadata?.userId && metadata.userId !== 'guest' ? metadata.userId : null

    const isRecurring = metadata?.isRecurring === 'true'

    const items = JSON.parse(metadata?.items || '[]')
    const hasPhysical = items.some((i: any) => i.isPhysicalProduct)

    const order = await prisma.order.create({
      data: {
        type: orderType,
        status: 'CONFIRMED',
        totalAmount: amount / 100,
        paymentIntentId: id,
        customerEmail: metadata?.email || '',
        customerName: metadata?.name?.trim() || 'Guest',
        userId,
        paidAt: new Date(),
        addressLine1: metadata?.addressLine1 || null,
        addressLine2: metadata?.addressLine2 || null,
        city: metadata?.city || null,
        state: metadata?.state || null,
        zipPostalCode: metadata?.zipPostalCode || null,
        country: metadata?.country || null,
        coverFees: metadata?.coverFees === 'true',
        feesCovered: parseFloat(metadata?.feesCovered || '0'),
        isRecurring,
        recurringFrequency: isRecurring ? ((metadata?.recurringFrequency as RecurringFrequency) ?? null) : null,
        stripeSubscriptionId: isRecurring ? (metadata?.stripeSubscriptionId ?? null) : null,
        nextBillingDate: isRecurring && metadata?.nextBillingDate ? new Date(metadata.nextBillingDate) : null,
        paymentMethodId: (paymentIntent.payment_method as string) || null,
        shippingStatus: hasPhysical ? 'PENDING_FULFILLMENT' : null
      }
    })

    // ── Order items by type ──────────────────────────────────────────────────
    if (orderType === 'WELCOME_WIENER' && metadata?.items) {
      const items = JSON.parse(metadata.items) as Array<{
        name: string
        price: number
        quantity: number
      }>

      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price,
            totalPrice: item.price,
            itemName: item.name,
            isPhysical: false
          }
        })
      }
    }

    if (orderType === 'PRODUCT' || orderType === 'MIXED') {
      const items = JSON.parse(metadata?.items || '[]') as Array<{
        name: string
        price: number
        quantity: number
        shippingPrice: number
        image: string
        isPhysicalProduct: boolean
      }>

      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
            totalPrice: (item.price + item.shippingPrice) * item.quantity,
            shippingPrice: item.shippingPrice,
            itemName: item.name,
            itemImage: item.image,
            isPhysical: item.isPhysicalProduct
          }
        })
      }
    }

    if (orderType === 'AUCTION_PURCHASE' && metadata?.winningBidderId) {
      await prisma.$transaction(async (tx) => {
        const winningBidder = await tx.auctionWinningBidder.update({
          where: { id: metadata.winningBidderId },
          data: {
            winningBidPaymentStatus: 'PAID',
            auctionItemPaymentStatus: 'PAID',
            shippingStatus: 'PENDING_FULFILLMENT',
            paidOn: new Date(),
            processingFee: metadata?.coverFees === 'true' ? metadata.feesCovered : 0
          },
          include: {
            user: { select: { email: true } },
            auction: { select: { id: true, supporterEmails: true, totalAuctionRevenue: true } },
            auctionItems: {
              include: {
                photos: { take: 1 }
              }
            }
          }
        })

        const auction = winningBidder.auction
        const userEmail = winningBidder.user?.email

        const updatedEmails =
          userEmail && !auction.supporterEmails.includes(userEmail) ? [...auction.supporterEmails, userEmail] : auction.supporterEmails

        await tx.auction.update({
          where: { id: auction.id },
          data: {
            supporterEmails: updatedEmails,
            supporters: updatedEmails.length,
            totalAuctionRevenue: { increment: winningBidder.totalPrice ?? 0 }
          }
        })

        // ── Order items ──────────────────────────────────────────────
        if (winningBidder.auctionItems?.length > 0) {
          await tx.orderItem.createMany({
            data: winningBidder.auctionItems.map((item) => ({
              orderId: order.id,
              itemName: item.name,
              itemImage: null,
              price: Number(item.soldPrice ?? item.currentBid ?? item.buyNowPrice ?? 0),
              quantity: 1,
              subtotal: Number(item.soldPrice ?? item.currentBid ?? item.buyNowPrice ?? 0),
              totalPrice: Number(item.soldPrice ?? item.currentBid ?? item.buyNowPrice ?? 0),
              isPhysical: item.requiresShipping
            }))
          })
        }
      })
    }
    // Send confirmation email
    await sendConfirmationEmail(order, orderType, amount)

    // Push to Pusher
    const channelId = userId || `guest-${paymentIntent.id}`
    await pusher.trigger(`payment-${channelId}`, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      createdAt: order.createdAt
    })

    await createLog('info', 'Order created from payment intent', {
      orderId: order.id,
      userId,
      type: orderType,
      paymentIntentId: id,
      amount: amount / 100
    })
  } catch (error) {
    await createLog('error', 'Failed to create order from payment intent', {
      error: error instanceof Error ? error.message : 'Unknown error',
      amount: amount / 100,
      paymentIntentId: id
    })
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { id, last_payment_error, metadata } = paymentIntent

  try {
    const orderType = (metadata?.orderType as 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE') || 'ONE_TIME_DONATION'
    const userId = metadata?.userId && metadata.userId !== 'guest' ? metadata.userId : null

    const order = await prisma.order.create({
      data: {
        type: orderType as OrderType,
        status: 'FAILED',
        totalAmount: paymentIntent.amount / 100,
        paymentIntentId: id,
        customerEmail: (metadata?.email as string) || '',
        customerName: (metadata?.name as string) || 'Guest',
        userId,
        failureReason: last_payment_error?.message || 'Payment failed',
        failureCode: last_payment_error?.code || null
      }
    })

    // Push to same channel as successful orders
    const channelId = userId || `guest-${paymentIntent.id}`
    await pusher.trigger(`payment-${channelId}`, 'order-failed', {
      orderId: order.id,
      error: last_payment_error?.message || 'Payment failed',
      type: orderType
    })

    await createLog('error', 'Payment failed from Stripe webhook', {
      orderId: order.id,
      userId,
      type: orderType,
      paymentIntentId: id,
      failureReason: last_payment_error?.message,
      failureCode: last_payment_error?.code
    })
  } catch (error) {
    await createLog('error', 'Error handling payment failure', {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentIntentId: id
    })
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  try {
    const customerId = typeof paymentMethod.customer === 'string' ? paymentMethod.customer : paymentMethod.customer?.id

    if (!customerId) {
      return
    }

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      return
    }

    const existing = await prisma.paymentMethod.findUnique({
      where: { stripePaymentId: paymentMethod.id }
    })

    if (existing) {
      return
    }

    await prisma.paymentMethod.create({
      data: {
        stripePaymentId: paymentMethod.id,
        cardholderName: paymentMethod.billing_details?.name || 'Unknown',
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isDefault: false,
        userId: user.id
      }
    })

    await createLog('info', 'Payment method attached via webhook', {
      paymentMethodId: paymentMethod.id,
      userId: user.id
    })
  } catch (error) {
    await createLog('error', 'Error handling payment method attached', {
      error: error instanceof Error ? error.message : 'Unknown error',
      paymentMethodId: paymentMethod.id
    })
  }
}

async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod) {
  try {
    await prisma.paymentMethod.deleteMany({
      where: { stripePaymentId: paymentMethod.id }
    })

    await createLog('info', 'Payment method detached', {
      paymentMethodId: paymentMethod.id
    })
  } catch (error) {
    await createLog('error', 'Error handling payment method detach', {
      paymentMethodId: paymentMethod.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handlePaymentMethodUpdated(paymentMethod: Stripe.PaymentMethod) {
  try {
    if (!paymentMethod.customer) return

    await prisma.paymentMethod.update({
      where: { stripePaymentId: paymentMethod.id },
      data: {
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0
      }
    })

    await createLog('info', 'Payment method updated', {
      paymentMethodId: paymentMethod.id,
      customerId: typeof paymentMethod.customer === 'string' ? paymentMethod.customer : paymentMethod.customer?.id
    })
  } catch (error) {
    await createLog('error', 'Error updating payment method', {
      paymentMethodId: paymentMethod.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    await createLog('info', 'Stripe subscription created', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      frequency: subscription.metadata?.frequency || 'monthly',
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      customerEmail: subscription.metadata?.email,
      campaignId: subscription.metadata?.campaignId,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      createdAt: new Date(subscription.created * 1000)
    })
  } catch (error) {
    console.error('Error handling subscription created:', error)
    await createLog('error', 'Failed to log subscription creation', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const latestOrder = await prisma.order.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' }
    })

    await createLog('info', 'Recurring donation cancelled', {
      subscriptionId: subscription.id,
      orderId: latestOrder?.id,
      userId: latestOrder?.userId
    })

    if (latestOrder?.userId) {
      await pusher.trigger(`user-${latestOrder.userId}`, 'subscription-cancelled', {
        subscriptionId: subscription.id,
        orderId: latestOrder.id
      })
    }
  } catch (error) {
    await createLog('error', 'Error cancelling recurring donation', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const latestOrder = await prisma.order.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestOrder) return

    const isCancellingAtPeriodEnd = subscription.cancel_at_period_end

    const order = await prisma.order.update({
      where: { id: latestOrder.id },
      data: {
        status: isCancellingAtPeriodEnd ? 'CANCELLED' : latestOrder.status,
        nextBillingDate:
          isCancellingAtPeriodEnd && subscription.cancel_at
            ? new Date((subscription as any).cancel_at * 1000)
            : (subscription as any).current_period_end
              ? new Date((subscription as any).current_period_end * 1000)
              : null
      }
    })

    await createLog('info', isCancellingAtPeriodEnd ? 'Subscription scheduled for cancellation' : 'Subscription updated', {
      subscriptionId: subscription.id,
      orderId: order.id,
      status: subscription.status,
      cancelAtPeriodEnd: isCancellingAtPeriodEnd
    })

    if (order?.userId) {
      await pusher.trigger(`user-${order.userId}`, 'subscription-updated', {
        subscriptionId: subscription.id,
        status: order.status,
        cancelAtPeriodEnd: isCancellingAtPeriodEnd,
        nextBillingDate: order.nextBillingDate
      })
    }
  } catch (error) {
    await createLog('error', 'Error updating subscription', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const invoiceWithSub = invoice as any
    // Subscription ID - basil uses parent.subscription_details
    let subscriptionId: string | null = null
    if (invoiceWithSub.parent?.subscription_details?.subscription) {
      subscriptionId = invoiceWithSub.parent.subscription_details.subscription
    }

    if (!subscriptionId) {
      return
    }

    const isFirstPayment = invoice.billing_reason === 'subscription_create'

    let paymentIntentId: string | null = null
    const invoicePayments = await stripeClient.invoicePayments.list({ invoice: invoice.id })
    const defaultPayment = invoicePayments.data.find((p) => p.is_default)
    if (defaultPayment?.payment?.type === 'payment_intent') {
      paymentIntentId =
        typeof defaultPayment.payment.payment_intent === 'string'
          ? defaultPayment.payment.payment_intent
          : (defaultPayment.payment.payment_intent as any)?.id || null
    }

    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
        ...(paymentIntentId && { paymentIntentId })
      }
    })

    if (existingOrder) {
      return
    }

    // Get the subscription details
    const subscriptionResponse = await stripeClient.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method']
    })

    const subscription = subscriptionResponse as Stripe.Subscription

    const userId = subscription.metadata?.userId

    const frequency = subscription.metadata?.frequency || 'monthly'
    const amount = invoice.amount_paid / 100
    const coverFees = subscription.metadata?.coverFees === 'true'
    const feesCovered = parseFloat(subscription.metadata?.feesCovered || '0')

    const order = await prisma.order.create({
      data: {
        type: 'RECURRING_DONATION',
        status: 'CONFIRMED',
        totalAmount: amount,
        customerEmail: subscription.metadata?.email || invoice.customer_email || '',
        customerName: subscription.metadata?.name || '',
        userId: userId && userId !== 'guest' ? userId : null,
        stripeSubscriptionId: subscriptionId,
        paymentIntentId: paymentIntentId || null,
        paymentMethodId:
          typeof subscription.default_payment_method === 'string'
            ? subscription.default_payment_method
            : subscription.default_payment_method?.id || null,
        isRecurring: true,
        recurringFrequency: frequency as RecurringFrequency,
        coverFees: coverFees,
        feesCovered: feesCovered,
        paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
        nextBillingDate: invoice.period_end ? new Date(invoice.period_end * 1000) : null
      }
    })

    await createLog('info', `Recurring donation ${isFirstPayment ? 'created' : 'renewed'}`, {
      orderId: order.id,
      subscriptionId,
      amount,
      isFirstPayment
    })

    // Only send confirmation email on first payment
    if (isFirstPayment) {
      await sendConfirmationEmail(order, 'RECURRING_DONATION', amount * 100)
    }

    const channelId = `payment-${subscriptionId}`
    await pusher.trigger(channelId, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      frequency,
      coverFees,
      feesCovered,
      createdAt: order.createdAt
    })
  } catch (error) {
    await createLog('error', 'Error handling invoice payment', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
