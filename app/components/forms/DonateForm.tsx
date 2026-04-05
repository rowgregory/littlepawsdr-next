import { useDefaultCard } from '@hooks/useDefaultCard'
import { useInitializeForm } from '@hooks/useInitializeForm'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createPaymentIntent } from 'app/lib/actions/createPaymentIntent'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { store, useFormSelector } from 'app/lib/store/store'
import { createFormActions } from 'app/utils/formActions'
import { EMAIL_REGEX } from 'app/utils/regex'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeUp } from 'app/lib/constants/motion'
import { FormField } from '../ui/FormField'
import { SavedCardSelector } from '../common/SavedCardSelector'
import { CardElementField } from '../common/CardElementField'
import { CoverFeesToggle } from '../common/CoverFeesToggle'
import { SaveCardToggle } from '../common/SaveCardToggle'
import { FormError } from '../common/FormError'
import { SubmitButton } from '../common/SubmitButton'
import { validatePaymentForm } from 'app/lib/validations/payment.validation'
import { OrderType } from '@prisma/client'
import { calculateStripeFees } from 'app/utils/calculateStripeFees'
import { StepSignIn } from '../common/SignInStep'
import { useSearchParams } from 'next/navigation'
import { SignedInRow } from '../common/SignedInRow'
import { IPaymentForm } from 'types/common'

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

function PresetAmounts({ inputs }) {
  return (
    <motion.fieldset variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-5 border-0 p-0 min-w-0">
      <legend className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-3">Select Amount</legend>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preset donation amounts">
        {PRESET_AMOUNTS.map((amount) => {
          const isSelected = !inputs?.useCustom && inputs?.selectedAmount === amount
          return (
            <motion.button
              key={amount}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setForm({ selectedAmount: amount, useCustom: false, customAmount: '' })
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
  )
}

const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'donateForm', data }))

export function DonateForm({ savedCards, userName }: IPaymentForm) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Session / UI ──────────────────────────────────────────────────────────
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const searchParams = useSearchParams()
  const donationAmountFromUrl = searchParams.get('donationAmount')

  // ── Form ──────────────────────────────────────────────────────────────────
  const { donateForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('donateForm', store.dispatch)
  const inputs = donateForm?.inputs
  const errors = donateForm?.errors

  // ── Payment processor ─────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  // ── Derived values ────────────────────────────────────────────────────────
  const donationAmount = inputs?.useCustom ? Math.max(5, parseFloat(inputs?.customAmount) || 0) : (inputs?.selectedAmount ?? 0)
  const processingFee = calculateStripeFees(donationAmount)
  const feesCovered = inputs?.coverFees ? processingFee : 0
  const finalAmount = inputs?.coverFees ? donationAmount + processingFee : donationAmount
  const isValid =
    donationAmount >= 5 &&
    !!inputs?.firstName?.trim() &&
    !!inputs?.lastName?.trim() &&
    EMAIL_REGEX.test(inputs?.email) &&
    (inputs?.selectedCardId && !inputs?.useNewCard ? true : inputs?.cardComplete)

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])

  useDefaultCard(savedCards, setDefaultCard)

  useInitializeForm(setForm, { session, savedCards, userName })

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (donationAmountFromUrl) {
      setForm({ selectedAmount: Number(donationAmountFromUrl) })
    }
  }, [donationAmountFromUrl])

  // ── Handlde Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return

    if (!validatePaymentForm(inputs, setErrors, isAuthed)) return

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
        orderType: 'ONE_TIME_DONATION' as OrderType
      }

      if (inputs?.usingSavedCard) {
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
          orderType: 'ONE_TIME_DONATION',
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
    <form onSubmit={handleSubmit} noValidate aria-label="One-time donation form" className="w-full space-y-5">
      {/* ── Preset amounts ── */}
      <PresetAmounts inputs={inputs} />

      {/* ── Custom amount ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mb-6">
        <label htmlFor="custom-amount" className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
          Custom Amount
          <span className="ml-1 text-muted-light/60 dark:text-muted-dark/60 normal-case tracking-normal font-sans">(min $5)</span>
        </label>
        <div className="relative">
          <span
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-quicksand font-black text-sm pointer-events-none transition-colors duration-200 ${
              inputs?.useCustom ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'
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
            value={inputs?.customAmount || ''}
            onChange={(e) => {
              setForm({ customAmount: e.target.value, useCustom: true, selectedAmount: null })
            }}
            onFocus={() => {
              setForm({ useCustom: true, selectedAmount: null })
            }}
            aria-describedby="custom-amount-hint"
            className={`
              w-full pl-8 pr-4 py-3 text-sm font-quicksand font-bold border-2 bg-surface-light dark:bg-surface-dark
              text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50
              transition-colors duration-200 focus:outline-none
              ${inputs?.useCustom ? 'border-primary-light dark:border-primary-dark' : 'border-border-light dark:border-border-dark'}
              focus-visible:border-primary-light dark:focus-visible:border-primary-dark
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            `}
          />
          {inputs?.useCustom && inputs?.customAmount && parseFloat(inputs?.customAmount) < 5 && (
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

      {!isAuthed && <StepSignIn redirectTo={`/donate?donationAmount=${inputs?.selectedAmount}`} />}
      <SignedInRow />

      {isAuthed && (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="space-y-5">
          {/* ── Name + Email ── */}
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <FormField
              id="donate-firstName"
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
              id="donate-lastName"
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
            id="donate-email"
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
          {(!isAuthed || savedCards.length === 0 || inputs?.useNewCard) && <CardElementField formName="donateForm" />}

          {/* ── Cover fees ── */}
          <CoverFeesToggle formName="donateForm" processingFee={processingFee} />

          {/* ── Save card ── */}
          <SaveCardToggle formName="donateForm" />

          {/* ── Error ── */}
          <FormError formName="donateForm" />

          {/* ── Submit ── */}
          <SubmitButton
            formName="donateForm"
            isValid={isValid}
            label={`Pay $${inputs?.coverFees ? finalAmount?.toFixed(2) : donationAmount?.toFixed(2)}`}
          />
        </motion.div>
      )}

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
