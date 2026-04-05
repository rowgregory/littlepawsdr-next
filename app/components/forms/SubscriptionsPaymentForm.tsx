'use client'

import { useCallback } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { store, useFormSelector } from 'app/lib/store/store'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import { useDefaultCard } from '@hooks/useDefaultCard'
import { createSubscriptionWithSavedCard } from 'app/lib/actions/createSubscriptionWithSavedCard'
import { createSetupIntentForSubscription } from 'app/lib/actions/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from 'app/lib/actions/createSubscriptionAfterSetup'
import { SubscriptionPaymentFormProps } from 'app/lib/constants/subscriptions'
import { createFormActions } from 'app/utils/formActions'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { calculateStripeFees } from 'app/utils/calculateStripeFees'
import { validatePaymentForm } from 'app/lib/validations/payment.validation'
import { FormField } from '../ui/FormField'
import { SavedCardSelector } from '../common/SavedCardSelector'
import { CardElementField } from '../common/CardElementField'
import { CoverFeesToggle } from '../common/CoverFeesToggle'
import { SaveCardToggle } from '../common/SaveCardToggle'
import { FormError } from '../common/FormError'
import { SubmitButton } from '../common/SubmitButton'
import { useInitializeForm } from '@hooks/useInitializeForm'

const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'subscriptionForm', data }))

export function SubscriptionPaymentForm({ tier, billing, savedCards, userName }: SubscriptionPaymentFormProps) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Session / UI ──────────────────────────────────────────────────────────
  const session = useSession()
  const isAuthed = session.status === 'authenticated'

  // ── Form ──────────────────────────────────────────────────────────────────
  const { subscriptionForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('subscriptionForm', store.dispatch)
  const inputs = subscriptionForm?.inputs
  const errors = subscriptionForm?.errors

  // ── Payment processor ─────────────────────────────────────────────────────
  const { setupPusherListenerRecurring } = usePaymentProcessor()

  // ── Derived values ────────────────────────────────────────────────────────
  const baseAmount = tier.price[billing]
  const processingFee = calculateStripeFees(baseAmount)
  const finalAmount = inputs?.coverFees ? Math.round((baseAmount + processingFee) * 100) / 100 : baseAmount
  const feesCovered = inputs?.coverFees ? processingFee : 0
  const usingSavedCard = !!inputs?.selectedCardId && !inputs?.useNewCard && isAuthed
  const isValid =
    !!inputs?.firstName?.trim() && !!inputs?.lastName?.trim() && !!inputs?.email?.trim() && (usingSavedCard ? true : inputs?.cardComplete)

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])

  useDefaultCard(savedCards, setDefaultCard)

  useInitializeForm(setForm, { session, savedCards, userName })

  // ── Handlde Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return

    if (!validatePaymentForm(inputs, setErrors, isAuthed)) return

    setForm({ loading: true, error: null, processingStatus: 'processing' })

    try {
      const name = `${inputs?.firstName?.trim()} ${inputs?.lastName?.trim()}`
      const email = inputs?.email?.trim()
      const amountInCents = Math.round(finalAmount * 100)
      const frequency = billing

      const pusherCallbacks = [
        (value: string) => setForm({ error: value }),
        (value: string) => setForm({ processingStatus: value }),
        () => setForm({ loading: false })
      ] as const

      const basePayload = {
        userId: session.data?.user?.id,
        email,
        name,
        amount: amountInCents,
        frequency,
        coverFees: inputs?.coverFees,
        feesCovered
      }

      // Recurring donation flow - Saved Card
      if (inputs?.selectedCardId && !inputs?.useNewCard) {
        const result = await createSubscriptionWithSavedCard({
          ...basePayload,
          savedCardId: inputs?.selectedCardId
        })

        if (!result.success) throw new Error(result.error ?? 'Failed to create subscription')

        setupPusherListenerRecurring(result, inputs?.processingStatus, ...pusherCallbacks)
      } else {
        const setupResult = await createSetupIntentForSubscription(basePayload)

        if (!setupResult.success) throw new Error(setupResult.error ?? 'Failed to create setup intent')

        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(setupResult.clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: { email, name }
          }
        })

        if (stripeError) {
          setForm({ processingStatus: 'failed', error: stripeError.message ?? 'Card confirmation failed', loading: false })
          return
        }

        const subscriptionResult = await createSubscriptionAfterSetup({
          ...basePayload,
          setupIntentId: setupResult.setupIntentId!
        })

        const paymentMethodId = setupIntent?.payment_method // string | PaymentMethod | null

        if (!subscriptionResult.success) throw new Error(subscriptionResult.error ?? 'Failed to create subscription')

        setupPusherListenerRecurring(subscriptionResult, inputs?.processingStatus, ...pusherCallbacks, inputs?.saveCard, paymentMethodId)
      }
    } catch (err) {
      setForm({
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        processingStatus: 'failed'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Subscription payment form" className="space-y-5 max-w-lg">
      {/* ── Plan summary ── */}
      <div className="flex items-center justify-between px-4 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-0.5">{billing} plan</p>
          <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark">{tier.name}</p>
        </div>
        <div className="text-right">
          <p className="font-quicksand font-black text-xl text-primary-light dark:text-primary-dark tabular-nums">${baseAmount}</p>
          <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">/{billing === 'MONTHLY' ? 'mo' : 'yr'}</p>
        </div>
      </div>

      {/* ── Billing notice ── */}
      <div className="px-4 py-3 border-l-2 border-primary-light dark:border-primary-dark bg-surface-light dark:bg-surface-dark">
        <p className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
          Your card will be charged{' '}
          <span className="text-text-light dark:text-text-dark">
            {billing === 'MONTHLY'
              ? `on the ${new Date().getDate()}th of each month`
              : `every year on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
          </span>
          . Cancel anytime.
        </p>
      </div>

      {/* ── Name ── */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
        <FormField
          id="checkout-firstName"
          label="First Name"
          name="firstName"
          value={inputs?.firstName ?? ''}
          onChange={handleInput}
          placeholder="Jane"
          autoComplete="given-name"
          error={errors?.firstName}
          required
        />
        <FormField
          id="checkout-lastName"
          label="Last Name"
          name="lastName"
          value={inputs?.lastName ?? ''}
          onChange={handleInput}
          placeholder="Doe"
          autoComplete="family-name"
          error={errors?.lastName}
          required
        />
      </div>

      {/* ── Email ── */}
      <FormField
        id="sub-email"
        label="Email Address"
        name="email"
        type="email"
        value={inputs?.email ?? ''}
        onChange={handleInput}
        placeholder="jane@example.com"
        autoComplete="email"
        required
        disabled={isAuthed}
        readOnly={isAuthed}
        hint={isAuthed ? 'Using your signed-in account email.' : undefined}
        error={errors?.email}
      />

      {/* ── Saved cards ── */}
      {isAuthed && (
        <SavedCardSelector
          savedCards={savedCards}
          selectedCardId={inputs?.selectedCardId}
          useNewCard={inputs?.useNewCard}
          onSelectCard={(id) => setForm({ selectedCardId: id })}
          onUseNewCard={() => setForm({ useNewCard: true, selectedCardId: null })}
          onUseSavedCard={() => setForm({ useNewCard: false, selectedCardId: savedCards[0]?.stripePaymentId ?? null })}
        />
      )}

      {/* ── Card element ── */}
      {(!isAuthed || savedCards.length === 0 || inputs?.useNewCard) && <CardElementField formName="subscriptionForm" />}

      {/* ── Cover fees ── */}
      <CoverFeesToggle formName="subscriptionForm" processingFee={processingFee} />

      {/* ── Save card ── */}
      <SaveCardToggle formName="subscriptionForm" />

      {/* ── Error ── */}
      <FormError formName="subscriptionForm" />

      {/* ── Submit ── */}
      <SubmitButton
        formName="subscriptionForm"
        isValid={isValid}
        label={`Subscribe · $${inputs?.coverFees ? finalAmount.toFixed(2) : baseAmount.toFixed(2)}/${billing === 'MONTHLY' ? 'mo' : 'yr'}`}
      />

      {/* ── Security note ── */}
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
    </form>
  )
}
