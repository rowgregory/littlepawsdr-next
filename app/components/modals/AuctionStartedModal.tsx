'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gavel, Zap, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useCountdown } from '@hooks/useCountdown'
import { store, useUiSelector } from 'app/lib/store/store'
import { setCloseAuctionStartedModal } from 'app/lib/store/slices/uiSlice'

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono font-black text-2xl text-text-light dark:text-text-dark leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mt-1">{label}</span>
    </div>
  )
}

export default function AuctionStartedModal() {
  const { auctionStartedModal, auctionStartedData } = useUiSelector()
  const { days, hours, minutes, done } = useCountdown(auctionStartedData?.endDate)
  const onClose = () => store.dispatch(setCloseAuctionStartedModal())

  return (
    <AnimatePresence>
      {auctionStartedModal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-110 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auction-started-heading"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-120 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark pointer-events-auto overflow-hidden">
              {/* Animated top accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ transformOrigin: 'left' }}
                className="absolute top-0 inset-x-0 h-0.5 bg-emerald-500"
                aria-hidden="true"
              />

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 p-1.5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={14} aria-hidden="true" />
              </button>

              {/* Header */}
              <div className="px-8 pt-10 pb-6 text-center border-b border-border-light dark:border-border-dark">
                {/* Icon */}
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div className="w-16 h-16 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center">
                    <Gavel size={24} className="text-emerald-500" aria-hidden="true" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Zap size={10} className="text-white" />
                  </motion.div>
                  {/* Pulse ring */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 border-2 border-emerald-500"
                    aria-hidden="true"
                  />
                </div>

                {/* Label */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="block w-6 h-px bg-emerald-500" aria-hidden="true" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-emerald-500">Now Live</p>
                  </div>
                  <span className="block w-6 h-px bg-emerald-500" aria-hidden="true" />
                </div>

                <h2 id="auction-started-heading" className="font-quicksand font-black text-xl text-text-light dark:text-text-dark leading-snug mb-2">
                  {auctionStartedData?.auctionTitle}
                </h2>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark">
                  The auction is now open — {auctionStartedData?.itemCount} item{auctionStartedData?.itemCount !== 1 ? 's' : ''} up for bidding.
                </p>
              </div>

              {/* Countdown */}
              <div className="px-8 py-6 border-b border-border-light dark:border-border-dark">
                <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark text-center mb-4">
                  Time Remaining
                </p>
                {done ? (
                  <p className="text-center text-xs font-mono text-red-500">Auction has ended</p>
                ) : (
                  <div className="flex items-end justify-center gap-6">
                    {days > 0 && <CountUnit value={days} label="days" />}
                    <CountUnit value={hours} label="hours" />
                    <CountUnit value={minutes} label="min" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-6 flex flex-col gap-3">
                <Link
                  href={`/auctions/${auctionStartedData?.auctionId}`}
                  className="group flex items-center justify-between px-5 py-3.5 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label={`Go to ${auctionStartedData?.auctionTitle}`}
                >
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-black">Start Bidding</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
                <button
                  onClick={onClose}
                  className="px-5 py-3 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark border border-border-light dark:border-border-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
