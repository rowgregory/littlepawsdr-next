import AdminLogsClient from 'app/components/pages/AdminLogsClient'
import getLogs from 'app/lib/actions/log/getLogs'

export default async function AdminLogsPage() {
  const result = await getLogs()
  return <AdminLogsClient logs={result.data} />
}
