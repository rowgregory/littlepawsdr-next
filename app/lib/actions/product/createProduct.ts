'use server'

import prisma from 'prisma/client'
import { ProductCreateInputs } from 'types/entities/product'
import { createLog } from '../log/createLog'
import { auth } from '../../auth'
import { getActor } from '../user/getActor'
import { getRequestContext } from 'app/utils/log.server.utils'
import { buildLogMessage } from 'app/utils/log.client.utils'

export const createProduct = async (input: ProductCreateInputs) => {
  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
      return { success: false, error: 'Unauthorized.', data: null }
    }

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])

    const product = await prisma.product.create({
      data: {
        name: input.name,
        images: input.images ?? [],
        description: input.description,
        price: input.price ?? 0,
        shippingPrice: input.shippingPrice ?? 0,
        countInStock: Number(input.countInStock) || 0,
        isLive: input.isLive ?? false,
        isPhysicalProduct: input.isPhysicalProduct ?? true,
        sizes: input.sizes ?? undefined
      }
    })

    const message = buildLogMessage('created a product', actor, context)
    await createLog('info', message, {
      productId: product.id,
      productName: product.name,
      context
    })

    return { success: true, error: null, data: null }
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
