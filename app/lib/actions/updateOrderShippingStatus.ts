'use server'

import { ShippingStatus } from '@prisma/client'
import prisma from 'prisma/client'
import { createLog } from './createLog'
import { pusher } from '../pusher'

export const updateOrderShippingStatus = async ({ id, shippingStatus }: { id: string; shippingStatus: ShippingStatus }) => {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { shippingStatus }
    })

    // Notify the user via Pusher
    if (shippingStatus === 'SHIPPED' && order.userId) {
      await pusher.trigger(`user-${order.userId}`, 'order-shipped', {
        orderId: order.id,
        customerName: order.customerName
      })
    }

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update order shipping status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return { success: false, error: 'Failed to update shipping status.', data: null }
  }
}
