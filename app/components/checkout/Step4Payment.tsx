import { CardElement } from '@stripe/react-stripe-js'
import { fadeUp } from 'app/lib/constants/motion.constants'
import { useUiSelector } from 'app/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, CreditCard, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { IStep4Payment } from 'types/forms.types'
import { ToggleRow } from '../common/ToggleRow'

export function Step4Payment({
  inputs,
  setForm,
  onBack,
  onSubmit,
  savedCards,
  processingFee,
  finalAmount
}: IStep4Payment) {
  const { isDark } = useUiSelector()
  const session = useSession()

  const loading = !!inputs?.loading
  const useNewCard = !!inputs?.useNewCard
  const selectedCardId = inputs?.selectedCardId ?? null
  const usingSavedCard = !!selectedCardId && !useNewCard
  const showCardElement = !session?.data?.user || savedCards.length === 0 || useNewCard

  const isSubmitReady = !loading && (usingSavedCard ? true : !!inputs?.cardComplete)

  return (
    <motion.div
      key="step-payment"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-1">
          Payment <span className="font-light text-muted-light dark:text-muted-dark">details</span>
        </h2>
        <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
          Donating as{' '}
          <span className="text-text-light dark:text-text-dark">
            {inputs?.firstName} {inputs?.lastName}
          </span>
        </p>
      </div>

      {/* ── Saved cards / new card ── */}
      {session?.data?.user && savedCards.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3.5} className="mb-6">
          <p className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
            Payment Method
          </p>

          {!useNewCard ? (
            <div className="space-y-2">
              {savedCards.map((card) => (
                <button
                  key={card.stripePaymentId}
                  type="button"
                  onClick={() => setForm({ selectedCardId: card.stripePaymentId })}
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
                    <CheckCircle
                      className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setForm({ useNewCard: true, selectedCardId: null })}
                className="w-full flex items-center gap-2 px-3.5 py-3 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Use a different card
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setForm({ useNewCard: false, selectedCardId: savedCards[0]?.stripePaymentId ?? null })}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              Use a saved card
            </button>
          )}
        </motion.div>
      )}

      {/* ── Card element ── */}
      {showCardElement && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mb-6">
          <p
            id="card-label"
            className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2"
          >
            Card Details
          </p>
          <div
            role="group"
            aria-labelledby="card-label"
            className="px-3.5 py-3.5 border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-colors duration-200 focus-within:border-primary-light dark:focus-within:border-primary-dark"
          >
            <CardElement
              onChange={(e) => {
                setForm({ cardComplete: e.complete, error: e.error?.message ?? null })
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
        <ToggleRow
          checked={!!inputs?.coverFees}
          onToggle={() => setForm({ coverFees: !inputs?.coverFees })}
          label="Cover processing fees"
          hint={`Add $${processingFee.toFixed(2)} so 100% goes to the rescue`}
        />

        {session?.data?.user && showCardElement && (
          <ToggleRow
            checked={!!inputs?.saveCard}
            onToggle={() => setForm({ saveCard: !inputs?.saveCard })}
            label="Save card for future donations"
            hint="One-click checkout next time"
          />
        )}
      </motion.div>

      {/* ── Error ── */}
      <AnimatePresence>
        {inputs?.error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            aria-live="assertive"
            className="text-xs text-red-500 dark:text-red-400 font-mono flex items-start gap-2"
          >
            <span aria-hidden="true" className="shrink-0 mt-0.5">
              ✕
            </span>
            {inputs.error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-5 py-4 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isSubmitReady}
          className={`flex-1 py-4 font-black text-[11px] tracking-[0.2em] uppercase font-mono transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2
            ${
              !isSubmitReady
                ? 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
                : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
            }`}
        >
          {loading ? (
            <span className="flex items-center gap-2" aria-live="polite">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full"
                aria-hidden="true"
              />
              Processing...
            </span>
          ) : (
            `Pay $${finalAmount.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Security note */}
      <p className="flex items-center justify-center gap-2 text-[10px] font-mono text-muted-light dark:text-muted-dark">
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
  )
}
