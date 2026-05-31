import AdminOrdersClient from 'app/components/pages/AdminOrdersClient'
import { getOrders } from 'app/lib/actions/order/getOrders'

export default async function AdminOrdersPage() {
  const result = await getOrders()
  return <AdminOrdersClient orders={result?.data} />
}
