import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        items: true
      }
    })

    return {
      success: true,
      error: null,
      data: orders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        feesCovered: Number(order.feesCovered),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: item.subtotal != null ? Number(item.subtotal) : null,
          totalPrice: item.totalPrice != null ? Number(item.totalPrice) : null,
          shippingPrice: Number(item.shippingPrice)
        }))
      }))
    }
  } catch (error) {
    await createLog('error', 'Failed to get orders', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get orders. Please try again.',
      data: null
    }
  }
}
