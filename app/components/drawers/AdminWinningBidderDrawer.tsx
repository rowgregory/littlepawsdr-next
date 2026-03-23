'use client'

import { setCloseWinningBidderDrawer } from 'app/lib/store/slices/uiSlice'
import { store, useUiSelector } from 'app/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Package, Truck, MapPin, Mail, Phone, Copy } from 'lucide-react'
import { IAddress } from 'types/entities/address'

// ─── Types ────────────────────────────────────────────────────────────────────
interface IWonItem {
  id: string
  name: string
  soldPrice: number
  requiresShipping: boolean
  shippingCosts?: number | null
}

interface IWinningBidder {
  id: string
  auctionId: string
  winningBidPaymentStatus: string
  auctionItemPaymentStatus: string
  auctionPaymentNotificationEmailHasBeenSent: boolean
  emailNotificationCount: number
  elapsedTimeSinceAuctionItemWon?: string | null
  processingFee?: number | null
  totalPrice?: number | null
  itemSoldPrice?: number | null
  shipping?: number | null
  shippingStatus: string
  shippingProvider?: string | null
  trackingNumber?: string | null
  payPalId?: string | null
  paidOn?: string | null
  createdAt: string
  auctionItems: IWonItem[]
  user: {
    id: string
    firstName?: string | null
    lastName?: string | null
    email: string
    phone?: string | null
    anonymousBidding: boolean
    address?: IAddress | null
  }
  auction: {
    title: string
  }
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center gap-2">
          <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h3 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{title}</h3>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border-light dark:border-border-dark last:border-0">
      <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark shrink-0">{label}</span>
      <span className="text-xs font-mono text-text-light dark:text-text-dark text-right">{value ?? '—'}</span>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ value }: { value: string }) {
  const isPaid = value === 'PAID'
  const isAwaiting = value === 'AWAITING_PAYMENT'
  return (
    <span
      className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
        isPaid
          ? 'bg-green-500/10 text-green-500'
          : isAwaiting
            ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
            : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
      }`}
    >
      {value.replace(/_/g, ' ')}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminWinningBidderDrawer() {
  const { adminWinningBidderDrawer, adminWinningBidderData } = useUiSelector()
  const bidder = adminWinningBidderData as IWinningBidder | null

  const onClose = () => store.dispatch(setCloseWinningBidderDrawer())

  const name = [bidder?.user?.firstName, bidder?.user?.lastName].filter(Boolean).join(' ') || bidder?.user?.email || 'Guest'

  const paymentLink = bidder ? `${typeof window !== 'undefined' ? window.location.origin : ''}/auctions/winner/${bidder.id}` : ''

  const itemsTotal = bidder?.auctionItems?.reduce((sum, item) => sum + item.soldPrice, 0) ?? 0

  return (
    <AnimatePresence>
      {adminWinningBidderDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Winning bidder details for ${name}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bg-light dark:bg-bg-dark border-l border-border-light dark:border-border-dark flex flex-col shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Winning Bidder</p>
                </div>
                <h2 className="text-sm font-semibold text-text-light dark:text-text-dark">{name}</h2>
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{bidder.auction?.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="p-1.5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* ── Scrollable content ── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* ── Contact ── */}
              <Section title="Contact">
                <div className="space-y-0">
                  <Row label="Name" value={name} />
                  <Row
                    label="Email"
                    value={
                      <a
                        href={`mailto:${bidder.user.email}`}
                        className="flex items-center gap-1.5 text-primary-light dark:text-primary-dark hover:underline"
                      >
                        <Mail className="w-3 h-3 shrink-0" aria-hidden="true" />
                        {bidder.user.email}
                      </a>
                    }
                  />
                  <Row
                    label="Phone"
                    value={
                      bidder.user.phone ? (
                        <a
                          href={`tel:${bidder.user.phone}`}
                          className="flex items-center gap-1.5 text-primary-light dark:text-primary-dark hover:underline"
                        >
                          <Phone className="w-3 h-3 shrink-0" aria-hidden="true" />
                          {bidder.user.phone}
                        </a>
                      ) : null
                    }
                  />
                  <Row label="Anonymous" value={bidder.user.anonymousBidding ? 'Yes' : 'No'} />
                </div>
              </Section>

              {/* ── Shipping address ── */}
              <Section title="Shipping Address">
                {bidder.user.address ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-xs font-mono text-text-light dark:text-text-dark space-y-0.5">
                      <p>{bidder.user.address.name}</p>
                      <p>{bidder.user.address.addressLine1}</p>
                      {bidder.user.address.addressLine2 && <p>{bidder.user.address.addressLine2}</p>}
                      <p>
                        {bidder.user.address.city}, {bidder.user.address.state} {bidder.user.address.zipPostalCode}
                      </p>
                      <p>{bidder.user.address.country}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No address on file</p>
                )}
              </Section>

              {/* ── Items won ── */}
              <Section title={`Items Won (${bidder.auctionItems?.length ?? 0})`}>
                <div className="space-y-2">
                  {bidder.auctionItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 py-2 border-b border-border-light dark:border-border-dark last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        <Package className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-text-light dark:text-text-dark">{item.name}</p>
                          {item.requiresShipping && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Truck className="w-3 h-3 text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                                {item.shippingCosts ? `+$${Number(item.shippingCosts).toLocaleString()} shipping` : 'Requires shipping'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark shrink-0">
                        ${Number(item.soldPrice).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Items</span>
                      <span className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark">${itemsTotal.toLocaleString()}</span>
                    </div>
                    {(bidder.shipping ?? 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Shipping</span>
                        <span className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark">
                          ${Number(bidder.shipping).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {(bidder.processingFee ?? 0) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                          Processing fee
                        </span>
                        <span className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark">
                          ${Number(bidder.processingFee).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-border-light dark:border-border-dark">
                      <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-text-light dark:text-text-dark font-semibold">
                        Total
                      </span>
                      <span className="text-sm font-mono tabular-nums font-semibold text-primary-light dark:text-primary-dark">
                        ${Number(bidder.totalPrice ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Section>

              {/* ── Payment ── */}
              <Section title="Payment">
                <div className="space-y-0">
                  <Row label="Status" value={<Badge value={bidder.winningBidPaymentStatus} />} />
                  <Row label="Emails Sent" value={bidder.emailNotificationCount} />
                  <Row
                    label="Paid On"
                    value={
                      bidder.paidOn
                        ? new Date(bidder.paidOn).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : null
                    }
                  />
                </div>
              </Section>

              {/* ── Shipping status ── */}
              <Section title="Shipping">
                <div className="space-y-0">
                  <Row label="Status" value={<Badge value={bidder.shippingStatus} />} />
                </div>
              </Section>
            </div>

            {/* ── Footer — payment link ── */}
            {bidder.winningBidPaymentStatus !== 'PAID' && (
              <div className="shrink-0 px-5 py-4 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-2">Payment Link</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark overflow-hidden">
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate">{paymentLink}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(paymentLink)}
                    aria-label="Copy payment link"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark text-[10px] font-mono tracking-widest uppercase"
                  >
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    Copy
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
