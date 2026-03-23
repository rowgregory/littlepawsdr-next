import { AdminMerchClient } from 'app/components/pages/AdminMerchClient'
import getProducts from 'app/lib/actions/getProducts'

export default async function AdminMerchPage() {
  const result = await getProducts()
  return <AdminMerchClient products={result?.data} />
}
