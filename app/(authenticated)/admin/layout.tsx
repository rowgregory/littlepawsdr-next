import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'
// import AdminSidebar from './sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
    redirect('/auth/signin')
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-bg-light dark:bg-bg-dark">
      {/* <AdminSidebar /> */}
      <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
    </div>
  )
}
