import AdminAuctionDrawer from 'app/components/drawers/AdminAuctionDrawer'
import AdminSidebar from './sidebar'
import { ReactNode } from 'react'

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg-light dark:bg-bg-dark">
      <AdminAuctionDrawer />
      <AdminSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
