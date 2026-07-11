'use server'

import { createLog } from 'app/lib/actions/log/createLog'
import { resend } from 'app/lib/email/resend'
import prisma from 'prisma/client'
import { getActor } from '../user/getActor'
import { getRequestContext } from 'app/utils/log.server.utils'
import { buildLogMessage } from 'app/utils/log.client.utils'
import { orderShippedTemplate } from 'app/lib/email/templates/order-shipped.template'

export async function markOrderShipped(orderId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { shippingStatus: 'SHIPPED' },
      include: { items: true }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = buildLogMessage('marked order as shipped', actor, context)
    await createLog('info', message, { orderId })

    const firstName = order.customerName.split(' ')[0]

    const { error } = await resend.emails.send({
      from: `Little Paws Dachshund Rescue <${process.env.RESEND_FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: 'Your order is on its way',
      html: orderShippedTemplate({
        firstName,
        items: order.items.map((item) => ({
          name: item.itemName ?? 'Item',
          quantity: item.quantity ?? undefined
        })),
        addressLine1: order.addressLine1 ?? '',
        addressLine2: order.addressLine2,
        city: order.city ?? '',
        state: order.state ?? '',
        zipPostalCode: order.zipPostalCode ?? ''
      })
    })

    if (error) {
      await createLog('error', '[markOrderShipped] Resend failed', { orderId, error })
      return { success: false, error: 'Failed to send shipping email' }
    }

    return { success: true }
  } catch (err) {
    await createLog('error', '[markOrderShipped] Failed to update order', {
      orderId,
      error: err instanceof Error ? err.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to update order' }
  }
}
