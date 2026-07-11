import { getAccountData } from 'app/lib/actions/_profile/getAccountData'
import MemberPortalClient from './MemberPortalClient'
import { Suspense } from 'react'
import { MemberPortalSkeleton } from 'app/components/member/portal/MemberPortalSkeleton'

export const dynamic = 'force-dynamic'

export default async function MemberPortalPage() {
  const result = await getAccountData()

  return (
    <Suspense fallback={<MemberPortalSkeleton />}>
      <MemberPortalClient
        user={result?.data?.user}
        donations={result?.data?.donations}
        subscriptions={result?.data?.subscriptions}
        auctionParticipation={result?.data?.auctionParticipation}
        paymentMethods={result?.data?.paymentMethods}
        adoptionFees={result?.data?.adoptionFees}
        merchAndWWOrders={result?.data?.merchAndWWOrders}
        showWelcome={!result?.data?.user?.hasSeenWelcome}
        auctionPurchases={result.data.auctionPurchases}
      />
    </Suspense>
  )
}
