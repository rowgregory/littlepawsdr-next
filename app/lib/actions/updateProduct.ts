'use server'

import { serializeProduct } from 'app/utils/serializeProduct'
import prisma from 'prisma/client'
import { ProductUpdateInputs } from 'types/entities/product'
import { createLog } from './createLog'

export const updateProduct = async (input: ProductUpdateInputs) => {
  try {
    const product = await prisma.product.update({
      where: { id: input.id },
      data: {
        ...(input.name != null && { name: input.name }),
        ...(input.images != null && { images: input.images }),
        ...(input.description != null && { description: input.description }),
        ...(input.price != null && { price: input.price }),
        ...(input.shippingPrice != null && { shippingPrice: input.shippingPrice }),
        ...(input.countInStock != null && { countInStock: input.countInStock }),
        ...(input.isLive != null && { isLive: input.isLive }),
        ...(input.isPhysicalProduct != null && { isPhysicalProduct: input.isPhysicalProduct })
      }
    })

    return { success: true, data: serializeProduct(product), error: null }
  } catch (error) {
    await createLog('error', 'Failed to update product', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id: input.id
    })

    return {
      success: false,
      error: 'Failed to update product. Please try again.',
      data: null
    }
  }
}
