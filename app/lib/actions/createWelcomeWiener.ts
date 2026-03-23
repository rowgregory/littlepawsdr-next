'use server'

import prisma from 'prisma/client'
import { WelcomeWienerInputs } from 'types/entities/welcome-wiener'
import { createLog } from './createLog'

export const createWelcomeWiener = async (input: WelcomeWienerInputs) => {
  try {
    const welcomeWiener = await prisma.welcomeWiener.create({
      data: {
        displayUrl: input.displayUrl,
        name: input.name,
        bio: input.bio,
        age: input.age,
        isLive: input.isLive ?? false,
        isDogBoost: input.isDogBoost ?? true,
        images: input.images ?? [],
        isPhysicalProduct: input.isPhysicalProduct ?? false,
        associatedProducts: (input.associatedProducts ?? []) as any
      }
    })

    return welcomeWiener
  } catch (error) {
    await createLog('error', 'Failed to create welcome wiener', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to create welcome wiener. Please try again.',
      data: null
    }
  }
}
