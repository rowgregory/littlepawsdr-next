import getAuctions from 'app/lib/actions/auction/getAuctions'
import PublicAuctionsClient from './PublicAuctionsClient'

export default async function PublicAuctionsPage() {
  const data = await getAuctions({ status: ['ACTIVE', 'ENDED'] })
  return <PublicAuctionsClient auctions={data} />
}
