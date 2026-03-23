'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gavel, Package, Users, DollarSign, Plus, ChevronLeft, Clock, Loader2, Copy } from 'lucide-react'
import Link from 'next/link'
import { AuctionStatus, IAuction } from 'types/entities/auction'
import { AuctionItemStatus } from 'types/entities/auction-item'
import { formatDate, formatDateTime, getDaysRemaining, toDatetimeLocal } from 'app/utils/date.utils'
import { formatMoney } from 'app/utils/currency.utils'
import Picture from '../common/Picture'
import { store, useFormSelector } from 'app/lib/store/store'
import { setOpenAuctionItemDrawer, setOpenWinningBidderDrawer } from 'app/lib/store/slices/uiSlice'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { updateAuction } from 'app/lib/actions/updateAuction'
import { useRouter } from 'next/navigation'
import { createFormActions } from 'app/utils/formActions'
import { showToast } from 'app/lib/store/slices/toastSlice'

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'Overview' | 'Items' | 'Bidders' | 'Winning Bidders' | 'Settings'

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getItemStatusConfig(status: AuctionItemStatus) {
  switch (status) {
    case 'SOLD':
      return { label: 'Sold', classes: 'bg-emerald-500/10 text-emerald-500' }
    case 'UNSOLD':
      return {
        label: 'Unsold',
        classes: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
      }
  }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  delay = 0
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark p-5"
    >
      <div className={`w-8 h-8 flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon size={14} className={iconColor} aria-hidden="true" />
      </div>
      <p className="text-xl font-black font-quicksand text-text-light dark:text-text-dark leading-none mb-1">{value}</p>
      <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">{label}</p>
      {sub && <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60 mt-0.5">{sub}</p>}
    </motion.div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ auction }: { auction: IAuction }) {
  const pct = auction.goal > 0 ? Math.min(100, Math.round((auction.totalAuctionRevenue / auction.goal) * 100)) : 0
  const daysLeft = getDaysRemaining(auction.endDate)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
        <StatCard
          label="Revenue"
          value={formatMoney(auction.totalAuctionRevenue)}
          icon={DollarSign}
          iconColor="text-primary-light dark:text-primary-dark"
          iconBg="bg-primary-light/10 dark:bg-primary-dark/10"
          delay={0}
        />
        <StatCard
          label="Items"
          value={String(auction.items.length)}
          icon={Package}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
          delay={0.06}
        />
        <StatCard
          label="Bidders"
          value={String(auction.bidders.length)}
          icon={Users}
          iconColor="text-pink-500"
          iconBg="bg-pink-500/10"
          delay={0.12}
        />
        <StatCard
          label="Total Bids"
          value={String(auction.bids.length)}
          icon={Gavel}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          delay={0.18}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal progress */}
        <div className="border border-border-light dark:border-border-dark">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Goal Progress</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black font-quicksand text-text-light dark:text-text-dark">{formatMoney(auction.totalAuctionRevenue)}</p>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1">of {formatMoney(auction.goal)} goal</p>
              </div>
              <p className="text-2xl font-black font-mono text-primary-light dark:text-primary-dark">{pct}%</p>
            </div>
            <div className="h-2 bg-surface-light dark:bg-surface-dark overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary-light dark:bg-primary-dark'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
              <div className="bg-bg-light dark:bg-bg-dark px-4 py-3">
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-1">Start</p>
                <p className="text-xs font-mono text-text-light dark:text-text-dark">{formatDateTime(auction.startDate)}</p>
              </div>
              <div className="bg-bg-light dark:bg-bg-dark px-4 py-3">
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-1">End</p>
                <p className="text-xs font-mono text-text-light dark:text-text-dark">{formatDateTime(auction.endDate)}</p>
              </div>
            </div>
            {auction.status === 'ACTIVE' && daysLeft > 0 && (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500">
                <Clock size={12} aria-hidden="true" />
                {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
              </div>
            )}
          </div>
        </div>

        {/* Top items */}
        <div className="border border-border-light dark:border-border-dark">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Top Items by Bids</h2>
            </div>
          </div>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {auction.items.length > 0 ? (
              [...auction.items]
                .sort((a, b) => b.totalBids - a.totalBids)
                .slice(0, 5)
                .map((item, i) => (
                  <div
                    key={item.id}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark w-4 shrink-0">{i + 1}</span>
                    {item.photos[0] ? (
                      <Picture
                        priority={false}
                        src={item.photos[0].url}
                        alt={item.name}
                        className="w-8 h-8 object-cover border border-border-light dark:border-border-dark shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shrink-0">
                        <Package size={12} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark truncate">{item.name}</p>
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{item.totalBids} bids</p>
                    </div>
                    <p className="text-xs font-black font-mono text-text-light dark:text-text-dark shrink-0">
                      {formatMoney(item.highestBidAmount ?? item.currentBid)}
                    </p>
                  </div>
                ))
            ) : (
              <div className="px-5 py-12 text-center">
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No items yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Items Tab ────────────────────────────────────────────────────────────────
function ItemsTab({ auction }: { auction: IAuction }) {
  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Items <span className="ml-1">{auction.items.length}</span>
          </h2>
        </div>
        <button
          onClick={() => {
            store.dispatch(setInputs({ formName: 'auctionItemForm', data: { auctionId: auction } }))
            store.dispatch(setOpenAuctionItemDrawer())
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary-light dark:bg-primary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label="Add auction item"
        >
          <Plus size={11} aria-hidden="true" /> Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Auction items">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              {['Item', 'Format', 'Starting', 'Current Bid', 'Buy Now', 'Bids', 'Status', ''].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {auction.items.length > 0 ? (
              auction.items.map((item) => {
                const itemStatus = getItemStatusConfig(item.status)
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {item.photos?.length > 0 ? (
                          <Picture
                            priority={false}
                            src={item.photos.find((p) => p.isPrimary)?.url ?? item.photos[0].url}
                            alt={item.name}
                            className="w-8 h-8 object-cover border border-border-light dark:border-border-dark shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shrink-0">
                            <Package size={12} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-text-light dark:text-text-dark truncate max-w-40">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-[9px] font-mono tracking-wider uppercase text-muted-light dark:text-muted-dark">
                        {item.sellingFormat.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-mono text-text-light dark:text-text-dark">{formatMoney(item.startingPrice)}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-black font-mono text-text-light dark:text-text-dark">
                        {formatMoney(item.highestBidAmount ?? item.currentBid)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-mono text-text-light dark:text-text-dark">{formatMoney(item.buyNowPrice)}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{item.totalBids}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${itemStatus.classes}`}>{itemStatus.label}</span>
                    </td>
                    <td className="px-5 py-3.5 space-x-3 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/auctions/${item?.auctionId}/${item.id}`}
                        aria-label={`View ${item.name}`}
                        className="text-[10px] font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          store.dispatch(setInputs({ formName: 'auctionItemForm', data: { ...item, isUpdating: true, status: auction.status } }))
                          store.dispatch(setOpenAuctionItemDrawer())
                        }}
                        aria-label={`Edit ${item.name}`}
                        className="text-[10px] font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No items yet — add your first item.</p>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Bidders Tab ──────────────────────────────────────────────────────────────
function BiddersTab({ auction }: { auction: IAuction }) {
  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Bidders <span className="ml-1">{auction.bidders.length}</span>
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Auction bidders">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              {['Bidder', 'Anonymous', 'Status'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody key="bidders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {auction.bidders.length > 0 ? (
              auction.bidders.map((bidder) => {
                const name = [bidder.user?.firstName, bidder.user?.lastName].filter(Boolean).join(' ') || bidder.user?.email || 'Guest'
                return (
                  <tr
                    key={bidder.id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark">{name}</p>
                      {bidder.user?.email && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{bidder.user.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
                          bidder.user?.anonymousBidding
                            ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                            : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                        }`}
                      >
                        {bidder.user?.anonymousBidding ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark">{name}</p>
                      {bidder?.status && <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{bidder.status}</p>}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={2} className="px-5 py-16 text-center">
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No bidders yet.</p>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Winning Bidders Tab ──────────────────────────────────────────────────────────────
function WinningBiddersTab({ auction }: { auction: IAuction }) {
  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Winning Bidders <span className="ml-1">{auction.winningBidders.length}</span>
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Winning bidders">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              {['Bidder', 'Items Won', 'Total', 'Payment Status', 'Emails Sent'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody key="winningBidders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {auction.winningBidders.length > 0 ? (
              auction.winningBidders.map((bidder) => {
                const name = [bidder.user?.firstName, bidder.user?.lastName].filter(Boolean).join(' ') || bidder.user?.email || 'Guest'
                return (
                  <tr
                    onClick={() => store.dispatch(setOpenWinningBidderDrawer(bidder))}
                    key={bidder.id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    {/* Bidder */}
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark">{name}</p>
                      {bidder.user?.email && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{bidder.user.email}</p>
                      )}
                    </td>

                    {/* Items won */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-1">
                        {bidder.auctionItems?.map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <span className="block w-1 h-1 shrink-0 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                            <p className="text-xs text-text-light dark:text-text-dark truncate max-w-50">{item.name}</p>
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark shrink-0">
                              ${Number(item.soldPrice).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-mono font-semibold text-text-light dark:text-text-dark tabular-nums">
                        ${Number(bidder.totalPrice ?? 0).toLocaleString()}
                      </p>
                      {(bidder.shipping ?? 0) > 0 && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                          +${Number(bidder.shipping).toLocaleString()} shipping
                        </p>
                      )}
                    </td>

                    {/* Payment status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
                          bidder.winningBidPaymentStatus === 'PAID'
                            ? 'bg-green-500/10 text-green-500'
                            : bidder.winningBidPaymentStatus === 'AWAITING_PAYMENT'
                              ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                              : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                        }`}
                      >
                        {bidder.winningBidPaymentStatus?.replace(/_/g, ' ')}
                      </span>
                      {bidder.winningBidPaymentStatus !== 'PAID' && (
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(`https://littlepawsdr.org/auctions/winner/${bidder.id}`)}
                          className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                          aria-label={`Copy payment link for ${name}`}
                        >
                          <Copy className="w-3 h-3 shrink-0" aria-hidden="true" />
                          Copy payment link
                        </button>
                      )}
                    </td>
                    {/* Emails sent */}
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark">{bidder.emailNotificationCount}</p>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center">
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark">
                    {auction.status === 'ACTIVE' ? 'Auction is still active.' : 'No winning bidders yet.'}
                  </p>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ auction }: { auction: IAuction }) {
  const router = useRouter()
  const { auctionSettingsForm } = useFormSelector()
  const { handleInput } = createFormActions('auctionSettingsForm', store.dispatch)
  const inputs = auctionSettingsForm?.inputs
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auction) {
      store.dispatch(setInputs({ formName: 'auctionSettingsForm', data: auction }))
    }
  }, [auction])

  return (
    <div className="max-w-xl space-y-5">
      <div className="border border-border-light dark:border-border-dark">
        <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-3">
            <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Auction Settings</h2>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={handleInput}
              value={inputs?.title || ''}
              className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="startDate" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                Start Date
              </label>
              <input
                disabled={auction.status === 'ACTIVE'}
                name="startDate"
                id="startDate"
                type="datetime-local"
                onChange={handleInput}
                value={toDatetimeLocal(inputs?.startDate) || ''}
                className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors scheme-light dark:scheme-dark"
              />
              {auction.status === 'ACTIVE' && (
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Start date cannot be changed once the auction is live</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="endDate" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                End Date
              </label>
              <input
                name="endDate"
                id="endDate"
                type="datetime-local"
                onChange={handleInput}
                value={toDatetimeLocal(inputs?.endDate) || ''}
                className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors scheme-light dark:scheme-dark"
              />
            </div>
          </div>

          {/* Goal */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="goal" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              Goal ($)
            </label>
            <input
              name="goal"
              id="goal"
              type="number"
              onChange={handleInput}
              value={inputs?.goal || ''}
              min={0}
              className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
            />
          </div>

          {/* Custom link */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="customLink" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              Custom Link
            </label>
            <input
              name="customAuctionLink"
              id="customAuctionLink"
              type="text"
              onChange={handleInput}
              value={inputs?.customAuctionLink ?? ''}
              placeholder="e.g. spring-2026"
              className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
            />
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              onClick={async () => {
                setLoading(true)
                await updateAuction(inputs.id, { ...inputs, startDate: new Date(inputs?.startDate), endDate: new Date(inputs?.endDate) })
                router.refresh()
                store.dispatch(
                  showToast({
                    message: 'Auction updated',
                    description: 'Your changes have been saved successfully.'
                  })
                )
                setLoading(false)
              }}
              className="px-5 py-2.5 bg-primary-light dark:bg-primary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" aria-hidden="true" /> Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAuctionClient({ auction }: { auction: IAuction }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const statusConfig = getStatusConfig(auction.status)

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

      {/* ── Tabs ── */}
      <div
        role="tablist"
        aria-label="Auction sections"
        className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit mb-6"
      >
        {(['Overview', 'Items', 'Bidders', 'Winning Bidders', 'Settings'] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            id={`tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
              activeTab === tab
                ? 'text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark'
                : 'text-muted-light dark:text-muted-dark bg-surface-light dark:bg-surface-dark hover:text-text-light dark:hover:text-text-dark'
            }`}
          >
            {activeTab === tab && (
              <motion.span
                layoutId="auction-detail-tab"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                aria-hidden="true"
              />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* ── Panels ── */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          {activeTab === 'Overview' && <OverviewTab auction={auction} />}
          {activeTab === 'Items' && <ItemsTab auction={auction} />}
          {activeTab === 'Bidders' && <BiddersTab auction={auction} />}
          {activeTab === 'Winning Bidders' && <WinningBiddersTab auction={auction} />}
          {activeTab === 'Settings' && <SettingsTab auction={auction} />}
        </motion.div>
      </div>
    </div>
  )
}
