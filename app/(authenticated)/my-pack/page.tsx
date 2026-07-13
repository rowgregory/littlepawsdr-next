import { getPackMemberData } from 'app/lib/actions/my-pack/getPackMemberData'
import MyPackClient from './MyPackClient'
import { Suspense } from 'react'
import { MyPackSkeleton } from 'app/components/features/my-pack/MyPack'

export const dynamic = 'force-dynamic'

export default async function MyPackPage() {
  const result = await getPackMemberData()

  return (
    <Suspense fallback={<MyPackSkeleton />}>
      <MyPackClient
        user={result?.data?.user}
        donations={result?.data?.donations}
        subscriptions={result?.data?.subscriptions}
        auctionParticipation={result?.data?.auctionParticipation}
        paymentMethods={result?.data?.paymentMethods}
        adoptionFees={result?.data?.adoptionFees}
        multiItemOrders={result?.data?.multiItemOrders}
        auctionPurchases={result.data.auctionPurchases}
      />
    </Suspense>
  )
}
