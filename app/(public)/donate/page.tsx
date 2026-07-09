import PublicDonateClient from 'app/(public)/donate/PublicDonateClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { auth } from 'app/lib/auth'

export default async function PublicDonatePage() {
  const session = await auth()

  const [paymentMethodsResult, userNameResult] = session
    ? await Promise.all([getSavedPaymentMethods(), getUserName()])
    : [{ data: null }, { data: null }]

  return <PublicDonateClient savedCards={paymentMethodsResult.data} userName={userNameResult.data} />
}
