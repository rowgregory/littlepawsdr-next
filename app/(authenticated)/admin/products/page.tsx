import { AdminProductsClient } from 'app/(authenticated)/admin/products/AdminProductsClient'
import getProducts from 'app/lib/actions/product/getProducts'

export default async function AdminProductsPage() {
  const result = await getProducts()
  return <AdminProductsClient products={result.data} />
}
