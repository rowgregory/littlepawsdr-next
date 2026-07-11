import { OrderType } from '@prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import { pusherSuperuser, pusherTrigger } from 'app/lib/pusher/pusher.utils'
import prisma from 'prisma/client'
import Stripe from 'stripe'

export async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
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
