'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import {
  Trophy,
  Package,
  Truck,
  AlertCircle,
  Loader2,
  Heart,
  ShieldCheck,
  ChevronLeft,
  ArrowLeft,
  Plus,
  CheckCircle,
  CreditCard,
  MapPin,
  Pencil,
  User
} from 'lucide-react'
import Image from 'next/image'
import { IAuctionWinningBidder } from 'types/entities/auction-winning-bidder'
import { fadeUp } from 'app/lib/constants/motion'
import { useUiSelector } from 'app/lib/store/store'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import { createPaymentIntent } from 'app/lib/actions/createPaymentIntent'
import { AddressSectionProps } from 'types/entities/address'
import { UpdateAddressModal } from '../modals/UpdateAddressModal'
import { useDefaultCard } from '@hooks/useDefaultCard'

interface IAuctionWinnerPaymentClient {
  winningBidder: IAuctionWinningBidder
  savedCards: IPaymentMethod[]
}

export function AddressSection({ address }: AddressSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <motion.div
      key="card-form"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={3}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
          <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">Shipping Address</span>
        </div>

        {address ? (
          <div className="border border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-surface-dark">
            <div className="flex items-start justify-between gap-4 px-4 py-3.5">
              <div className="flex items-start gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark leading-snug">{address.name}</p>
                  <p className="font-lato text-xs text-zinc-500 dark:text-muted-dark mt-0.5 leading-relaxed">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                    <br />
                    {address.city}, {address.state} {address.zipPostalCode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label="Edit shipping address"
                className="shrink-0 flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
              >
                <Pencil className="w-3 h-3" aria-hidden="true" />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-3.5 border border-dashed border-zinc-200 dark:border-border-dark hover:border-cyan-600/40 dark:hover:border-violet-400/40 text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 font-changa text-[10px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Add shipping address
          </button>
        )}
      </div>

      <UpdateAddressModal open={modalOpen} onClose={() => setModalOpen(false)} address={address} />
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuctionWinnerPaymentClient({ winningBidder, savedCards }: IAuctionWinnerPaymentClient) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Store ────────────────────────────────────────────────────────────────
  const session = useSession()
  const { isDark } = useUiSelector()

  // ── Hooks ────────────────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const [cardComplete, setCardComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveCard, setSaveCard] = useState(false)
  const [coverFees, setCoverFees] = useState(true)
  const [processingStatus, setProcessingStatus] = useState('idle')
  const [useNewCard, setUseNewCard] = useState(savedCards?.length === 0)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards?.[0]?.stripePaymentId ?? null)

  const alreadyPaid = winningBidder?.winningBidPaymentStatus === 'PAID'
  const total = winningBidder?.auctionItems.reduce((sum, item) => sum + item.soldPrice, 0)
  const shipping = winningBidder?.shipping ?? 0
  const processingFee = Math.round(((total + 0.3) / (1 - 0.029) - total) * 100) / 100
  const finalAmount = coverFees ? Math.round((total + shipping + processingFee) * 100) / 100 : total + shipping
  const feesCovered = coverFees ? processingFee : 0

  const name = `${winningBidder?.user.firstName} ${winningBidder?.user.lastName}`
  const email = session.data?.user?.email
  const userId = session.data?.user?.id

  const usingSavedCard = !!selectedCardId && !useNewCard && session.data?.user

  useDefaultCard(savedCards, setSelectedCardId)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)
    setProcessingStatus('processing')

    try {
      if (usingSavedCard) {
        const result = await createPaymentIntent({
          amount: Math.round(finalAmount * 100),
          name,
          email,
          orderType: 'AUCTION_PURCHASE',
          userId,
          coverFees,
          feesCovered,
          savedCardId: selectedCardId,
          address: winningBidder?.user?.address,
          winningBidderId: winningBidder.id
        })

        if (!result.success) {
          throw new Error(result.error)
        }

        setupPusherListenerOneTime(
          result.paymentIntentId!,
          false, // saved card — already saved
          selectedCardId,
          processingStatus,
          setError,
          setProcessingStatus,
          setLoading
        )
      } else {
        // ── New card — confirmed client-side ──
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const intentResult = await createPaymentIntent({
          amount: Math.round(finalAmount * 100),
          name,
          email,
          orderType: 'AUCTION_PURCHASE',
          userId,
          saveCard,
          coverFees,
          feesCovered,
          address: winningBidder?.user?.address,
          winningBidderId: winningBidder.id
        })

        if (!intentResult.success) throw new Error(intentResult.error)

        const result = await stripe.confirmCardPayment(intentResult.clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email }
          }
        })

        if (result.error) {
          setProcessingStatus('failed')
          setError(result.error.message || 'Payment failed')
        } else if (result.paymentIntent?.status === 'succeeded') {
          setupPusherListenerOneTime(
            result.paymentIntent.id,
            saveCard,
            getPaymentMethodId(result.paymentIntent.payment_method),
            processingStatus,
            setError,
            setProcessingStatus,
            setLoading
          )
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  // ── Already paid state ──────────────────────────────────────────────────────
  if (alreadyPaid) {
    const itemsTotal = winningBidder?.auctionItems.reduce((sum, item) => sum + item.soldPrice, 0)

    return (
      <div className="min-h-dvh bg-white dark:bg-bg-dark flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Receipt header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" />
              <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-cyan-600 dark:text-violet-400">Receipt</span>
              <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" />
            </div>
            <h1 className="font-changa text-2xl uppercase text-zinc-950 dark:text-text-dark mb-1">Payment Confirmed</h1>
            <p className="font-lato text-xs text-zinc-400 dark:text-muted-dark">
              {winningBidder?.paidOn
                ? new Date(winningBidder?.paidOn).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : '—'}
            </p>
          </div>

          {/* Receipt body */}
          <div className="border border-zinc-200 dark:border-border-dark">
            {/* Auction */}
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-white/2">
              <p className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">{winningBidder?.auction.title}</p>
            </div>

            {/* Items */}
            <div className="divide-y divide-zinc-200 dark:divide-border-dark">
              {winningBidder?.auctionItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Package className="w-3.5 h-3.5 text-zinc-400 dark:text-muted-dark/50 shrink-0" aria-hidden="true" />
                    <p className="font-lato text-sm text-zinc-950 dark:text-text-dark truncate">{item.name}</p>
                  </div>
                  <span className="font-changa text-sm tabular-nums text-zinc-950 dark:text-text-dark shrink-0">
                    ${item.soldPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t border-zinc-200 dark:border-border-dark space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Items</span>
                <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">${itemsTotal.toLocaleString()}</span>
              </div>
              {(winningBidder?.shipping ?? 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Shipping</span>
                  <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">
                    ${Number(winningBidder?.shipping).toLocaleString()}
                  </span>
                </div>
              )}
              {(winningBidder?.processingFee ?? 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Processing fee</span>
                  <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">
                    ${Number(winningBidder?.processingFee).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-200 dark:border-border-dark flex justify-between items-center">
                <span className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark">Total Paid</span>
                <span className="font-changa text-xl tabular-nums text-cyan-600 dark:text-violet-400">
                  ${Number(winningBidder?.totalPrice ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Thank you */}
            <div className="px-5 py-4 border-t border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-white/2 flex items-start gap-3">
              <Heart className="w-3.5 h-3.5 text-cyan-600 dark:text-violet-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-lato text-xs text-zinc-500 dark:text-muted-dark leading-relaxed">
                Thank you for supporting Little Paws Dachshund Rescue, {winningBidder?.user?.firstName}. Your generosity helps the dogs in our care
                find their forever homes.
              </p>
            </div>
          </div>

          {/* Back to account */}
          <div className="mt-6 text-center">
            <Link
              href="/member/portal"
              className="inline-flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" aria-hidden="true" />
              Back to My Account
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-white dark:bg-bg-dark">
      <div className="max-w-4xl mx-auto px-4 430:px-6 py-12 430:py-16">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
              <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-cyan-600 dark:text-violet-400">
                {winningBidder?.auction.title}
              </span>
            </div>
            <Link
              href="/member/portal"
              className="flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors"
            >
              <User className="w-3 h-3" aria-hidden="true" />
              Portal
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-cyan-600/10 dark:bg-violet-400/10">
              <Trophy className="w-5 h-5 text-cyan-600 dark:text-violet-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-changa text-3xl 430:text-4xl uppercase leading-none text-zinc-950 dark:text-text-dark mb-2">
                Congratulations, {winningBidder?.user?.firstName}!
              </h1>
              <p className="font-lato text-sm text-zinc-500 dark:text-muted-dark leading-relaxed max-w-lg">
                You won {winningBidder?.auctionItems.length === 1 ? 'an item' : `${winningBidder?.auctionItems.length} items`} in the auction.
                Complete your payment below to claim {winningBidder?.auctionItems.length === 1 ? 'it' : 'them'}.
              </p>
            </div>
          </div>
        </motion.div>

        {winningBidder.user?.firstName && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.5} className="mb-6">
            <div className="border-l-2 border-cyan-600 dark:border-violet-400 pl-4">
              <p className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark mb-0.5">Paying as</p>
              <p className="font-changa text-lg uppercase leading-none text-zinc-950 dark:text-text-dark">
                {[winningBidder.user.firstName, winningBidder.user.lastName].filter(Boolean).join(' ')}
              </p>
              <p className="font-lato text-xs text-zinc-400 dark:text-muted-dark/50 mt-0.5">{winningBidder.user.email}</p>
            </div>
          </motion.div>
        )}

        {/* ── Two column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ── LEFT: Payment form ── */}
          <div className="space-y-5">
            {/* ── Saved cards / new card ── */}
            {session?.data?.user && savedCards.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
                  <label className="block font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">
                    Payment Method
                  </label>
                </div>

                {!useNewCard ? (
                  <div className="space-y-2">
                    {savedCards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCardId(card.stripePaymentId)}
                        aria-pressed={selectedCardId === card.stripePaymentId}
                        className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400 ${
                          selectedCardId === card.stripePaymentId
                            ? 'border-cyan-600 dark:border-violet-400 bg-cyan-600/5 dark:bg-violet-400/5'
                            : 'border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-surface-dark hover:border-cyan-600/40 dark:hover:border-violet-400/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard
                            className={`w-4 h-4 shrink-0 ${
                              selectedCardId === card.stripePaymentId ? 'text-cyan-600 dark:text-violet-400' : 'text-zinc-400 dark:text-muted-dark/50'
                            }`}
                            aria-hidden="true"
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark">
                                {card.cardBrand} •••• {card.cardLast4}
                              </p>
                              {card.isDefault && (
                                <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-cyan-600/10 dark:bg-violet-400/10 text-cyan-600 dark:text-violet-400">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50 mt-0.5">
                              Expires {card.cardExpMonth.toString().padStart(2, '0')}/{card.cardExpYear}
                            </p>
                          </div>
                        </div>
                        {selectedCardId === card.stripePaymentId && (
                          <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-violet-400 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setUseNewCard(true)
                        setSelectedCardId(null)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 border border-dashed border-zinc-200 dark:border-border-dark hover:border-cyan-600/40 dark:hover:border-violet-400/40 text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 font-changa text-[10px] uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Use a different card
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setUseNewCard(false)
                      setSelectedCardId(savedCards[0]?.stripePaymentId ?? null)
                    }}
                    className="flex items-center gap-1.5 font-changa text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors focus-visible:outline-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    Use a saved card
                  </button>
                )}
              </motion.div>
            )}

            {/* ── Card element ── */}
            {(!session?.data?.user || savedCards.length === 0 || useNewCard) && (
              <AnimatePresence>
                <motion.div
                  key="card-form"
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={2}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
                    <label id="card-label" className="block font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">
                      Card Details
                    </label>
                  </div>
                  <div
                    role="group"
                    aria-labelledby="card-label"
                    className="px-3.5 py-3.5 border-l-2 border-l-cyan-600 dark:border-l-violet-400 border-t border-r border-b border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-surface-dark transition-colors duration-200 focus-within:border-cyan-600 dark:focus-within:border-violet-400"
                  >
                    <CardElement
                      onChange={(e) => {
                        setCardComplete(e.complete)
                        if (e.error) setError(e.error.message ?? null)
                        else setError(null)
                      }}
                      options={{
                        style: {
                          base: {
                            color: isDark ? '#f1f0ff' : '#09090b',
                            backgroundColor: isDark ? '#13131f' : '#f9fafb',
                            fontSize: '14px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            '::placeholder': { color: isDark ? '#4a4a6a' : '#a1a1aa' },
                            iconColor: isDark ? '#7c3aed' : '#0891b2'
                          },
                          invalid: { color: '#ef4444' }
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ShieldCheck className="w-3 h-3 text-zinc-400 dark:text-muted-dark/50 shrink-0" aria-hidden="true" />
                    <p className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50">Secured and encrypted by Stripe</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <AddressSection address={winningBidder?.user?.address} />

            {/* ── Options ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
                <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">Options</span>
              </div>

              <div className="border border-zinc-200 dark:border-border-dark divide-y divide-zinc-200 dark:divide-border-dark">
                {/* Cover fees */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={coverFees}
                  onClick={() => setCoverFees(!coverFees)}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-zinc-50 dark:bg-surface-dark hover:bg-zinc-100 dark:hover:bg-white/3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Heart
                      className={`w-4 h-4 shrink-0 ${coverFees ? 'text-cyan-600 dark:text-violet-400' : 'text-zinc-400 dark:text-muted-dark/50'}`}
                      aria-hidden="true"
                    />
                    <div className="text-left min-w-0">
                      <p className="font-changa text-xs uppercase tracking-wide leading-none mb-0.5 text-zinc-950 dark:text-text-dark">
                        Cover processing fees
                      </p>
                      <p className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50 leading-relaxed">
                        Add ${processingFee?.toFixed(2)} so 100% goes to the dogs
                      </p>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${
                      coverFees ? 'bg-cyan-600 dark:bg-violet-500' : 'bg-zinc-300 dark:bg-border-dark'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${
                        coverFees ? 'translate-x-0.5' : '-translate-x-4.5'
                      }`}
                    />
                  </div>
                </button>

                {/* Save card */}
                {session?.data?.user && (!selectedCardId || useNewCard) && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={saveCard}
                    onClick={() => setSaveCard(!saveCard)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-zinc-50 dark:bg-surface-dark hover:bg-zinc-100 dark:hover:bg-white/3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ShieldCheck
                        className={`w-4 h-4 shrink-0 ${saveCard ? 'text-cyan-600 dark:text-violet-400' : 'text-zinc-400 dark:text-muted-dark/50'}`}
                        aria-hidden="true"
                      />
                      <div className="text-left min-w-0">
                        <p className="font-changa text-xs uppercase tracking-wide leading-none mb-0.5 text-zinc-950 dark:text-text-dark">Save card</p>
                        <p className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50">One-click checkout next time</p>
                      </div>
                    </div>
                    <div
                      aria-hidden="true"
                      className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${
                        saveCard ? 'bg-cyan-600 dark:bg-violet-500' : 'bg-zinc-300 dark:bg-border-dark'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${
                          saveCard ? 'translate-x-0.5' : '-translate-x-4.5'
                        }`}
                      />
                    </div>
                  </button>
                )}
              </div>
            </motion.div>

            {/* ── Error ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  aria-live="assertive"
                  className="flex items-start gap-3 px-4 py-3 border-l-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-400/5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500 dark:text-red-400" aria-hidden="true" />
                  <p className="font-lato text-xs text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Submit ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={(!cardComplete && !selectedCardId) || loading}
                aria-disabled={(!cardComplete && !selectedCardId) || loading}
                className="group relative w-full overflow-hidden font-changa uppercase tracking-widest disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-bg-dark"
              >
                {/* Shimmer */}
                <span
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.4s_ease_infinite] pointer-events-none z-10"
                  aria-hidden="true"
                />
                {loading ? (
                  <div className="flex items-center justify-center gap-3 px-6 py-3.5 bg-cyan-600 dark:bg-violet-500 text-white text-sm">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                    <span>Processing...</span>
                    <span className="sr-only">Please wait while your payment is processed</span>
                  </div>
                ) : (
                  <div className={`flex ${!cardComplete && !selectedCardId ? 'opacity-40' : ''}`}>
                    <div className="flex-1 flex items-center justify-center px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 dark:bg-violet-500 dark:hover:bg-violet-400 text-white text-sm transition-colors duration-200">
                      Complete Payment
                    </div>
                    <div className="flex items-center justify-center px-6 py-3.5 bg-cyan-700 dark:bg-violet-600 text-white text-lg tabular-nums transition-colors duration-200">
                      ${coverFees ? finalAmount.toFixed(2) : finalAmount.toFixed(2)}
                    </div>
                  </div>
                )}
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} className="lg:sticky lg:top-8">
            <div className="border border-zinc-200 dark:border-border-dark">
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-zinc-400 dark:text-muted-dark/50" aria-hidden="true" />
                  <span className="font-changa text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark">Order Summary</span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-zinc-200 dark:divide-border-dark">
                {winningBidder?.auctionItems.map((item) => {
                  const photo = item.photos.find((p) => p.isPrimary) ?? item.photos[0]
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                      <div className="shrink-0 w-14 h-14 bg-zinc-200 dark:bg-white/5 overflow-hidden">
                        {photo ? (
                          <Image src={photo.url} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-zinc-400 dark:text-muted-dark/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark leading-snug truncate">
                          {item.name}
                        </p>
                        {item.requiresShipping && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Truck className="w-3 h-3 text-zinc-400 dark:text-muted-dark/50 shrink-0" aria-hidden="true" />
                            <span className="font-lato text-[10px] text-zinc-400 dark:text-muted-dark/50">
                              {item.shippingCosts ? `+$${item.shippingCosts.toLocaleString()} shipping` : 'Ships separately'}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="shrink-0 font-changa text-sm tabular-nums text-zinc-950 dark:text-text-dark">
                        ${item.soldPrice.toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 border-t border-zinc-200 dark:border-border-dark space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Items</span>
                  <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">${total?.toLocaleString()}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Shipping</span>
                    <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">${shipping?.toLocaleString()}</span>
                  </div>
                )}
                {processingFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-xs text-zinc-500 dark:text-muted-dark">Processing fee</span>
                    <span className="font-changa text-xs tabular-nums text-zinc-950 dark:text-text-dark">${processingFee?.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-zinc-200 dark:border-border-dark flex justify-between items-center">
                  <span className="font-changa text-xs uppercase tracking-wide text-zinc-950 dark:text-text-dark">Total due</span>
                  <span className="font-changa text-xl tabular-nums text-cyan-600 dark:text-violet-400">${finalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
