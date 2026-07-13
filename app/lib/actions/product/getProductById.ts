import { serializeProduct } from 'app/utils/_product.utils'
import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { auth } from 'app/lib/auth'

export const getProductById = async (id: string) => {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPERUSER'].includes(session.user.role)) {
      return { success: false, error: 'Unauthorized.', data: null }
    }

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) return { success: false, error: 'Product not found.', data: null }

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
