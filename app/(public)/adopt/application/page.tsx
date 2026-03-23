import { AdoptionApplicationClient } from 'app/components/pages/AdoptionApplicationClient'
import { hasActiveAdoptionFee } from 'app/lib/actions/hasActiveAdoptionFee'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdoptionApplicationPage() {
  const session = await auth()

  if (session?.user?.id) {
    const { isActive } = await hasActiveAdoptionFee()
    if (isActive) {
      redirect('/adopt/application/apply')
    }
  }

  return <AdoptionApplicationClient />
}
