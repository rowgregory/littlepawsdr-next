import MemberPortalMerchAndWWOrdersClient from 'app/components/pages/MemberPortalMerchAndWWOrdersClient'
import { getMerchAndWWOrders } from 'app/lib/actions/getMerchAndWWOrders'

export default async function MemberPortalMerchAndWWOrdersPage() {
  const result = await getMerchAndWWOrders()
  return <MemberPortalMerchAndWWOrdersClient orders={result?.data} />
}
