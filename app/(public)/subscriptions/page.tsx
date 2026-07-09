import PublicSubscriptionsClient from 'app/(public)/subscriptions/PublicSubscriptionsClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { auth } from 'app/lib/auth'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function PublicSubscriptionsPage() {
  const session = await auth()
  const isAuthed = !!session?.user?.id

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
      <PublicSubscriptionsClient
        savedPaymentMethods={paymentMethodsResult?.data ?? []}
        userName={userNameResult?.data ?? null}
      />
    </Suspense>
  )
}
