import PublicAuctionsClient from 'app/components/pages/PublicAuctionsClient'
import getAuctions from 'app/lib/actions/getAuctions'

export default async function PublicAuctionsPage() {
  const data = await getAuctions({ status: ['ACTIVE', 'ENDED'] })
  return <PublicAuctionsClient auctions={data} />
}
