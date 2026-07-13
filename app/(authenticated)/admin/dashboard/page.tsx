import { getDashboardStats } from 'app/lib/actions/_dashboard/getDashboardStats'
import AdminDashboardClient from './AdminDashboardClient'
import { Suspense } from 'react'
import { AdminDashboardSkeleton } from 'app/components/dashboard/AdminDashboardSkeleton'
import { getPendingShipments } from 'app/lib/actions/order/getPendingShipments'

export default async function AdminDashboardPage() {
  const [statsResult, pendingShipments] = await Promise.all([getDashboardStats(), getPendingShipments()])

  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardClient stats={statsResult} pendingShipments={pendingShipments.data} />
    </Suspense>
  )
}
