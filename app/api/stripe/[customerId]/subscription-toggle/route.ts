import { createLog } from 'app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function POST(req: NextRequest, { params }: any) {
  const parameters = await params
  const customerId = parameters.customerId

  if (!customerId) {
    await createLog('error', 'Missing customerId in subscription toggle', {
      location: ['api/stripe/[customerId]/subscription-toggle'],
      message: 'Customer ID was not provided in the request parameters',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })
    return NextResponse.json({ message: 'Customer ID is required' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { subscriptionId, action } = body // action: "pause" or "resume"

    if (!subscriptionId || !action || !['pause', 'resume'].includes(action)) {
      await createLog('error', 'Invalid subscription toggle request body', {
        location: ['api/stripe/[customerId]/subscription-toggle'],
        message: 'subscriptionId or action missing or invalid',
        requestBody: body,
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
      })

      return NextResponse.json(
        {
          message: "subscriptionId and valid action ('pause' or 'resume') required"
        },
        { status: 400 }
      )
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    if (subscription.customer !== customerId) {
      await createLog('warn', `Subscription ${subscriptionId} does not belong to customer ${customerId}`, {
        location: ['api/stripe/[customerId]/subscription-toggle'],
        subscriptionId,
        customerId,
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
      })

      return NextResponse.json({ message: 'Subscription does not belong to customer' }, { status: 403 })
    }

    let updatedSubscription
    if (action === 'pause') {
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: { behavior: 'keep_as_draft' }
      })
    } else {
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: null
      })
    }

    await createLog('info', `Subscription ${subscriptionId} ${action}d by customer ${customerId}`, {
      location: ['api/stripe/[customerId]/subscription-toggle'],
      subscriptionId,
      customerId,
      action,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({
      message: `Subscription ${action}d successfully`,
      subscription: updatedSubscription
    })
  } catch (error: any) {
    await createLog('error', `Failed to update subscription: ${error.message}`, {
      location: ['api/stripe/[customerId]/subscription-toggle'],
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({ message: 'Failed to update subscription', error: error.message }, { status: 500 })
  }
}
