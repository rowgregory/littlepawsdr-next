import { createLog } from 'app/utils/logHelper'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function GET(req: NextRequest, { params }: any) {
  try {
    const parameters = await params
    const customerId = parameters.customerId
    if (!customerId) {
      return NextResponse.json({ message: 'Customer ID is required' }, { status: 400 })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100
    })

    return NextResponse.json({
      subscriptions: subscriptions.data
    })
  } catch (error: any) {
    await createLog('error', 'Error retrieving Stripe subscriptions', {
      functionName: 'GET_STRIPE_SUBSCRIPTIONS',
      name: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
      user: undefined, // no user context here
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        message: 'Failed to retrieve subscription history',
        error: error.message
      },
      { status: 500 }
    )
  }
}
