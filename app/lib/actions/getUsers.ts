import prisma from 'prisma/client'
import { createLog } from './createLog'

export default async function getUsers() {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return users
  } catch (error) {
    await createLog('error', 'Failed to get users', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return []
  }
}
