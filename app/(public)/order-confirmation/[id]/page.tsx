import OrderConfirmationClient from 'app/components/pages/OrderConfirmationClient'
import { getOrderById } from 'app/lib/actions/getOrderById'

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getOrderById(id)
  return <OrderConfirmationClient order={result?.data} />
}
