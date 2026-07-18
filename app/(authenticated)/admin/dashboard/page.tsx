import { redirect } from 'next/navigation'
import { auth } from 'app/lib/auth'
import AdminDashboardClient from './AdminDashboardClient'
import { getDashboardData } from 'app/lib/actions/admin/dashboard/getDashboardData'

export default async function AdminDashboardPage() {
  const session = await auth()
  const role = session?.user?.role

  if (role !== 'ADMIN' && role !== 'SUPER_USER') {
    redirect('/my-pack')
  }

  const stats = await getDashboardData()

  return <AdminDashboardClient stats={stats} />
}
