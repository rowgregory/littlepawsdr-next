'use server'

import prisma from 'prisma/client'
import { getErrorMessage } from 'app/utils/_error.utils'
import { createLog } from '../../log/createLog'
import { migrateMongoUser } from '../../migrate/migrateMongoUser'
import { requireSuper, SuperFailure } from '../../auth/requireSuper'

export async function retriggerMigration(userId: string) {
  const gate = await requireSuper()
  if (!gate.ok) return { success: false, error: (gate as SuperFailure).error, data: null }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, hasMigrated: true }
    })

    if (!user) {
      return { success: false, error: 'User not found', data: null }
    }

    if (user.hasMigrated) {
      return { success: false, error: 'This user has already migrated successfully', data: null }
    }

    // This is a direct server action call, awaited fully — no serverless
    // early-teardown risk like the fire-and-forget signIn event has.
    await migrateMongoUser(user.email, user.id)

    const refreshed = await prisma.user.findUnique({
      where: { id: userId },
      select: { hasMigrated: true }
    })

    await createLog('info', 'Migration manually re-triggered', {
      userId,
      email: user.email,
      triggeredBy: gate.userId,
      succeeded: refreshed?.hasMigrated ?? false
    })

    if (!refreshed?.hasMigrated) {
      return {
        success: false,
        error: 'Migration ran but did not complete. Check logs for the underlying error.',
        data: null
      }
    }

    return { success: true, data: { hasMigrated: true }, error: null }
  } catch (error) {
    await createLog('error', 'Manual migration re-trigger failed', {
      userId,
      error: getErrorMessage(error)
    })
    return {
      success: false,
      error: 'Failed to re-trigger migration. Check the logs for details.',
      data: null
    }
  }
}
