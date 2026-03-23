import MemberPortalClient from 'app/components/pages/MemberPortalClient'
import { getAccountData } from 'app/lib/actions/getAccountData'

export default async function MemberPortalPage() {
  const result = await getAccountData()
  return (
    <MemberPortalClient
      user={result?.data?.user}
      donations={result?.data?.donations}
      subscriptions={result?.data?.subscriptions}
      auctionParticipation={result?.data?.auctionParticipation}
      paymentMethods={result?.data?.paymentMethods}
      adoptionFees={result?.data?.adoptionFees}
      merchAndWWOrders={result?.data?.merchAndWWOrders}
    />
  )
}
