import { getActiveAuctionItems } from 'app/lib/actions/auction/getActiveAuctionItems'
import { getAuctionItemById } from 'app/lib/actions/auction/getAuctionItemById'
import PublicAuctionItemClient from './PublicAuctionItemClient'

export default async function PublicAuctionItemPage({ params }: { params: Promise<{ auctionItemId: string }> }) {
  const { auctionItemId } = await params
  const data = await getAuctionItemById(auctionItemId)
  const auctionId = data?.auctionItem?.auction?.id
  const itemsResult = await getActiveAuctionItems(auctionId)
  return <PublicAuctionItemClient item={data?.auctionItem} auctionItems={itemsResult?.data ?? []} />
}
