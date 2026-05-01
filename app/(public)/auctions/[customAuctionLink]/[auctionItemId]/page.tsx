import PublicAuctionItemClient from 'app/components/pages/PublicAuctionItemClient'
import { getActiveAuctionItems } from 'app/lib/actions/getActiveAuctionItems'
import { getAuctionItemById } from 'app/lib/actions/getAuctionItemById'

export default async function PublicAuctionItemPage({ params }: { params: Promise<{ auctionItemId: string }> }) {
  const { auctionItemId } = await params

  const data = await getAuctionItemById(auctionItemId)
  const auctionId = data?.auctionItem?.auction?.id

  const [itemsResult] = await Promise.all([getActiveAuctionItems(auctionId)])

  return <PublicAuctionItemClient item={data?.auctionItem} auctionItems={itemsResult?.data ?? []} />
}
