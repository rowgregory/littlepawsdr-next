'use server'

import prisma from 'prisma/client'
import { ProductUpdateInputs } from 'types/entities/product'
import { createLog } from '../log/createLog'
import { auth } from '../../auth'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from 'app/utils/log.utils'

export const updateProduct = async (input: ProductUpdateInputs) => {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPERUSER'].includes(session.user.role)) {
      return { success: false, error: 'Unauthorized.', data: null }
    }

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])

    const product = await prisma.product.update({
      where: { id: input.id },
      data: {
        ...(input.name != null && { name: input.name }),
        ...(input.images != null && { images: input.images }),
        ...(input.description != null && { description: input.description }),
        ...(input.price != null && { price: input.price }),
        ...(input.shippingPrice != null && { shippingPrice: input.shippingPrice }),
        ...(input.countInStock != null && { countInStock: input.countInStock }),
        ...(input.sizes !== undefined && { sizes: input.sizes }),
        ...(input.isLive != null && { isLive: input.isLive }),
        ...(input.isPhysicalProduct != null && { isPhysicalProduct: input.isPhysicalProduct })
      }
    })

    const message = await buildLogMessage('updated a product', actor, context)
    await createLog('info', message, {
      productId: product.id,
      productName: product.name,
      context
    })

    return { success: true, error: null }
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
