import AdminUsersClient from 'app/(authenticated)/admin/users/AdminUsersClient'
import getUsers from 'app/lib/actions/admin/user/getUsers'

export default async function AdminUsersPage() {
  const result = await getUsers()
  return <AdminUsersClient users={result.data} />
}
