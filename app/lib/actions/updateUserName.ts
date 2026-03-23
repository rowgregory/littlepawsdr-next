'use server'

import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const updateUserName = async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized', data: null }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { firstName, lastName },
      select: { id: true, firstName: true, lastName: true }
    })

    return { success: true, data: user, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update user name', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update name. Please try again.',
      data: null
    }
  }
}
