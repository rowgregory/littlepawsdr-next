'use server'

import { ShippingStatus } from '@prisma/client'
import prisma from 'prisma/client'
import { createLog } from './createLog'
import { pusherSuperuser, pusherTrigger } from 'app/utils/pusherTrigger'
import { auth } from '../auth'

export const updateOrderShippingStatus = async ({ id, shippingStatus }: { id: string; shippingStatus: ShippingStatus }) => {
  try {
    const [order, session] = await Promise.all([
      prisma.order.update({
        where: { id },
        data: { shippingStatus }
      }),
      auth()
    ])

    if (shippingStatus === 'SHIPPED' && order.userId) {
      await pusherTrigger(`user-${order.userId}`, 'order-shipped', {
        orderId: order.id,
        customerName: order.customerName
      })
    }

    const sessionUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: { firstName: true, lastName: true, email: true }
    })

    const updatedBy = sessionUser?.firstName
      ? `${sessionUser.firstName}${sessionUser.lastName ? ` ${sessionUser.lastName}` : ''}`
      : (sessionUser?.email ?? 'Unknown')

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
