import AdminAuctionDrawer from 'app/components/drawers/AdminAuctionDrawer'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
    redirect('/auth/login')
  }

  return (
    <div className="flex bg-bg-light dark:bg-bg-dark">
      <AdminAuctionDrawer />

      <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
    </div>
  )
}
