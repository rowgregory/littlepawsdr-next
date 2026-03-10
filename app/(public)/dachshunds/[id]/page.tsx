import DachshundDetailClient from 'app/components/pages/DachshundDetailClient'
import { getDachshundById } from 'app/lib/actions/getDachshundById'
import { notFound } from 'next/navigation'

export default async function DachshundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getDachshundById(id)
  if (!result.success || !result.data) notFound()

  return <DachshundDetailClient data={result?.data?.data[0]} />
}
