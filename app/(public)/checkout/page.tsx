import { PublicCheckoutClient } from 'app/components/pages/PublicCheckoutClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'
import { getUserAddress } from 'app/lib/actions/getUserAddress'
import { auth } from 'app/lib/auth'

export default async function PublicCheckoutPage() {
  const session = await auth()

  const savedPaymentMethods = session?.user?.id ? await getSavedPaymentMethods() : { success: true, data: [] }
  const result = await getUserAddress()

  return <PublicCheckoutClient savedCards={savedPaymentMethods.data ?? []} userAddress={result?.data} />
}
