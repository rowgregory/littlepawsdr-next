'use client'

import { useCountdown } from '@hooks/useCountdown'
import { motion, useInView } from 'framer-motion'
import { Gavel, Clock, ChevronRight, TrendingUp, Users, Package, Zap } from 'lucide-react'
import Link from 'next/link'
import { IAuctionItem } from 'types/entities/auction-item'
import Picture from '../common/Picture'
import { IAuction } from 'types/entities/auction'
import { useEffect, useRef } from 'react'
import { formatMoney } from 'app/utils/currency.utils'
import { useRouter } from 'next/navigation'
import { pusherClient } from 'app/lib/pusher-client'

// ─── Countdown unit ───────────────────────────────────────────────────────────
function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono font-black text-lg text-text-light dark:text-text-dark leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mt-0.5">{label}</span>
    </div>
  )
}

function Countdown({ endDate }: { endDate: Date }) {
  const { days, hours, minutes, seconds, done } = useCountdown(endDate)
  if (done) return <span className="text-[10px] font-mono text-red-500 tracking-widest uppercase">Ended</span>
  return (
    <div className="flex items-end gap-2.5" aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`}>
      {days > 0 && <CountUnit value={days} label="d" />}
      <CountUnit value={hours} label="h" />
      <CountUnit value={minutes} label="m" />
      <CountUnit value={seconds} label="s" />
    </div>
  )
}

// ─── Item Strip ───────────────────────────────────────────────────────────────
function ItemStrip({ items }: { items: IAuctionItem[] }) {
  const shown = items.slice(0, 4)
  const extra = items.length - shown.length

  return (
    <div className="flex items-center gap-1.5">
      {shown.map((item) => {
        const photo = item.photos.find((p) => p.isPrimary) ?? item.photos[0]
        return (
          <div
            key={item.id}
            className="w-10 h-10 shrink-0 border border-border-light dark:border-border-dark overflow-hidden bg-surface-light dark:bg-surface-dark"
          >
            {photo ? (
              <Picture priority={false} src={photo.url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={12} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
              </div>
            )}
          </div>
        )
      })}
      {extra > 0 && (
        <div className="w-10 h-10 shrink-0 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center">
          <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">+{extra}</span>
        </div>
      )}
    </div>
  )
}

// ─── Active Auction Card (hero treatment) ─────────────────────────────────────
function ActiveAuctionCard({ auction, index }: { auction: IAuction; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const pct = auction.goal > 0 ? Math.min(100, Math.round((auction.totalAuctionRevenue / auction.goal) * 100)) : 0
  const href = auction.customAuctionLink ? `/auctions/${auction.customAuctionLink}` : `/auctions/${auction.id}`

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label={auction.title}
      className="group relative border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark overflow-hidden"
    >
      {/* Accent line top */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-primary-light dark:bg-primary-dark z-10" aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* ── Left — photo ── */}
        <div className="relative aspect-4/3 lg:aspect-auto lg:min-h-100 overflow-hidden bg-surface-light dark:bg-surface-dark">
          <div className="absolute inset-0 flex items-center justify-center bg-surface-light dark:bg-surface-dark overflow-hidden">
            {/* Dot grid */}
            <div
              className="absolute inset-0 opacity-40 dark:opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
              aria-hidden="true"
            />
            {/* Center monogram */}
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-20 h-20 border border-border-light dark:border-border-dark flex items-center justify-center">
                <div className="w-14 h-14 border border-primary-light/20 dark:border-primary-dark/20 flex items-center justify-center">
                  <span className="font-quicksand font-black text-2xl text-primary-light/20 dark:text-primary-dark/20 tracking-tight select-none">
                    LP
                  </span>
                </div>
              </div>
              <span className="text-[8px] font-mono tracking-[0.5em] uppercase text-muted-light/30 dark:text-muted-dark/30">{auction.title}</span>
            </div>
            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-primary-light/30 dark:border-primary-dark/30" aria-hidden="true" />
            <div
              className="absolute top-4 right-4 w-6 h-6 border-t border-r border-primary-light/30 dark:border-primary-dark/30"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-primary-light/30 dark:border-primary-dark/30"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-primary-light/30 dark:border-primary-dark/30"
              aria-hidden="true"
            />
          </div>

          {/* Item strip overlay */}
          {auction.items.length > 0 && (
            <div className="absolute bottom-0 inset-x-0 p-3">
              <ItemStrip items={auction.items} />
            </div>
          )}

          {/* Live badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm px-2.5 py-1.5 border border-border-light dark:border-border-dark">
            <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-emerald-500 font-black">Live</span>
          </div>
        </div>

        {/* ── Right — info ── */}
        <div className="flex flex-col p-6 sm:p-8">
          {/* Label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Active Auction</span>
          </div>

          {/* Title */}
          <h2 className="font-quicksand font-black text-2xl sm:text-3xl text-text-light dark:text-text-dark leading-tight mb-6">{auction.title}</h2>

          {/* Countdown */}
          <div className="mb-6 pb-6 border-b border-border-light dark:border-border-dark">
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-3 flex items-center gap-2">
              <Clock size={10} aria-hidden="true" /> Time Remaining
            </p>
            <Countdown endDate={auction.endDate} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark mb-6">
            {[
              { icon: TrendingUp, label: 'Raised', value: formatMoney(auction.totalAuctionRevenue) },
              { icon: Package, label: 'Items', value: String(auction.items.length) },
              { icon: Users, label: 'Bidders', value: String(auction.bidders.length) }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-bg-light dark:bg-bg-dark px-3 py-3">
                <Icon size={12} className="text-muted-light dark:text-muted-dark mb-1.5" aria-hidden="true" />
                <p className="text-base font-black font-mono text-text-light dark:text-text-dark leading-none">{value}</p>
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Goal progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Goal Progress</span>
              <span className="text-[10px] font-mono font-black text-primary-light dark:text-primary-dark">{pct}%</span>
            </div>
            <div className="h-1.5 bg-surface-light dark:bg-surface-dark overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : {}}
                transition={{ duration: 1, delay: index * 0.1 + 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full bg-primary-light dark:bg-primary-dark"
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{formatMoney(auction.totalAuctionRevenue)} raised</span>
              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">of {formatMoney(auction.goal)}</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={href}
            className="group/btn mt-auto flex items-center justify-between px-6 py-4 bg-primary-light dark:bg-primary-dark text-white hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            aria-label={`View ${auction.title} auction`}
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-black">Place a Bid</span>
            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-150" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Past Auction Card ────────────────────────────────────────────────────────
function PastAuctionCard({ auction, index }: { auction: IAuction; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const pct = auction.goal > 0 ? Math.min(100, Math.round((auction.totalAuctionRevenue / auction.goal) * 100)) : 0

  const featuredPhoto = auction.items.flatMap((i) => i.photos).find((p) => p.isPrimary) ?? auction.items[0]?.photos?.[0]

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark overflow-hidden"
      aria-label={auction.title}
    >
      {/* Photo */}
      <div className="relative aspect-3/2 overflow-hidden bg-surface-light dark:bg-surface-dark">
        {featuredPhoto ? (
          <Picture
            priority={false}
            src={featuredPhoto.url}
            alt={`Featured item from ${auction.title}`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gavel size={32} className="text-border-light dark:text-border-dark" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm px-2.5 py-1 border border-border-light dark:border-border-dark">
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark font-black">Ended</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-snug mb-3">{auction.title}</h3>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={11} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
            <span className="text-xs font-mono font-black text-text-light dark:text-text-dark">{formatMoney(auction.totalAuctionRevenue)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package size={11} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
            <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{auction.items.length} items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={11} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
            <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{auction.bidders.length} bidders</span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-0.5 bg-surface-light dark:bg-surface-dark overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${pct}%` } : {}}
            transition={{ duration: 0.8, delay: (index % 3) * 0.07 + 0.3 }}
            className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-muted-light dark:bg-muted-dark'}`}
          />
        </div>
        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
          {pct}% of {formatMoney(auction.goal)} goal
        </p>
      </div>
    </motion.article>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border-light dark:border-border-dark py-24 flex flex-col items-center justify-center gap-6 text-center px-6"
    >
      <div className="relative">
        <div className="w-16 h-16 border border-border-light dark:border-border-dark flex items-center justify-center">
          <Gavel size={24} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
      </div>
      <div>
        <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark mb-2">No auctions yet</p>
        <p className="text-sm font-mono text-muted-light dark:text-muted-dark max-w-xs leading-relaxed">
          Check back soon — we run auctions throughout the year to support our rescue dogs.
        </p>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicAuctionsClient({ auctions }) {
  const active = auctions.filter((a) => a.status === 'ACTIVE')
  const past = auctions.filter((a) => a.status === 'ENDED')
  const router = useRouter()
  const routerRef = useRef(router)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  const activeAuctionId = active[0]?.id

  useEffect(() => {
    if (!activeAuctionId) return

    const channel = pusherClient.subscribe(`auction-${activeAuctionId}`)

    channel.bind('auction-started', () => routerRef.current.refresh())
    channel.bind('auction-ended', () => routerRef.current.refresh())
    channel.bind('auction-updated', () => routerRef.current.refresh())

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`auction-${activeAuctionId}`)
    }
  }, [activeAuctionId])

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* ── Header ── */}
        <header ref={headerRef} className="mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Little Paws Dachshund Rescue
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-quicksand font-black text-4xl sm:text-5xl lg:text-6xl text-text-light dark:text-text-dark leading-[1.05] mb-4"
          >
            Rescue
            <br className="sm:hidden" /> Auctions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="text-base sm:text-lg font-mono text-muted-light dark:text-muted-dark max-w-xl leading-relaxed"
          >
            Bid on incredible items and experiences — every dollar goes directly to rescuing and rehabilitating dachshunds in need.
          </motion.p>

          {/* Impact strip */}
          {auctions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.22 }}
              className="flex flex-wrap items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark mt-8 w-fit"
            >
              {[
                { icon: Zap, label: 'Total Raised', value: formatMoney(auctions.reduce((s, a) => s + a.totalAuctionRevenue, 0)) },
                { icon: Package, label: 'Items Auctioned', value: String(auctions.reduce((s, a) => s + a.items.length, 0)) },
                { icon: Users, label: 'Bidders', value: String(auctions.reduce((s, a) => s + a.bidders.length, 0)) }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-bg-light dark:bg-bg-dark px-5 py-3.5 flex items-center gap-3">
                  <Icon size={13} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black font-mono text-text-light dark:text-text-dark leading-none">{value}</p>
                    <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </header>

        {/* ── Active auctions ── */}
        {active.length > 0 && (
          <section aria-labelledby="active-heading" className="mb-16 sm:mb-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
              <h2 id="active-heading" className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                Live Now
              </h2>
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
            </div>
            <div className="space-y-6">
              {active.map((auction, i) => (
                <ActiveAuctionCard key={auction.id} auction={auction} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── No auctions at all ── */}
        {auctions.length === 0 && <EmptyState />}

        {/* ── Past auctions ── */}
        {past.length > 0 && (
          <section aria-labelledby="past-heading">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-6 h-px bg-border-light dark:bg-border-dark shrink-0" aria-hidden="true" />
              <h2 id="past-heading" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                Past Auctions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
              {past.map((auction, i) => (
                <div key={auction.id} className="bg-bg-light dark:bg-bg-dark">
                  <PastAuctionCard auction={auction} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
