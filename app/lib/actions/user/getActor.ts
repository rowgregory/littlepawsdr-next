import prisma from 'prisma/client'
import { auth } from '../../auth'

export async function getActor() {
  const session = await auth()
  const user = await prisma.user
    .findUnique({
      where: { email: session?.user?.email ?? '' },
      select: { firstName: true, lastName: true, email: true }
    })
    .catch(() => null)
  return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'unknown'
}
