'use server'

import prisma from 'prisma/client'
import { WelcomeWienerInputs } from 'types/entities/welcome-wiener'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext, RequestContext } from 'app/utils/log.utils'
import { auth } from 'app/lib/auth'
import { Prisma } from '@prisma/client'

export const createWelcomeWiener = async (input: WelcomeWienerInputs) => {
  const [actor, context] = await Promise.all([getActor().catch(() => 'Unknown actor'), getRequestContext().catch(() => ({}) as RequestContext)])

  try {
    // ── Guards ──
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    if (!input.name?.trim()) {
      return { success: false, error: 'Name is required', data: null }
    }

    const welcomeWiener = await prisma.welcomeWiener.create({
      data: {
        name: input.name.trim(),
        bio: input.bio,
        age: input.age,
        isLive: input.isLive ?? false,
        images: input.images ?? [],
        associatedProducts: (input.associatedProducts ?? []) as unknown as Prisma.InputJsonValue[]
      }
    })

    await createLog('info', buildLogMessage('created welcome wiener', actor, context), {
      welcomeWienerId: welcomeWiener.id,
      name: welcomeWiener.name,
      isLive: welcomeWiener.isLive,
      ...context
    })

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', buildLogMessage('failed to create welcome wiener', actor, context), {
      error: error instanceof Error ? error.message : 'Unknown error',
      input: { name: input.name },
      ...context
    }).catch(console.error)

    return {
      success: false,
      error: 'Failed to create welcome wiener. Please try again.',
      data: null
    }
  }
}
