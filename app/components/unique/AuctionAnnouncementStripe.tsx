'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gavel, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type AuctionStripProps = {
  auction: {
    id: string
    title: string
    status: 'UPCOMING' | 'ACTIVE'
    startDate?: Date | null
    endDate?: Date | null
  }
}

export default function AuctionAnnouncementStrip({ auction }: AuctionStripProps) {
  const [dismissed, setDismissed] = useState(false)
  const isActive = auction?.status === 'ACTIVE'

  if (!auction) return

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden w-full"
          role="banner"
          aria-label={isActive ? 'Auction is live' : 'Upcoming auction announcement'}
        >
          <div
            className="relative w-full flex items-center justify-between px-4 xs:px-5 sm:px-6 py-2 overflow-hidden"
            style={{
              background: isActive
                ? 'linear-gradient(90deg, #7c3aed, #db2777, #ea580c, #db2777, #7c3aed)'
                : 'linear-gradient(90deg, #0e7490, #0891b2, #06b6d4, #0891b2, #0e7490)',
              backgroundSize: '200% 100%',
              animation: 'stripScroll 4s linear infinite'
            }}
          >
            {/* Animated background shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                backgroundSize: '200% 100%'
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />

            {/* Left — icon + text */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Pulse dot */}
              {isActive && (
                <span className="relative shrink-0 flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
              )}

              <Gavel size={13} className="text-white shrink-0" aria-hidden="true" />

              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white truncate">
                {isActive ? (
                  <>
                    <span className="font-black">Live Now</span>
                    <span className="mx-2 opacity-60">—</span>
                    {auction?.title}
                  </>
                ) : (
                  <>
                    <span className="font-black">Coming Soon</span>
                    <span className="mx-2 opacity-60">—</span>
                    {auction?.title}
                  </>
                )}
              </p>
            </div>

            {/* Right — CTA + dismiss */}
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <Link
                href={`/auctions/${auction?.id}`}
                aria-label={isActive ? `Bid now on ${auction?.title}` : `View upcoming auction: ${auction?.title}`}
                className="group inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-white border border-white/40 hover:border-white hover:bg-white/10 px-3 py-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-transparent whitespace-nowrap"
              >
                {isActive ? 'Bid Now' : 'Learn More'}
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
              </Link>

              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss auction announcement"
                className="text-white/60 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>
          </div>

          <style>{`
            @keyframes stripScroll {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
