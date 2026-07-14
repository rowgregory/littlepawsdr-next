import prisma from 'prisma/client'
import { createLog } from '../../log/createLog'
import { AdminFailure, requireAdmin } from '../../auth/requireAdmin'
import { getErrorMessage } from 'app/utils/_error.utils'

export default async function getUsers() {
  const gate = await requireAdmin()
  if (!gate.ok) return { success: false, error: (gate as AdminFailure).error, data: null }

  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return { success: true, data: users, error: null }
  } catch (error) {
    await createLog('error', 'Failed to get users', {
      error: getErrorMessage(error)
    })
    return { success: false, error: 'Failed to get users. Please try again.', data: null }
  }
}
