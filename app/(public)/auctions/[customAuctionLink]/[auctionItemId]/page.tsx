import PublicAuctionItemClient from 'app/components/pages/PublicAuctionItemClient'
import { getAuctionItemById } from 'app/lib/actions/getAuctionItemById'

export default async function PublicAuctionItemPage({ params }: { params: Promise<{ auctionItemId: string }> }) {
  const { auctionItemId } = await params
  const data = await getAuctionItemById(auctionItemId)
  return <PublicAuctionItemClient item={data?.auctionItem} />
}
