'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { store, useCartSelector, useFormSelector } from 'app/lib/store/store'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createFormActions } from 'app/utils/form.utils'
import { fadeUp } from 'app/lib/constants/motion.constants'
import { EMAIL_REGEX } from 'app/lib/constants/regex.constants'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor.hook'
import { useDefaultCard } from '@hooks/useDefaultCard.hook'
import Link from 'next/link'
import { getOrderType } from 'app/utils/order.utils'
import { IAddress } from 'types/entities/address'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { StepSignIn } from 'app/components/common/SignInStep'
import { SignedInRow } from 'app/components/common/SignedInRow'
import { useInitializeForm } from '@hooks/useInitializeForm.hook'
import { calculateStripeFees } from 'app/utils/stripe.utils'
import { CheckoutFormInputs } from 'types/forms.types'
import { StepIndicator } from 'app/components/common/StepIndicator'
import { createPaymentIntent } from 'app/lib/actions/_stripe/createPaymentIntent'
import { OrderSummary, Step2Name, Step3Address, Step4Payment } from 'app/components/checkout'

const setForm = (data: Partial<CheckoutFormInputs>) => store.dispatch(setInputs({ formName: 'checkoutForm', data }))

type IPublicCheckoutClient = {
  savedCards: IPaymentMethod[]
  userAddress: IAddress | null
  userName: { firstName: string; lastName: string } | null
}

// ── Step validation ───────────────────────────────────────────────────────
const validateName = (inputs, setErrors, isAuthed) => {
  const errs: Record<string, string> = {}
  if (!inputs?.firstName?.trim()) errs.firstName = 'Required'
  if (!inputs?.lastName?.trim()) errs.lastName = 'Required'
  if (!isAuthed) {
    if (!inputs?.email?.trim()) errs.email = 'Required'
    else if (!EMAIL_REGEX.test(inputs.email)) errs.email = 'Invalid email'
  }
  setErrors(errs)
  return Object.keys(errs).length === 0
}

const validateAddress = (inputs, setErrors) => {
  const errs: Record<string, string> = {}
  if (!inputs?.addressLine1?.trim()) errs.address = 'Required'
  if (!inputs?.city?.trim()) errs.city = 'Required'
  if (!inputs?.state) errs.state = 'Required'
  if (!inputs?.zipPostalCode?.trim()) errs.zipPostalCode = 'Required'
  setErrors(errs)
  return Object.keys(errs).length === 0
}

export function PublicCheckoutClient({ savedCards, userAddress, userName }: IPublicCheckoutClient) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Store ─────────────────────────────────────────────────────────────────
  const session = useSession()
  const { items } = useCartSelector()
  const { checkoutForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('checkoutForm', store.dispatch)
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const inputs = checkoutForm?.inputs as CheckoutFormInputs | undefined
  const errors = checkoutForm?.errors

  const isAuthed = session.status === 'authenticated'
  const email = isAuthed ? session.data?.user?.email : inputs?.email
  const hasPhysical = items.some((i) => i.isPhysicalProduct)
  const hasName = !!userName?.firstName?.trim()

  // ── Step machine ──────────────────────────────────────────────────────────
  // The flow is an ordered list of step ids; physical carts include the address step.
  const FLOW: number[] = hasPhysical ? [1, 2, 3, 4] : [1, 2, 4]
  const stepLabels = hasPhysical ? ['Sign In', 'Your Name', 'Shipping', 'Payment'] : ['Sign In', 'Your Name', 'Payment']

  const [step, setStep] = useState<number>(() => {
    if (!isAuthed) return 1
    if (!hasName) return 2
    if (!hasPhysical) return 4
    return userAddress ? 4 : 3
  })

  const effectiveStep = isAuthed && step === 1 ? 2 : step
  const flowIndex = FLOW.indexOf(effectiveStep as (typeof FLOW)[number])
  const displayStep = flowIndex + 1
  const totalSteps = FLOW.length

  const goNext = () => setStep(FLOW[Math.min(flowIndex + 1, FLOW.length - 1)])
  const goBack = () => setStep(FLOW[Math.max(flowIndex - 1, isAuthed ? 1 : 0)])

  // ── Money ─────────────────────────────────────────────────────────────────
  const total = items.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0)
  const shipping = items
    .filter((i: { isPhysicalProduct: any }) => i.isPhysicalProduct)
    .reduce((sum, i) => sum + (i.shippingPrice ?? 0) * i.quantity, 0)
  const baseAmount = total + shipping

  const processingFee = calculateStripeFees(baseAmount)
  const feesCovered = inputs?.coverFees ? processingFee : 0
  const finalAmount = Math.round((baseAmount + feesCovered) * 100) / 100

  const usingSavedCard = !!inputs?.selectedCardId && !inputs?.useNewCard && isAuthed
  const isValid =
    !!inputs?.firstName?.trim() &&
    !!inputs?.lastName?.trim() &&
    EMAIL_REGEX.test(email ?? '') &&
    (usingSavedCard ? true : !!inputs?.cardComplete)

  // ── Shipping address — single source for display AND submit ──────────────
  const shippingAddress = hasPhysical
    ? (() => {
        const src = inputs?.useSavedAddress ? userAddress : inputs
        return {
          addressLine1: src?.addressLine1 ?? null,
          addressLine2: src?.addressLine2 ?? null,
          city: src?.city ?? null,
          state: src?.state ?? null,
          zipPostalCode: src?.zipPostalCode ?? null,
          country: 'US'
        }
      })()
    : null

  const formattedShippingAddress = shippingAddress
    ? [shippingAddress.addressLine1, shippingAddress.addressLine2, shippingAddress.city, shippingAddress.state]
        .filter(Boolean)
        .join(', ') + (shippingAddress.zipPostalCode ? ` ${shippingAddress.zipPostalCode}` : '')
    : ''

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])
  useDefaultCard(savedCards, setDefaultCard)
  useInitializeForm(setForm, { session, savedCards, userName, userAddress })

  const handleNext = () => {
    if (effectiveStep === 2 && !validateName(inputs, setErrors, isAuthed)) return
    if (effectiveStep === 3 && !inputs?.useSavedAddress && !validateAddress(inputs, setErrors)) return
    goNext()
  }

  const handleBack = () => goBack()

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return

    setForm({ loading: true, error: null, processingStatus: 'processing' })

    try {
      const name = `${inputs?.firstName?.trim()} ${inputs?.lastName?.trim()}`
      const amountInCents = Math.round(finalAmount * 100)

      const pusherCallbacks = [
        (value: string) => setForm({ error: value }),
        (value: string) => setForm({ processingStatus: value }),
        () => setForm({ loading: false })
      ] as const

      const basePayload = {
        amount: amountInCents,
        name,
        email,
        orderType: getOrderType(items),
        userId: session.data?.user?.id,
        coverFees: inputs?.coverFees,
        feesCovered,
        items,
        ...(shippingAddress != null && { address: shippingAddress })
      }

      if (usingSavedCard) {
        const result = await createPaymentIntent({ ...basePayload, savedCardId: inputs?.selectedCardId })
        if (!result.success) throw new Error(result.error)

        setupPusherListenerOneTime(
          result.paymentIntentId!,
          false,
          inputs?.selectedCardId,
          inputs?.processingStatus,
          ...pusherCallbacks
        )
      } else {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const intentResult = await createPaymentIntent({ ...basePayload, saveCard: inputs?.saveCard })
        if (!intentResult.success) throw new Error(intentResult.error)

        const result = await stripe.confirmCardPayment(intentResult.clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email }
          }
        })

        if (result.error) {
          setForm({ processingStatus: 'failed', error: result.error.message || 'Payment failed', loading: false })
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
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10 sm:mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Cart
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Little Paws Dachshund Rescue
            </p>
          </div>
          <h1 className="font-quicksand text-4xl sm:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
            Checkout <span className="font-light text-muted-light dark:text-muted-dark">& Donate</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-start">
          {/* ── Form column ── */}
          <div>
            <StepIndicator current={displayStep} total={totalSteps} labels={stepLabels} />

            {isAuthed && session.data?.user?.email && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.5}
                className="mb-8 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
              >
                {/* Signed in row */}
                <SignedInRow />

                {/* Shipping address row — step 4 + hasPhysical only */}
                {effectiveStep === 4 && hasPhysical && userAddress && (
                  <div className="flex items-start gap-3 px-4 py-3 border-t border-border-light dark:border-border-dark">
                    <div
                      className="shrink-0 w-6 h-6 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30 mt-0.5"
                      aria-hidden="true"
                    >
                      <span className="text-[9px] font-mono font-bold text-primary-light dark:text-primary-dark uppercase">
                        @
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                        Ships to
                      </p>
                      <p className="text-xs font-mono text-text-light dark:text-text-dark">
                        {formattedShippingAddress}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {effectiveStep === 1 && <StepSignIn key="signin" redirectTo="/checkout" />}
              {effectiveStep === 2 && (
                <Step2Name
                  key="name"
                  inputs={inputs}
                  errors={errors}
                  handleInput={handleInput}
                  onNext={handleNext}
                  isAuthed={isAuthed}
                />
              )}
              {effectiveStep === 3 && hasPhysical && (
                <Step3Address
                  key="address"
                  inputs={inputs}
                  errors={errors}
                  handleInput={handleInput}
                  onNext={handleNext}
                  onBack={handleBack}
                  userAddress={userAddress}
                  useSaved={inputs?.useSavedAddress}
                  setUseSaved={(value) => setForm({ useSavedAddress: value })}
                />
              )}
              {effectiveStep === 4 && (
                <Step4Payment
                  key="payment"
                  inputs={inputs}
                  setForm={setForm}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  savedCards={savedCards}
                  processingFee={processingFee}
                  finalAmount={finalAmount}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ── Order summary column ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
            <OrderSummary
              items={items}
              finalAmount={finalAmount}
              total={total}
              coverFees={inputs?.coverFees}
              step={effectiveStep}
              shipping={shipping}
            />
          </motion.div>
        </div>
      </div>
    </main>
  )
}
