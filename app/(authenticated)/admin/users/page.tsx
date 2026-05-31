import AdminUsersClient from 'app/components/pages/AdminUsersClient'
import getUsers from 'app/lib/actions/user/getUsers'

export default async function AdminUsersPage() {
  const data = await getUsers()
  return <AdminUsersClient users={data} />
}
