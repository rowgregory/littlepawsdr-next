import MemberPortalSubscriptionDetailsClient from 'app/components/pages/MemberPortalSubscriptionDetailsClient'
import { getSubscriptionById } from 'app/lib/actions/getSubscriptionById'

export default async function MemberPortalSubscriptionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getSubscriptionById(id)
  return <MemberPortalSubscriptionDetailsClient subscription={result?.data} />
}
