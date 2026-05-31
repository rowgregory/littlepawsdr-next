import { stripeClient } from 'app/lib/stripe-client'
import prisma from 'prisma/client'

export async function getOrCreateStripeCustomer({ userId, email }: { userId?: string; email: string }): Promise<string> {
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })
    if (user?.stripeCustomerId) return user.stripeCustomerId
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { stripeCustomerId: true }
    })
    if (existingUser?.stripeCustomerId) return existingUser.stripeCustomerId

    const stripeCustomers = await stripeClient.customers.search({
      query: `email:"${email}"`,
      limit: 1
    })
    if (stripeCustomers.data.length > 0) return stripeCustomers.data[0].id
  }

  const customer = await stripeClient.customers.create({
    email,
    metadata: {
      userId: userId ?? 'guest',
      createdAt: new Date().toISOString()
    }
  })
  return customer.id
}
