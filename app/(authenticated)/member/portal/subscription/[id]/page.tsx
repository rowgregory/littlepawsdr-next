import MemberPortalSubscriptionDetailsClient from 'app/(authenticated)/member/portal/subscription/[id]/MemberPortalSubscriptionDetailsClient'
import { getSubscriptionById } from 'app/lib/actions/order/getSubscriptionById'

export default async function MemberPortalSubscriptionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getSubscriptionById(id)
  return <MemberPortalSubscriptionDetailsClient subscription={result?.data} />
}
