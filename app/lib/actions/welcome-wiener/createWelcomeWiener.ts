'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import prisma from 'prisma/client'
import { createLog } from 'app/lib/actions/log/createLog'
import { WelcomeWienerInputs } from 'types/_welcome-wiener'
import { requireAdmin } from '../user/requireAdmin'
import { getActor } from '../user/getActor'
import { getRequestContext, RequestContext } from 'app/utils/_log.server.utils'
import { buildLogMessage } from 'app/utils/_log.client.utils'

const MAX_NAME = 100

export const createWelcomeWiener = async (input: WelcomeWienerInputs) => {
  const gate = await requireAdmin()
  if (gate.ok === false) {
    return { success: false, error: gate.error, data: null }
  }

  const name = input.name?.trim()
  if (!name) {
    return { success: false, error: 'Name is required', data: null }
  }
  if (name.length > MAX_NAME) {
    return { success: false, error: `Name must be ${MAX_NAME} characters or fewer`, data: null }
  }

  const bio = input.bio?.trim() || null
  const age = input.age?.trim() || null
  const images = (input.images ?? []).filter((url) => typeof url === 'string' && url.trim().length > 0)
  const associatedProducts = input.associatedProducts ?? []

  const [actor, context] = await Promise.all([
    getActor().catch(() => 'Unknown actor'),
    getRequestContext().catch(() => ({}) as RequestContext)
  ])

  try {
    const welcomeWiener = await prisma.welcomeWiener.create({
      data: {
        name,
        bio,
        age,
        isLive: input.isLive ?? false,
        images,
        associatedProducts: associatedProducts as unknown as Prisma.InputJsonValue[]
      }
    })

    await createLog('info', buildLogMessage('created welcome wiener', actor, context), {
      welcomeWienerId: welcomeWiener.id,
      name: welcomeWiener.name,
      isLive: welcomeWiener.isLive,
      ...context
    })

    revalidatePath('/welcomewieners')
    revalidatePath('/admin/welcome-wieners')

    return { success: true, error: null, data: welcomeWiener }
  } catch (error) {
    await createLog('error', buildLogMessage('failed to create welcome wiener', actor, context), {
      error: error instanceof Error ? error.message : 'Unknown error',
      input: { name },
      ...context
    }).catch(console.error)

    return {
      success: false,
      error: 'Failed to create welcome wiener. Please try again.',
      data: null
    }
  }
}
