import { OrderType, RecurringFrequency } from '@prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import { stripeClient } from 'app/lib/stripe/stripe-client'
import sendConfirmationEmail from 'app/lib/email/sendConfirmatioinEmail'
import { pusherSuperuser, pusherTrigger } from 'app/lib/pusher/pusher.utils'
import { NextRequest, NextResponse } from 'next/server'
import prisma from 'prisma/client'
import Stripe from 'stripe'
import { IAdoptionFee } from 'types/entities/adoption-fee'
import { ProductSizeEntry } from 'types/entities/product'
import { WelcomeWienerProduct } from 'types/entities/welcome-wiener'

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

    const userId = metadata?.userId || null

    const isRecurring = metadata?.isRecurring === 'true'

    const items = JSON.parse(metadata?.items || '[]')
    const hasPhysical = items.some((i: any) => i.isPhysicalProduct)

    const nbd = isRecurring && metadata?.nextBillingDate ? new Date(metadata.nextBillingDate) : null

    const geoUser = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          select: {
            lastGeoLatitude: true,
            lastGeoLongitude: true,
            lastGeoCity: true,
            lastGeoRegion: true,
            lastGeoCountry: true,
            address: true // add this
          }
        })
      : null

    const address = geoUser?.address as {
      addressLine1?: string
      addressLine2?: string
      city?: string
      state?: string
      zipPostalCode?: string
    } | null

    const order = await prisma.order.create({
      data: {
        type: orderType,
        status: 'CONFIRMED',
        totalAmount: amount / 100,
        paymentIntentId: id,
        customerEmail: metadata?.email || '',
        customerName: metadata?.name?.trim() || '',
        userId,
        paidAt: new Date(),
        addressLine1: address?.addressLine1 ?? null,
        addressLine2: address?.addressLine2 ?? null,
        city: address?.city ?? null,
        state: address?.state ?? null,
        zipPostalCode: address?.zipPostalCode ?? null,
        country: 'US',
        coverFees: metadata?.coverFees === 'true',
        feesCovered: parseFloat(metadata?.feesCovered || '0') || 0,
        isRecurring,
        recurringFrequency: isRecurring ? ((metadata?.recurringFrequency as RecurringFrequency) ?? null) : null,
        stripeSubscriptionId: isRecurring ? (metadata?.stripeSubscriptionId ?? null) : null,
        nextBillingDate: nbd && !isNaN(+nbd) ? nbd : null,
        paymentMethodId: (paymentIntent.payment_method as string) || null,
        shippingStatus: hasPhysical ? 'PENDING_FULFILLMENT' : null,
        geoLatitude: geoUser?.lastGeoLatitude ?? null,
        geoLongitude: geoUser?.lastGeoLongitude ?? null,
        geoCity: geoUser?.lastGeoCity ?? null,
        geoRegion: geoUser?.lastGeoRegion ?? null,
        geoCountry: geoUser?.lastGeoCountry ?? null,
        geoSource: geoUser?.lastGeoLatitude != null ? 'ip' : null
      },
      include: { items: true }
    })

    if ((orderType === 'PRODUCT' || orderType === 'MIXED' || orderType === 'WELCOME_WIENER') && metadata?.items) {
      const compact = JSON.parse(metadata.items || '[]') as Array<{
        i: string
        q: number
        s: string | null
        w: string | null
        wp: string | null
      }>

      const ids = compact.map((c) => c.i)
      const wienerIds = compact.map((c) => c.w).filter(Boolean) as string[]

      const [products, wieners] = await Promise.all([
        prisma.product.findMany({ where: { id: { in: ids } } }),
        wienerIds.length ? prisma.welcomeWiener.findMany({ where: { id: { in: wienerIds } } }) : Promise.resolve([])
      ])

      for (const line of compact) {
        const product = products.find((p) => p.id === line.i)

        // ── Product line ──
        if (product) {
          const price = Number(product.price)
          const shipping = Number(product.shippingPrice)

          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              itemName: product.name ?? '',
              itemImage: product.images[0] ?? null,
              price,
              shippingPrice: shipping,
              quantity: line.q,
              subtotal: price * line.q,
              totalPrice: (price + shipping) * line.q,
              isPhysical: product.isPhysicalProduct,
              size: line.s ?? null
            }
          })

          // ── Decrement stock (fresh read per line — see note) ──
          const fresh = await prisma.product.findUnique({
            where: { id: product.id },
            select: { sizes: true, countInStock: true }
          })
          if (fresh) {
            const sizes = fresh.sizes as ProductSizeEntry[] | null
            const updatedSizes =
              line.s && sizes
                ? sizes.map((s) => (s.size === line.s ? { ...s, quantity: Math.max(0, s.quantity - line.q) } : s))
                : sizes

            await prisma.product.update({
              where: { id: product.id },
              data: {
                sizes: updatedSizes ?? undefined,
                countInStock: Math.max(0, (fresh.countInStock ?? 0) - line.q)
              }
            })
          }
          continue
        }

        // ── Welcome Wiener line ──
        const wiener = wieners.find((w) => w.id === line.w)
        if (!wiener) {
          await createLog('warn', 'Order item could not be resolved', { orderId: order.id, itemId: line.i })
          continue
        }

        const options = wiener.associatedProducts as unknown as WelcomeWienerProduct[]
        const option = options.find((o) => o.id === (line.wp ?? line.i))
        const price = Number(option?.price ?? 0)

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            welcomeWienerId: wiener.id,
            itemName: option ? `${option.name} for ${wiener.name}` : (wiener.name ?? ''),
            itemImage: option?.image ?? wiener.images[0] ?? null,
            price,
            quantity: line.q,
            subtotal: price * line.q,
            totalPrice: price * line.q,
            isPhysical: wiener.isPhysicalProduct,
            size: null
          }
        })
      }
    }

    if (orderType === 'AUCTION_PURCHASE') {
      // ── Instant buy (fixed price) ────────────────────────────────
      if (metadata?.auctionItemId && !metadata?.winningBidderId) {
        await prisma.$transaction(async (tx) => {
          const auctionItem = await tx.auctionItem.findUnique({
            where: { id: metadata.auctionItemId },
            include: {
              auction: { select: { id: true, supporterEmails: true, totalAuctionRevenue: true } },
              photos: { take: 1 }
            }
          })

          if (!auctionItem) throw new Error(`AuctionItem not found: ${metadata.auctionItemId}`)

          // Create instant buyer record
          await tx.auctionItemInstantBuyer.create({
            data: {
              auctionId: auctionItem.auctionId,
              auctionItemId: auctionItem.id,
              userId: metadata.userId,
              name: metadata.name,
              email: metadata.email,
              totalPrice: Number(auctionItem.buyNowPrice ?? 0),
              paymentStatus: 'PAID',
              shippingStatus: auctionItem.requiresShipping ? 'PENDING_FULFILLMENT' : 'DIGITAL'
            }
          })

          // Decrement quantity and conditionally mark as sold
          const newQuantity = (auctionItem.totalQuantity ?? 1) - 1

          await tx.auctionItem.update({
            where: { id: auctionItem.id },
            data: {
              totalQuantity: newQuantity,
              ...(newQuantity <= 0 ? { status: 'SOLD' } : {})
            }
          })

          // Update auction revenue and supporter emails
          const auction = auctionItem.auction
          const updatedEmails =
            metadata.email && !auction.supporterEmails.includes(metadata.email)
              ? [...auction.supporterEmails, metadata.email]
              : auction.supporterEmails

          await tx.auction.update({
            where: { id: auction.id },
            data: {
              supporterEmails: updatedEmails,
              supporters: updatedEmails.length,
              totalAuctionRevenue: { increment: Number(auctionItem.buyNowPrice ?? 0) }
            }
          })

          // Create order item
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              itemName: auctionItem.name,
              itemImage: auctionItem.photos[0]?.url ?? null,
              price: Number(auctionItem.buyNowPrice ?? 0),
              quantity: 1,
              subtotal: Number(auctionItem.buyNowPrice ?? 0),
              totalPrice: Number(auctionItem.buyNowPrice ?? 0),
              isPhysical: auctionItem.requiresShipping
            }
          })
        })
      }

      // ── Auction winner (bid) ─────────────────────────────────────
      else if (metadata?.winningBidderId) {
        await prisma.$transaction(async (tx) => {
          const winningBidder = await tx.auctionWinningBidder.update({
            where: { id: metadata.winningBidderId },
            data: {
              winningBidPaymentStatus: 'PAID',
              auctionItemPaymentStatus: 'PAID',
              shippingStatus: 'PENDING_FULFILLMENT',
              paidOn: new Date(),
              processingFee: metadata?.coverFees === 'true' ? parseFloat(metadata.feesCovered || '0') || 0 : 0
            },
            include: {
              user: { select: { email: true } },
              auction: { select: { id: true, supporterEmails: true, totalAuctionRevenue: true } },
              auctionItems: { include: { photos: { take: 1 } } }
            }
          })

          const auction = winningBidder.auction
          const userEmail = winningBidder.user?.email
          const updatedEmails =
            userEmail && !auction.supporterEmails.includes(userEmail)
              ? [...auction.supporterEmails, userEmail]
              : auction.supporterEmails

          await tx.auction.update({
            where: { id: auction.id },
            data: {
              supporterEmails: updatedEmails,
              supporters: updatedEmails.length,
              totalAuctionRevenue: { increment: winningBidder.totalPrice ?? 0 }
            }
          })

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
    }

    let adoptionFee: IAdoptionFee | undefined
    let existingAdoptionFee: { id: string } | null = null

    if (orderType === 'ADOPTION_FEE') {
      const userId = metadata.userId

      existingAdoptionFee = await prisma.adoptionFee.findFirst({
        where: {
          userId,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() }
        },
        select: { id: true }
      })

      if (!existingAdoptionFee) {
        adoptionFee = await prisma.adoptionFee.create({
          data: {
            userId,
            feeAmount: paymentIntent.amount / 100,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            email: metadata.email
          }
        })
      }
    }

    await sendConfirmationEmail(order)

    // Push to Pusher
    const channelId = userId

    await pusherTrigger(`payment-${channelId}`, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      createdAt: order.createdAt,
      adoptionFeeId: adoptionFee?.id ?? existingAdoptionFee?.id ?? null
    })

    await pusherSuperuser('order-created', {
      userId: userId ?? null,
      email: order.customerEmail,
      name: order.customerName,
      amount: order.totalAmount,
      type: orderType,
      orderId: order.id,
      paymentIntentId: id
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
    const orderType = (metadata?.orderType as OrderType) || 'ONE_TIME_DONATION'
    const userId = metadata?.userId || null

    const order = await prisma.order.upsert({
      where: { paymentIntentId: id },
      update: {
        status: 'FAILED',
        failureReason: last_payment_error?.message || 'Payment failed',
        failureCode: last_payment_error?.code || null
      },
      create: {
        type: orderType,
        status: 'FAILED',
        totalAmount: paymentIntent.amount / 100,
        paymentIntentId: id,
        customerEmail: metadata?.email || '',
        customerName: metadata?.name || '',
        userId,
        failureReason: last_payment_error?.message || 'Payment failed',
        failureCode: last_payment_error?.code || null
      }
    })

    await pusherTrigger(`payment-${userId}`, 'order-failed', {
      orderId: order.id,
      error: last_payment_error?.message || 'Payment failed',
      type: orderType
    })

    await pusherSuperuser('order-failed', {
      userId: userId ?? null,
      email: order.customerEmail,
      name: order.customerName,
      amount: order.totalAmount,
      type: orderType,
      orderId: order.id,
      paymentIntentId: id,
      failureReason: last_payment_error?.message ?? null,
      failureCode: last_payment_error?.code ?? null
    })

    await createLog('warn', 'Payment failed from Stripe webhook', {
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
    }).catch(console.error)
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

    await pusherSuperuser('payment-method-attached', {
      userId: user.id,
      email: user.email,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4
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
    // Fetch before deleting so we have user info for the superuser event
    const existing = await prisma.paymentMethod.findFirst({
      where: { stripePaymentId: paymentMethod.id },
      select: {
        user: {
          select: { id: true, email: true, firstName: true }
        }
      }
    })

    await prisma.paymentMethod.deleteMany({
      where: { stripePaymentId: paymentMethod.id }
    })

    await createLog('info', 'Payment method detached', {
      paymentMethodId: paymentMethod.id
    })

    await pusherSuperuser('payment-method-detached', {
      userId: existing?.user.id ?? null,
      email: existing?.user.email ?? null,
      name: existing?.user.firstName ?? null,
      brand: paymentMethod.card?.brand ?? null,
      last4: paymentMethod.card?.last4 ?? null
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

    const existing = await prisma.paymentMethod.findFirst({
      where: { stripePaymentId: paymentMethod.id },
      select: {
        user: {
          select: { id: true, email: true, firstName: true }
        }
      }
    })

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

    await pusherSuperuser('payment-method-updated', {
      userId: existing?.user.id ?? null,
      email: existing?.user.email ?? null,
      name: existing?.user.firstName ?? null,
      brand: paymentMethod.card?.brand ?? null,
      last4: paymentMethod.card?.last4 ?? null
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
    const item = subscription.items.data[0]
    const currentPeriodEnd = item ? new Date(item.current_period_end * 1000) : null

    await createLog('info', 'Stripe subscription created', {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      frequency: subscription.metadata?.frequency || 'MONTHLY',
      amount: item?.price.unit_amount ?? 0,
      customerEmail: subscription.metadata?.email,
      campaignId: subscription.metadata?.campaignId,
      currentPeriodEnd,
      createdAt: new Date(subscription.created * 1000)
    })

    await pusherSuperuser('subscription-created', {
      email: subscription.metadata?.email ?? null,
      status: subscription.status,
      frequency: subscription.metadata?.frequency ?? 'MONTHLY',
      amount: subscription.items.data[0]?.price.unit_amount ?? 0,
      stripeSubscriptionId: subscription.id
    })
  } catch (error) {
    console.error('Error handling subscription created:', error)
    await createLog('error', 'Failed to log subscription creation', {
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    }).catch(console.error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const latestOrder = await prisma.order.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, firstName: true } }
      }
    })

    // No matching order — this is an orphan/legacy Stripe event (old test data,
    // or a subscription never tracked in our DB). Ignore it silently.
    if (!latestOrder) {
      return
    }

    await createLog('info', 'Recurring donation cancelled', {
      subscriptionId: subscription.id,
      orderId: latestOrder.id,
      userId: latestOrder.userId
    })

    if (latestOrder.userId) {
      await pusherTrigger(`user-${latestOrder.userId}`, 'subscription-cancelled', {
        subscriptionId: subscription.id,
        orderId: latestOrder.id
      })
    }

    await pusherSuperuser('subscription-cancelled', {
      userId: latestOrder.user?.id ?? null,
      email: latestOrder.user?.email ?? null,
      name: latestOrder.user?.firstName ?? null,
      stripeSubscriptionId: subscription.id,
      orderId: latestOrder.id
    })
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
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, firstName: true } }
      }
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

    await createLog(
      'info',
      isCancellingAtPeriodEnd ? 'Subscription scheduled for cancellation' : 'Subscription updated',
      {
        subscriptionId: subscription.id,
        orderId: order.id,
        status: subscription.status,
        cancelAtPeriodEnd: isCancellingAtPeriodEnd
      }
    )

    if (order?.userId) {
      await pusherTrigger(`user-${order.userId}`, 'subscription-updated', {
        subscriptionId: subscription.id,
        status: order.status,
        cancelAtPeriodEnd: isCancellingAtPeriodEnd,
        nextBillingDate: order.nextBillingDate
      })
    }

    await pusherSuperuser('subscription-updated', {
      userId: latestOrder.user?.id ?? null,
      email: latestOrder.user?.email ?? null,
      name: latestOrder.user?.firstName ?? null,
      stripeSubscriptionId: subscription.id,
      status: isCancellingAtPeriodEnd ? 'CANCELLING' : subscription.status,
      cancelAtPeriodEnd: isCancellingAtPeriodEnd
    })
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

    const frequency = subscription.metadata?.frequency || 'MONTHLY'
    const amount = invoice.amount_paid / 100
    const coverFees = subscription.metadata?.coverFees === 'true'
    const feesCovered = parseFloat(subscription.metadata?.feesCovered || '0')

    function getNextBillingDate(subscription: any): Date {
      const frequency = subscription.metadata?.frequency || 'MONTHLY'
      const anchor = new Date(subscription.billing_cycle_anchor * 1000)

      if (frequency === 'YEARLY') {
        return new Date(anchor.setFullYear(anchor.getFullYear() + 1))
      }

      return new Date(anchor.setMonth(anchor.getMonth() + 1))
    }

    const geoUser = userId
      ? await prisma.user.findUnique({
          where: { id: userId },
          select: {
            lastGeoLatitude: true,
            lastGeoLongitude: true,
            lastGeoCity: true,
            lastGeoRegion: true,
            lastGeoCountry: true
          }
        })
      : null

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
        nextBillingDate: getNextBillingDate(subscription),
        tierName: subscription.metadata.tierName || null,
        geoLatitude: geoUser?.lastGeoLatitude ?? null,
        geoLongitude: geoUser?.lastGeoLongitude ?? null,
        geoCity: geoUser?.lastGeoCity ?? null,
        geoRegion: geoUser?.lastGeoRegion ?? null,
        geoCountry: geoUser?.lastGeoCountry ?? null,
        geoSource: geoUser?.lastGeoLatitude != null ? 'ip' : null
      },
      include: { items: true }
    })

    await createLog('info', `Recurring donation ${isFirstPayment ? 'created' : 'renewed'}`, {
      orderId: order.id,
      subscriptionId,
      amount,
      isFirstPayment
    })

    // Only send confirmation email on first payment
    if (isFirstPayment) {
      await sendConfirmationEmail(order)
    }

    const channelId = `payment-${subscriptionId}`

    await pusherTrigger(channelId, 'order-created', {
      orderId: order.id,
      amount: order.totalAmount,
      status: order.status,
      type: order.type,
      frequency,
      coverFees,
      feesCovered,
      createdAt: order.createdAt
    })

    await pusherSuperuser('recurring-donation', {
      userId: userId ?? null,
      email: order.customerEmail,
      name: order.customerName,
      amount,
      frequency,
      isFirstPayment,
      orderId: order.id,
      stripeSubscriptionId: subscriptionId
    })
  } catch (error) {
    await createLog('error', 'Error handling invoice payment', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
