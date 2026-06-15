'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Gavel, LayoutDashboard } from 'lucide-react'
import { AuctionStatus } from 'types/entities/auction'
import { store } from 'app/lib/store/store'
import { setOpenAuctionDrawer } from 'app/lib/store/slices/uiSlice'
import { AdminAuctionCard } from '../../../components/admin/auction/AdminAuctionCard'
import Link from 'next/link'

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-border-light dark:border-border-dark py-20 flex flex-col items-center justify-center gap-4"
    >
      <div className="w-12 h-12 flex items-center justify-center border border-border-light dark:border-border-dark">
        <Gavel size={20} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-sm font-quicksand font-black text-text-light dark:text-text-dark mb-1">No auctions yet</p>
        <p className="text-xs font-mono text-muted-light dark:text-muted-dark">Create your first auction to get started</p>
      </div>
    </motion.div>
  )
}

export default function AdminAuctionsClient({ auctions }: { auctions: any[] }) {
  const [filter, setFilter] = useState<AuctionStatus | 'ALL'>('ALL')

  const filtered = filter === 'ALL' ? auctions : auctions.filter((a) => a.status === filter)

  const counts = {
    ALL: auctions.length,
    DRAFT: auctions.filter((a) => a.status === 'DRAFT').length,
    ACTIVE: auctions.filter((a) => a.status === 'ACTIVE').length,
    ENDED: auctions.filter((a) => a.status === 'ENDED').length
  }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between">
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
          <h1 className="text-[9px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark" aria-current="page">
            Auctions
          </h1>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-[9px] font-mono tabular-nums text-muted-light dark:text-muted-dark">
            {auctions.length} auction{auctions.length === 1 ? '' : 's'}
          </span>
          <button
            onClick={() => store.dispatch(setOpenAuctionDrawer())}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark text-[9px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 hover:bg-secondary-light dark:hover:bg-secondary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <Plus size={12} aria-hidden="true" />
            New Auction
          </button>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        {/* ── Filter tabs ── */}
        <div
          role="tablist"
          aria-label="Filter auctions by status"
          className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit flex-wrap"
        >
          {(['ALL', 'DRAFT', 'ACTIVE', 'ENDED'] as const).map((status) => (
            <button
              key={status}
              role="tab"
              aria-selected={filter === status}
              onClick={() => setFilter(status)}
              className={`relative px-4 py-2 text-[9px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                filter === status
                  ? 'text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark'
                  : 'text-muted-light dark:text-muted-dark bg-surface-light dark:bg-surface-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              {filter === status && (
                <motion.span
                  layoutId="auction-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              <span className="ml-1.5 text-primary-light dark:text-primary-dark tabular-nums">{counts[status]}</span>
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
            >
              {filtered.map((auction, i) => (
                <AdminAuctionCard key={auction.id} auction={auction} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
