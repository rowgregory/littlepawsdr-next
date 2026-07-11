'use server'

import { ShippingStatus } from '@prisma/client'
import prisma from 'prisma/client'
import { auth } from 'app/lib/auth'
import { createLog } from '../log/createLog'
import { pusherSuperuser, pusherTrigger } from 'app/lib/pusher/pusher.utils'
import { resend } from 'app/lib/email/resend'
import { orderShippedTemplate } from 'app/lib/email/templates/order-shipped.template'

export const updateOrderShippingStatus = async ({
  id,
  shippingStatus
}: {
  id: string
  shippingStatus: ShippingStatus
}) => {
  try {
    const [order, session] = await Promise.all([
      prisma.order.update({
        where: { id },
        data: { shippingStatus },
        include: { items: true }
      }),
      auth()
    ])

    const sessionUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: { firstName: true, lastName: true, email: true }
    })

    const updatedBy = sessionUser?.firstName
      ? `${sessionUser.firstName}${sessionUser.lastName ? ` ${sessionUser.lastName}` : ''}`
      : (sessionUser?.email ?? 'Unknown')

    if (shippingStatus === 'SHIPPED') {
      // ── Pusher → member ──────────────────────────────────
      if (order.userId) {
        await pusherTrigger(`user-${order.userId}`, 'order-shipped', {
          orderId: order.id,
          customerName: order.customerName
        })
      }

      // ── Email → customer ─────────────────────────────────
      const firstName = order.customerName.split(' ')[0]
      const { error: emailError } = await resend.emails.send({
        from: 'Little Paws Dachshund Rescue <info@littlepawsdr.org>',
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

      if (emailError) {
        await createLog('error', 'Failed to send shipped email', {
          orderId: id,
          error: emailError.message
        })
      }
    }

    await createLog('info', 'Order shipping status updated', {
      orderId: id,
      shippingStatus,
      customerName: order.customerName,
      updatedBy
    })

    await pusherSuperuser('order-shipped', {
      orderId: id,
      shippingStatus,
      customerName: order.customerName,
      email: order.customerEmail,
      updatedBy
    })

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update order shipping status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })
    return { success: false, error: 'Failed to update shipping status.', data: null }
  }
}
