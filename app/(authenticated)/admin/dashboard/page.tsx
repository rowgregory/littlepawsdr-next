import AdminDashboardClient from './AdminDashboardClient'
import { Suspense } from 'react'
import { AdminDashboardSkeleton } from 'app/components/admin/dashboard/AdminDashboardSkeleton'
import { getDashboardData } from 'app/lib/actions/admin/dashboard/getDashboardData'

export default async function AdminDashboardPage() {
  const statsResult = await getDashboardData()
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardClient stats={statsResult} />
    </Suspense>
  )
}
