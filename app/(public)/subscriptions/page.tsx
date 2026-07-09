import PublicSubscriptionsClient from 'app/(public)/subscriptions/PublicSubscriptionsClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { Suspense } from 'react'

export default async function PublicSubscriptionsPage() {
  const [paymentMethodsResult, userNameResult] = await Promise.all([getSavedPaymentMethods(), getUserName()])
  return (
    <Suspense fallback={<div />}>
      <PublicSubscriptionsClient
        savedPaymentMethods={paymentMethodsResult?.data ?? []}
        userName={userNameResult?.data ?? null}
      />
    </Suspense>
  )
}
