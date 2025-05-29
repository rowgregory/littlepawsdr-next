import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import getOrCreateStripeCustomer from 'app/api/utils/stripe/getOrCreateStripeCustomer'
import savePaymentProfileIfNeeded from 'app/api/utils/stripe/savePaymentProfileIfNeeded'
import createPaymentIntent from 'app/api/utils/stripe/createPaymentIntent'
import findOrCreateUser from 'app/api/utils/adopt/findOrCreateUser'
import { createLog } from 'app/utils/logHelper'
import startMongoSession from 'app/api/utils/startMonogoSession'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function POST(req: NextRequest) {
  const session = await startMongoSession()

  try {
    const formData = await req.json()
    const user = await findOrCreateUser(formData, session)

    const customer = await getOrCreateStripeCustomer(formData, stripe)

    await savePaymentProfileIfNeeded(formData, user, customer, session, stripe)

    // Add metadata for webhook to use
    const metadata = {
      name: formData.name,
      email: formData.email,
      userId: user._id.toString(),
      requiresShipping: formData.requiresShipping ? 'true' : 'false',
      shippingAddress: JSON.stringify(formData.shippingAddress || {}),
      subtotal: formData.subtotal.toString(),
      totalPrice: formData.totalPrice.toString(),
      products: JSON.stringify(formData.products || []),
      ecard: JSON.stringify(formData.ecard || {}),
      adoptFee: JSON.stringify(formData.adoptFee || {}),
      type: 'order'
    }

    const paymentIntent = await createPaymentIntent(formData, customer, stripe, metadata)

    await session.commitTransaction()
    session.endSession()

    return NextResponse.json({
      success: true,
      paymentIntent: paymentIntent
    })
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()

    await createLog('error', 'Error processing payment', {
      functionName: 'POST_PAYMENT',
      name: error.name,
      message: error.message,
      location: ['payment route - POST /api/payment'],
      method: 'POST',
      url: '/api/payment',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
