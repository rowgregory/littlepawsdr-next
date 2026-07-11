import { OrderType, RecurringFrequency } from '@prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import sendConfirmationEmail from 'app/lib/email/sendConfirmatioinEmail'
import { pusherSuperuser, pusherTrigger } from 'app/lib/pusher/pusher.utils'
import prisma from 'prisma/client'
import Stripe from 'stripe'
import { IAdoptionFee } from 'types/entities/adoption-fee'
import { ProductSizeEntry } from 'types/entities/product'
import { WelcomeWienerProduct } from 'types/entities/welcome-wiener'

export async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
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
    const hasPhysical = items.some((i: any) => i.ip)

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
            address: true, // add this
            firstName: true,
            lastName: true
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
        ip: boolean
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
            email: metadata.email,
            firstName: geoUser.firstName,
            lastName: geoUser.lastName
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
