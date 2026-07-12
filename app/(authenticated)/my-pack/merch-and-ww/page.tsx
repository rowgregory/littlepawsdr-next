import { getMerchAndWWOrders } from 'app/lib/actions/product/getMerchAndWWOrders'
import MyPackMerchAndWWOrdersClient from './MyPackMerchAndWWOrdersClient'

export default async function MyPacklMerchAndWWOrdersPage() {
  const result = await getMerchAndWWOrders()
  return <MyPackMerchAndWWOrdersClient orders={result?.data} />
}
