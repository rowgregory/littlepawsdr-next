'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CreditCard, RefreshCw, X, AlertTriangle, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { store, useUiSelector } from 'app/lib/store/store'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { fadeUp } from 'app/lib/constants/motion'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDate } from 'app/utils/date.utils'
import { getSubscriptionById } from 'app/lib/actions/getSubscriptionById'
import { updateSubscriptionPaymentMethod } from 'app/lib/actions/updateSubscriptionPaymentMethod'
import { cancelSubscription } from 'app/lib/actions/cancelSubscription'

type Subscription = Awaited<ReturnType<typeof getSubscriptionById>>['data']

// ─────────────────────────────────────────────
// Cancel Modal
// ─────────────────────────────────────────────

function CancelModal({
  onConfirm,
  onClose,
  loading,
  cancelAtPeriodEnd,
  nextBillingDate
}: {
  onConfirm: () => void
  onClose: () => void
  loading: boolean
  cancelAtPeriodEnd: boolean
  nextBillingDate: Date | null
}) {
  return (
    <>
      <motion.div
        key="cancel-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        key="cancel-modal"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm z-50 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border-light dark:border-border-dark">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400" aria-hidden="true" />
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-red-500 dark:text-red-400">Cancel Subscription</p>
            </div>
            <h2 id="cancel-modal-title" className="font-quicksand font-bold text-lg text-text-light dark:text-text-dark">
              Are you sure?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark p-1"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed mb-6">
            {cancelAtPeriodEnd
              ? 'Your subscription is already set to cancel.'
              : nextBillingDate
                ? `Your subscription will remain active until ${formatDate(nextBillingDate)} and will not renew after that.`
                : 'Your subscription will be cancelled and will not renew.'}
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`w-full py-3.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500
                ${
                  loading
                    ? 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current"
                    aria-hidden="true"
                  />
                  Cancelling...
                </span>
              ) : (
                'Yes, cancel subscription'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              Keep subscription
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ─────────────────────────────────────────────
// Update Card Form
// ─────────────────────────────────────────────

function UpdateCardForm({ subscriptionId, onSuccess, onCancel }: { subscriptionId: string; onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const { isDark } = useUiSelector()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      })

      if (stripeError) throw new Error(stripeError.message)

      const result = await updateSubscriptionPaymentMethod({
        subscriptionId,
        paymentMethodId: paymentMethod!.id
      })

      if (!result.success) throw new Error(result.error ?? 'Failed to update card')

      store.dispatch(showToast({ message: 'Card updated', description: 'Your payment method has been updated.', type: 'success' }))
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label id="update-card-label" className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
          New Card Details
        </label>
        <div
          role="group"
          aria-labelledby="update-card-label"
          className="px-3.5 py-3.5 border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-colors duration-200 focus-within:border-primary-light dark:focus-within:border-primary-dark"
        >
          <CardElement
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
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="text-[11px] text-red-500 dark:text-red-400 font-mono flex items-start gap-2"
          >
            <span aria-hidden="true" className="shrink-0 mt-0.5">
              ✕
            </span>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className={`flex-1 py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2
            ${
              loading
                ? 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
                : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
            }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full"
                aria-hidden="true"
              />
              Updating...
            </span>
          ) : (
            'Update Card'
          )}
        </motion.button>
      </div>
    </form>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function MemberPortalSubscriptionDetailsClient({ subscription }: { subscription: NonNullable<Subscription> }) {
  const router = useRouter()

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showUpdateCard, setShowUpdateCard] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  const isCancelled = subscription.cancelAtPeriodEnd || subscription.stripeStatus === 'canceled'
  const frequencyLabel = subscription.recurringFrequency === 'MONTHLY' ? 'Monthly' : 'Yearly'
  const frequencyShort = subscription.recurringFrequency === 'MONTHLY' ? 'mo' : 'yr'

  const handleCancel = async () => {
    setCancelLoading(true)
    try {
      const result = await cancelSubscription({ subscriptionId: subscription.stripeSubscriptionId! })
      if (!result.success) throw new Error(result.error ?? 'Failed to cancel')
      store.dispatch(showToast({ message: 'Subscription cancelled', description: 'Your subscription will not renew.', type: 'success' }))
      setShowCancelModal(false)
      router.refresh()
    } catch (err) {
      store.dispatch(showToast({ message: 'Failed to cancel subscription', type: 'error' }))
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10">
          <Link
            href="/member/portal"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Portal
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Subscription</p>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="font-quicksand text-4xl sm:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
              {frequencyLabel} <span className="font-light text-muted-light dark:text-muted-dark">Membership</span>
            </h1>
            {isCancelled && (
              <span className="shrink-0 mt-2 px-2.5 py-1 border border-red-500/30 text-[9px] font-mono tracking-[0.15em] uppercase text-red-500 dark:text-red-400">
                Cancelled
              </span>
            )}
          </div>
        </motion.div>

        {/* ── Overview card ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="border border-border-light dark:border-border-dark mb-6">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Overview</p>
          </div>

          <div className="divide-y divide-border-light dark:divide-border-dark">
            {[
              {
                label: 'Amount',
                value: (
                  <span className="font-quicksand font-black text-lg text-primary-light dark:text-primary-dark tabular-nums">
                    {formatMoney(subscription.totalAmount)}
                    <span className="text-[10px] font-mono font-normal text-muted-light dark:text-muted-dark ml-1">/{frequencyShort}</span>
                  </span>
                )
              },
              {
                label: 'Frequency',
                value: <span className="text-sm font-mono text-text-light dark:text-text-dark">{frequencyLabel}</span>
              },
              {
                label: 'Status',
                value: (
                  <span
                    className={`text-[10px] font-mono tracking-[0.15em] uppercase ${
                      isCancelled ? 'text-red-500 dark:text-red-400' : 'text-primary-light dark:text-primary-dark'
                    }`}
                  >
                    {isCancelled ? 'Cancelled' : (subscription.stripeStatus ?? subscription.status)}
                  </span>
                )
              },
              {
                label: 'Member since',
                value: <span className="text-sm font-mono text-text-light dark:text-text-dark">{formatDate(subscription.createdAt, true)}</span>
              },
              {
                label: 'Last payment',
                value: (
                  <span className="text-sm font-mono text-text-light dark:text-text-dark">
                    {subscription.paidAt ? formatDate(subscription.paidAt) : '—'}
                  </span>
                )
              },
              {
                label: isCancelled ? 'Active until' : 'Next billing',
                value: (
                  <span className={`text-sm font-mono ${isCancelled ? 'text-red-500 dark:text-red-400' : 'text-text-light dark:text-text-dark'}`}>
                    {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : '—'}
                  </span>
                )
              },
              ...(subscription.coverFees
                ? [
                    {
                      label: 'Fees covered',
                      value: <span className="text-sm font-mono text-text-light dark:text-text-dark">{formatMoney(subscription.feesCovered)}</span>
                    }
                  ]
                : [])
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5 gap-4">
                <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark shrink-0">{label}</span>
                <div className="text-right">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Payment method ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="border border-border-light dark:border-border-dark mb-6">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Payment Method</p>
            {!isCancelled && !showUpdateCard && (
              <button
                type="button"
                onClick={() => setShowUpdateCard(true)}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                Update
              </button>
            )}
          </div>

          <div className="px-5 py-4">
            {showUpdateCard ? (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <UpdateCardForm
                  subscriptionId={subscription.stripeSubscriptionId!}
                  onSuccess={() => {
                    setShowUpdateCard(false)
                    router.refresh()
                  }}
                  onCancel={() => setShowUpdateCard(false)}
                />
              </motion.div>
            ) : subscription.paymentMethod ? (
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-mono text-text-light dark:text-text-dark capitalize">
                    {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                  </p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                    Expires {subscription.paymentMethod.expMonth?.toString().padStart(2, '0')}/{subscription.paymentMethod.expYear}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm font-mono text-muted-light dark:text-muted-dark">No payment method on file.</p>
            )}
          </div>
        </motion.div>

        {/* ── Billing history ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="border border-border-light dark:border-border-dark mb-8">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Billing History</p>
          </div>

          {subscription.billingHistory?.length > 0 ? (
            <ul className="divide-y divide-border-light dark:divide-border-dark" role="list">
              {subscription.billingHistory.map((payment) => (
                <li key={payment.id} className="flex items-center justify-between px-5 py-3.5 gap-4" role="listitem">
                  <div className="flex items-center gap-3">
                    <Check className="w-3.5 h-3.5 text-primary-light dark:text-primary-dark shrink-0" aria-hidden="true" />
                    <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{formatDate(payment.paidAt ?? payment.createdAt)}</span>
                  </div>
                  <span className="font-mono text-sm text-text-light dark:text-text-dark tabular-nums">
                    {formatMoney(Number(payment.totalAmount))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm font-mono text-muted-light dark:text-muted-dark">No billing history yet.</p>
            </div>
          )}
        </motion.div>

        {/* ── Cancel ── */}
        {!isCancelled && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
            <div className="h-px bg-border-light dark:bg-border-dark mb-6" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-mono text-text-light dark:text-text-dark mb-1">Cancel subscription</p>
                <p className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-relaxed max-w-xs">
                  Your membership will remain active until the end of the current billing period.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="shrink-0 px-4 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase border border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Cancel modal ── */}
      <AnimatePresence>
        {showCancelModal && (
          <CancelModal
            onConfirm={handleCancel}
            onClose={() => setShowCancelModal(false)}
            loading={cancelLoading}
            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
            nextBillingDate={subscription.nextBillingDate}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
