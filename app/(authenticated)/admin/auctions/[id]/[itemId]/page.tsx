import AdminAuctionItemClient from 'app/components/pages/AdminAuctionItemClient'
import { getAuctionItemById } from 'app/lib/actions/getAuctionItemById'

export default async function AdminAuctionItemPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params
  const data = await getAuctionItemById(itemId)
  return <AdminAuctionItemClient auctionItem={data?.auctionItem} />
}
