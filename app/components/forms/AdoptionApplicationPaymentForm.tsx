import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { store, useFormSelector } from 'app/lib/store/store'
import { useSession } from 'next-auth/react'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { calculateStripeFees } from 'app/utils/calculateStripeFees'
import { OrderType } from '@prisma/client'
import { createPaymentIntent } from 'app/lib/actions/createPaymentIntent'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import { EMAIL_REGEX } from 'app/utils/regex'
import { CardElementField } from '../common/CardElementField'
import { CoverFeesToggle } from '../common/CoverFeesToggle'
import { SaveCardToggle } from '../common/SaveCardToggle'
import { FormError } from '../common/FormError'
import { SubmitButton } from '../common/SubmitButton'
import { SavedCardSelector } from '../common/SavedCardSelector'
import { useCallback } from 'react'
import { useDefaultCard } from '@hooks/useDefaultCard'
import { IPaymentForm } from 'types/common'

const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'adoptionFeeForm', data }))

export function AdoptionApplicationPaymentForm({ savedCards }: IPaymentForm) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Session / UI ──────────────────────────────────────────────────────────
  const session = useSession()
  const isAuthed = session.status === 'authenticated'

  // ── Form ──────────────────────────────────────────────────────────────────
  const { adoptionFeeForm } = useFormSelector()
  const inputs = adoptionFeeForm?.inputs

  // ── Payment processor ─────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  // ── Derived values ────────────────────────────────────────────────────────
  const feeAmount = 15
  const processingFee = calculateStripeFees(feeAmount)
  const feesCovered = inputs?.coverFees ? processingFee : 0
  const finalAmount = inputs?.coverFees ? feeAmount + processingFee : feeAmount
  const usingSavedCard = !!inputs?.selectedCardId && !inputs?.useNewCard && isAuthed
  const isValid =
    feeAmount >= 15 &&
    !!inputs?.firstName?.trim() &&
    !!inputs?.lastName?.trim() &&
    EMAIL_REGEX.test(inputs?.email) &&
    (usingSavedCard ? true : inputs?.cardComplete)

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])

  useDefaultCard(savedCards, setDefaultCard)

  // ── Handlde Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements) return

    setForm({ loading: true, error: null, processingStatus: 'processing' })

    try {
      const name = `${inputs?.firstName?.trim()} ${inputs?.lastName?.trim()}`
      const email = inputs?.email?.trim()
      const amountInCents = Math.round(finalAmount * 100)

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
        coverFees: inputs?.coverFees,
        feesCovered,
        orderType: 'ADOPTION_FEE' as OrderType
      }

      if (usingSavedCard) {
        const result = await createPaymentIntent({
          ...basePayload,
          savedCardId: inputs?.selectedCardId
        })

        if (!result.success) {
          throw new Error(result.error)
        }

        setupPusherListenerOneTime(
          result.paymentIntentId!,
          false, // saved card — already saved
          inputs?.selectedCardId,
          inputs?.processingStatus,
          ...pusherCallbacks
        )
      } else {
        // ── New card — confirmed client-side ──
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const intentResult = await createPaymentIntent({
          amount: amountInCents,
          name,
          email,
          orderType: 'ADOPTION_FEE',
          userId: session.data?.user?.id,
          saveCard: inputs?.saveCard,
          coverFees: inputs?.coverFees,
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
          setForm({ processingStatus: 'failed', error: result.error.message || 'Payment failed' })
        } else if (result.paymentIntent?.status === 'succeeded') {
          setupPusherListenerOneTime(
            result.paymentIntent.id,
            inputs?.saveCard,
            getPaymentMethodId(result.paymentIntent.payment_method),
            inputs?.processingStatus,
            ...pusherCallbacks
          )
        }
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
    <form onSubmit={handleSubmit} noValidate aria-label="Adoption fee form" className="space-y-6">
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
      {(!isAuthed || savedCards.length === 0 || inputs?.useNewCard) && <CardElementField formName="adoptionFeeForm" />}

      {/* ── Cover fees ── */}
      <CoverFeesToggle formName="adoptionFeeForm" processingFee={processingFee} />

      {/* ── Save card ── */}
      <SaveCardToggle formName="adoptionFeeForm" />

      {/* ── Error ── */}
      <FormError formName="adoptionFeeForm" />

      {/* ── Submit ── */}
      <SubmitButton
        formName="adoptionFeeForm"
        isValid={isValid}
        label={`Pay $${inputs?.coverFees ? finalAmount?.toFixed(2) : feeAmount?.toFixed(2)}`}
      />

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
        Secured by Stripe. We never store your card details. All donations are final and non-refundable.
      </p>
    </form>
  )
}
