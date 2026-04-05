import PublicDonateClient from 'app/components/pages/PublicDonateClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/getUserName'
import { auth } from 'app/lib/auth'

export default async function PublicDonatePage() {
  const session = await auth()

  const [paymentMethodsResult, userNameResult] = session
    ? await Promise.all([getSavedPaymentMethods(), getUserName()])
    : [{ data: null }, { data: null }]

  return <PublicDonateClient savedCards={paymentMethodsResult.data} userName={userNameResult.data} />
}
