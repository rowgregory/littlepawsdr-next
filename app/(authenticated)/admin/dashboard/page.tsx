import { getDashboardStats } from 'app/lib/actions/_dashboard/getDashboardStats'
import { getPendingShipments } from 'app/lib/actions/order/getPendingShipments'
import AdminDashboardClient from './AdminDashboardClient'
import { getDachshundsPreview } from 'app/lib/actions/rescue-groups/getDachshundsPreview'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [statsResult, shipmentsResult, dachshundsResult] = await Promise.all([
    getDashboardStats(),
    getPendingShipments(),
    getDachshundsPreview()
  ])

  return (
    <AdminDashboardClient
      stats={statsResult}
      pendingShipments={shipmentsResult.success ? shipmentsResult.data : []}
      dachshunds={dachshundsResult.success ? dachshundsResult.data : []}
    />
  )
}
