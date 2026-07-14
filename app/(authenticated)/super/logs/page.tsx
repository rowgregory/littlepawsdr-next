import getLogs from 'app/lib/actions/admin/log/getLogs'
import AdminLogsClient from './AdminLogsClient'

export const dynamic = 'force-dynamic'

export default async function AdminLogsPage() {
  const result = await getLogs()
  return <AdminLogsClient logs={result.data} />
}
