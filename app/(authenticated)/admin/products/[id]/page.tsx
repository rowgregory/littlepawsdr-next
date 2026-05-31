import ProductFormClient from 'app/components/pages/ProductFormClient'
import { getProductById } from 'app/lib/actions/product/getProductById'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getProductById(id)
  return <ProductFormClient product={result.data} />
}
