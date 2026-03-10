import MerchClient from 'app/components/pages/MerchClient'
import getProducts from 'app/lib/actions/getProducts'

export default async function MerchPage() {
  const data = await getProducts()
  return <MerchClient products={data} />
}
