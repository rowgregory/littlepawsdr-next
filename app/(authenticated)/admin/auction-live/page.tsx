import AdminAuctionLiveClient from 'app/components/pages/AdminAuctionLiveClient'
import getActiveAuctionForSuperuser from 'app/lib/actions/getActiveAuctionForSuperUser'

export default async function AdminAuctionLivePage() {
  const result = await getActiveAuctionForSuperuser()

  return <AdminAuctionLiveClient auction={result?.data} />
}
