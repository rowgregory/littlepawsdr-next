import prisma from 'prisma/client'
import { createLog } from './createLog'
import { IProduct } from 'types/entities/product'

export default async function getProducts(): Promise<IProduct[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      shippingPrice: Number(p.shippingPrice)
    }))
  } catch (error) {
    await createLog('error', 'Failed to get products', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return []
  }
}
