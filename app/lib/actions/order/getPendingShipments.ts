import prisma from 'prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from 'app/utils/log.utils'
import { createLog } from '../log/createLog'

export interface PendingShipmentData {
  id: string
  name: string
  items: string
  total: number
  createdAt: string
  address: string
}

export async function getPendingShipments(): Promise<{
  success: boolean
  data: PendingShipmentData[]
  error?: string
}> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        isPhysical: true,
        status: 'CONFIRMED',
        shippingStatus: null
      },
      include: {
        items: {
          where: { isPhysical: true },
          select: {
            itemName: true,
            quantity: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    const data: PendingShipmentData[] = orders.map((o) => {
      const itemsSummary = o.items.map((i) => `${i.itemName ?? 'Item'}${i.quantity && i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ')

      const address = [o.addressLine1, o.addressLine2, o.city, o.state, o.zipPostalCode, o.country].filter(Boolean).join(', ')

      return {
        id: o.id,
        name: o.customerName || o.customerEmail,
        items: itemsSummary || 'Physical item',
        total: Number(o.totalAmount),
        createdAt: o.createdAt.toISOString(),
        address: address || 'No address on file'
      }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = buildLogMessage('fetched pending shipments', actor, context)
    await createLog('info', message, { count: data.length })

    return { success: true, data }
  } catch (err) {
    console.error('[getPendingShipments]', err)
    return { success: false, data: [], error: 'Failed to load pending shipments' }
  }
}
