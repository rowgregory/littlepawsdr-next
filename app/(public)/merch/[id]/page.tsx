import { notFound } from 'next/navigation'
import prisma from 'prisma/client'
import PublicMerchItemDetailsClient from './PublicMerchItemDetailsClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, select: { name: true, description: true } })
  if (!product) return { title: 'Merch | Little Paws Dachshund Rescue' }
  return {
    title: `${product.name} | Little Paws Dachshund Rescue`,
    description: product.description?.slice(0, 160)
  }
}

export default async function PublicMerchItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  // Decimal → number before crossing to the client
  const serialized = {
    ...product,
    price: Number(product.price),
    shippingPrice: Number(product.shippingPrice),
    sizes: (product.sizes as { size: string; quantity: number }[] | null) ?? []
  }

  return <PublicMerchItemDetailsClient product={serialized} />
}
