import PaymentProfile from 'models/paymentProfileModel'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function POST(req: NextRequest, { params }: any) {
  try {
    const { customerId } = params
    const { newPriceId } = await req.json()

    // Find the Stripe Customer ID from your PaymentProfile DB by user ID
    const paymentProfile = await PaymentProfile.findOne({ user: customerId })
    if (!paymentProfile) {
      return NextResponse.json({ error: 'Payment profile not found' }, { status: 404 })
    }

    // Fetch active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: paymentProfile.stripeCustomerId,
      status: 'active',
      limit: 1
    })

    if (!subscriptions.data.length) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const subscription = subscriptions.data[0]

    // Update subscription with new price, enable proration
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId
        }
      ]
    })

    // TODO: Update your DB with updatedSubscription info if you track subscriptions

    return NextResponse.json({
      message: 'Subscription updated',
      subscription: updatedSubscription
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
