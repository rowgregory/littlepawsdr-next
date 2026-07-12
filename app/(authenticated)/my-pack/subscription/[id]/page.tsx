import MyPackSubscriptionClient from 'app/(authenticated)/my-pack/subscription/[id]/MyPackSubscriptionClient'
import { getSubscriptionById } from 'app/lib/actions/order/getSubscriptionById'

export default async function MyPackSubscriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getSubscriptionById(id)
  return <MyPackSubscriptionClient subscription={result?.data} />
}
