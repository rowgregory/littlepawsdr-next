'use server'

import prisma from 'prisma/client'
import { Prisma } from '@prisma/client'
import { WelcomeWienerInputs } from 'types/entities/welcome-wiener'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext, RequestContext } from 'app/utils/log.utils'
import { auth } from 'app/lib/auth'

export const updateWelcomeWiener = async (id: string, input: Partial<WelcomeWienerInputs>) => {
  const [actor, context] = await Promise.all([getActor().catch(() => 'Unknown actor'), getRequestContext().catch(() => ({}) as RequestContext)])

  try {
    // ── Guards ──
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    if (input.name != null && !input.name.trim()) {
      return { success: false, error: 'Name is required', data: null }
    }

    const welcomeWiener = await prisma.welcomeWiener.update({
      where: { id },
      data: {
        ...(input.name != null && { name: input.name.trim() }),
        ...(input.bio != null && { bio: input.bio }),
        ...(input.age != null && { age: input.age }),
        ...(input.isLive != null && { isLive: input.isLive }),
        ...(input.images != null && { images: input.images }),
        ...(input.associatedProducts != null && {
          associatedProducts: input.associatedProducts as unknown as Prisma.InputJsonValue[]
        })
      }
    })

    await createLog('info', buildLogMessage(`updated welcome wiener "${welcomeWiener.name}"`, actor, context), {
      welcomeWienerId: id,
      isLive: welcomeWiener.isLive,
      imageCount: welcomeWiener.images.length,
      ...context
    })

    return { success: true, data: welcomeWiener, error: null }
  } catch (error) {
    await createLog('error', buildLogMessage('failed to update welcome wiener', actor, context), {
      error: error instanceof Error ? error.message : 'Unknown error',
      id,
      ...context
    }).catch(console.error)

    return {
      success: false,
      error: 'Failed to update welcome wiener. Please try again.',
      data: null
    }
  }
}
