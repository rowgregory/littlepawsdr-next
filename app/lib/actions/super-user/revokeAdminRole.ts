'use server'

import { auth } from 'app/lib/auth'
import prisma from 'prisma/client'
import { createLog } from '../createLog'

export async function revokeAdminRole(userId: string) {
  const session = await auth()
  const grantor = session?.user?.name ?? session?.user?.email ?? 'Unknown'

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true }
  })

  if (!existing) {
    return { success: false, error: 'User not found' }
  }

  if (existing.role === 'SUPPORTER') {
    return { success: false, error: `${existing.email} doesn't have an admin role to revoke` }
  }

  if (existing.role === 'SUPERUSER') {
    return { success: false, error: 'Cannot revoke a superuser role' }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'SUPPORTER' }
  })

  await createLog('warn', `[SUPER] ${grantor} revoked admin role from ${existing.email}`, {
    targetUserId: userId,
    targetEmail: existing.email,
    previousRole: existing.role,
    grantedBy: grantor
  })

  return { success: true }
}
