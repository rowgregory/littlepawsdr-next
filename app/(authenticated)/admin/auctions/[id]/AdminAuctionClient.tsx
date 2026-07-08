'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { IAuction, Tab } from 'types/entities/auction'
import { formatDate } from 'app/utils/date.utils'
import { AdminAuctionOverviewTab } from 'app/components/admin/auction/AdminAuctionOverviewTab'
import { AdminAuctionItemsTab } from 'app/components/admin/auction/AdminAuctionItemsTab'
import { AdminAuctionBiddersTab } from 'app/components/admin/auction/AdminAuctionBiddersTab'
import { AdminAuctionWinningBiddersTab } from 'app/components/admin/auction/AdminAuctionWinningBiddersTab'
import { AdminAuctionSettingsTab } from 'app/components/admin/auction/AdminAuctionSettingsTab'
import { LayoutDashboard } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getAuctionStatusConfig } from 'app/utils/auction.utils'
import { TABS } from 'app/lib/constants/auction.constants'

export default function AdminAuctionClient({ auction }: { auction: IAuction }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const statusConfig = getAuctionStatusConfig(auction.status)
  const visibleTabs = TABS.filter((t) => t.statuses.includes(auction.status))

  const tabSlug = (label: string) => label.toLowerCase().replace(/\s+/g, '-')
  const param = searchParams.get('tab')
  const activeTab: Tab = visibleTabs.find((t) => tabSlug(t.label) === param)?.label ?? 'Overview'

  const selectTab = (label: Tab) => {
    router.replace(`${pathname}?tab=${tabSlug(label)}`, { scroll: false })
  }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <LayoutDashboard className="w-3 h-3" aria-hidden="true" />
            Dashboard
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <Link
            href="/admin/auctions"
            className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Auctions
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <h1
            className="text-[9px] font-mono tracking-[0.15em] uppercase text-text-light dark:text-text-dark truncate"
            aria-current="page"
          >
            {auction.title}
          </h1>
        </nav>

        <span
          className={`shrink-0 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 ${statusConfig.classes}`}
        >
          {statusConfig.label}
        </span>
      </header>

      {/* ── Title band ── */}
      <div className="w-full px-4 sm:px-6 pt-6 pb-4">
        <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-text-light dark:text-text-dark">
          {auction.title}
        </h2>
        <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1">
          {formatDate(auction.startDate)} — {formatDate(auction.endDate)}
        </p>
      </div>

      <div className="w-full px-4 sm:px-6 pb-6">
        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Auction sections"
          className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit mb-6 flex-wrap"
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.label}
              role="tab"
              id={`tab-${tab.label}`}
              aria-selected={activeTab === tab.label}
              aria-controls={`panel-${tab.label}`}
              onClick={() => selectTab(tab.label)}
              className={`relative px-4 py-2 text-[9px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                activeTab === tab.label
                  ? 'text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark'
                  : 'text-muted-light dark:text-muted-dark bg-surface-light dark:bg-surface-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              {activeTab === tab.label && (
                <motion.span
                  layoutId="auction-detail-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Panels ── */}
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {activeTab === 'Overview' && <AdminAuctionOverviewTab auction={auction} />}
            {activeTab === 'Items' && <AdminAuctionItemsTab auction={auction} />}
            {activeTab === 'Bidders' && <AdminAuctionBiddersTab auction={auction} />}
            {activeTab === 'Winning Bidders' && <AdminAuctionWinningBiddersTab auction={auction} />}
            {activeTab === 'Settings' && <AdminAuctionSettingsTab auction={auction} />}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
