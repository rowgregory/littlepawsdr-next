import AdminAuctionsClient from 'app/(authenticated)/admin/auctions/AdminAuctionsClient'
import getAuctions from 'app/lib/actions/auction/getAuctions'

export default async function AdminAuctionsPage() {
  const auctions = await getAuctions({ status: ['DRAFT', 'ACTIVE', 'ENDED'] })
  return <AdminAuctionsClient auctions={auctions} />
}
