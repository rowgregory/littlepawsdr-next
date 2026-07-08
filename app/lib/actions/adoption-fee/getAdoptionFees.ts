'use server'

import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { auth } from 'app/lib/auth'
import { getActor } from '../user/getActor'
import { getRequestContext } from 'app/utils/log.server.utils'
import { buildLogMessage } from 'app/utils/log.client.utils'

export const getAdoptionFees = async () => {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPERUSER'].includes(session.user.role)) {
      return { success: false, error: 'Unauthorized.', data: null }
    }

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])

    const adoptionFees = await prisma.adoptionFee.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const message = buildLogMessage('fetched adoption fees', actor, context)
    await createLog('info', message, { count: adoptionFees.length, context })

    return { success: true, data: adoptionFees, error: null }
  } catch (error) {
    await createLog('error', 'Failed to get adoption fees', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to get adoption fees. Please try again.', data: null }
  }
}
