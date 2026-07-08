'use server'

import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { auth } from 'app/lib/auth'
import { getActor } from '../user/getActor'
import { getRequestContext } from 'app/utils/log.server.utils'
import { buildLogMessage } from 'app/utils/log.client.utils'

export const deleteProduct = async (id: string) => {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPERUSER'].includes(session.user.role)) {
      return { success: false, error: 'Unauthorized.', data: null }
    }

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])

    const product = await prisma.product.delete({
      where: { id }
    })

    const message = buildLogMessage('deleted a product', actor, context)
    await createLog('info', message, {
      productId: product.id,
      productName: product.name,
      context
    })

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to delete product', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to delete product. Please try again.',
      data: null
    }
  }
}
