import AdminAuctionLiveClient from 'app/components/pages/AdminAuctionLiveClient'
import getActiveAuctionForSuperuser from 'app/lib/actions/super-user/getActiveAuctionForSuperUser'

export default async function AdminAuctionLivePage() {
  const result = await getActiveAuctionForSuperuser()

  return <AdminAuctionLiveClient auction={result?.data} />
}
