import { AdoptionApplicationClient } from 'app/(public)/adopt/application/AdoptionApplicationClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function AdoptionApplicationPage() {
  const session = await auth()
  const isAuthed = !!session?.user?.id

  // Signed-in users with an active fee skip straight to the application.
  if (isAuthed) {
    const { isActive } = await hasActiveAdoptionFee()
    if (isActive) redirect('/adopt/application/apply')
  }

  const [paymentMethodsResult, userNameResult] = isAuthed
    ? await Promise.all([
        getSavedPaymentMethods().catch(() => ({ success: false, data: [] })),
        getUserName().catch(() => ({ success: false, data: null }))
      ])
    : [
        { success: true, data: [] },
        { success: true, data: null }
      ]

  return (
    <Suspense fallback={<div />}>
      <AdoptionApplicationClient savedCards={paymentMethodsResult.data ?? []} userName={userNameResult.data ?? null} />
    </Suspense>
  )
}
