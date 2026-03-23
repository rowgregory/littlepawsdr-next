'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { fadeUp } from 'app/lib/constants/motion'
import { useUiSelector } from 'app/lib/store/store'
import { useSession } from 'next-auth/react'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { createPaymentIntent } from 'app/lib/actions/createPaymentIntent'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import { ArrowLeft, CheckCircle, CreditCard, Plus } from 'lucide-react'
import { useDefaultCard } from '@hooks/useDefaultCard'

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

export default function PublicDonateClient({ savedCards }: { savedCards: IPaymentMethod[] }) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Store ────────────────────────────────────────────────────────────────
  const session = useSession()
  const { isDark } = useUiSelector()

  // ── Hooks ────────────────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards?.[0]?.id ?? null)
  const [useNewCard, setUseNewCard] = useState(savedCards?.length === 0)

  const [selectedAmount, setSelectedAmount] = useState<number | null>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [useCustom, setUseCustom] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState(session.data.user.email ?? '')
  const [cardComplete, setCardComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveCard, setSaveCard] = useState(false)
  const [coverFees, setCoverFees] = useState(true)
  const [processingStatus, setProcessingStatus] = useState('idle')

  const donationAmount = useCustom ? Math.max(5, parseFloat(customAmount) || 0) : (selectedAmount ?? 0)
  const processingFee = Math.round((donationAmount * 0.029 + 0.3) * 100) / 100
  const feesCovered = coverFees ? processingFee : 0
  const finalAmount = coverFees ? donationAmount + processingFee : donationAmount

  const isValid =
    donationAmount >= 5 && name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (selectedCardId && !useNewCard ? true : cardComplete)

  const usingSavedCard = !!selectedCardId && !useNewCard && session.data?.user

  useDefaultCard(savedCards, setSelectedCardId)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return
    setLoading(true)
    setError(null)
    setProcessingStatus('processing')

    try {
      if (usingSavedCard) {
        const result = await createPaymentIntent({
          amount: Math.round(finalAmount * 100),
          name,
          email,
          orderType: 'ONE_TIME_DONATION',
          userId: session.data?.user?.id,
          coverFees,
          feesCovered,
          savedCardId: selectedCardId
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
          orderType: 'ONE_TIME_DONATION',
          userId: session.data?.user?.id,
          saveCard,
          coverFees,
          feesCovered
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

  return (
    <main className="min-h-dvh px-4 1150:px-0 pt-12 sm:pt-16 pb-24 sm:pb-32 bg-bg-light dark:bg-bg-dark flex flex-col gap-y-20 sm:gap-y-28">
      <div className="max-w-5xl mx-auto w-full">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">One-Time Donation</p>
          </div>
          <h1 className="font-quicksand text-4xl sm:text-5xl font-bold text-text-light dark:text-text-dark leading-tight mb-5">
            Make a <span className="font-light text-muted-light dark:text-muted-dark">Difference</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-light dark:text-on-dark leading-relaxed max-w-2xl">
            Every dollar goes directly to rescue, vetting, and care for our dachshunds.
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-start">
          {/* ── LEFT PANEL ── */}
          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="lg:sticky lg:top-8 space-y-8"
            aria-label="About Little Paws Dachshund Rescue"
          >
            {/* Mission */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Our Mission</p>
              </div>
              <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                Little Paws Dachshund Rescue is a volunteer-run nonprofit dedicated to saving dachshunds and dachshund mixes from shelters,
                surrenders, and neglect — giving every long dog a second chance at a loving forever home.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />

            {/* Impact stats */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-5">Your Impact</p>
              <dl className="space-y-5">
                {[
                  { stat: '1,900+', label: 'Dogs rescued since 2012' },
                  { stat: '100%', label: 'Volunteer-operated' },
                  { stat: 'ME→FL', label: 'Rescue network up & down the East Coast' }
                ].map(({ stat, label }) => (
                  <div key={stat} className="flex items-baseline gap-4">
                    <dt className="font-quicksand font-black text-2xl te  xt-primary-light dark:text-primary-dark tabular-nums shrink-0">{stat}</dt>
                    <dd className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-snug">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Divider */}
            <div className="h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />

            {/* What your donation covers */}
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-4">Where It Goes</p>
              <ul className="space-y-3" aria-label="What your donation covers">
                {[
                  { amount: '$25', desc: 'covers a vet wellness visit' },
                  { amount: '$50', desc: 'funds heartworm treatment' },
                  { amount: '$100', desc: 'sponsors a full rescue intake' }
                ].map(({ amount, desc }) => (
                  <li key={amount} className="flex items-start gap-3">
                    <span className="font-quicksand font-black text-sm text-primary-light dark:text-primary-dark shrink-0 mt-px">{amount}</span>
                    <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-snug">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* ── Logged-in indicator ── */}
            {session?.data?.user && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
                <div className="h-px bg-border-light dark:bg-border-dark mb-8" aria-hidden="true" />
                <div className="flex items-center gap-3">
                  {/* Avatar initials circle */}
                  <div
                    aria-hidden="true"
                    className="shrink-0 w-8 h-8 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30 flex items-center justify-center"
                  >
                    <span className="text-[10px] font-mono font-bold text-primary-light dark:text-primary-dark uppercase">
                      {session.data.user.name
                        ? session.data.user.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join('')
                        : session.data.user.email?.[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Signed in as</p>
                    <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{session.data.user.email}</p>
                  </div>
                  {/* Active dot */}
                  <div aria-hidden="true" className="shrink-0 ml-auto w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark" />
                </div>
              </motion.div>
            )}
          </motion.aside>

          {/* ── RIGHT PANEL — the form ── */}
          <form onSubmit={handleSubmit} noValidate aria-label="One-time donation form" className="w-full">
            {/* ── Preset amounts ── */}
            <motion.fieldset variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-5 border-0 p-0 min-w-0">
              <legend className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-3">Select Amount</legend>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preset donation amounts">
                {PRESET_AMOUNTS.map((amount) => {
                  const isSelected = !useCustom && selectedAmount === amount
                  return (
                    <motion.button
                      key={amount}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setSelectedAmount(amount)
                        setUseCustom(false)
                        setCustomAmount('')
                      }}
                      aria-pressed={isSelected}
                      aria-label={`Donate $${amount}`}
                      className={`
                  relative py-3 text-sm font-black font-quicksand border-2 transition-colors duration-200 overflow-hidden
                  focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                  ${
                    isSelected
                      ? 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                      : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50 hover:text-text-light dark:hover:text-text-dark'
                  }
                `}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            key="sel"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0 }}
                            style={{ originX: 0 }}
                            transition={{ duration: 0.25 }}
                            className="absolute top-0 left-0 right-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                            aria-hidden="true"
                          />
                        )}
                      </AnimatePresence>
                      ${amount}
                    </motion.button>
                  )
                })}
              </div>
            </motion.fieldset>

            {/* ── Custom amount ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-6">
              <label
                htmlFor="custom-amount"
                className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2"
              >
                Custom Amount
                <span className="ml-1 text-muted-light/60 dark:text-muted-dark/60 normal-case tracking-normal font-sans">(min $5)</span>
              </label>
              <div className="relative">
                <span
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-quicksand font-black text-sm pointer-events-none transition-colors duration-200 ${
                    useCustom ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'
                  }`}
                  aria-hidden="true"
                >
                  $
                </span>
                <input
                  id="custom-amount"
                  type="number"
                  min={5}
                  step={1}
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setUseCustom(true)
                    setSelectedAmount(null)
                  }}
                  onFocus={() => {
                    setUseCustom(true)
                    setSelectedAmount(null)
                  }}
                  aria-describedby="custom-amount-hint"
                  className={`
              w-full pl-8 pr-4 py-3 text-sm font-quicksand font-bold border-2 bg-surface-light dark:bg-surface-dark
              text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50
              transition-colors duration-200 focus:outline-none
              ${useCustom ? 'border-primary-light dark:border-primary-dark' : 'border-border-light dark:border-border-dark'}
              focus-visible:border-primary-light dark:focus-visible:border-primary-dark
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            `}
                />
                {useCustom && customAmount && parseFloat(customAmount) < 5 && (
                  <p id="custom-amount-hint" role="alert" className="text-[11px] text-red-500 dark:text-red-400 mt-1.5 font-mono">
                    Minimum donation is $5
                  </p>
                )}
              </div>
            </motion.div>

            {/* ── Amount display ── */}
            <AnimatePresence mode="wait">
              {donationAmount >= 5 && (
                <motion.div
                  key={donationAmount}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex items-center gap-3 mb-6 py-3 px-4 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
                >
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Donating</span>
                  <span className="font-quicksand font-black text-2xl text-primary-light dark:text-primary-dark">${donationAmount}</span>
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark ml-auto">one-time</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Name + Email ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 mb-3">
              <div>
                <label
                  htmlFor="donor-name"
                  className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2"
                >
                  Full Name
                </label>
                <input
                  id="donor-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-required="true"
                  className="w-full px-3.5 py-3 text-sm border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-200 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
                />
              </div>
              <div>
                <label
                  htmlFor="donor-email"
                  className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2"
                >
                  Email
                </label>
                <input
                  id="donor-email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@email.com"
                  value={email || session?.data?.user?.email || ''}
                  onChange={(e) => !session?.data?.user && setEmail(e.target.value)}
                  readOnly={!!session?.data?.user}
                  required
                  aria-required="true"
                  className={`w-full px-3.5 py-3 text-sm border-2 border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-200 focus:outline-none ${
                    session?.data?.user
                      ? 'bg-surface-light dark:bg-surface-dark cursor-not-allowed'
                      : 'bg-surface-light dark:bg-surface-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
                  }`}
                />
                {session?.data?.user && (
                  <p className="mt-1.5 text-[10px] font-mono text-muted-light dark:text-muted-dark">Using your signed-in account email.</p>
                )}
              </div>
            </motion.div>

            {/* ── Saved cards / new card ── */}
            {session?.data?.user && savedCards.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3.5} className="mb-6">
                <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
                  Payment Method
                </label>

                {!useNewCard ? (
                  <div className="space-y-2">
                    {savedCards.map((card) => (
                      <button
                        key={card.stripePaymentId}
                        type="button"
                        onClick={() => setSelectedCardId(card.stripePaymentId)}
                        aria-pressed={selectedCardId === card.stripePaymentId}
                        className={`w-full flex items-center justify-between px-3.5 py-3 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                          selectedCardId === card.stripePaymentId
                            ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                            : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light dark:hover:border-primary-dark'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                          <div className="text-left">
                            <p className="text-xs font-mono text-text-light dark:text-text-dark capitalize">
                              {card.cardBrand} •••• {card.cardLast4}
                            </p>
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                              Expires {card.cardExpMonth.toString().padStart(2, '0')}/{card.cardExpYear}
                            </p>
                          </div>
                        </div>
                        {selectedCardId === card.stripePaymentId && (
                          <CheckCircle className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setUseNewCard(true)
                        setSelectedCardId(null)
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-3 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Use a different card
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Card element shown here when useNewCard is true */}
                    <button
                      type="button"
                      onClick={() => {
                        setUseNewCard(false)
                        setSelectedCardId(savedCards[0]?.stripePaymentId ?? null)
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      Use a saved card
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Card element ── */}
            {(!session?.data?.user || savedCards.length === 0 || useNewCard) && (
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mb-6">
                <label id="card-label" className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
                  Card Details
                </label>
                <div
                  role="group"
                  aria-labelledby="card-label"
                  className="px-3.5 py-3.5 border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-colors duration-200 focus-within:border-primary-light dark:focus-within:border-primary-dark"
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
                          backgroundColor: 'transparent',
                          fontSize: '14px',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          '::placeholder': { color: isDark ? '#4a4a6a' : '#a1a1aa' }
                        },
                        invalid: { color: '#ef4444' }
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── Options ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4.5} className="mb-6 space-y-2">
              {/* Cover fees */}
              <button
                type="button"
                role="switch"
                aria-checked={coverFees}
                onClick={() => setCoverFees(!coverFees)}
                className="w-full flex items-center justify-between px-3.5 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <div className="text-left">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark">Cover processing fees</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                    Add ${processingFee?.toFixed(2)} so 100% goes to the rescue
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${
                    coverFees ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${coverFees ? 'translate-x-0.5' : '-translate-x-4.5'}`}
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
                  className="w-full flex items-center justify-between px-3.5 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  <div className="text-left">
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark">
                      Save card for future donations
                    </p>
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">One-click checkout next time</p>
                  </div>
                  <div
                    aria-hidden="true"
                    className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${
                      saveCard ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${saveCard ? 'translate-x-0.5' : '-translate-x-4.5'}`}
                    />
                  </div>
                </button>
              )}
            </motion.div>

            {/* ── Error ── */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  aria-live="assertive"
                  className="text-xs text-red-500 dark:text-red-400 font-mono mb-4 flex items-start gap-2"
                >
                  <span aria-hidden="true" className="shrink-0 mt-0.5">
                    ✕
                  </span>
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* ── Submit ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}>
              <motion.button
                type="submit"
                disabled={!isValid || loading}
                whileHover={isValid && !loading ? { scale: 1.02 } : {}}
                whileTap={isValid && !loading ? { scale: 0.98 } : {}}
                aria-disabled={!isValid || loading}
                className={`
            w-full py-4 font-black text-[11px] tracking-[0.2em] uppercase font-mono transition-colors duration-200
            focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
            ${
              isValid && !loading
                ? 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
                : 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
            }
          `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2" aria-live="polite">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      aria-hidden="true"
                    />
                    Processing...
                  </span>
                ) : (
                  `Pay $${coverFees ? finalAmount.toFixed(2) : donationAmount.toFixed(2)}`
                )}
              </motion.button>

              {/* ── Security note ── */}
              <p className="flex items-center justify-center gap-2 mt-3 text-[10px] font-mono text-muted-light dark:text-muted-dark">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Secured by Stripe. We never store your card details.
              </p>
            </motion.div>
          </form>
        </div>
        {/* end two-column grid */}
      </div>
    </main>
  )
}
