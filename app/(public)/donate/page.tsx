'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { fadeUp } from 'app/lib/constants/motion'
import { useUiSelector } from 'app/lib/store/store'

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

export default function DonationForm() {
  const stripe = useStripe()
  const elements = useElements()

  const { isDark } = useUiSelector()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [useCustom, setUseCustom] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cardComplete, setCardComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const donationAmount = useCustom ? Math.max(5, parseFloat(customAmount) || 0) : (selectedAmount ?? 0)

  const isValid = donationAmount >= 5 && name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && cardComplete

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return
    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name, email }
      })

      if (stripeError) throw new Error(stripeError.message)

      // TODO: send paymentMethod.id + donationAmount to your server action
      console.log('paymentMethod', paymentMethod?.id, 'amount', donationAmount)

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100dvh-583px)] py-36 px-4 sm:px-0 bg-bg-light dark:bg-bg-dark">
      {success && (
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-title"
              aria-describedby="success-desc"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSuccess(false)}
                aria-hidden="true"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
                className="relative z-10 w-full max-w-sm bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark p-10 flex flex-col items-center text-center gap-4"
              >
                {/* Close button */}
                <button
                  onClick={() => setSuccess(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark p-1"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="square"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                  className="w-14 h-14 border-2 border-primary-light dark:border-primary-dark flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-primary-light dark:text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="square"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <h2 id="success-title" className="font-quicksand font-black text-2xl text-text-light dark:text-text-dark">
                  Thank you!
                </h2>
                <p id="success-desc" className="text-sm text-muted-light dark:text-on-dark max-w-xs leading-relaxed">
                  Your donation of <span className="font-bold text-primary-light dark:text-primary-dark">${donationAmount}</span> will directly help
                  Little Paws dachshunds.
                </p>

                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 w-full py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white font-black text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <form onSubmit={handleSubmit} noValidate aria-label="One-time donation form" className="w-full max-w-lg mx-auto">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">One-Time Donation</p>
          </div>
          <h2 className="font-quicksand font-black text-3xl text-text-light dark:text-text-dark leading-tight">
            Make a <span className="font-light text-muted-light dark:text-muted-dark">Difference</span>
          </h2>
          <p className="text-sm text-muted-light dark:text-on-dark mt-2 leading-relaxed">
            Every dollar goes directly to rescue, vetting, and care for our dachshunds.
          </p>
        </motion.div>

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
                  {/* Selected sweep line */}
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
            <label htmlFor="donor-name" className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              className="w-full px-3.5 py-3 text-sm border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-200 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
            />
          </div>
        </motion.div>

        {/* ── Card element ── */}
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
                  className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                Processing...
              </span>
            ) : (
              `Donate ${donationAmount >= 5 ? `$${donationAmount}` : ''}`
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
    </main>
  )
}
