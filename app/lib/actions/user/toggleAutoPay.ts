'use server'

import prisma from 'prisma/client'
import { auth } from 'app/lib/auth'
import { revalidatePath } from 'next/cache'

export async function toggleAutoPay() {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { autoPay: true }
    })

    if (!user) return { success: false, error: 'User not found' }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { autoPay: !user.autoPay }
    })

    revalidatePath(' /my-pack')
    return { success: true, autoPay: !user.autoPay }
  } catch (error) {
    return { success: false, error: 'Failed to update setting' }
  }
}
