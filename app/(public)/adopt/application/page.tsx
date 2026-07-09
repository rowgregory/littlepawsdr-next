import { AdoptionApplicationClient } from 'app/(public)/adopt/application/AdoptionApplicationClient'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'
import { getSavedPaymentMethods } from 'app/lib/actions/stripe/getSavedPaymentMethods'
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
