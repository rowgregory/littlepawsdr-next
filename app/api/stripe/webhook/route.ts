import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import Donation from 'models/donationModel'
import createOrder, { CreateOrderParams } from 'app/api/utils/order/createOrder'
import startMongoSession from 'app/api/utils/startMonogoSession'
import { pusherServer } from 'app/lib/pusher/server'
import { IEcardOrder } from 'models/ecardOrderModel'
import { IProductOrder } from 'models/productOrderModel'
import { IDogBoostOrder } from 'models/dogBoostOrderModel'
import { IAdoptionFee } from 'models/adoptionFeeModel'
import { IShippingAddress } from 'models/shippingAddressModel'
import { IAuctionItemOrder } from 'models/auctionItemOrderModel'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
})
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ message: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ message: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') break

        const metadata = session.metadata
        if (!metadata || metadata.type !== 'donation' || metadata.isRecurring !== 'true') break

        const newDonation = new Donation({
          email: session.customer_email,
          amount: Number(session.amount_total) / 100,
          status: 'active',
          paymentDate: new Date(),
          stripePaymentIntentId: session.payment_intent,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          name: metadata.name,
          isRecurring: true,
          note: metadata.note || ''
        })

        await newDonation.save()
        console.log(`✅ Created new recurring donation for ${session.customer_email}`)
        break
      }

      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent

        if (!intent.metadata || intent.metadata.type !== 'order') break

        const session = await startMongoSession()

        try {
          const {
            name,
            email,
            userId,
            requiresShipping,
            shippingAddress,
            shippingPrice,
            subtotal,
            totalPrice,
            products,
            dogBoosts,
            ecards,
            auctionItems,
            adoptFee
          } = intent.metadata

          const parseArray = <T>(val?: string): T[] | undefined => {
            try {
              const parsed = val ? JSON.parse(val) : undefined
              return Array.isArray(parsed) ? parsed : undefined
            } catch {
              return undefined
            }
          }

          const parseObject = <T>(val?: string): T | undefined => {
            try {
              const parsed = val ? JSON.parse(val) : undefined
              return parsed && typeof parsed === 'object' ? parsed : undefined
            } catch {
              return undefined
            }
          }

          const parsedProducts = parseArray<IProductOrder>(products)
          const parsedDogBoosts = parseArray<IDogBoostOrder>(dogBoosts)
          const parsedEcards = parseArray<IEcardOrder>(ecards)
          const parsedAuctionItems = parseArray<IAuctionItemOrder>(auctionItems)
          const parsedAdoptFee = parseObject<IAdoptionFee>(adoptFee)
          const parsedShippingAddress = parseObject<IShippingAddress>(shippingAddress)

          const requiresShippingBool = requiresShipping === 'true'

          const hasPhysicalItems = (parsedProducts && parsedProducts.length > 0) || (parsedAuctionItems && parsedAuctionItems.length > 0)

          const baseOrderData: CreateOrderParams = {
            name,
            email,
            user: userId,
            paymentIntentId: intent.id,
            subtotal: Number(subtotal),
            totalPrice: Number(totalPrice),
            hasPhysicalItems,
            requiresShipping: requiresShippingBool,
            shippingAddress: JSON.stringify(parsedShippingAddress ?? {}),
            shippingPrice: Number(shippingPrice) || 0,
            products: parsedProducts,
            dogBoosts: parsedDogBoosts,
            ecards: parsedEcards,
            auctionItems: parsedAuctionItems,
            adoptFee: parsedAdoptFee,
            isPaid: true
          }

          // Use your createOrder util to handle everything inside a transaction
          const newOrder = await createOrder(baseOrderData, session)

          await session.commitTransaction()
          session.endSession()

          // 🔔 Notify the frontend via Pusher
          await pusherServer.trigger('payment-status', 'payment_succeeded', {
            paymentIntentId: intent.id,
            orderId: newOrder._id.toString(),
            email,
            hasAdoptFee: !!newOrder.adoptFee
          })
        } catch (err) {
          console.error('❌ Failed to create order in webhook:', err)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const donation = await Donation.findOne({
          stripeSubscriptionId: subscription.id
        })

        if (donation) {
          donation.status = 'canceled'
          donation.cancelAtPeriodEnd = subscription.cancel_at_period_end
          donation.canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : new Date()
          await donation.save()
          console.log(`🛑 Recurring donation ${donation._id} marked as canceled.`)
        } else {
          console.warn(`⚠️ Donation not found for subscription ID ${subscription.id}`)
        }
        break
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }
  } catch (err: any) {
    console.error(`🔥 Stripe webhook error: ${err.message}`)
  }

  return NextResponse.json({ received: true })
}
