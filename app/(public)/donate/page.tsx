import PublicDonateClient from 'app/components/pages/PublicDonateClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'

export default async function PublicDonatePage() {
  const result = await getSavedPaymentMethods()
  return <PublicDonateClient savedCards={result.data} />
}
