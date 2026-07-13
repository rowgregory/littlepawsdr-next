import { WelcomeWienerForm } from 'app/components/admin/welcome-wieners/WelcomeWienerForm'
import { notFound } from 'next/navigation'
import prisma from 'prisma/client'
import { IWelcomeWiener } from 'types/_welcome-wiener'

export default async function AdminWelcomeWienersEditPage({
  params
}: {
  params: Promise<{ welcomeWienerId: string }>
}) {
  const { welcomeWienerId } = await params

  const welcomeWiener = await prisma.welcomeWiener.findUnique({ where: { id: welcomeWienerId } })
  if (!welcomeWiener) notFound()

  return <WelcomeWienerForm welcomeWiener={welcomeWiener as unknown as IWelcomeWiener} />
}
