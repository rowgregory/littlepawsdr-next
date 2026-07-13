'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, DollarSign, FileText, Radio, CheckCircle, Gavel } from 'lucide-react'
import { store } from 'app/lib/store/store'
import { setOpenAuctionDrawer } from 'app/lib/store/slices/uiSlice'
import { AdminAuctionCard } from '../../../components/features/auction/admin/AdminAuctionCard'
import AdminPageHeader from 'app/components/admin/AdminPageHeader'
import AdminHeaderButton from 'app/components/admin/AdminHeaderButton'
import { Stat } from 'app/components/admin/Stat'
import { fmtCurrency } from 'app/utils/_currency.utils'
import AdminEmptyState from 'app/components/admin/AdminEmptyState'
import AdminFilterTabs from 'app/components/admin/AdminFilterTabs'
import { AUCTION_FILTERS } from 'app/lib/constants/auction.constants'

export default function AdminAuctionsClient({ auctions }: { auctions: any[] }) {
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL' ? auctions : auctions.filter((a) => a.status === filter)

  const counts = {
    ALL: auctions.length,
    DRAFT: auctions.filter((a) => a.status === 'DRAFT').length,
    ACTIVE: auctions.filter((a) => a.status === 'ACTIVE').length,
    ENDED: auctions.filter((a) => a.status === 'ENDED').length
  }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      <AdminPageHeader
        title="Auctions"
        count={{ value: auctions.length, noun: 'auction' }}
        action={
          <AdminHeaderButton
            onClick={() => store.dispatch(setOpenAuctionDrawer())}
            icon={<Plus size={12} aria-hidden="true" />}
          >
            New Auction
          </AdminHeaderButton>
        }
      />

      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat label="All" value={fmtCurrency(counts.ALL)} icon={DollarSign} />
          <Stat label="Draft" value={String(counts.DRAFT)} icon={FileText} />
          <Stat label="Active" value={String(counts.ACTIVE)} icon={Radio} />
          <Stat label="Ended" value={String(counts.ENDED)} icon={CheckCircle} />
        </div>

        {/* ── Filter tabs ── */}
        <AdminFilterTabs
          options={AUCTION_FILTERS}
          value={filter}
          onChange={setFilter}
          counts={counts}
          label="Filter auctions by status"
        />

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
              <AdminEmptyState
                icon={<Gavel size={20} aria-hidden="true" />}
                title="No auctions yet"
                description="Create your first auction to get started"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
