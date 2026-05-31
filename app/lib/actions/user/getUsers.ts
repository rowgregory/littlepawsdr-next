import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { auth } from 'app/lib/auth'

export default async function getUsers() {
  try {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPERUSER'].includes(session.user.role)) {
      return { success: false, error: 'Unauthorized.', data: null }
    }

    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return { success: true, data: users, error: null }
  } catch (error) {
    await createLog('error', 'Failed to get users', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to get users. Please try again.', data: null }
  }
}
