import { createLog } from 'app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paymentIntentId, amount, reason } = body

    if (!paymentIntentId) {
      await createLog('error', 'Refund failed: Missing paymentIntentId', {
        location: ['api/stripe/admin/refund'],
        message: 'Request missing paymentIntentId',
        requestBody: body,
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
      })
      return NextResponse.json({ message: 'paymentIntentId is required' }, { status: 400 })
    }

    // Optional: restrict access — add your admin auth check here
    // e.g., check a secret header or session token

    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId
    }
    if (amount) {
      refundParams.amount = Math.round(amount * 100) // amount in cents
    }
    if (reason) {
      refundParams.reason = reason // e.g. 'requested_by_customer', 'duplicate', etc.
    }

    const refund = await stripe.refunds.create(refundParams)

    await createLog('info', `Refund created for paymentIntent ${paymentIntentId}`, {
      location: ['api/stripe/admin/refund'],
      paymentIntentId,
      amount,
      reason,
      refundId: refund.id,
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({ refund })
  } catch (error: any) {
    await createLog('error', `Refund failed: ${error.message}`, {
      location: ['api/stripe/admin/refund'],
      errorLocation: parseStack(JSON.stringify(error)),
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    })

    return NextResponse.json({ message: 'Failed to create refund', error: error.message }, { status: 500 })
  }
}
