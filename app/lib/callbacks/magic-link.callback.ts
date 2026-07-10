import type { User } from 'next-auth'
import prisma from 'prisma/client'
import { pusherSuperuser } from 'app/lib/pusher/pusher.utils'

export async function handleMagicLinkCallback(user: User) {
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (!dbUser) return true

  if (dbUser?.status === 'SUSPENDED') return '/auth/suspended'
  if (dbUser?.status === 'TERMINATED') return '/auth/terminated'

  await pusherSuperuser('user-signed-in', {
    email: dbUser.email,
    name: dbUser.firstName,
    userId: dbUser.id
  })

  return true
}
