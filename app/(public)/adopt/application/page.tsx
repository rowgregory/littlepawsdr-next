import { AdoptionApplicationClient } from 'app/components/pages/AdoptionApplicationClient'
import { hasActiveAdoptionFee } from 'app/lib/actions/adoption-fee/hasActiveAdoptionFee'
import { getSavedPaymentMethods } from 'app/lib/actions/stripe/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/user/getUserName'
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
