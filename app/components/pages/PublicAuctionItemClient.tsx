'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Gavel, Clock, Tag, ChevronRight, ChevronLeft, ArrowLeft, Package, TrendingUp, Users, Truck, ShieldCheck, Zap, Trophy } from 'lucide-react'
import Link from 'next/link'
import Picture from '../common/Picture'
import { IAuctionBid } from 'types/entities/auction-bid'
import { IAuctionItemPhoto } from 'types/entities/auction-item-photo'
import { formatDateTime } from 'app/utils/date.utils'
import { formatMoney } from 'app/utils/currency.utils'
import { useCountdown } from '@hooks/useCountdown'
import { store } from 'app/lib/store/store'
import { setOpenAuctionBidModal } from 'app/lib/store/slices/uiSlice'

function bidderDisplay(bid: IAuctionBid) {
  if (bid.user.anonymousBidding) return bid.bidderName ?? 'Anonymous'
  return `${bid.user.firstName} ${bid.user.lastName[0]}.`
}
// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{children}</p>
    </div>
  )
}

// ─── Photo gallery ────────────────────────────────────────────────────────────
function PhotoGallery({ photos, name }: { photos: IAuctionItemPhoto[]; name: string }) {
  const sorted = [...photos].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || a.sortOrder - b.sortOrder)
  const [idx, setIdx] = useState(0)
  const current = sorted[idx]

  const prev = () => setIdx((i) => (i - 1 + sorted.length) % sorted.length)
  const next = () => setIdx((i) => (i + 1) % sorted.length)

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-14 h-14 border border-border-light dark:border-border-dark flex items-center justify-center">
            <span className="font-quicksand font-black text-lg text-primary-light/20 dark:text-primary-dark/20 select-none">LP</span>
          </div>
          <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-muted-light/30 dark:text-muted-dark/30">{name}</span>
        </div>
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary-light/20 dark:border-primary-dark/20" aria-hidden="true" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-primary-light/20 dark:border-primary-dark/20" aria-hidden="true" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-primary-light/20 dark:border-primary-dark/20" aria-hidden="true" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary-light/20 dark:border-primary-dark/20" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="space-y-2" role="region" aria-label={`Photos of ${name}`}>
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark group">
        <Picture
          priority={true}
          key={current.url}
          src={current.url}
          alt={`${name} — photo ${idx + 1} of ${sorted.length}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-bg-light/85 dark:bg-bg-dark/85 backdrop-blur-sm border border-border-light dark:border-border-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <ChevronLeft size={15} aria-hidden="true" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-bg-light/85 dark:bg-bg-dark/85 backdrop-blur-sm border border-border-light dark:border-border-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <ChevronRight size={15} aria-hidden="true" />
            </button>
            <div className="absolute bottom-2 right-2 bg-bg-light/85 dark:bg-bg-dark/85 backdrop-blur-sm px-2.5 py-1 border border-border-light dark:border-border-dark">
              <span className="text-[9px] font-mono text-text-light dark:text-text-dark tabular-nums">
                {idx + 1} / {sorted.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" role="tablist" aria-label="Photo thumbnails">
          {sorted.map((photo, i) => (
            <button
              key={photo.id}
              role="tab"
              aria-selected={i === idx}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-14 h-14 overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                i === idx ? 'border-primary-light dark:border-primary-dark' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Picture priority={true} src={photo.url} alt="" className="w-full h-full object-cover" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-9">
      <span className="font-mono font-black text-xl text-text-light dark:text-text-dark leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-f8 font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mt-0.5">{label}</span>
    </div>
  )
}

// ─── Bid row ──────────────────────────────────────────────────────────────────
function BidRow({ bid, rank, delay }: { bid: IAuctionBid; rank: number; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const isTop = rank === 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay }}
      className={`flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark last:border-0 ${isTop ? 'bg-primary-light/5 dark:bg-primary-dark/5' : ''}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`text-[9px] font-mono font-black w-5 shrink-0 ${isTop ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
        >
          #{rank}
        </span>
        {isTop && <Trophy size={11} className="text-primary-light dark:text-primary-dark shrink-0" aria-hidden="true" />}
        <div className="min-w-0">
          <p className="text-xs font-mono font-black text-text-light dark:text-text-dark truncate">{bidderDisplay(bid)}</p>
          <p className="text-[9px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{formatDateTime(bid.createdAt)}</p>
        </div>
      </div>
      <span
        className={`text-sm font-mono font-black shrink-0 ml-3 ${isTop ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}
      >
        {formatMoney(bid.bidAmount)}
      </span>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicAuctionItemClient({ item }) {
  const { days, hours, minutes, seconds, done } = useCountdown(new Date(item?.auction?.endDate))
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  const isActive = item?.auction?.status === 'ACTIVE'
  const isEnded = item?.auction?.status === 'ENDED'
  const isSold = item?.status === 'SOLD'
  const isFixed = item?.sellingFormat === 'FIXED'

  const auctionHref = item?.auction?.customAuctionLink ? `/auctions/${item?.auction?.customAuctionLink}` : `/auctions/${item?.auction?.id}`

  const topBid = item?.bids[0]
  const displayBid = item?.currentBid ?? item?.startingPrice

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* ── Sticky bar ── */}
      <div className="sticky top-0 z-40 border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 h-11 flex items-center justify-between gap-4">
          <Link
            href={auctionHref}
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:underline shrink-0"
            aria-label={`Back to ${item?.auction?.title}`}
          >
            <ArrowLeft size={11} aria-hidden="true" />
            <span className="hidden xs:inline">{item?.auction?.title}</span>
            <span className="xs:hidden">Back</span>
          </Link>

          {isActive && !done && (
            <div
              className="flex items-center gap-1.5 shrink-0"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`${hours} hours ${minutes} minutes ${seconds} seconds remaining`}
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-mono text-emerald-500 tabular-nums font-black">
                {days > 0 ? `${days}d ` : ''}
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
          {isEnded && <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark shrink-0">Auction Ended</span>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* ══ LEFT — Photos ══ */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <PhotoGallery photos={item?.photos} name={item?.name} />
          </motion.div>

          {/* ══ RIGHT — Info + Bid ══ */}
          <div className="space-y-5">
            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              {/* Format + status badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border-light dark:border-border-dark">
                  {isFixed ? (
                    <>
                      <Tag size={10} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                      <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">Fixed Price</span>
                    </>
                  ) : (
                    <>
                      <Gavel size={10} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                      <span className="text-[9px] font-mono text-primary-light dark:text-primary-dark">Auction</span>
                    </>
                  )}
                </div>
                {isSold && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-emerald-500/40 bg-emerald-500/10">
                    <ShieldCheck size={10} className="text-emerald-500" aria-hidden="true" />
                    <span className="text-[9px] font-mono text-emerald-500 font-black">Sold</span>
                  </div>
                )}
                {isActive && !isSold && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-emerald-500/40 bg-emerald-500/10">
                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-[9px] font-mono text-emerald-500 font-black">Live</span>
                  </div>
                )}
                {item?.requiresShipping && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-border-light dark:border-border-dark">
                    <Truck size={10} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                    <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">
                      {item?.shippingCosts ? `Ships +${formatMoney(item?.shippingCosts)}` : 'Shipping Included'}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="font-quicksand font-black text-2xl xs:text-3xl sm:text-4xl text-text-light dark:text-text-dark leading-tight mb-3">
                {item?.name}
              </h1>

              {item?.description && <p className="text-sm font-nunito text-muted-light dark:text-muted-dark leading-relaxed">{item?.description}</p>}
            </motion.div>

            {/* Price block */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.14 }}
              className="border border-border-light dark:border-border-dark"
            >
              {/* Accent line */}
              <div
                className={`h-0.5 ${isActive && !isSold ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'}`}
                aria-hidden="true"
              />

              <div className="p-5 space-y-4">
                {/* Current bid / price */}
                {!isFixed && displayBid != null && (
                  <div>
                    <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-1.5">
                      {item?.currentBid ? 'Current Bid' : 'Starting Bid'}
                    </p>
                    <p className="font-mono font-black text-3xl xs:text-4xl text-text-light dark:text-text-dark leading-none" aria-live="polite">
                      {formatMoney(displayBid)}
                    </p>
                    {item?.bids.length > 0 && (
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-1.5">
                        {item?.bids.length} bid{item?.bids.length !== 1 ? 's' : ''}
                        {topBid && (
                          <>
                            {' '}
                            · Top bidder: <span className="text-text-light dark:text-text-dark">{bidderDisplay(topBid)}</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Fixed price */}
                {isFixed && item?.buyNowPrice != null && (
                  <div className={isFixed ? '' : 'pt-4 border-t border-border-light dark:border-border-dark'}>
                    <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-1.5">
                      {isFixed ? 'Price' : 'Buy Now Price'}
                    </p>
                    <p
                      className={`font-mono font-black leading-none ${isFixed ? 'text-3xl xs:text-4xl text-text-light dark:text-text-dark' : 'text-xl text-primary-light dark:text-primary-dark'}`}
                    >
                      {formatMoney(item?.buyNowPrice)}
                    </p>
                  </div>
                )}

                {/* Minimum bid info */}
                {item?.minimumBid != null && !isFixed && (
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    Minimum bid: <span className="text-text-light dark:text-text-dark font-black">{formatMoney(item?.minimumBid)}</span>
                  </p>
                )}

                {/* CTA */}
                {isActive && !isSold && (
                  <div className="pt-2 space-y-2">
                    {!isFixed && (
                      <button
                        onClick={() => store.dispatch(setOpenAuctionBidModal(item))}
                        type="button"
                        className="group w-full flex items-center justify-between px-5 py-4 bg-primary-light dark:bg-primary-dark text-white hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2"
                        aria-label={`Place a bid on ${item?.name}`}
                      >
                        <div className="flex items-center gap-2">
                          <Gavel size={14} aria-hidden="true" />
                          <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-black">Place a Bid</span>
                        </div>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                      </button>
                    )}
                    {isFixed && item?.buyNowPrice != null && (
                      <button
                        type="button"
                        className={`group w-full flex items-center justify-between px-5 py-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                          isFixed
                            ? 'bg-primary-light dark:bg-primary-dark text-white hover:bg-secondary-light dark:hover:bg-secondary-dark focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark'
                            : 'border border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark'
                        }`}
                        aria-label={`Buy ${item?.name} now for ${item?.buyNowPrice ? formatMoney(item?.buyNowPrice) : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <Zap size={14} aria-hidden="true" />
                          <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-black">Buy Now</span>
                        </div>
                        <span className="text-[10px] font-mono font-black">{formatMoney(item?.buyNowPrice)}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Ended state */}
                {isEnded && (
                  <div className="pt-2 flex items-center gap-2 px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                    <Package size={13} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                      {isSold ? 'This item has been sold.' : 'This auction has ended.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Countdown */}
            {isActive && !done && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="border border-border-light dark:border-border-dark p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={11} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Auction Closes In</span>
                </div>
                <div
                  className="flex items-end gap-5"
                  aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {days > 0 && <CountUnit value={days} label="days" />}
                  <CountUnit value={hours} label="hrs" />
                  <CountUnit value={minutes} label="min" />
                  <CountUnit value={seconds} label="sec" />
                </div>
              </motion.div>
            )}

            {/* Item details */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="border border-border-light dark:border-border-dark"
            >
              <div className="px-5 py-3.5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <SectionLabel>Item Details</SectionLabel>
              </div>
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {[
                  { label: 'Format', value: isFixed ? 'Fixed Price' : 'Auction' },
                  { label: 'Quantity', value: String(item?.totalQuantity) },
                  {
                    label: 'Shipping',
                    value: item?.requiresShipping ? (item?.shippingCosts ? `+${formatMoney(item?.shippingCosts)}` : 'Included') : 'No Shipping'
                  },
                  ...(item?.startingPrice != null && !isFixed ? [{ label: 'Starting Bid', value: formatMoney(item?.startingPrice) }] : []),
                  ...(item?.buyNowPrice != null ? [{ label: 'Buy Now Price', value: formatMoney(item?.buyNowPrice) }] : [])
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">{label}</span>
                    <span className="text-xs font-mono font-black text-text-light dark:text-text-dark">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══ BID HISTORY ══ */}
        {item?.bids.length > 0 && (
          <section aria-labelledby="bids-heading" className="mt-12 sm:mt-16">
            <div className="flex items-center justify-between mb-5">
              <div>
                <SectionLabel>Bid History</SectionLabel>
                <h2 id="bids-heading" className="font-quicksand font-black text-2xl xs:text-3xl text-text-light dark:text-text-dark mt-1">
                  {item?.bids.length} Bid{item?.bids.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <TrendingUp size={11} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                  Top: <span className="text-text-light dark:text-text-dark font-black">{topBid ? formatMoney(topBid.bidAmount) : '—'}</span>
                </span>
              </div>
            </div>

            <div className="border border-border-light dark:border-border-dark">
              <div className="grid grid-cols-3 gap-px bg-border-light dark:bg-border-dark border-b border-border-light dark:border-border-dark">
                {[
                  { icon: TrendingUp, label: 'Top Bid', value: topBid ? formatMoney(topBid.bidAmount) : '—' },
                  { icon: Users, label: 'Bidders', value: String(new Set(item?.bids.map((b) => b.userId)).size) },
                  { icon: Gavel, label: 'Total Bids', value: String(item?.bids.length) }
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-bg-light dark:bg-bg-dark px-4 py-4">
                    <Icon size={11} className="text-muted-light dark:text-muted-dark mb-1.5" aria-hidden="true" />
                    <p className="font-mono font-black text-base text-text-light dark:text-text-dark leading-none">{value}</p>
                    <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <div role="list" aria-label="Bid history">
                {item?.bids.map((bid, i) => (
                  <div key={bid.id} role="listitem">
                    <BidRow bid={bid} rank={i + 1} delay={i * 0.04} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty bid state */}
        {item?.bids.length === 0 && !isFixed && (
          <div className="mt-12 border border-border-light dark:border-border-dark py-16 flex flex-col items-center gap-4 text-center px-6">
            <div className="relative w-12 h-12 border border-border-light dark:border-border-dark flex items-center justify-center">
              <Gavel size={18} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            </div>
            <div>
              <p className="font-quicksand font-black text-base text-text-light dark:text-text-dark mb-1">No bids yet</p>
              <p className="text-xs font-mono text-muted-light dark:text-muted-dark">Be the first to place a bid on this item?.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
