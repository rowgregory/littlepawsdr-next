import AdminAuctionClient from 'app/components/pages/AdminAuctionClient'
import { getAuctionById } from 'app/lib/actions/getAuctionById'

export default async function AdminAuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getAuctionById(id)
  return <AdminAuctionClient auction={result?.data} />
}
