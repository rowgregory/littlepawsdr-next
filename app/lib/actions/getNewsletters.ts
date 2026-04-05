'use server'

import prisma from 'prisma/client'

export default async function getNewsletters() {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: newsletters }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
