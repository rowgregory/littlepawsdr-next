'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Gavel, Calendar, Users, TrendingUp, ChevronRight, Clock, Package as Package2 } from 'lucide-react'
import { AuctionStatus, IAuction } from 'types/entities/auction'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDate, getDaysRemaining } from 'app/utils/date.utils'
import AdminPageHeader from '../common/AdminPageHeader'
import { store } from 'app/lib/store/store'
import { setOpenAuctionDrawer } from 'app/lib/store/slices/uiSlice'
import Link from 'next/link'

function getStatusConfig(status: AuctionStatus) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Active', classes: 'bg-emerald-500/10 text-emerald-500' }
    case 'DRAFT':
      return { label: 'Draft', classes: 'bg-amber-500/10 text-amber-500' }
    case 'ENDED':
      return {
        label: 'Ended',
        classes: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
      }
  }
}

function getProgressPct(revenue: number, goal: number) {
  if (!goal) return 0
  return Math.min(100, Math.round((revenue / goal) * 100))
}

// ─── Auction Card ─────────────────────────────────────────────────────────────
function AuctionCard({ auction, index }: { auction: IAuction; index: number }) {
  const statusConfig = getStatusConfig(auction.status)
  const pct = getProgressPct(Number(auction.totalAuctionRevenue), Number(auction.goal))
  const daysLeft = getDaysRemaining(auction.endDate)
  const isActive = auction.status === 'ACTIVE'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        href={`/admin/auctions/${auction.id}`}
        className="group block border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        aria-label={`Open ${auction.title} auction`}
      >
        {/* Card header */}
        <div className="px-5 py-4 border-b border-border-light dark:border-border-dark flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 ${statusConfig.classes}`}>{statusConfig.label}</span>
              {isActive && daysLeft > 0 && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-muted-light dark:text-muted-dark">
                  <Clock size={9} aria-hidden="true" />
                  {daysLeft}d left
                </span>
              )}
            </div>
            <h2 className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-snug truncate">{auction.title}</h2>
          </div>
          <ChevronRight
            size={16}
            className="text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark group-hover:translate-x-0.5 transition-all duration-150 shrink-0 mt-1"
            aria-hidden="true"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px bg-border-light dark:bg-border-dark border-b border-border-light dark:border-border-dark">
          {[
            { icon: Package2, label: 'Items', value: auction.items?.length ?? 0 },
            { icon: Users, label: 'Bidders', value: auction.bidders?.length ?? 0 },
            { icon: Gavel, label: 'Bids', value: auction.bids?.length ?? 0 }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-bg-light dark:bg-bg-dark px-4 py-3 flex items-center gap-2.5">
              <Icon size={13} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-black font-mono text-text-light dark:text-text-dark leading-none">{value}</p>
                <p className="text-[9px] font-mono text-muted-light dark:text-muted-dark mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue + goal */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
              <span className="text-xs font-black font-mono text-text-light dark:text-text-dark">
                {formatMoney(Number(auction.totalAuctionRevenue))}
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
              {pct}% of {formatMoney(Number(auction.goal))} goal
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-surface-light dark:bg-surface-dark overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, delay: index * 0.06 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary-light dark:bg-primary-dark'}`}
            />
          </div>
        </div>

        {/* Dates footer */}
        <div className="px-5 pb-4 flex items-center gap-1.5 text-[10px] font-mono text-muted-light dark:text-muted-dark">
          <Calendar size={10} aria-hidden="true" />
          {formatDate(auction.startDate)} — {formatDate(auction.endDate)}
        </div>
      </Link>
    </motion.div>
  )
}

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
    ACTIVE: auctions.filter((a) => a.status === 'ACTIVE').length,
    DRAFT: auctions.filter((a) => a.status === 'DRAFT').length,
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
          {(['ALL', 'ACTIVE', 'DRAFT', 'ENDED'] as const).map((status) => (
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
                <AuctionCard key={auction.id} auction={auction} index={i} />
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
