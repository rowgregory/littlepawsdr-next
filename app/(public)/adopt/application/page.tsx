import { AdoptionApplicationClient } from 'app/components/pages/AdoptionApplicationClient'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/getUserName'
import { hasActiveAdoptionFee } from 'app/lib/actions/hasActiveAdoptionFee'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdoptionApplicationPage() {
  const [paymentMethodsResult, userNameResult] = await Promise.all([getSavedPaymentMethods(), getUserName()])
  const session = await auth()

  if (session?.user?.id) {
    const { isActive } = await hasActiveAdoptionFee()
    if (isActive) {
      redirect('/adopt/application/apply')
    }
  }

  return <AdoptionApplicationClient savedCards={paymentMethodsResult.data} userName={userNameResult.data} />
}
