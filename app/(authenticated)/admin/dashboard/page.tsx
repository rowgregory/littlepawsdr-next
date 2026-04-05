import AdminDashboardClient from 'app/components/pages/AdminDashboardClient'
import getAdoptionApplicationBypassCode from 'app/lib/actions/getAdoptionApplicationBypassCode'

export default async function AdminDashboardPage() {
  const result = await getAdoptionApplicationBypassCode()
  return <AdminDashboardClient bypassCode={result.data?.bypassCode} nextRotationAt={result.data?.nextRotationAt} />
}
