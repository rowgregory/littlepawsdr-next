import AdminAuctionsClient from 'app/components/pages/AdminAuctionsClient'
import getAuctions from 'app/lib/actions/getAuctions'

export default async function AdminAuctionsPage() {
  const auctions = await getAuctions({ status: ['DRAFT', 'ACTIVE', 'ENDED'] })
  return <AdminAuctionsClient auctions={auctions} />
}
