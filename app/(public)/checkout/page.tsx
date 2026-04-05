import { PublicCheckoutClient } from 'app/components/pages/PublicCheckoutClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'
import { getUserAddress } from 'app/lib/actions/getUserAddress'
import { getUserName } from 'app/lib/actions/getUserName'
import { auth } from 'app/lib/auth'

export default async function PublicCheckoutPage() {
  const session = await auth()

  const [savedPaymentMethods, userAddress, userName] = await Promise.all([
    session?.user?.id ? getSavedPaymentMethods() : Promise.resolve({ success: true, data: [] }),
    getUserAddress(),
    getUserName()
  ])

  return <PublicCheckoutClient savedCards={savedPaymentMethods.data ?? []} userAddress={userAddress?.data} userName={userName?.data} />
}
