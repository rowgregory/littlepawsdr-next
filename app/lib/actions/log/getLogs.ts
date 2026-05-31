'use server'

import prisma from 'prisma/client'

export default async function getLogs() {
  try {
    const logs = await prisma.log.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: logs }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
