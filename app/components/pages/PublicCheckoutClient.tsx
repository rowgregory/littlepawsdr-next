'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { ArrowRight, ArrowLeft, Check, CreditCard, CheckCircle, Plus } from 'lucide-react'
import { CartItem } from 'app/lib/store/slices/cartSlice'
import Picture from '../common/Picture'
import { STATES } from 'app/lib/constants/states'
import { store, useCartSelector, useFormSelector, useUiSelector } from 'app/lib/store/store'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { createFormActions } from 'app/utils/formActions'
import { fadeUp } from 'app/lib/constants/motion'
import { EMAIL_REGEX } from 'app/utils/regex'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import { useDefaultCard } from '@hooks/useDefaultCard'
import { createPaymentIntent } from 'app/lib/actions/createPaymentIntent'
import { getOrderType } from 'app/utils/getOrderType'
import Link from 'next/link'
import { IAddress } from 'types/entities/address'
import { updateAddress } from 'app/lib/actions/updateAddress'
import { useRouter } from 'next/navigation'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { StepIndicator } from '../common/StepIndicator'
import { StepSignIn } from '../common/SignInStep'
import { errorClass, fieldClass, labelClass } from 'app/lib/constants/styles'
import { SignedInRow } from '../common/SignedInRow'
import { useInitializeForm } from '@hooks/useInitializeForm'

// ─────────────────────────────────────────────
// Order summary sidebar
// ─────────────────────────────────────────────

function OrderSummary({
  items,
  finalAmount,
  total,
  coverFees,
  step,
  shipping
}: {
  items: CartItem[]
  finalAmount: number
  total: number
  coverFees: boolean
  step: number
  shipping: number
}) {
  return (
    <aside aria-label="Order summary" className="lg:sticky lg:top-8">
      <div className="border border-border-light dark:border-border-dark">
        <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Order Summary</p>
        </div>

        <ul className="divide-y divide-border-light dark:divide-border-dark" role="list" aria-label="Cart items">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-5 py-3.5" role="listitem">
              <div
                className="shrink-0 w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark overflow-hidden"
                aria-hidden="true"
              >
                {item.image ? (
                  <Picture priority={true} src={item.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono text-text-light dark:text-text-dark truncate">{item.name}</p>
                {item.quantity > 1 && <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">×{item.quantity}</p>}
              </div>
              <span className="text-[11px] font-mono text-primary-light dark:text-primary-dark tabular-nums shrink-0">
                ${item.price * item.quantity}
              </span>
            </li>
          ))}
        </ul>

        <div className="px-5 py-4 border-t border-border-light dark:border-border-dark space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Subtotal</span>
            <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums">${total.toFixed(2)}</span>
          </div>

          {shipping > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Shipping</span>
              <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums">+${shipping.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Shipping</span>
              <span className="text-[11px] font-mono text-primary-light dark:text-primary-dark tabular-nums">Free</span>
            </div>
          )}

          {coverFees && step === 4 && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Processing fees</span>
              <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums">
                +${(finalAmount - total - shipping).toFixed(2)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-border-light dark:border-border-dark flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Total</span>
            <span className="font-quicksand font-black text-xl text-primary-light dark:text-primary-dark tabular-nums">
              ${coverFees && step === 4 ? finalAmount.toFixed(2) : (total + shipping).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────
// Step 2 — Name
// ─────────────────────────────────────────────

function StepName({ inputs, errors, handleInput, onNext, isAuthed }: any) {
  const isValid = !!inputs?.firstName?.trim() && !!inputs?.lastName?.trim()

  return (
    <motion.div
      key="step-name"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-1">
          Your <span className="font-light text-muted-light dark:text-muted-dark">name</span>
        </h2>
        <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">Who should we thank for this donation?</p>
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
        <div>
          <label htmlFor="checkout-firstName" className={labelClass}>
            First Name
          </label>
          <input
            id="checkout-firstName"
            type="text"
            name="firstName"
            value={inputs?.firstName ?? ''}
            onChange={handleInput}
            placeholder="Jane"
            autoComplete="given-name"
            required
            aria-required="true"
            aria-invalid={!!errors?.firstName}
            aria-describedby={errors?.firstName ? 'firstName-error' : undefined}
            className={fieldClass}
          />
          {errors?.firstName && (
            <p id="firstName-error" role="alert" className={errorClass}>
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="checkout-lastName" className={labelClass}>
            Last Name
          </label>
          <input
            id="checkout-lastName"
            type="text"
            name="lastName"
            value={inputs?.lastName ?? ''}
            onChange={handleInput}
            placeholder="Smith"
            autoComplete="family-name"
            required
            aria-required="true"
            aria-invalid={!!errors?.lastName}
            aria-describedby={errors?.lastName ? 'lastName-error' : undefined}
            className={fieldClass}
          />
          {errors?.lastName && (
            <p id="lastName-error" role="alert" className={errorClass}>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {!isAuthed && (
        <div>
          <label htmlFor="checkout-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="checkout-email"
            type="email"
            name="email"
            value={inputs?.email ?? ''}
            onChange={handleInput}
            placeholder="jane@example.com"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!!errors?.email}
            aria-describedby={errors?.email ? 'checkout-email-error' : undefined}
            className={fieldClass}
          />
          {errors?.email && (
            <p id="checkout-email-error" role="alert" className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        aria-disabled={!isValid}
        className={`w-full py-4 font-black text-[11px] tracking-[0.2em] uppercase font-mono transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2
          ${
            isValid
              ? 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
              : 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
          }`}
      >
        Continue
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Step 3 — Shipping Address (physical only)
// ─────────────────────────────────────────────

function StepAddress({ inputs, errors, handleInput, onNext, onBack, userAddress, useSaved, setUseSaved }: any) {
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const router = useRouter()

  const handleContinue = async () => {
    if (!useSaved && userAddress) {
      setShowReplaceModal(true)
    } else {
      if (!userAddress) {
        await updateAddress({
          name: `${inputs?.firstName?.trim()} ${inputs?.lastName?.trim()}`,
          addressLine1: inputs?.addressLine1?.trim(),
          addressLine2: inputs?.addressLine2?.trim() || null,
          city: inputs?.city?.trim(),
          state: inputs?.state,
          zipPostalCode: inputs?.zipPostalCode?.trim(),
          country: 'US'
        })
        router.refresh()
      }
      onNext()
    }
  }

  const isValid = useSaved
    ? !!userAddress
    : !!inputs?.addressLine1?.trim() && !!inputs?.city?.trim() && !!inputs?.state && !!inputs?.zipPostalCode?.trim()

  return (
    <>
      <AnimatePresence>
        {showReplaceModal && (
          <>
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowReplaceModal(false)}
              aria-hidden="true"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm z-50 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark"
              role="dialog"
              aria-modal="true"
              aria-labelledby="replace-address-title"
            >
              <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3 mb-1">
                  <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Shipping Address</p>
                </div>
                <h3 id="replace-address-title" className="font-quicksand font-bold text-lg text-text-light dark:text-text-dark">
                  Update saved address?
                </h3>
              </div>

              <div className="px-6 py-5">
                <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed mb-6">
                  Would you like to save this as your new address, or just use it for this order?
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateAddress({
                        name: `${inputs?.firstName?.trim()} ${inputs?.lastName?.trim()}`,
                        addressLine1: inputs?.addressLine1?.trim(),
                        addressLine2: inputs?.addressLine2?.trim() || null,
                        city: inputs?.city?.trim(),
                        state: inputs?.state,
                        zipPostalCode: inputs?.zipPostalCode?.trim(),
                        country: 'US'
                      })
                      router.refresh()
                      setShowReplaceModal(false)
                      onNext()
                    }}
                    className="w-full py-3.5 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    Save &amp; continue
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplaceModal(false)
                      onNext()
                    }}
                    className="w-full py-3.5 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    Just this order
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.div
        key="step-address"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h2 className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-1">
            Shipping <span className="font-light text-muted-light dark:text-muted-dark">address</span>
          </h2>
          <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">One or more items in your cart ship physically.</p>
        </div>

        {/* ── Saved address ── */}
        {userAddress && useSaved ? (
          <div className="space-y-2">
            <button
              type="button"
              aria-pressed={true}
              className="w-full flex items-start justify-between px-3.5 py-3.5 border-2 border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <div>
                <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-primary-light dark:text-primary-dark mb-1">Saved address</p>
                <p className="text-sm font-mono text-text-light dark:text-text-dark">
                  {userAddress.addressLine1}
                  {userAddress.addressLine2 && `, ${userAddress.addressLine2}`}
                </p>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-0.5">
                  {userAddress.city}, {userAddress.state} {userAddress.zipPostalCode}
                </p>
              </div>
              <Check className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                setUseSaved(false)
                store.dispatch(
                  setInputs({
                    formName: 'checkoutForm',
                    data: {
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      zipPostalCode: ''
                    }
                  })
                )
              }}
              className="w-full flex items-center gap-2 px-3.5 py-3 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              Use a different address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userAddress && (
              <button
                type="button"
                onClick={() => {
                  setUseSaved(true)
                  store.dispatch(
                    setInputs({
                      formName: 'checkoutForm',
                      data: {
                        addressLine1: userAddress?.addressLine1 ?? '',
                        addressLine2: userAddress?.addressLine2 ?? '',
                        city: userAddress?.city ?? '',
                        state: userAddress?.state ?? '',
                        zipPostalCode: userAddress?.zipPostalCode ?? ''
                      }
                    })
                  )
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Use saved address
              </button>
            )}

            {/* Street */}
            <div>
              <label htmlFor="checkout-addressLine1" className={labelClass}>
                Street Address
              </label>
              <input
                id="checkout-addressLine1"
                type="text"
                name="addressLine1"
                value={inputs?.addressLine1 ?? ''}
                onChange={handleInput}
                placeholder="123 Main Street"
                autoComplete="street-address"
                required
                aria-required="true"
                aria-invalid={!!errors?.addressLine1}
                aria-describedby={errors?.addressLine1 ? 'address-error' : undefined}
                className={fieldClass}
              />
              {errors?.addressLine1 && (
                <p id="address-error" role="alert" className={errorClass}>
                  {errors.addressLine1}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="checkout-addressLine2" className={labelClass}>
                Unit / Apartment No.
              </label>
              <input
                id="checkout-addressLine2"
                type="text"
                name="addressLine2"
                value={inputs?.addressLine2 ?? ''}
                onChange={handleInput}
                placeholder="Unit 1"
                autoComplete="street-address"
                aria-required="true"
                aria-invalid={!!errors?.addressLine2}
                aria-describedby={errors?.addressLine2 ? 'address-error' : undefined}
                className={fieldClass}
              />
              {errors?.addressLine2 && (
                <p id="address-error" role="alert" className={errorClass}>
                  {errors.addressLine2}
                </p>
              )}
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkout-city" className={labelClass}>
                  City
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  value={inputs?.city ?? ''}
                  onChange={handleInput}
                  placeholder="Boston"
                  autoComplete="address-level2"
                  required
                  aria-required="true"
                  aria-invalid={!!errors?.city}
                  aria-describedby={errors?.city ? 'city-error' : undefined}
                  className={fieldClass}
                />
                {errors?.city && (
                  <p id="city-error" role="alert" className={errorClass}>
                    {errors.city}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="checkout-state" className={labelClass}>
                  State
                </label>
                <select
                  id="checkout-state"
                  name="state"
                  value={inputs?.state ?? ''}
                  onChange={handleInput}
                  required
                  aria-required="true"
                  aria-invalid={!!errors?.state}
                  aria-describedby={errors?.state ? 'state-error' : undefined}
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.text}
                    </option>
                  ))}
                </select>
                {errors?.state && (
                  <p id="state-error" role="alert" className={errorClass}>
                    {errors.state}
                  </p>
                )}
              </div>
            </div>

            {/* ZIP */}
            <div>
              <label htmlFor="checkout-zip" className={labelClass}>
                ZIP / Postal Code
              </label>
              <input
                id="checkout-zip"
                type="text"
                name="zipPostalCode"
                value={inputs?.zipPostalCode ?? ''}
                onChange={handleInput}
                placeholder="02101"
                autoComplete="postal-code"
                required
                aria-required="true"
                aria-invalid={!!errors?.zipPostalCode}
                aria-describedby={errors?.zipPostalCode ? 'zip-error' : undefined}
                className={`${fieldClass} max-w-45`}
              />
              {errors?.zipPostalCode && (
                <p id="zip-error" role="alert" className={errorClass}>
                  {errors.zipPostalCode}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-4 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isValid}
            aria-disabled={!isValid}
            className={`flex-1 py-4 font-black text-[11px] tracking-[0.2em] uppercase font-mono transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2
            ${
              isValid
                ? 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
                : 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ─────────────────────────────────────────────
// Step 4 — Payment
// ─────────────────────────────────────────────

function StepPayment({
  inputs,
  onBack,
  onSubmit,
  loading,
  savedCards,
  useNewCard,
  setSelectedCardId,
  selectedCardId,
  setUseNewCard,
  setError,
  coverFees,
  setCoverFees,
  processingFee,
  error,
  setSaveCard,
  saveCard,
  setCardComplete,
  cardComplete,
  finalAmount,
  total
}: any) {
  const { isDark } = useUiSelector()
  const session = useSession()

  const isSubmitReady = loading
    ? false
    : selectedCardId && !useNewCard
      ? true // saved card selected — no need for cardComplete
      : cardComplete // new card — must be complete

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
          <label className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">Payment Method</label>

          {!useNewCard ? (
            <div className="space-y-2">
              {savedCards.map((card) => (
                <button
                  key={card.stripePaymentId}
                  type="button"
                  onClick={() => setSelectedCardId(card.stripePaymentId)}
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
                    <CheckCircle className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setUseNewCard(true)
                  setSelectedCardId(null)
                }}
                className="w-full flex items-center gap-2 px-3.5 py-3 border border-dashed border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Use a different card
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Card element shown here when useNewCard is true */}
              <button
                type="button"
                onClick={() => {
                  setUseNewCard(false)
                  setSelectedCardId(savedCards[0]?.stripePaymentId ?? null)
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Use a saved card
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Card element ── */}
      {(!session?.data?.user || savedCards.length === 0 || useNewCard) && (
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
      )}

      {/* ── Options ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4.5} className="mb-6 space-y-2">
        {/* Cover fees */}
        <button
          type="button"
          role="switch"
          aria-checked={coverFees}
          onClick={() => setCoverFees(!coverFees)}
          className="w-full flex items-center justify-between px-3.5 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <div className="text-left">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark">Cover processing fees</p>
            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
              Add ${processingFee?.toFixed(2)} so 100% goes to the rescue
            </p>
          </div>
          <div
            aria-hidden="true"
            className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${
              coverFees ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${coverFees ? 'translate-x-0.5' : '-translate-x-4.5'}`}
            />
          </div>
        </button>

        {/* Save card */}
        {session?.data?.user && (!selectedCardId || useNewCard) && (
          <button
            type="button"
            role="switch"
            aria-checked={saveCard}
            onClick={() => setSaveCard(!saveCard)}
            className="w-full flex items-center justify-between px-3.5 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <div className="text-left">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark">Save card for future donations</p>
              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">One-click checkout next time</p>
            </div>
            <div
              aria-hidden="true"
              className={`relative shrink-0 w-10 h-5 ml-4 transition-colors duration-200 ${
                saveCard ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white transition-transform duration-200 ${saveCard ? 'translate-x-0.5' : '-translate-x-4.5'}`}
              />
            </div>
          </button>
        )}
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

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!isSubmitReady}
          aria-disabled={!isSubmitReady}
          className="px-5 py-4 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isSubmitReady}
          aria-disabled={!isSubmitReady}
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
            `Pay $${coverFees ? finalAmount.toFixed(2) : total.toFixed(2)}`
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

const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'checkoutForm', data }))

// ─────────────────────────────────────────────
// Main checkout
// ─────────────────────────────────────────────

type IPublicCheckoutClient = {
  savedCards: IPaymentMethod[]
  userAddress: IAddress
  userName: { firstName: string; lastName: string }
}

export function PublicCheckoutClient({ savedCards, userAddress, userName }: IPublicCheckoutClient) {
  // ── Stripe ────────────────────────────────────────────────────────────────
  const stripe = useStripe()
  const elements = useElements()

  // ── Store ────────────────────────────────────────────────────────────────
  const session = useSession()
  const { items } = useCartSelector()
  const { checkoutForm } = useFormSelector()
  const { handleInput, setErrors } = createFormActions('checkoutForm', store.dispatch)

  // ── Hooks ────────────────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  // const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards?.find((c) => c.isDefault).stripePaymentId ?? null)
  // const [useNewCard, setUseNewCard] = useState(savedCards?.length === 0)
  // const [saveCard, setSaveCard] = useState(false)
  // const [coverFees, setCoverFees] = useState(true)
  // const [processingStatus, setProcessingStatus] = useState('idle')
  // const [cardComplete, setCardComplete] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  // const [useSavedAddress, setUseSavedAddress] = useState(!!userAddress)

  const inputs = checkoutForm?.inputs
  const errors = checkoutForm?.errors

  const isAuthed = session.status === 'authenticated'
  const hasPhysical = items.some((i) => i.isPhysicalProduct)

  // Step logic:
  // 1 = sign in, 2 = name, 3 = address (physical only), 4 = payment
  // For digital only: 1 → 2 → 4 (skip 3)
  const [step, setStep] = useState(isAuthed ? 2 : 1)

  const totalSteps = hasPhysical ? 4 : 3
  const displayStep = hasPhysical ? step : step === 4 ? 3 : step
  const stepLabels = hasPhysical ? ['Sign In', 'Your Name', 'Shipping', 'Payment'] : ['Sign In', 'Your Name', 'Payment']

  // Auto advance past step 1 if already signed in
  const effectiveStep = !isAuthed ? step : step === 1 ? 2 : step

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = items.filter((i) => i.isPhysicalProduct).reduce((sum, i) => sum + i.shippingPrice * i.quantity, 0)

  const processingFee = Math.round(((total + 0.3) / (1 - 0.029) - total) * 100) / 100
  const finalAmount = Math.round((total + shipping + (inputs?.coverFees ? processingFee : 0)) * 100) / 100
  const feesCovered = inputs?.coverFees ? processingFee : 0
  const isValid =
    inputs?.firstName?.trim().length > 0 &&
    inputs?.lastName?.trim().length > 0 &&
    EMAIL_REGEX.test(session.data.user ? session.data.user.email : inputs?.email) &&
    (inputs?.selectedCardId && !inputs?.useNewCard ? true : inputs?.cardComplete)
  const usingSavedCard = !!inputs?.selectedCardId && !inputs?.useNewCard && isAuthed
  const email = isAuthed ? session.data?.user?.email : inputs?.email

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])

  useDefaultCard(savedCards, setDefaultCard)

  useInitializeForm(setForm, { session, savedCards, userName })

  const validateName = () => {
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

  const validateAddress = () => {
    const errs: Record<string, string> = {}
    if (!inputs?.addressLine1?.trim()) errs.address = 'Required'
    if (!inputs?.city?.trim()) errs.city = 'Required'
    if (!inputs?.state) errs.state = 'Required'
    if (!inputs?.zipPostalCode?.trim()) errs.zipPostalCode = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (effectiveStep === 2 && !validateName()) return
    if (effectiveStep === 3 && !inputs?.useSavedAddress && !validateAddress()) return

    setStep((prev) => (hasPhysical ? prev + 1 : prev === 2 ? 4 : prev + 1))
  }

  const handleBack = () => {
    setStep((prev) => (hasPhysical ? prev - 1 : prev === 4 ? 2 : prev - 1))
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return

    setForm({ loading: true, error: null, processingStatus: 'processing' })

    try {
      const name = `${inputs.firstName} ${inputs.lastName}`
      const amountInCents = Math.round(finalAmount * 100)

      const pusherCallbacks = [
        (value: string) => setForm({ error: value }),
        (value: string) => setForm({ processingStatus: value }),
        () => setForm({ loading: false })
      ] as const

      const address = hasPhysical
        ? {
            addressLine1: inputs?.useSavedAddress ? (userAddress?.addressLine1 ?? null) : (inputs?.addressLine1 ?? null),
            addressLine2: inputs?.useSavedAddress ? (userAddress?.addressLine2 ?? null) : (inputs?.addressLine2 ?? null),
            city: inputs?.useSavedAddress ? (userAddress?.city ?? null) : (inputs?.city ?? null),
            state: inputs?.useSavedAddress ? (userAddress?.state ?? null) : (inputs?.state ?? null),
            zipPostalCode: inputs?.useSavedAddress ? (userAddress?.zipPostalCode ?? null) : (inputs?.zipPostalCode ?? null),
            country: 'US'
          }
        : null

      const basePayload = {
        amount: amountInCents,
        name,
        email,
        orderType: getOrderType(items),
        userId: session.data?.user?.id,
        coverFees: inputs?.coverFees,
        feesCovered,
        items,
        ...(address != null && { address })
      }
      if (usingSavedCard) {
        const result = await createPaymentIntent({
          ...basePayload,
          savedCardId: inputs?.selectedCardId
        })

        if (!result.success) throw new Error(result.error)

        setupPusherListenerOneTime(result.paymentIntentId!, false, inputs?.selectedCardId, inputs?.processingStatus, ...pusherCallbacks)
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
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Little Paws Dachshund Rescue</p>
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
                      <span className="text-[9px] font-mono font-bold text-primary-light dark:text-primary-dark uppercase">@</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Ships to</p>
                      <p className="text-xs font-mono text-text-light dark:text-text-dark">
                        {inputs?.useSavedAddress ? (
                          <>
                            {userAddress?.addressLine1}
                            {userAddress?.addressLine2 && `, ${userAddress.addressLine2}`}
                            {userAddress?.city && `, ${userAddress.city}`}
                            {userAddress?.state && `, ${userAddress.state}`} {userAddress?.zipPostalCode}
                          </>
                        ) : (
                          <>
                            {inputs?.addressLine1}
                            {inputs?.addressLine2 && `, ${inputs.addressLine2}`}
                            {inputs?.city && `, ${inputs.city}`}
                            {inputs?.state && `, ${inputs.state}`} {inputs?.zipPostalCode}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {effectiveStep === 1 && <StepSignIn key="signin" redirectTo="/checkout" />}
              {effectiveStep === 2 && (
                <StepName key="name" inputs={inputs} errors={errors} handleInput={handleInput} onNext={handleNext} isAuthed={isAuthed} />
              )}
              {effectiveStep === 3 && hasPhysical && (
                <StepAddress
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
                <StepPayment
                  key="payment"
                  inputs={inputs}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  loading={inputs?.loading}
                  savedCards={savedCards}
                  useNewCard={inputs?.useNewCard}
                  setSelectedCardId={(value) => setForm({ selectedCardId: value })}
                  selectedCardId={inputs?.selectedCardId}
                  setUseNewCard={(value) => setForm({ useNewCard: value })}
                  setError={(value) => setForm({ error: value })}
                  coverFees={inputs?.coverFees}
                  setCoverFees={(value) => setForm({ coverFees: value })}
                  processingFee={processingFee}
                  error={inputs?.error}
                  setSaveCard={(value) => setForm({ saveCard: value })}
                  saveCard={inputs?.saveCard}
                  setCardComplete={(value) => setForm({ cardComplete: value })}
                  cardComplete={inputs?.cardComplete}
                  finalAmount={finalAmount}
                  total={total}
                  userAddress={userAddress}
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
