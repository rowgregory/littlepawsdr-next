'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Receipt, Package, Heart, ChevronLeft, User } from 'lucide-react'
import { fadeUp } from 'app/lib/constants/motion'
import Picture from '../common/Picture'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { store } from 'app/lib/store/store'
import { clearCart } from 'app/lib/store/slices/cartSlice'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ORDER_TYPE_CONFIG: Record<string, { label: string; message: string }> = {
  ONE_TIME_DONATION: {
    label: 'Donation Confirmed',
    message: 'Your generosity helps rescued dachshunds find their forever homes. Every dollar makes a real difference.'
  },
  RECURRING_DONATION: {
    label: 'Recurring Donation Active',
    message: 'Your ongoing support means our dogs get consistent care all year long. Thank you for being a monthly hero.'
  },
  WELCOME_WIENER: {
    label: 'Welcome Wieners Confirmed',
    message: "You're now sponsoring a dachshund in our care. They're lucky to have you in their corner."
  },
  PRODUCT: {
    label: 'Order Confirmed',
    message: 'Your order is confirmed. Every purchase supports the dogs in our rescue program.'
  },
  MIXED: {
    label: 'Order Confirmed',
    message: 'Your order is confirmed. Every purchase supports the dogs in our rescue program.'
  },
  ADOPTION_FEE: {
    label: 'Application Fee Received',
    message:
      "We've received your adoption application fee. Our team will be in touch within 3–5 business days — your perfect dachshund match is out there!"
  },
  AUCTION_PURCHASE: {
    label: 'Payment Confirmed',
    message: "Your auction payment has been received. Thank you for supporting Little Paws — we'll be in touch with details about your item shortly."
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderConfirmationClient({ order }) {
  const config = ORDER_TYPE_CONFIG[order?.type] ?? ORDER_TYPE_CONFIG['ONE_TIME_DONATION']
  const subtotal = Number(order?.totalAmount) - Number(order?.coverFees ? order?.feesCovered : 0)
  const session = useSession()

  useEffect(() => {
    store.dispatch(clearCart())
  }, [])

  return (
    <div className="min-h-dvh bg-white dark:bg-bg-dark">
      <div className="max-w-2xl mx-auto px-4 430:px-6 py-12 430:py-16">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
              <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-cyan-600 dark:text-violet-400">
                Little Paws Dachshund Rescue
              </span>
            </div>
            {session?.data?.user ? (
              <Link
                href="/member/portal"
                className="flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
              >
                <User className="w-3 h-3" aria-hidden="true" />
                Portal
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
              >
                <ChevronLeft className="w-3 h-3" aria-hidden="true" />
                Home
              </Link>
            )}
          </div>

          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative shrink-0"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-cyan-600/10 dark:bg-violet-400/10">
                <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-violet-400" aria-hidden="true" />
              </div>
              <motion.div
                animate={{
                  scale: [0.8, 1.8, 0.8],
                  opacity: [0.5, 0, 0]
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                  times: [0, 0.7, 1]
                }}
                className="absolute inset-0 bg-cyan-600/20 dark:bg-violet-400/20"
                aria-hidden="true"
              />
            </motion.div>
            <div>
              <p className="font-changa text-[10px] uppercase tracking-[0.25em] text-cyan-600 dark:text-violet-400 mb-1">{config.label}</p>
              <h1 className="font-changa text-3xl 430:text-4xl uppercase leading-none text-zinc-950 dark:text-text-dark mb-2">
                Thank you, {order?.customerName}!
              </h1>
              <p className="font-lato text-sm text-zinc-500 dark:text-muted-dark leading-relaxed max-w-lg">{config.message}</p>
            </div>
          </div>
        </motion.div>

        {!session?.data?.user && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 flex items-start gap-3 px-4 py-3.5 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <User className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-600 dark:text-violet-400" aria-hidden="true" />
            <p className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
              Have an account?{' '}
              <Link
                href={`/auth/login?email=${encodeURIComponent(order?.customerEmail)}`}
                className="text-cyan-600 dark:text-violet-400 hover:underline underline-offset-2 focus-visible:outline-none"
              >
                Sign in with {order?.customerEmail}
              </Link>{' '}
              to view all your donations and purchases in one place.
            </p>
          </motion.div>
        )}

        {/* ── Receipt ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="border border-zinc-200 dark:border-border-dark mb-6">
          {/* Receipt header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-white/2">
            <div className="flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-zinc-400 dark:text-muted-dark/50" aria-hidden="true" />
              <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">Receipt</span>
            </div>
            <span className="font-changa text-[10px] uppercase tracking-[0.15em] text-zinc-400 dark:text-muted-dark/50 font-mono">
              #{order?.id.slice(-8).toUpperCase()}
            </span>
          </div>

          {/* Items */}

          {order?.items.length > 0 ? (
            <div className="divide-y divide-zinc-200 dark:divide-border-dark">
              {order?.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="shrink-0 w-10 h-10 bg-zinc-100 dark:bg-white/5 overflow-hidden">
                    {item.itemImage ? (
                      <Picture priority={true} src={item.itemImage} alt={item.itemName ?? 'Item'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-zinc-400 dark:text-muted-dark/30" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark truncate">
                      {item.itemName ?? 'Item'}
                    </p>
                    {item.quantity && item.quantity > 1 && (
                      <p className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50 mt-0.5">Qty: {item.quantity}</p>
                    )}
                    {item.isPhysical && (
                      <p className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50 mt-0.5">Shipping details to follow</p>
                    )}
                  </div>
                  <span className="shrink-0 font-changa text-sm tabular-nums text-zinc-950 dark:text-text-dark">
                    ${(item.totalPrice ?? item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="shrink-0 w-10 h-10 bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                <Heart className="w-4 h-4 text-zinc-400 dark:text-muted-dark/30" aria-hidden="true" />
              </div>
              <p className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark">
                {order?.type === 'RECURRING_DONATION'
                  ? 'Recurring Donation'
                  : order?.type === 'AUCTION_PURCHASE'
                    ? 'Auction Purchase'
                    : 'One-Time Donation'}
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="px-5 py-4 border-t border-zinc-200 dark:border-border-dark space-y-2.5">
            {order?.coverFees && Number(order?.feesCovered) > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Subtotal</span>
                  <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Processing fees covered</span>
                  <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">
                    +${Number(order?.feesCovered).toFixed(2)}
                  </span>
                </div>
              </>
            )}
            {order?.isRecurring && order?.recurringFrequency && (
              <div className="flex justify-between items-center">
                <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Frequency</span>
                <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark capitalize">
                  {order?.recurringFrequency.toLowerCase()}
                </span>
              </div>
            )}
            <div
              className={`flex justify-between items-center ${
                (order?.coverFees && Number(order?.feesCovered) > 0) || (order?.isRecurring && order?.recurringFrequency)
                  ? 'pt-2.5 border-t border-zinc-200 dark:border-border-dark'
                  : ''
              }`}
            >
              <span className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark">Total</span>
              <span className="font-changa text-2xl tabular-nums text-cyan-600 dark:text-violet-400">${order?.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="px-5 py-4 border-t border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-white/2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50">Email</span>
              <span className="font-lato text-[10px] text-zinc-600 dark:text-muted-dark truncate max-w-50">{order?.customerEmail}</span>
            </div>
            {order?.paidAt && (
              <div className="flex justify-between items-center">
                <span className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50">Date</span>
                <span className="font-lato text-[10px] text-zinc-600 dark:text-muted-dark">
                  {new Date(order?.paidAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
            {order?.isRecurring && order?.nextBillingDate && (
              <div className="flex justify-between items-center">
                <span className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50">Next billing</span>
                <span className="font-lato text-[10px] text-zinc-600 dark:text-muted-dark">
                  {new Date(order?.nextBillingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Confirmation email note ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="flex items-start gap-3 px-4 py-3 mb-6 border-l-2 border-cyan-600 dark:border-violet-400 bg-cyan-600/5 dark:bg-violet-400/5"
          role="note"
        >
          <Heart className="w-3.5 h-3.5 text-cyan-600 dark:text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-lato text-xs text-zinc-500 dark:text-muted-dark leading-relaxed">
            A confirmation email has been sent to <strong className="text-zinc-950 dark:text-text-dark">{order?.customerEmail}</strong>
          </p>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="flex flex-col 430:flex-row gap-3">
          <Link
            href="/donate"
            className="group relative flex-1 overflow-hidden flex items-center justify-between px-6 py-3.5 font-changa text-sm uppercase tracking-widest text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-violet-500 dark:hover:bg-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-bg-dark"
          >
            <span
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent group-hover:animate-[shimmer_1.4s_ease_infinite] pointer-events-none"
              aria-hidden="true"
            />
            <span>Donate Again</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center px-6 py-3.5 font-changa text-sm uppercase tracking-widest border border-zinc-200 dark:border-border-dark hover:border-cyan-600/30 dark:hover:border-violet-400/30 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-500 dark:text-muted-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
