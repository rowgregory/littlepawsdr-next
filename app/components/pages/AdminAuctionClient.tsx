'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { IAuction } from 'types/entities/auction'
import { formatDate } from 'app/utils/date.utils'
import { getAuctionStatusConfig } from 'app/utils/getAuctionStatusConfig'
import { AdminAuctionOverviewTab } from '../admin/AdminAuctionOverviewTab'
import { AdminAuctionItemsTab } from '../admin/AdminAuctionItemsTab'
import { AdminAuctionBiddersTab } from '../admin/AdminAuctionBiddersTab'
import { AdminAuctionWinningBiddersTab } from '../admin/AdminAuctionWinningBiddersTab'
import { AdminAuctionSettingsTab } from '../admin/AdminAuctionSettingsTab'

// ─── Types ────────────────────────────────────────────────────────────────────
const TABS = [
  { label: 'Overview', statuses: ['DRAFT', 'ACTIVE', 'ENDED'] },
  { label: 'Items', statuses: ['DRAFT', 'ACTIVE', 'ENDED'] },
  { label: 'Settings', statuses: ['DRAFT', 'ACTIVE', 'ENDED'] },
  { label: 'Bidders', statuses: ['ACTIVE', 'ENDED'] },
  { label: 'Winning Bidders', statuses: ['ENDED'] }
]

type Tab = (typeof TABS)[number]['label']

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAuctionClient({ auction }: { auction: IAuction }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const statusConfig = getAuctionStatusConfig(auction.status)

  const visibleTabs = TABS.filter((t) => t.statuses.includes(auction.status))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Back + header ── */}
      <div className="mb-6">
        <Link
          href="/admin/auctions"
          className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <ChevronLeft size={12} aria-hidden="true" />
          All Auctions
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Auction</p>
              </div>
              <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 ${statusConfig.classes}`}>{statusConfig.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-quicksand text-text-light dark:text-text-dark">{auction.title}</h1>
            <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1">
              {formatDate(auction.startDate)} — {formatDate(auction.endDate)}
            </p>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Auction sections"
        className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit mb-6"
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab.label}
            role="tab"
            id={`tab-${tab.label}`}
            aria-selected={activeTab === tab.label}
            aria-controls={`panel-${tab.label}`}
            onClick={() => setActiveTab(tab.label)}
            className={`relative px-5 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
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
  )
}
