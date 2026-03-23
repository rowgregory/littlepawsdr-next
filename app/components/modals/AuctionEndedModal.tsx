'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gavel, Trophy, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatMoney } from 'app/utils/currency.utils'
import { store, useUiSelector } from 'app/lib/store/store'
import { setCloseAuctionEndedModal } from 'app/lib/store/slices/uiSlice'

export default function AuctionEndedModal() {
  const { auctionEndedModal, auctionEndedData } = useUiSelector()
  const onClose = () => store.dispatch(setCloseAuctionEndedModal())

  return (
    <AnimatePresence>
      {auctionEndedModal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auction-ended-heading"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark pointer-events-auto overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />

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
                    <Trophy size={24} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-light dark:bg-primary-dark flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Gavel size={10} className="text-white" />
                  </motion.div>
                </div>

                {/* Label */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Auction Closed</p>
                  <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                </div>

                <h2 id="auction-ended-heading" className="font-quicksand font-black text-xl text-text-light dark:text-text-dark leading-snug mb-2">
                  {auctionEndedData?.auctionTitle}
                </h2>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark">
                  This auction has ended. Thank you to everyone who participated!
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-border-light dark:bg-border-dark border-b border-border-light dark:border-border-dark">
                {[
                  { label: 'Raised', value: formatMoney(auctionEndedData?.totalRaised) },
                  { label: 'Items', value: String(auctionEndedData?.itemCount) },
                  { label: 'Bidders', value: String(auctionEndedData?.bidderCount) }
                ].map(({ label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="bg-bg-light dark:bg-bg-dark px-4 py-4 text-center"
                  >
                    <p className="text-lg font-black font-mono text-text-light dark:text-text-dark leading-none mb-1">{value}</p>
                    <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">{label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-8 py-6 flex flex-col gap-3">
                <Link
                  onClick={onClose}
                  href={`/auctions/${auctionEndedData?.customAuctionLink}`}
                  className="group flex items-center justify-between px-5 py-3.5 bg-primary-light dark:bg-primary-dark text-white hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  aria-label="View auction results"
                >
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-black">View Results</span>
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
