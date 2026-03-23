import prisma from 'prisma/client'
import { createLog } from './createLog'

export const deleteWelcomeWiener = async (id: string) => {
  try {
    await prisma.welcomeWiener.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete welcome wiener', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to delete welcome wiener. Please try again.',
      data: null
    }
  }
}
