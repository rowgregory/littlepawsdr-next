import AdminUsersClient from 'app/components/pages/AdminUsersClient'
import getUsers from 'app/lib/actions/user/getUsers'

export default async function AdminUsersPage() {
  const result = await getUsers()
  return <AdminUsersClient users={result.data} />
}
