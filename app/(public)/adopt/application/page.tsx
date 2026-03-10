'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Pusher from 'pusher-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const TERMS_AND_CONDITIONS = [
  {
    title: 'Adoption Requirements',
    content: [
      'Must be 21 years of age or older',
      'Own or rent your home (landlord approval required for rentals)',
      'All household members must agree to the adoption',
      'Financially able to provide proper care'
    ]
  },
  {
    title: 'Home Environment',
    content: [
      'Safe, secure living environment',
      'Proper fencing if you have a yard',
      'No history of animal abuse or neglect',
      'Current pets must be spayed/neutered and up-to-date on vaccinations'
    ]
  },
  {
    title: 'Adoption Process',
    content: [
      'Application fee is non-refundable',
      'Home visit may be required',
      'Reference checks will be conducted',
      'Approval is not guaranteed',
      'Final adoption fee is separate from application fee'
    ]
  },
  {
    title: 'Commitment',
    content: [
      'Lifetime commitment to the adopted dog',
      'Provide necessary medical care',
      'Keep dog indoors as a family member',
      'Return dog to Little Paws if unable to keep'
    ]
  }
]

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paymentIntentId = clientSecret.split('_secret_')[0]

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

    if (!pusherKey || !pusherCluster) {
      console.error('Missing Pusher credentials')
      setError('Configuration error')
      setLoading(false)
      return
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster
    })

    const channel = pusher.subscribe(`adoption-fee-${paymentIntentId}`)

    const handlePaymentComplete = (data: any) => {
      if (data.success) {
        window.location.href = `/adoption/application/success?fee_id=${data.feeId}`
      } else {
        setError(data.error || 'Failed to process payment')
        setLoading(false)
      }

      channel.unbind('payment-complete', handlePaymentComplete)
      pusher.unsubscribe(`adoption-fee-${paymentIntentId}`)
      pusher.disconnect()
    }

    channel.bind('payment-complete', handlePaymentComplete)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/adoption/application/success`
      },
      redirect: 'if_required'
    })

    if (submitError) {
      channel.unbind('payment-complete', handlePaymentComplete)
      pusher.unsubscribe(`adoption-fee-${paymentIntentId}`)
      pusher.disconnect()
      setError(submitError.message || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="p-4 bg-bg-light dark:bg-bg-dark border border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark text-sm"
        >
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        aria-disabled={!stripe || loading}
        className="w-full bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2" aria-live="polite">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing…
          </span>
        ) : (
          'Submit Application & Pay $15'
        )}
      </button>

      <p className="text-xs text-muted-light dark:text-muted-dark text-center">
        Your payment is secure and encrypted. You&apos;ll receive a receipt via email.
      </p>
    </form>
  )
}

// ─── Input ─────────────────────────────────────────────────────────────────────
function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-2">
        {label}
        {required && (
          <span className="text-secondary-light dark:text-secondary-dark ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
        className="w-full px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition"
      />
    </div>
  )
}

const STEPS = ['terms', 'info', 'payment'] as const

const slideVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, easing: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
}

const STEP_LABELS: Record<string, string> = {
  terms: 'Terms',
  info: 'Info',
  payment: 'Payment'
}

export default function AdoptionApplicationPage() {
  const { push } = useRouter()
  const [step, setStep] = useState<'info' | 'terms' | 'payment'>('terms')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [bypassPayment, setBypassPayment] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bypassCode, setBypassCode] = useState('')
  const [bypassError, setBypassError] = useState('')
  const [verifyingCode, setVerifyingCode] = useState(false)

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    darkModeMediaQuery.addEventListener('change', handler)

    return () => darkModeMediaQuery.removeEventListener('change', handler)
  }, [])

  const handleContinueToInfo = () => {
    if (!agreedToTerms) {
      return
    }
    setStep('info')
  }

  const handleVerifyBypassCode = async () => {
    if (!bypassCode.trim()) return

    setVerifyingCode(true)
    setBypassError('')

    try {
      const res = await fetch('/api/adoption/verify-bypass-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: bypassCode })
      })

      const data = await res.json()

      if (data.valid) {
        setBypassPayment(true)
        setBypassError('')
      } else {
        setBypassError('Invalid bypass code')
        setBypassPayment(false)
      }
    } catch (error) {
      setBypassError('Error verifying code')
      setBypassPayment(false)
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleContinueToPayment = async () => {
    if (!agreedToTerms) return

    if (bypassCode) {
      try {
        const res = await fetch('/api/adopt/create-application-fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone
          })
        })

        const data = await res.json()
        push(`/adopt/application?fee=${data?._id}`)
      } catch (error) {
        console.error('Error creating payment intent:', error)
      }
    }

    try {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          donationAmount: 15
        })
      })

      const data = await res.json()
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (error) {
      console.error('Error creating payment intent:', error)
    }
  }

  const stripeOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: isDarkMode ? '#a78bfa' : '#0891b2',
            colorBackground: isDarkMode ? '#13131f' : '#f4f4f5',
            colorText: isDarkMode ? '#f1f0ff' : '#09090b',
            colorDanger: isDarkMode ? '#f472b6' : '#0e7490',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '0px'
          }
        }
      }
    : undefined

  const currentIndex = STEPS.indexOf(step)

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Adopt</p>
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          </div>
          <h1 className="font-quicksand text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            Adoption <span className="font-light text-muted-light dark:text-muted-dark">Application</span>
          </h1>
          <p className="text-sm text-muted-light dark:text-on-dark">Start your journey to giving a dachshund a forever home</p>
        </motion.div>

        {/* ── Progress ── */}
        <nav aria-label="Application steps" className="mb-10">
          <ol className="flex items-center justify-center gap-0" role="list">
            {STEPS.map((s, index) => {
              const isComplete = index < currentIndex
              const isCurrent = s === step

              return (
                <li key={s} className="flex items-center" role="listitem">
                  <div className="flex flex-col items-center">
                    <div
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`Step ${index + 1}: ${STEP_LABELS[s]}${isComplete ? ' (complete)' : isCurrent ? ' (current)' : ''}`}
                      className={`w-9 h-9 flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
                        isComplete
                          ? 'bg-primary-light dark:bg-primary-dark text-white'
                          : isCurrent
                            ? 'bg-button-light dark:bg-button-dark text-white border-2 border-primary-light dark:border-primary-dark'
                            : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-[10px] font-mono tracking-widest uppercase ${isCurrent ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
                    >
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors duration-300 ${
                        index < currentIndex ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                      }`}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        {/* ── Step content ── */}
        <AnimatePresence mode="wait">
          {/* Step 1: Terms */}
          {step === 'terms' && (
            <motion.section
              key="terms"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-terms-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              <h2 id="step-terms-heading" className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                Terms &amp; Conditions
              </h2>

              <div
                className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-light dark:scrollbar-thumb-border-dark"
                tabIndex={0}
                aria-label="Terms and conditions — scrollable"
                role="region"
              >
                {TERMS_AND_CONDITIONS.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark mb-3">{section.title}</h3>
                    <ul className="space-y-2" role="list">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-light dark:text-on-dark">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark shrink-0 mt-1.5" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 border-border-light dark:border-border-dark text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark bg-bg-light dark:bg-bg-dark"
                  />
                  <span className="text-sm text-muted-light dark:text-on-dark leading-relaxed">
                    I have read and agree to the terms and conditions. I understand that the{' '}
                    <strong className="text-text-light dark:text-text-dark">$15 application fee is non-refundable</strong> and that approval is not
                    guaranteed.
                  </span>
                </label>

                <button
                  onClick={handleContinueToInfo}
                  disabled={!agreedToTerms}
                  aria-disabled={!agreedToTerms}
                  className="w-full bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Continue to Info
                </button>
              </div>
            </motion.section>
          )}

          {/* Step 2: Info */}
          {step === 'info' && (
            <motion.section
              key="info"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-info-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              <h2 id="step-info-heading" className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                Your Information
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <Input id="firstName" label="First Name" value={firstName} onChange={setFirstName} required />
                  <Input id="lastName" label="Last Name" value={lastName} onChange={setLastName} required />
                </div>
                <Input id="email" label="Email Address" type="email" value={email} onChange={setEmail} required />
                <Input id="phone" label="Phone Number" type="tel" value={phone} onChange={setPhone} required />

                {/* Bypass code */}
                <div className="border-t border-border-light dark:border-border-dark pt-5">
                  <label
                    htmlFor="bypassCode"
                    className="block text-xs font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-2"
                  >
                    Bypass Code <span className="normal-case tracking-normal text-muted-light dark:text-muted-dark">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="bypassCode"
                      type="text"
                      value={bypassCode}
                      onChange={(e) => {
                        setBypassCode(e.target.value)
                        setBypassPayment(false)
                        setBypassError('')
                      }}
                      placeholder="Enter code to waive application fee"
                      className="flex-1 px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyBypassCode}
                      disabled={!bypassCode.trim() || verifyingCode}
                      aria-disabled={!bypassCode.trim() || verifyingCode}
                      className="px-5 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-text-light dark:text-text-dark disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      {verifyingCode ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>
                  {bypassError && (
                    <p className="mt-2 text-xs text-secondary-light dark:text-secondary-dark" role="alert">
                      {bypassError}
                    </p>
                  )}
                  {bypassPayment && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 text-xs text-primary-light dark:text-primary-dark"
                      role="status"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Valid code — application fee waived.
                    </motion.p>
                  )}
                </div>

                {/* Fee info box */}
                <div
                  className="bg-bg-light dark:bg-bg-dark border border-primary-light/30 dark:border-primary-dark/30 p-4"
                  role="note"
                  aria-label="Application fee information"
                >
                  <div className="flex gap-3">
                    <svg
                      className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-text-light dark:text-text-dark mb-1">Application Fee: $15</p>
                      <p className="text-muted-light dark:text-on-dark text-xs leading-relaxed">
                        This non-refundable fee covers application processing and background checks. The final adoption fee will be discussed if your
                        application is approved.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  disabled={!firstName || !lastName || !email || !phone}
                  aria-disabled={!firstName || !lastName || !email || !phone}
                  className="w-full bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Continue to Payment
                </button>

                <button
                  onClick={() => setStep('terms')}
                  className="w-full text-xs font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  ← Back to Terms
                </button>
              </div>
            </motion.section>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && clientSecret && stripeOptions && (
            <motion.section
              key="payment"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-payment-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              <h2 id="step-payment-heading" className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-1">
                Payment
              </h2>
              <p className="text-sm text-muted-light dark:text-on-dark mb-6">
                Complete your $15 application fee to submit your adoption application.
              </p>

              <div className="bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark p-4 mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-text-light dark:text-text-dark">Application Fee</span>
                <span className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark">$15.00</span>
              </div>

              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentForm clientSecret={clientSecret} />
              </Elements>

              <button
                onClick={() => setStep('info')}
                className="w-full mt-4 text-xs font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                ← Back to Info
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
