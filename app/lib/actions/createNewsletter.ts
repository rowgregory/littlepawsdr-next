'use server'

import prisma from 'prisma/client'

export default async function createNewsletter(email: string) {
  try {
    const newsletter = await prisma.newsletter.create({
      data: { newsletterEmail: email }
    })

    return { success: true, data: newsletter }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
