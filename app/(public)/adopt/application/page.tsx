import { AdoptionApplicationClient } from 'app/(public)/adopt/application/AdoptionApplicationClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function AdoptionApplicationPage() {
  const session = await auth()

  if (session?.user?.id) {
    const { isActive } = await hasActiveAdoptionFee()
    if (isActive) redirect('/adopt/application/apply')
  }

  const [paymentMethodsResult, userNameResult] = await Promise.all([getSavedPaymentMethods(), getUserName()])

  return (
    <Suspense fallback={<div />}>
      <AdoptionApplicationClient savedCards={paymentMethodsResult.data} userName={userNameResult.data} />
    </Suspense>
  )
}
