import AdminRootClient from 'app/components/pages/AdminRootClient'
import { ReactNode } from 'react'

export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminRootClient>{children}</AdminRootClient>
}
