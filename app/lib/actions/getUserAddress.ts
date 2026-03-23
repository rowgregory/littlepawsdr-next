import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const getUserAddress = async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
        data: null
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { address: true }
    })

    return {
      success: true,
      data: user?.address ?? null,
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to get user address', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get address. Please try again.',
      data: null
    }
  }
}
