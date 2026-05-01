import type { User } from 'next-auth'
import prisma from 'prisma/client'
import { createStripeCustomer } from '../actions/createStripeCustomer'
import { pusherSuperuser } from 'app/utils/pusherTrigger'

export async function handleEmailCallback(user: User) {
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (dbUser?.status === 'SUSPENDED') return '/auth/suspended'
  if (dbUser?.status === 'TERMINATED') return '/auth/terminated'

  if (!dbUser) {
    const emailName = user.email!.split('@')[0]

    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        firstName: emailName.charAt(0).toUpperCase() + emailName.slice(1),
        role: 'SUPPORTER',
        status: 'ACTIVE'
      },
      include: { accounts: true }
    })
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { lastLoginAt: new Date() }
  })

  const existing = await prisma.account.findFirst({
    where: { userId: dbUser.id, provider: 'email' }
  })

  if (!existing) {
    await prisma.account.create({
      data: {
        userId: dbUser.id,
        type: 'email',
        provider: 'email',
        providerAccountId: user.email!
      }
    })
  }

  if (!dbUser.stripeCustomerId) {
    await createStripeCustomer(dbUser.id, dbUser.email, `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim())
  }

  await pusherSuperuser('user-signed-in', {
    email: dbUser.email,
    name: dbUser.firstName,
    userId: dbUser.id
  })

  return true
}
