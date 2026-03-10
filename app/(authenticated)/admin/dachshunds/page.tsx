import AdminDachshundsClient from 'app/components/pages/AdminDachshundsClient'
import { getDachshundsByStatus } from 'app/lib/actions/getDachshundsByStatus'

export default async function AdminDachshundsPage() {
  const availableResult = await getDachshundsByStatus({ status: 'Available', currentPage: 1, pageLimit: 250 })
  const holdResult = await getDachshundsByStatus({ status: 'Hold', currentPage: 1, pageLimit: 250 })
  const available = availableResult?.data?.data
  const hold = holdResult?.data?.data
  return <AdminDachshundsClient available={available} hold={hold} />
}
