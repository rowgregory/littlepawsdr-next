'use server'

import { auth } from 'app/lib/auth'
import prisma from 'prisma/client'
import { createLog } from '../log/createLog'

export async function markWelcomeSeen() {
  const session = await auth()
  if (!session?.user?.id) return { success: false }

  await prisma.user
    .update({
      where: { id: session.user.id },
      data: { hasSeenWelcome: true }
    })
    .catch((err) =>
      createLog('error', 'Failed to mark welcome seen', {
        error: err instanceof Error ? err.message : 'Unknown error',
        userId: session.user.id
      })
    )

  return { success: true }
}
