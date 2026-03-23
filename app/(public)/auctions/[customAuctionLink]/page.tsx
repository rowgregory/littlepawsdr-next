import PublicAuctionClient from 'app/components/pages/PublicAuctionClient'
import { getAuctionByCustomAuctionLink } from 'app/lib/actions/getAuctionByCustomAuctionLink'
import { notFound } from 'next/navigation'

export default async function PublicAuctionPage({ params }: { params: Promise<{ customAuctionLink: string }> }) {
  const { customAuctionLink } = await params
  const result = await getAuctionByCustomAuctionLink(customAuctionLink)
  if (!result.success || !result.data) notFound()
  return <PublicAuctionClient auction={result.data} />
}
