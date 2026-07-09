import { getDashboardStats } from 'app/lib/actions/_dashboard/getDashboardStats'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const statsResult = await getDashboardStats()
  return <AdminDashboardClient stats={statsResult} />
}
