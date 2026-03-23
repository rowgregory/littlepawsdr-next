'use server'

import prisma from 'prisma/client'
import { WelcomeWienerInputs } from 'types/entities/welcome-wiener'
import { createLog } from './createLog'

export const updateWelcomeWiener = async (id: string, input: Partial<WelcomeWienerInputs>) => {
  try {
    const welcomeWiener = await prisma.welcomeWiener.update({
      where: { id },
      data: {
        ...(input.displayUrl != null && { displayUrl: input.displayUrl }),
        ...(input.name != null && { name: input.name }),
        ...(input.bio != null && { bio: input.bio }),
        ...(input.age != null && { age: input.age }),
        ...(input.isLive != null && { isLive: input.isLive }),
        ...(input.images != null && { images: input.images }),
        ...(input.associatedProducts != null && { associatedProducts: input.associatedProducts as any })
      }
    })

    return welcomeWiener
  } catch (error) {
    await createLog('error', 'Failed to update welcome wiener', {
      error: error instanceof Error ? error.message : 'Unknown error',
      id
    })

    return {
      success: false,
      error: 'Failed to update welcome wiener. Please try again.',
      data: null
    }
  }
}
