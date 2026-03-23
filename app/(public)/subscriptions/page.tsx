import PublicSubscriptionsClient from 'app/components/pages/PublicSubscriptionsClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'

export default async function PublicSubscriptionsPage() {
  const result = await getSavedPaymentMethods()
  return <PublicSubscriptionsClient savedPaymentMethods={result?.data} />
}
