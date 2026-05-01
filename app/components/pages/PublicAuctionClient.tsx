'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Gavel, Clock, TrendingUp, Users, Package, ChevronRight, ArrowLeft, Zap, Tag, ShoppingCart, Eye } from 'lucide-react'
import Link from 'next/link'
import Picture from '../common/Picture'
import { IAuctionItem } from 'types/entities/auction-item'
import { AuctionStatus, IAuction } from 'types/entities/auction'
import { useCountdown } from '@hooks/useCountdown'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDate } from 'app/utils/date.utils'
import { pusherClient } from 'app/lib/pusher-client'
import { useRouter } from 'next/navigation'
import { store } from 'app/lib/store/store'
import { setOpenAuctionEndedModal, setShowConfetti } from 'app/lib/store/slices/uiSlice'

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`block w-6 h-px shrink-0 ${muted ? 'bg-border-light dark:bg-border-dark' : 'bg-primary-light dark:bg-primary-dark'}`}
        aria-hidden="true"
      />
      <p
        className={`text-[10px] font-mono tracking-[0.2em] uppercase ${muted ? 'text-muted-light dark:text-muted-dark' : 'text-primary-light dark:text-primary-dark'}`}
      >
        {children}
      </p>
    </div>
  )
}

// ─── Countdown units ─────────────────────────────────────────────────────────
function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-10">
      <span className="font-mono font-black text-2xl sm:text-3xl text-text-light dark:text-text-dark leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mt-1">{label}</span>
    </div>
  )
}

// ─── Auction Item Card ────────────────────────────────────────────────────────
function AuctionItemCard({
  item,
  auctionStatus,
  index,
  customAuctionLink
}: {
  item: IAuctionItem
  auctionStatus: AuctionStatus
  index: number
  customAuctionLink: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const photo = item.photos.find((p) => p.isPrimary) ?? item.photos[0]
  const isEnded = auctionStatus === 'ENDED'
  const isSold = item.status === 'SOLD'

  const displayPrice = item.sellingFormat === 'FIXED' ? item.buyNowPrice : (item.currentBid ?? item.startingPrice)

  const bidCount = item._count?.bids ?? 0

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label={item.name}
      className="group relative bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark overflow-hidden flex flex-col h-full"
    >
      {/* Status ribbon */}
      {(isSold || isEnded) && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm border border-border-light dark:border-border-dark">
          <span
            className={`text-[9px] font-mono tracking-[0.2em] uppercase font-black ${isSold ? 'text-emerald-500' : 'text-muted-light dark:text-muted-dark'}`}
          >
            {isSold ? 'Sold' : 'Ended'}
          </span>
        </div>
      )}

      {/* Format badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="px-2 py-1 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm border border-border-light dark:border-border-dark flex items-center gap-1.5">
          {item.sellingFormat === 'FIXED' ? (
            <>
              <Tag size={9} aria-hidden="true" className="text-muted-light dark:text-muted-dark" />
              <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">Buy Now</span>
            </>
          ) : (
            <>
              <Gavel size={9} aria-hidden="true" className="text-primary-light dark:text-primary-dark" />
              <span className="text-[9px] font-mono text-primary-light dark:text-primary-dark">Auction</span>
            </>
          )}
        </div>
      </div>

      {/* Photo */}
      <div className="relative aspect-square overflow-hidden bg-surface-light dark:bg-surface-dark">
        {photo ? (
          <Picture
            priority={true}
            src={photo.url}
            alt={item.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${isSold || isEnded ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              aria-hidden="true"
            />
            <span className="font-quicksand font-black text-2xl text-primary-light/20 dark:text-primary-dark/20 select-none">LP</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-snug mb-2 line-clamp-2">{item.name}</h3>
          <p className="text-[11px] font-nunito text-muted-light dark:text-muted-dark leading-relaxed mb-3 line-clamp-2">{item.description}</p>
        </div>

        <div className="space-y-2">
          {/* Bid count */}
          {item.sellingFormat !== 'FIXED' && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">Bids</span>
              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{bidCount}</span>
            </div>
          )}

          {/* Price */}
          {displayPrice != null && (
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">
                {item.sellingFormat === 'FIXED' ? 'Price' : item.currentBid ? 'Current Bid' : 'Starting'}
              </span>
              <span className="font-mono font-black text-sm text-text-light dark:text-text-dark">{formatMoney(displayPrice)}</span>
            </div>
          )}

          {/* CTA */}
          {auctionStatus === 'ACTIVE' && !isSold && (
            <Link
              href={`/auctions/${customAuctionLink}/${item.id}`}
              className="group/btn mt-2 flex items-center justify-between px-3.5 py-2.5 bg-primary-light dark:bg-primary-dark text-white hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              aria-label={`${item.sellingFormat === 'FIXED' ? 'Buy' : 'Bid on'} ${item.name}`}
            >
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-black">
                {item.sellingFormat === 'FIXED' ? 'Buy Now' : 'Place Bid'}
              </span>
              <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicAuctionClient({ auction }: { auction: IAuction }) {
  const { days, hours, minutes, seconds, done } = useCountdown(new Date(auction.endDate))
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const router = useRouter()
  const routerRef = useRef(router)

  const pct = auction.goal > 0 ? Math.min(100, Math.round((auction.totalAuctionRevenue / auction.goal) * 100)) : 0
  const isActive = auction.status === 'ACTIVE'
  const isEnded = auction.status === 'ENDED'

  const available = auction.items.filter((i) => i.status === 'UNSOLD')
  const sold = auction.items.filter((i) => i.status === 'SOLD')

  const customAuctionLink = auction?.customAuctionLink

  const activeAuctionId = auction.id

  useEffect(() => {
    if (!activeAuctionId) return

    const channel = pusherClient.subscribe(`auction-${activeAuctionId}`)

    channel.bind('auction-ended', (data) => {
      routerRef.current.refresh()
      store.dispatch(setShowConfetti())
      store.dispatch(setOpenAuctionEndedModal(data))
    })
    channel.bind('auction-updated', () => routerRef.current.refresh())
    channel.bind('bid-placed', () => routerRef.current.refresh())

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`auction-${activeAuctionId}`)
    }
  }, [activeAuctionId])

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 h-12 flex items-center justify-between gap-4">
          <p className="text-xs font-quicksand font-black text-text-light dark:text-text-dark truncate">{auction.title}</p>
          {isActive && !done && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] font-mono text-emerald-500 tabular-nums">
                {days > 0 ? `${days}d ` : ''}
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
          {isEnded && <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark shrink-0">Auction Ended</span>}
        </div>
      </div>
      {/* ══════════════════════════════════════════════
          HEADER BAND
      ══════════════════════════════════════════════ */}
      <section
        ref={headerRef}
        aria-labelledby="auction-heading"
        className="border-b border-border-light dark:border-border-dark relative overflow-hidden"
      >
        {/* Top accent */}
        <div
          className={`absolute top-0 inset-x-0 h-0.5 ${isActive ? 'bg-emerald-500' : isEnded ? 'bg-muted-light dark:bg-muted-dark' : 'bg-primary-light dark:bg-primary-dark'}`}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 py-10 sm:py-14">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="mb-6"
          >
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:underline"
              aria-label="Back to all auctions"
            >
              <ArrowLeft size={12} aria-hidden="true" /> All Auctions
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* ── Left: title + status ── */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={headerInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="flex items-center gap-3 mb-4"
              >
                <span
                  className={`block w-6 h-px shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-primary-light dark:bg-primary-dark'}`}
                  aria-hidden="true"
                />
                <div className="flex items-center gap-2">
                  {isActive && <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />}
                  <span
                    className={`text-[10px] font-mono tracking-[0.2em] uppercase ${isActive ? 'text-emerald-500' : 'text-primary-light dark:text-primary-dark'}`}
                  >
                    {isActive ? 'Live Now' : isEnded ? 'Auction Ended' : auction.status.charAt(0) + auction.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                id="auction-heading"
                initial={{ opacity: 0, y: 18 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-quicksand font-black text-3xl xs:text-4xl sm:text-5xl text-text-light dark:text-text-dark leading-[1.04] mb-5"
              >
                {auction.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.16 }}
                className="text-[10px] font-mono text-muted-light dark:text-muted-dark"
              >
                {formatDate(auction.startDate)} — {formatDate(auction.endDate)}
              </motion.p>
            </div>

            {/* ── Right: countdown + stats ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="space-y-4"
            >
              {/* Countdown */}
              {isActive && !done && (
                <div className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={11} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                    <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Closing In</span>
                  </div>
                  <div
                    className="flex items-end gap-4 xs:gap-6"
                    aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {days > 0 && <CountUnit value={days} label="days" />}
                    <CountUnit value={hours} label="hrs" />
                    <CountUnit value={minutes} label="min" />
                    <CountUnit value={seconds} label="sec" />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
                {[
                  { icon: TrendingUp, label: 'Raised', value: formatMoney(auction.totalAuctionRevenue) },
                  { icon: Package, label: 'Items', value: String(auction.items.length) },
                  { icon: Users, label: 'Bidders', value: String(auction.bidders.length) }
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-bg-light dark:bg-bg-dark px-3 xs:px-4 py-4">
                    <Icon size={11} className="text-muted-light dark:text-muted-dark mb-2" aria-hidden="true" />
                    <p className="font-mono font-black text-sm xs:text-base text-text-light dark:text-text-dark leading-none">{value}</p>
                    <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Goal progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Goal Progress</span>
                  <span className="text-[10px] font-mono font-black text-primary-light dark:text-primary-dark">{pct}%</span>
                </div>
                <div
                  className="h-1.5 bg-surface-light dark:bg-surface-dark overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${pct}% of goal reached`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={headerInView ? { width: `${pct}%` } : {}}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary-light dark:bg-primary-dark'}`}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    {formatMoney(auction.totalAuctionRevenue)} raised
                  </span>
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">of {formatMoney(auction.goal)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ITEMS
      ══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 py-10 sm:py-14">
        {/* Available */}
        <section aria-labelledby="available-heading">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <SectionLabel>{isActive ? 'Open for Bidding' : 'All Items'}</SectionLabel>
              <h2 id="available-heading" className="font-quicksand font-black text-2xl xs:text-3xl text-text-light dark:text-text-dark">
                {available.length} Item{available.length !== 1 ? 's' : ''}
                {isActive && (
                  <span className="ml-3 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-[10px] font-mono text-emerald-500 tracking-[0.15em] uppercase font-normal">Live</span>
                  </span>
                )}
              </h2>
            </div>
            {isActive && (
              <div className="hidden xs:flex items-center gap-1.5 px-3 py-2 border border-emerald-500/30 bg-emerald-500/5">
                <Zap size={10} className="text-emerald-500" aria-hidden="true" />
                <span className="text-[9px] font-mono text-emerald-500 tracking-[0.15em] uppercase">Bidding Open</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px items-stretch bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
            {available.map((item, i) => (
              <div key={item.id} className="bg-bg-light dark:bg-bg-dark" id={`item-${item.id}`}>
                <AuctionItemCard item={item} auctionStatus={auction.status} index={i} customAuctionLink={customAuctionLink} />
              </div>
            ))}
          </div>
        </section>

        {/* Sold items */}
        {sold.length > 0 && (
          <section aria-labelledby="sold-heading">
            <div className="mb-6">
              <SectionLabel muted>Sold</SectionLabel>
              <h2 id="sold-heading" className="font-quicksand font-black text-xl xs:text-2xl text-text-light dark:text-text-dark mt-1">
                {sold.length} Item{sold.length !== 1 ? 's' : ''} Sold
              </h2>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-px items-stretch bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
              {sold.map((item, i) => (
                <div key={item.id} className="bg-bg-light dark:bg-bg-dark">
                  <AuctionItemCard item={item} auctionStatus={auction.status} index={i} customAuctionLink={customAuctionLink} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {auction.items.length === 0 && (
          <div className="border border-border-light dark:border-border-dark py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="relative w-14 h-14 border border-border-light dark:border-border-dark flex items-center justify-center">
              <Package size={20} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            </div>
            <div>
              <p className="font-quicksand font-black text-base text-text-light dark:text-text-dark mb-1.5">No items yet</p>
              <p className="text-xs font-mono text-muted-light dark:text-muted-dark">Items will appear here once the auction opens.</p>
            </div>
          </div>
        )}

        {/* How to bid — only show if active */}
        {isActive && (
          <section aria-labelledby="how-heading" className="border border-border-light dark:border-border-dark">
            <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              <SectionLabel>How It Works</SectionLabel>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-px bg-border-light dark:bg-border-dark">
              {[
                { icon: Eye, step: '01', title: 'Browse Items', description: 'Explore all available items and find something you love.' },
                { icon: Gavel, step: '02', title: 'Place Your Bid', description: 'Click Place Bid on any auction item to submit your bid amount.' },
                {
                  icon: ShoppingCart,
                  step: '03',
                  title: 'Win & Checkout',
                  description: "If you win, you'll receive an email with payment and shipping details."
                }
              ].map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="bg-bg-light dark:bg-bg-dark px-5 py-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] font-mono font-black text-primary-light dark:text-primary-dark tracking-widest">{step}</span>
                    <Icon size={13} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                  </div>
                  <h3 className="font-quicksand font-black text-sm text-text-light dark:text-text-dark mb-1.5">{title}</h3>
                  <p className="text-[11px] font-nunito text-muted-light dark:text-muted-dark leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
