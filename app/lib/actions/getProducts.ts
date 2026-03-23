import prisma from 'prisma/client'
import { createLog } from './createLog'

export default async function getProducts() {
  try {
    const [products, orderItems] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.orderItem.findMany({
        where: {
          isPhysical: true,
          order: { status: 'CONFIRMED' }
        },
        select: {
          itemName: true,
          quantity: true
        }
      })
    ])

    const soldMap = orderItems.reduce<Record<string, number>>((acc, item) => {
      const name = item.itemName ?? 'Unknown'
      acc[name] = (acc[name] ?? 0) + (item.quantity ?? 1)
      return acc
    }, {})

    return {
      success: true,
      error: null,
      data: products.map((p) => ({
        ...p,
        price: Number(p.price),
        shippingPrice: Number(p.shippingPrice),
        sold: soldMap[p.name ?? ''] ?? 0
      }))
    }
  } catch (error) {
    await createLog('error', 'Failed to get products', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get products. Please try again.',
      data: null
    }
  }
}
