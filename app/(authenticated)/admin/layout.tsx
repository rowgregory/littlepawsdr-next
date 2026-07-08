import { ReactNode } from 'react'
import { AdminLayoutClient } from './AdminLayoutClient'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminLayoutPage({ children }: { children: ReactNode }) {
  // Runs on the Node runtime — the database session lookup works here.
  const session = await auth()
  const role = session?.user?.role

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (role !== 'ADMIN' && role !== 'SUPERUSER') {
    redirect('/member/portal')
  }
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
