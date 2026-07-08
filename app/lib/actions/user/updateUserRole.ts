'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@prisma/client'
import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from './getActor'

// Roles an admin is allowed to assign through the UI
const ASSIGNABLE_ROLES: Role[] = ['ADMIN', 'SUPPORTER']

export async function updateUserRole(userId: string, role: Role) {
  const actor = await getActor()
  if (actor === 'unknown') {
    return { success: false, error: 'Unauthorized', data: null }
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    return { success: false, error: 'Invalid role', data: null }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true }
    })

    await createLog('info', 'User role updated', {
      location: ['updateUserRole.ts'],
      userId,
      newRole: role,
      actor
    })

    revalidatePath(`/admin/users/${userId}`)
    revalidatePath('/admin/users')

    return { success: true, error: null, data: updated }
  } catch (error) {
    await createLog('error', 'Failed to update user role', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      attemptedRole: role
    })

    return { success: false, error: 'Failed to update role. Please try again.', data: null }
  }
}
