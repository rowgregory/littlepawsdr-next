'use server'

import { auth } from 'app/lib/auth'
import prisma from 'prisma/client'

export async function markWelcomeSeen() {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.user.update({
    where: { id: session.user.id },
    data: { hasSeenWelcome: true }
  })
}
