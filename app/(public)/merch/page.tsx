import PublicMerchClient from 'app/components/pages/PublicMerchClient'
import { getLiveProducts } from 'app/lib/actions/product/getLiveProducts'

export default async function MerchPage() {
  const result = await getLiveProducts()
  return <PublicMerchClient products={result?.data} />
}
