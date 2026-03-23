import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useUiSelector } from 'app/lib/store/store'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function AdoptionApplicationPaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isDark } = useUiSelector()
  const [cardComplete, setCardComplete] = useState(false)

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
  }

  return (
    <section className="space-y-6">
      <div
        role="group"
        aria-labelledby="card-details-label"
        className="px-3.5 py-3.5 border-l-2 border-l-cyan-600 dark:border-l-violet-400 border-t border-r border-b border-zinc-200 dark:border-border-dark bg-zinc-50 dark:bg-[#13131f] transition-colors duration-200 focus-within:border-cyan-600 dark:focus-within:border-violet-400"
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
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || loading || !cardComplete}
        aria-disabled={!stripe || loading || !cardComplete}
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
          'Pay $15'
        )}
      </button>

      <p className="text-xs text-muted-light dark:text-muted-dark text-center">
        Your payment is secure and encrypted. You&apos;ll receive a receipt via email.
      </p>
    </section>
  )
}
