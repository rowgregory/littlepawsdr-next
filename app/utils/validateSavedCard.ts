import { stripeClient } from 'app/lib/stripe-client'
import prisma from 'prisma/client'

export async function validateSavedCard({
  savedCardId,
  userId,
  customerId
}: {
  savedCardId: string
  userId: string
  customerId: string
}): Promise<string> {
  const savedCard = await prisma.paymentMethod.findUnique({
    where: { stripePaymentId: savedCardId },
    select: { stripePaymentId: true, userId: true }
  })

  if (!savedCard || savedCard.userId !== userId) {
    throw new Error('Saved card not found or unauthorized')
  }

  const paymentMethod = await stripeClient.paymentMethods.retrieve(savedCard.stripePaymentId)

  if (paymentMethod.customer !== customerId) {
    throw new Error('Payment method does not belong to this customer')
  }

  return savedCard.stripePaymentId
}
