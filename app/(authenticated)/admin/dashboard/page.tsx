import { getDashboardStats } from 'app/lib/actions/_dashboard/getDashboardStats'
import AdminDashboardClient from './AdminDashboardClient'
import { Suspense } from 'react'
import { AdminDashboardSkeleton } from 'app/components/dashboard/AdminDashboardSkeleton'

export default async function AdminDashboardPage() {
  const statsResult = await getDashboardStats()
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardClient stats={statsResult} />
    </Suspense>
  )
}
