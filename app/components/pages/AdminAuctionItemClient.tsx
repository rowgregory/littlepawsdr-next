'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Package, ChevronLeft, Gavel, ShoppingBag, Truck, TrendingUp, Star, Clock, Edit2 } from 'lucide-react'
import { IAuctionItemPhoto } from 'types/entities/auction-item-photo'
import { AuctionItemStatus } from 'types/entities/auction-item'
import Picture from '../common/Picture'
import { IAuctionBid } from 'types/entities/auction-bid'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDateTime } from 'app/utils/date.utils'
import Link from 'next/link'
import { store } from 'app/lib/store/store'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { setOpenAuctionItemDrawer } from 'app/lib/store/slices/uiSlice'

function getItemStatusConfig(status: AuctionItemStatus) {
  switch (status) {
    case 'SOLD':
      return { label: 'Sold', classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
    case 'ACTIVE':
      return {
        label: 'Active',
        classes:
          'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark border-primary-light/20 dark:border-primary-dark/20'
      }
    case 'UNSOLD':
      return {
        label: 'Unsold',
        classes: 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-border-light dark:border-border-dark'
      }
  }
}

// ─── Photo Gallery ────────────────────────────────────────────────────────────
function PhotoGallery({ photos }: { photos: IAuctionItemPhoto[] }) {
  const sorted = [...photos].sort((a, b) => a.sortOrder - b.sortOrder)
  const primary = sorted.find((p) => p.isPrimary) ?? sorted[0]
  const [active, setActive] = useState(primary?.id ?? sorted[0]?.id)
  const activePhoto = sorted.find((p) => p.id === active) ?? sorted[0]

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center">
        <Package size={40} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div className="relative aspect-square border border-border-light dark:border-border-dark overflow-hidden bg-surface-light dark:bg-surface-dark">
        <Picture
          key={activePhoto?.id}
          priority={true}
          src={activePhoto?.url}
          alt={activePhoto?.name ?? 'Item photo'}
          className="w-full h-full object-cover"
        />
        {activePhoto?.isPrimary && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm px-2 py-1 border border-border-light dark:border-border-dark">
            <Star size={9} className="text-amber-500" aria-hidden="true" />
            <span className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">Primary</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="grid grid-cols-5 gap-1.5" role="list" aria-label="Photo thumbnails">
          {sorted.map((photo) => (
            <button
              key={photo.id}
              role="listitem"
              onClick={() => setActive(photo.id)}
              aria-label={`View photo ${photo.name ?? ''}`}
              className={`relative aspect-square overflow-hidden border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                active === photo.id
                  ? 'border-primary-light dark:border-primary-dark opacity-100'
                  : 'border-border-light dark:border-border-dark opacity-50 hover:opacity-80'
              }`}
            >
              <Picture priority={true} src={photo.url} alt={photo.name ?? ''} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  delay = 0
}: {
  label: string
  value: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay }}
      className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark p-4"
    >
      <div className={`w-7 h-7 flex items-center justify-center mb-2.5 ${iconBg}`}>
        <Icon size={13} className={iconColor} aria-hidden="true" />
      </div>
      <p className="text-lg font-black font-mono text-text-light dark:text-text-dark leading-none mb-1">{value}</p>
      <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">{label}</p>
    </motion.div>
  )
}

// ─── Bids Table ───────────────────────────────────────────────────────────────
function BidsTable({ bids }: { bids: IAuctionBid[] }) {
  const sorted = [...bids].sort((a, b) => b.bidAmount - a.bidAmount)

  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Bid History
            <span className="ml-2">{bids.length}</span>
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Bid history">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <th scope="col" className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                #
              </th>
              <th scope="col" className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                Bidder
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
              >
                Time
              </th>
            </tr>
          </thead>
          <motion.tbody key="bids" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {sorted.length > 0 ? (
              sorted.map((bid, i) => {
                const name = [bid?.user?.firstName, bid?.user?.lastName].filter(Boolean).join(' ') || bid?.user?.email || 'Anonymous'
                const isTop = i === 0
                return (
                  <tr
                    key={bid.id}
                    className={`border-b border-border-light dark:border-border-dark last:border-0 transition-colors ${
                      isTop ? 'bg-emerald-500/5' : 'hover:bg-surface-light dark:hover:bg-surface-dark'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-mono ${isTop ? 'text-emerald-500 font-black' : 'text-muted-light dark:text-muted-dark'}`}>
                        {isTop ? '★' : i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-text-light dark:text-text-dark">{name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-xs font-black font-mono ${isTop ? 'text-emerald-500' : 'text-text-light dark:text-text-dark'}`}>
                        {formatMoney(bid.bidAmount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{formatDateTime(bid.createdAt)}</span>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No bids yet.</p>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAuctionItemClient({ auctionItem }: { auctionItem: any }) {
  const item = auctionItem
  const statusConfig = getItemStatusConfig(item.status)
  const isActive = item.auction.status === 'ACTIVE'

  const highBid = item.bids.length > 0 ? Math.max(...item.bids.map((b) => b.bidAmount)) : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-[10px] font-mono text-muted-light dark:text-muted-dark">
        <Link
          href="/admin/auctions"
          className="hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          Auctions
        </Link>
        <ChevronLeft size={10} className="rotate-180" aria-hidden="true" />
        <Link
          href={`/admin/auctions/${item.auctionId}`}
          className="hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          {item.auction.title}
        </Link>
        <ChevronLeft size={10} className="rotate-180" aria-hidden="true" />
        <span className="text-text-light dark:text-text-dark">{item.name}</span>
      </nav>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Auction Item</p>
            <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 border ${statusConfig.classes}`}>{statusConfig.label}</span>
            {isActive && (
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
                Live
              </span>
            )}
          </div>
          <h1 className="font-quicksand font-black text-2xl sm:text-3xl text-text-light dark:text-text-dark">{item.name}</h1>
        </div>

        <button
          onClick={() => {
            store.dispatch(
              setInputs({
                formName: 'auctionItemForm',
                data: { ...item, isUpdating: true, auctionStatus: item.auction.status }
              })
            )
            store.dispatch(setOpenAuctionItemDrawer())
          }}
          className="flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label={`Edit ${item.name}`}
        >
          <Edit2 size={12} aria-hidden="true" />
          Edit Item
        </button>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left — gallery */}
        <div>
          <PhotoGallery photos={item.photos} />
        </div>

        {/* Right — details */}
        <div className="space-y-6">
          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
            <StatCard
              label="Total Bids"
              value={String(item.totalBids)}
              icon={Gavel}
              iconColor="text-primary-light dark:text-primary-dark"
              iconBg="bg-primary-light/10 dark:bg-primary-dark/10"
              delay={0}
            />
            <StatCard
              label="High Bid"
              value={formatMoney(highBid)}
              icon={TrendingUp}
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
              delay={0.06}
            />
            <StatCard
              label="Starting"
              value={formatMoney(item.startingPrice)}
              icon={Clock}
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
              delay={0.12}
            />
            <StatCard
              label="Buy Now"
              value={formatMoney(item.buyNowPrice)}
              icon={ShoppingBag}
              iconColor="text-violet-500"
              iconBg="bg-violet-500/10"
              delay={0.18}
            />
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Description</h2>
              </div>
              <p className="text-sm font-mono text-muted-light dark:text-muted-dark leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Details</h2>
            </div>
            <dl className="grid grid-cols-1 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
              {[
                { label: 'Format', value: item.sellingFormat.toLowerCase() },
                { label: 'Current Bid', value: formatMoney(item.currentBid) },
                { label: 'Highest Bid', value: formatMoney(item.highestBidAmount) },
                { label: 'Minimum Bid', value: formatMoney(item.minimumBid) },
                { label: 'Sold Price', value: formatMoney(item.soldPrice) },
                { label: 'Quantity', value: item.totalQuantity ? String(item.totalQuantity) : '—' },
                { label: 'Requires Shipping', value: item.requiresShipping ? 'Yes' : 'No' },
                { label: 'Shipping Cost', value: formatMoney(item.shippingCosts) }
              ].map(({ label, value }) => (
                <div key={label} className="grid grid-cols-2 bg-bg-light dark:bg-bg-dark">
                  <dt className="px-4 py-3 text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark border-r border-border-light dark:border-border-dark">
                    {label}
                  </dt>
                  <dd className="px-4 py-3 text-xs font-mono text-text-light dark:text-text-dark capitalize">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Shipping notice */}
          {item.requiresShipping && (
            <div className="flex items-center gap-2.5 px-4 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <Truck size={13} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                This item requires shipping.
                {item.shippingCosts ? ` Shipping cost: ${formatMoney(item.shippingCosts)}` : ' Shipping cost TBD.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bid history ── */}
      {item.isAuction && <BidsTable bids={item.bids} />}
    </div>
  )
}
