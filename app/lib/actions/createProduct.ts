'use server'

import { serializeProduct } from 'app/utils/serializeProduct'
import prisma from 'prisma/client'
import { ProductCreateInputs } from 'types/entities/product'
import { createLog } from './createLog'

export const createProduct = async (input: ProductCreateInputs) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: input.name,
        images: input.images ?? [],
        description: input.description,
        price: input.price ?? 0,
        shippingPrice: input.shippingPrice ?? 0,
        countInStock: Number(input.countInStock) ?? 0,
        isLive: input.isLive ?? false,
        isPhysicalProduct: input.isPhysicalProduct ?? true
      }
    })

    return { success: true, data: serializeProduct(product), error: null }
  } catch (error) {
    await createLog('error', 'Failed to create product', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to create product. Please try again.',
      data: null
    }
  }
}
