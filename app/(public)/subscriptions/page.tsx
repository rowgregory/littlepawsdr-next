import PublicSubscriptionsClient from 'app/components/pages/PublicSubscriptionsClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/getUserName'

export default async function PublicSubscriptionsPage() {
  const [paymentMethodsResult, userNameResult] = await Promise.all([getSavedPaymentMethods(), getUserName()])

  return <PublicSubscriptionsClient savedPaymentMethods={paymentMethodsResult?.data ?? []} userName={userNameResult?.data ?? null} />
}
