import { notFound } from 'next/navigation'
import prisma from 'prisma/client'
import { WelcomeWienerForm } from 'app/components/forms/WelcomeWienerForm'
import { IWelcomeWiener } from 'types/entities/welcome-wiener'

export default async function AdminWelcomeWienersEditPage({ params }: { params: Promise<{ welcomeWienerId: string }> }) {
  const { welcomeWienerId } = await params

  const welcomeWiener = await prisma.welcomeWiener.findUnique({ where: { id: welcomeWienerId } })
  if (!welcomeWiener) notFound()

  return <WelcomeWienerForm welcomeWiener={welcomeWiener as unknown as IWelcomeWiener} />
}
