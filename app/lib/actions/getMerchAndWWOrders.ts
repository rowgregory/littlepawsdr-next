import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const getMerchAndWWOrders = async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
        data: null
      }
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        type: { in: ['PRODUCT', 'WELCOME_WIENER', 'MIXED'] }
      },
      include: {
        items: true,
        user: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      error: null,
      data: orders.map((o) => ({
        id: o.id,
        type: o.type,
        totalAmount: Number(o.totalAmount),
        createdAt: o.createdAt,
        status: o.status,
        shippingStatus: o.shippingStatus ?? null,
        firstName: o.user?.firstName ?? null,
        lastName: o.user?.lastName ?? null,
        items: o.items.map((item) => ({
          id: item.id,
          name: item.itemName ?? 'Item',
          image: item.itemImage ?? null,
          price: Number(item.price),
          quantity: item.quantity ?? 1,
          isPhysical: item.isPhysical
        })),
        shippingAddress: o.addressLine1
          ? {
              addressLine1: o.addressLine1,
              addressLine2: o.addressLine2 ?? null,
              city: o.city ?? null,
              state: o.state ?? null,
              zipPostalCode: o.zipPostalCode ?? null
            }
          : null
      }))
    }
  } catch (error) {
    await createLog('error', 'Failed to get purchases', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get purchases. Please try again.',
      data: null
    }
  }
}
