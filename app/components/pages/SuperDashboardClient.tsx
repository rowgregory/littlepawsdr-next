'use client'

import { useState } from 'react'
import { RefreshCw, Shield, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ServiceHealth } from 'app/lib/actions/getServiceHealth'
import { CronJob } from 'app/lib/actions/super-user/getCronJobs'
import { PulseStat } from 'app/lib/actions/super-user/getPulseStats'
import { AdminUser } from 'app/lib/actions/super-user/getAdminUsers'
import { Badge, LogEntry } from './DashboardClient'
import { LiveActionsFeed } from '../super/LiveActionsFeed'
import { ServiceStrip } from '../super/ServiceHealthStrip'
import { CronStrip } from '../super/CronStrip'
import { PulseColumn } from '../super/PulseColumn'
import { RightColumn } from '../super/RightColumn'
import { ManagedUser } from 'app/lib/actions/super-user/getManagedUsers'
import { Auction } from '@prisma/client'

interface Props {
  services: ServiceHealth[]
  cronJobs: CronJob[]
  pulseStats: PulseStat[]
  adminUsers: AdminUser[]
  auditLogs: LogEntry[]
  managedUsers: ManagedUser[]
  auction: any
}

export default function SuperDashboardClient({ services, cronJobs, pulseStats, adminUsers, auditLogs, managedUsers, auction }: Props) {
  const [refreshing, setRefreshing] = useState(false)

  const hasIssues = pulseStats?.some((s) => s.signal === 'red')
  const hasWarnings = !hasIssues && pulseStats?.some((s) => s.signal === 'yellow')

  return (
    <div className="h-dvh flex flex-col bg-bg-light dark:bg-bg-dark overflow-hidden">
      {/* Topbar */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark shrink-0 flex-wrap gap-2 z-50">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-quicksand font-bold text-[12px] text-text-light dark:text-text-dark leading-tight">Little Paws</span>
              <Badge variant="info">
                <Shield size={8} className="inline mr-0.5" aria-hidden="true" />
                Super
              </Badge>
            </div>
            <p className="font-mono text-[8px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">System Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2 py-1 border font-mono text-[8px] tracking-[0.12em] uppercase ${
              hasIssues ? 'border-red-500/30 text-red-500' : hasWarnings ? 'border-amber-500/30 text-amber-500' : 'border-green-500/30 text-green-500'
            }`}
          >
            <span className={`w-1 h-1 rounded-full animate-pulse ${hasIssues ? 'bg-red-500' : hasWarnings ? 'bg-amber-500' : 'bg-green-500'}`} />
            {hasIssues ? 'Issues' : hasWarnings ? 'Warnings' : 'All Systems Go'}
          </div>
          <button
            onClick={() => {
              setRefreshing(true)
              setTimeout(() => setRefreshing(false), 1200)
            }}
            className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[8px] tracking-[0.12em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none"
          >
            <RefreshCw size={9} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </button>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[8px] tracking-[0.12em] uppercase border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none"
          >
            <LayoutDashboard size={9} aria-hidden="true" />
            Admin
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="inline-flex items-center gap-1 px-2 py-1 font-mono text-[8px] tracking-[0.12em] uppercase border border-red-500/40 text-red-500 hover:bg-red-500/5 transition-colors focus:outline-none"
          >
            <LogOut size={9} aria-hidden="true" />
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <PulseColumn stats={pulseStats} />
          <LiveActionsFeed />
          <RightColumn adminUsers={adminUsers} managedUsers={managedUsers} auditLogs={auditLogs} />
        </div>
        <ServiceStrip services={services} />
        <CronStrip initialJobs={cronJobs} />
      </main>
    </div>
  )
}
