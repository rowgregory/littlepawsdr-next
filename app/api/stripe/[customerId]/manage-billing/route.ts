import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import PaymentProfile from 'models/paymentProfileModel'
import startMongoSession from 'app/api/utils/startMonogoSession'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function POST(req: NextRequest, { params }: any) {
  const { customerId } = params
  let session

  try {
    session = await startMongoSession()
    // Find the payment profile for this user to get the Stripe customer ID
    const paymentProfile = await PaymentProfile.findOne({
      user: customerId
    }).session(session)

    if (!paymentProfile || !paymentProfile.stripeCustomerId) {
      return NextResponse.json({ error: 'Stripe customer ID not found for user' }, { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: paymentProfile.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/account`
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
