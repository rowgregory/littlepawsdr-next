'use client'

import { useCallback } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import { store, useFormSelector, useUiSelector } from 'app/lib/store/store'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor.hook'
import { useDefaultCard } from '@hooks/useDefaultCard.hook'
import { createFormActions } from 'app/utils/form.utils'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { calculateStripeFees } from 'app/utils/stripe.utils'
import { validatePaymentForm } from 'app/lib/validations/payment.validation'
import { FormField } from '../ui/FormField'
import { SavedCardSelector } from '../common/SavedCardSelector'
import { CardElementField } from '../common/CardElementField'
import { CoverFeesToggle } from '../common/CoverFeesToggle'
import { FormError } from '../ui/FormError'
import { SubmitButton } from '../common/SubmitButton'
import { useInitializeForm } from '@hooks/useInitializeForm.hook'
import { SubscriptionPaymentFormProps } from 'types/subscriptions.types'
import { createSubscriptionWithSavedCard } from 'app/lib/actions/_stripe/createSubscriptionWithSavedCard'
import { createSetupIntentForSubscription } from 'app/lib/actions/_stripe/createSetupIntentForSubscription'
import { createSubscriptionAfterSetup } from 'app/lib/actions/_stripe/createSubscriptionAfterSetup'

const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'subscriptionForm', data }))

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`
}

export function SubscriptionPaymentForm({
  tier,
  billing,
  savedCards,
  userName,
  isDark
}: SubscriptionPaymentFormProps & { isDark?: boolean }) {
  const stripe = useStripe()
  const elements = useElements()

  const session = useSession()
  const isAuthed = session.status === 'authenticated'

  const { isDark: storeDark } = useUiSelector()
  const dark = isDark ?? storeDark

  const c = {
    box: dark ? 'border-border-dark bg-surface-dark' : 'border-border-light bg-surface-light',
    notice: dark ? 'border-primary-dark bg-surface-dark' : 'border-primary-light bg-surface-light',
    muted: dark ? 'text-muted-dark' : 'text-muted-light',
    text: dark ? 'text-text-dark' : 'text-text-light',
    primary: dark ? 'text-primary-dark' : 'text-primary-light'
  }

  const { subscriptionForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('subscriptionForm', store.dispatch)
  const inputs = subscriptionForm?.inputs
  const errors = subscriptionForm?.errors

  const { setupPusherListenerRecurring } = usePaymentProcessor()

  const baseAmount = tier.price[billing]
  const processingFee = calculateStripeFees(baseAmount)
  const finalAmount = inputs?.coverFees ? Math.round((baseAmount + processingFee) * 100) / 100 : baseAmount
  const feesCovered = inputs?.coverFees ? processingFee : 0
  const usingSavedCard = !!inputs?.selectedCardId && !inputs?.useNewCard && isAuthed
  const isValid =
    !!inputs?.firstName?.trim() &&
    !!inputs?.lastName?.trim() &&
    !!inputs?.email?.trim() &&
    (usingSavedCard ? true : inputs?.cardComplete)

  const enteringNewCard = !isAuthed || savedCards.length === 0 || inputs?.useNewCard

  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])
  useDefaultCard(savedCards, setDefaultCard)
  useInitializeForm(setForm, { session, savedCards, userName })

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
        feesCovered,
        tierName: tier.name
      }

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
          setForm({
            processingStatus: 'failed',
            error: stripeError.message ?? 'Card confirmation failed',
            loading: false
          })
          return
        }

        const subscriptionResult = await createSubscriptionAfterSetup({
          ...basePayload,
          setupIntentId: setupResult.setupIntentId!
        })

        const paymentMethodId = setupIntent?.payment_method

        if (!subscriptionResult.success) throw new Error(subscriptionResult.error ?? 'Failed to create subscription')

        // Card is always saved for subscriptions — recurring billing requires a stored payment method
        setupPusherListenerRecurring(
          subscriptionResult,
          inputs?.processingStatus,
          ...pusherCallbacks,
          true,
          paymentMethodId
        )
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
    <form onSubmit={handleSubmit} noValidate aria-label="Subscription payment form" className="dark space-y-5 max-w-lg">
      {/* ── Plan summary ── */}
      <div className={`flex items-center justify-between px-4 py-3 border ${c.box}`}>
        <div>
          <p className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-0.5 ${c.muted}`}>{billing} plan</p>
          <p className={`font-quicksand font-black text-sm ${c.text}`}>{tier.name}</p>
        </div>
        <div className="text-right">
          <p className={`font-quicksand font-black text-xl tabular-nums ${c.primary}`}>${baseAmount}</p>
          <p className={`text-[10px] font-mono ${c.muted}`}>/{billing === 'MONTHLY' ? 'mo' : 'yr'}</p>
        </div>
      </div>

      {/* ── Billing notice ── */}
      <div className={`px-4 py-3 border-l-2 ${c.notice}`}>
        <p className={`text-[11px] font-mono leading-relaxed ${c.muted}`}>
          Your card will be charged{' '}
          <span className={c.text}>
            {billing === 'MONTHLY'
              ? `on the ${ordinal(new Date().getDate())} of each month`
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
      {enteringNewCard && <CardElementField formName="subscriptionForm" isDark />}

      {/* ── Cover fees ── */}
      <CoverFeesToggle formName="subscriptionForm" processingFee={processingFee} />

      {/* ── Card storage note (replaces SaveCardToggle — saving is required for subscriptions) ── */}
      {enteringNewCard && (
        <p className={`text-[10px] font-mono leading-relaxed ${c.muted}`}>
          Your card will be securely saved with Stripe to process your recurring{' '}
          {billing === 'MONTHLY' ? 'monthly' : 'yearly'} payments.
        </p>
      )}

      {/* ── Error ── */}
      <FormError formName="subscriptionForm" />

      {/* ── Submit ── */}
      <SubmitButton
        formName="subscriptionForm"
        isValid={isValid}
        label={`Subscribe · $${inputs?.coverFees ? finalAmount.toFixed(2) : baseAmount.toFixed(2)}/${billing === 'MONTHLY' ? 'mo' : 'yr'}`}
      />

      {/* ── Security note ── */}
      <p className={`flex items-center justify-center gap-2 text-[10px] font-mono ${c.muted}`}>
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
