import ProductFormClient from 'app/components/forms/ProductForm'
import { getProductById } from 'app/lib/actions/product/getProductById'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getProductById(id)
  return <ProductFormClient product={result.data} />
}
