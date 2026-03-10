import type { User } from 'next-auth'
import prisma from 'prisma/client'
// import { createStripeCustomer } from '../actions/createStripeCustomer'

export async function handleEmailCallback(user: User) {
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (!dbUser) {
    const emailName = user.email!.split('@')[0]

    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        firstName: emailName.charAt(0).toUpperCase() + emailName.slice(1),
        role: 'SUPPORTER'
      },
      include: { accounts: true }
    })
  }

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

  // Create Stripe customer if new user
  // if (!dbUser.stripeCustomerId) {
  //   await createStripeCustomer(dbUser.id, dbUser.email, `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim())
  // }

  return true
}
