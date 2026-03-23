import { serializeProduct } from 'app/utils/serializeProduct'
import prisma from 'prisma/client'
import { createLog } from './createLog'

export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product)
      return {
        success: false,
        error: 'Product not found.',
        data: null
      }

    return { success: true, data: serializeProduct(product), error: null }
  } catch (error) {
    await createLog('error', 'Failed to get product by id', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to get product. Please try again.',
      data: null
    }
  }
}
