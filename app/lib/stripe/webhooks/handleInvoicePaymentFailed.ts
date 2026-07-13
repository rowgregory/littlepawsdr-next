import Stripe from 'stripe'
import { stripeClient } from '../stripe-client'
import prisma from 'prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import { pusherSuperuser } from 'app/lib/pusher/pusher.utils'

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const invoiceWithSub = invoice as any

    let subscriptionId: string | null = null
    if (invoiceWithSub.parent?.subscription_details?.subscription) {
      subscriptionId = invoiceWithSub.parent.subscription_details.subscription
    }

    if (!subscriptionId) return

    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
    const userId = subscription.metadata?.userId
    const amount = invoice.amount_due / 100

    // Update any existing order for this subscription to FAILED
    await prisma.order.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId,
        status: 'PENDING'
      },
      data: { status: 'FAILED' }
    })

    await createLog('error', 'Recurring donation payment failed', {
      invoiceId: invoice.id,
      subscriptionId,
      userId: userId ?? null,
      email: subscription.metadata?.email ?? invoice.customer_email,
      amount,
      failureReason: (invoice as any).last_finalization_error?.message ?? null
    })

    await pusherSuperuser('recurring-payment-failed', {
      userId: userId ?? null,
      email: subscription.metadata?.email ?? invoice.customer_email,
      name: subscription.metadata?.name ?? null,
      amount,
      subscriptionId,
      invoiceId: invoice.id
    })
  } catch (error) {
    await createLog('error', 'Error handling invoice payment failed', {
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
