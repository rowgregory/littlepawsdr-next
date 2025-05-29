import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createLog } from 'app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function GET(req: NextRequest) {
  try {
    const subscriptions = await stripe.subscriptions.list({ limit: 100 })

    return NextResponse.json({
      subscriptions: subscriptions.data
    })
  } catch (error: any) {
    await createLog('error', `Failed to retrieve subscriptions: ${error.message}`, {
      location: ['admin history route - GET /api/admin/history'],
      message: 'Error fetching Stripe subscriptions',
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json(
      {
        message: 'Failed to retrieve subscriptions',
        error: error.message
      },
      { status: 500 }
    )
  }
}
