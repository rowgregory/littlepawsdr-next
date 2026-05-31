'use server'

import prisma from 'prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from 'app/utils/log.utils'
import { createLog } from '../log/createLog'

export async function markOrderShipped(orderId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { shippingStatus: 'SHIPPED' }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('marked order as shipped', actor, context)
    await createLog('INFO', message, { orderId })

    return { success: true }
  } catch (err) {
    console.error('[markOrderShipped]', err)
    return { success: false, error: 'Failed to update order' }
  }
}
