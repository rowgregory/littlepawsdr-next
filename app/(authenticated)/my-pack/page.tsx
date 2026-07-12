import { getAccountData } from 'app/lib/actions/_profile/getAccountData'
import MyPackClient from './MyPackClient'
import { Suspense } from 'react'
import { MyPackSkeleton } from 'app/components/my-pack/MyPack'

export const dynamic = 'force-dynamic'

export default async function MyPackPage() {
  const result = await getAccountData()

  return (
    <Suspense fallback={<MyPackSkeleton />}>
      <MyPackClient
        user={result?.data?.user}
        donations={result?.data?.donations}
        subscriptions={result?.data?.subscriptions}
        auctionParticipation={result?.data?.auctionParticipation}
        paymentMethods={result?.data?.paymentMethods}
        adoptionFees={result?.data?.adoptionFees}
        merchAndWWOrders={result?.data?.merchAndWWOrders}
        auctionPurchases={result.data.auctionPurchases}
      />
    </Suspense>
  )
}
