'use server'

import prisma from 'prisma/client'
import { getActor } from '../user/getActor'
import { getRequestContext } from 'app/utils/log.server.utils'
import { createLog } from '../log/createLog'
import { buildLogMessage } from 'app/utils/log.client.utils'

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
    const message = buildLogMessage('marked order as shipped', actor, context)
    await createLog('info', message, { orderId })

    return { success: true }
  } catch (err) {
    console.error('[markOrderShipped]', err)
    return { success: false, error: 'Failed to update order' }
  }
}
