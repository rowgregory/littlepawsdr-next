'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Gavel } from 'lucide-react'
import { AuctionStatus } from 'types/entities/auction'
import AdminPageHeader from '../common/AdminPageHeader'
import { store } from 'app/lib/store/store'
import { setOpenAuctionDrawer } from 'app/lib/store/slices/uiSlice'
import { AdminAuctionCard } from '../admin/AdminAuctionCard'

// ─── Empty state ──────────────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAuctionsClient({ auctions }) {
  const [filter, setFilter] = useState<AuctionStatus | 'ALL'>('ALL')

  const filtered = filter === 'ALL' ? auctions : auctions.filter((a) => a.status === filter)

  const counts = {
    ALL: auctions.length,
    DRAFT: auctions.filter((a) => a.status === 'DRAFT').length,
    ACTIVE: auctions.filter((a) => a.status === 'ACTIVE').length,
    ENDED: auctions.filter((a) => a.status === 'ENDED').length
  }

  return (
    <>
      <AdminPageHeader label="Admin" title="Auctions" description="Create and manage auctions, items, and bidders">
        <button
          onClick={() => store.dispatch(setOpenAuctionDrawer())}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-light dark:bg-primary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 hover:bg-secondary-light dark:hover:bg-secondary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label="Create new auction"
        >
          <Plus size={13} aria-hidden="true" />
          New Auction
        </button>
      </AdminPageHeader>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Filter tabs ── */}
        <div
          role="tablist"
          aria-label="Filter auctions by status"
          className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit mb-6 flex-wrap"
        >
          {(['ALL', 'DRAFT', 'ACTIVE', 'ENDED'] as const).map((status) => (
            <button
              key={status}
              role="tab"
              aria-selected={filter === status}
              onClick={() => setFilter(status)}
              className={`relative px-4 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
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
              <span className="ml-1.5 text-primary-light dark:text-primary-dark">{counts[status]}</span>
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
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
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
    </>
  )
}
