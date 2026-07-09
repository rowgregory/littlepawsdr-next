import MemberPortalMerchAndWWOrdersClient from 'app/(authenticated)/member/portal/merch-and-ww/MemberPortalMerchAndWWOrdersClient'
import { getMerchAndWWOrders } from 'app/lib/actions/product/getMerchAndWWOrders'

export default async function MemberPortalMerchAndWWOrdersPage() {
  const result = await getMerchAndWWOrders()
  return <MemberPortalMerchAndWWOrdersClient orders={result?.data} />
}
