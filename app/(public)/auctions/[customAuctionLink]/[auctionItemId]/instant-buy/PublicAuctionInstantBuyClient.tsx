'use client'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { createPaymentIntent } from 'app/lib/actions/_stripe/createPaymentIntent'
import { updateAddress } from 'app/lib/actions/user/updateAddress'
import { updateUserName } from 'app/lib/actions/user/updateUserName'
import { calculateStripeFees } from 'app/lib/stripe/calculateStripeFees'

import { CardElementField } from 'app/components/_primitives/CardElementField'
import { FormError } from 'app/components/_primitives/FormError'
import { SubmitButton } from 'app/components/_primitives/SubmitButton'
import { Toggle } from 'app/components/_primitives/Toggle'
import { CoverFeesToggle } from 'app/components/payment/CoverFeesToggle'
import { SavedCardSelector } from 'app/components/payment/SavedCardSelector'

import { useDefaultCard } from '@hooks/useDefaultCard.hook'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor.hook'

import type { IAuctionItem } from 'types/entities/auction-item'
import type { IPaymentMethod } from 'types/entities/payment-method.types'

interface FormInputs {
  // identity
  firstName: string
  lastName: string
  // address
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipPostalCode: string
  // card
  cardComplete: boolean
  selectedCardId: string | null
  useNewCard: boolean
  saveCard: boolean
  // fees
  coverFees: boolean
  // ui
  loading: boolean
  error: string | null
}

interface Props {
  auctionItem: IAuctionItem
  savedCards: IPaymentMethod[]
  // from server page — no useSession flash
  isAuthed: boolean
  userId: string | null
  userEmail: string
  userName: { firstName: string; lastName: string } | null
  userAddress: {
    addressLine1: string | null
    addressLine2?: string | null
    city: string | null
    state: string | null
    zipPostalCode: string | null
  } | null
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicAuctionInstantBuyClient({
  auctionItem,
  savedCards,
  isAuthed,
  userId,
  userEmail,
  userName,
  userAddress
}: Props) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  // ── Local form state ──────────────────────────────────────────────────────
  const [inputs, setInputs] = useState<FormInputs>({
    firstName: userName?.firstName ?? '',
    lastName: userName?.lastName ?? '',
    addressLine1: userAddress?.addressLine1 ?? '',
    addressLine2: userAddress?.addressLine2 ?? '',
    city: userAddress?.city ?? '',
    state: userAddress?.state ?? '',
    zipPostalCode: userAddress?.zipPostalCode ?? '',
    cardComplete: false,
    selectedCardId: savedCards[0]?.stripePaymentId ?? null,
    useNewCard: savedCards.length === 0,
    saveCard: false,
    coverFees: false,
    loading: false,
    error: null
  })

  const patch = (data: Partial<FormInputs>) => setInputs((prev) => ({ ...prev, ...data }))

  // UI-only toggles — not part of the payment payload
  const [editingName, setEditingName] = useState(!userName?.firstName)
  const [editingAddress, setEditingAddress] = useState(!userAddress?.addressLine1)

  // Per-section field errors
  const [nameErrors, setNameErrors] = useState<Record<string, string>>({})
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})

  // Per-section save loading
  const [savingName, setSavingName] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  // ── Derived amounts ───────────────────────────────────────────────────────
  const baseAmount = Number(auctionItem?.buyNowPrice ?? 0)
  const shipping = Number(auctionItem?.shippingCosts ?? 0)
  const processingFee = calculateStripeFees(baseAmount)
  const feesCovered = inputs.coverFees ? processingFee : 0
  const finalAmount = baseAmount + shipping + feesCovered
  const finalAmountInCents = Math.round(finalAmount * 100)

  // ── Payment derived ───────────────────────────────────────────────────────
  const usingSavedCard = isAuthed && !!inputs.selectedCardId && !inputs.useNewCard
  const enteringNewCard = !isAuthed || savedCards.length === 0 || inputs.useNewCard

  const hasName = !!inputs.firstName && !!inputs.lastName && !editingName
  const hasAddress =
    !!inputs.addressLine1 && !!inputs.city && !!inputs.state && !!inputs.zipPostalCode && !editingAddress

  const addressRequired = !!auctionItem?.requiresShipping
  const addressReady = !addressRequired || hasAddress

  const isValid =
    hasName &&
    addressReady &&
    !inputs.loading &&
    !!stripe &&
    !!elements &&
    (usingSavedCard ? true : inputs.cardComplete)

  // ── Cover photo ───────────────────────────────────────────────────────────
  const coverPhoto = auctionItem?.photos?.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url

  // ── Default card ──────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => patch({ selectedCardId: value }), [])
  useDefaultCard(savedCards, setDefaultCard)

  // ── Name handlers ─────────────────────────────────────────────────────────
  async function handleSaveName() {
    const errs: Record<string, string> = {}
    if (!inputs.firstName.trim()) errs.firstName = 'Required'
    if (!inputs.lastName.trim()) errs.lastName = 'Required'
    if (Object.keys(errs).length) {
      setNameErrors(errs)
      return
    }

    setSavingName(true)
    const result = await updateUserName({
      firstName: inputs.firstName.trim(),
      lastName: inputs.lastName.trim()
    })

    if (!result.success) {
      setNameErrors({ firstName: result.error ?? 'Failed to save' })
      setSavingName(false)
      return
    }

    setNameErrors({})
    setEditingName(false)
    setSavingName(false)
    router.refresh()
  }

  // ── Address handlers ──────────────────────────────────────────────────────
  async function handleSaveAddress() {
    const errs: Record<string, string> = {}
    if (!inputs.addressLine1.trim()) errs.addressLine1 = 'Required'
    if (!inputs.city.trim()) errs.city = 'Required'
    if (!inputs.state.trim()) errs.state = 'Required'
    if (!inputs.zipPostalCode.trim()) errs.zipPostalCode = 'Required'
    if (Object.keys(errs).length) {
      setAddressErrors(errs)
      return
    }

    setSavingAddress(true)
    const result = await updateAddress({
      name: `${inputs.firstName.trim()} ${inputs.lastName.trim()}`,
      addressLine1: inputs.addressLine1.trim(),
      addressLine2: inputs.addressLine2?.trim() || null,
      city: inputs.city.trim(),
      state: inputs.state.trim(),
      zipPostalCode: inputs.zipPostalCode.trim(),
      country: 'US'
    })

    if (!result.success) {
      setAddressErrors({ addressLine1: result.error ?? 'Failed to save' })
      setSavingAddress(false)
      return
    }

    setAddressErrors({})
    setEditingAddress(false)
    setSavingAddress(false)
    router.refresh()
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return

    patch({ loading: true, error: null })

    try {
      const name = `${inputs.firstName.trim()} ${inputs.lastName.trim()}`

      const pusherCallbacks = [
        (value: string) => patch({ error: value }),
        () => {
          patch({ loading: false })
        }
      ] as const

      const basePayload = {
        amount: finalAmountInCents,
        name,
        email: userEmail,
        orderType: 'AUCTION_PURCHASE' as const,
        userId,
        coverFees: inputs.coverFees,
        feesCovered,
        auctionItemId: auctionItem?.id
      }

      if (usingSavedCard) {
        const result = await createPaymentIntent({
          ...basePayload,
          savedCardId: inputs.selectedCardId
        })
        if (!result.success) throw new Error(result.error)

        setupPusherListenerOneTime(inputs.saveCard, inputs.selectedCardId, ...pusherCallbacks)
      } else {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const intentResult = await createPaymentIntent({
          ...basePayload,
          saveCard: inputs.saveCard
        })
        if (!intentResult.success) throw new Error(intentResult.error)

        const result = await stripe.confirmCardPayment(intentResult.clientSecret!, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email: userEmail }
          }
        })

        if (result.error) {
          patch({ loading: false, error: result.error.message ?? 'Payment failed' })
        } else if (result.paymentIntent?.status === 'succeeded') {
          setupPusherListenerOneTime(
            inputs.saveCard,
            getPaymentMethodId(result.paymentIntent.payment_method),
            ...pusherCallbacks
          )
        }
      }
    } catch (err) {
      patch({
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      })
    }
  }

  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark" id="main-content">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Nav links */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/auctions/${auctionItem?.auction.customAuctionLink}/${auctionItem?.id}`}
            className="inline-flex items-center gap-2   text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            aria-label={`Back to ${auctionItem?.auction.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Auction Item
          </Link>
          <Link
            href="/member/portal"
            className="inline-flex items-center gap-2   text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
          >
            Member Portal
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <span className="  text-f10 uppercase tracking-[0.25em] text-primary-light dark:text-primary-dark">
              Instant Buy
            </span>
          </div>
          <h1 className="  text-2xl sm:text-3xl uppercase tracking-widest text-text-light dark:text-text-dark">
            Complete Purchase
          </h1>
        </div>

        <div className="space-y-6">
          {/* Item card */}
          <section
            aria-label="Item details"
            className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <div className="flex gap-4 p-4">
              {coverPhoto && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden border border-border-light dark:border-border-dark">
                  <Image
                    src={coverPhoto}
                    alt={auctionItem?.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <h2 className="  text-sm sm:text-base uppercase tracking-widest text-text-light dark:text-text-dark leading-snug">
                  {auctionItem?.name}
                </h2>
                {auctionItem?.description && (
                  <p className="font-lato text-xs text-muted-light dark:text-muted-dark leading-relaxed line-clamp-2">
                    {auctionItem?.description}
                  </p>
                )}
                {auctionItem?.requiresShipping && (
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 text-muted-light dark:text-muted-dark shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m8 4v10"
                      />
                    </svg>
                    <span className="font-lato text-xs text-muted-light dark:text-muted-dark">
                      {auctionItem?.shippingCosts
                        ? `Shipping: $${Number(auctionItem?.shippingCosts).toFixed(2)}`
                        : 'Shipping included'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
              <span className="  text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">
                Buy Now Price
              </span>
              <span className="  text-lg text-primary-light dark:text-primary-dark">${baseAmount.toFixed(2)}</span>
            </div>
          </section>

          {/* Order summary */}
          <section
            aria-label="Order summary"
            className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2 className="  text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">
                Order Summary
              </h2>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-lato text-sm text-text-light dark:text-text-dark">Item price</span>
                <span className="font-lato text-sm text-text-light dark:text-text-dark">${baseAmount.toFixed(2)}</span>
              </div>
              {inputs.coverFees && (
                <div className="flex justify-between items-center">
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">Processing fee</span>
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">
                    +${feesCovered.toFixed(2)}
                  </span>
                </div>
              )}
              {auctionItem?.requiresShipping && auctionItem?.shippingCosts && (
                <div className="flex justify-between items-center">
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">Shipping</span>
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">
                    +${Number(auctionItem?.shippingCosts).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-border-light dark:border-border-dark pt-2 flex justify-between items-center">
                <span className="  text-sm uppercase tracking-widest text-text-light dark:text-text-dark">Total</span>
                <span className="  text-lg text-primary-light dark:text-primary-dark">${finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* ── Name section ── */}
          <section
            aria-label={hasName ? 'Your name' : 'Enter your name'}
            className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            {hasName ? (
              <>
                <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                  <p className="  text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Name</p>
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    className="  text-f10 uppercase tracking-[0.2em] text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus-visible:outline-none"
                  >
                    Edit
                  </button>
                </div>
                <div className="px-4 py-3">
                  <p className="font-lato text-sm text-text-light dark:text-text-dark">
                    {inputs.firstName} {inputs.lastName}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                  <h2 className="  text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">
                    Your Name
                  </h2>
                  <p className="font-lato text-xs text-muted-light dark:text-muted-dark mt-0.5">
                    Required to complete your purchase.
                  </p>
                </div>
                <div className="px-4 py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={inputs.firstName}
                        onChange={(e) => patch({ firstName: e.target.value })}
                        autoComplete="given-name"
                        placeholder="Jane"
                        aria-invalid={!!nameErrors.firstName}
                        className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${nameErrors.firstName ? 'border-red-400 dark:border-red-500' : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'}`}
                      />
                      {nameErrors.firstName && (
                        <p role="alert" className="font-lato text-xs text-red-500 mt-1">
                          {nameErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={inputs.lastName}
                        onChange={(e) => patch({ lastName: e.target.value })}
                        autoComplete="family-name"
                        placeholder="Doe"
                        aria-invalid={!!nameErrors.lastName}
                        className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${nameErrors.lastName ? 'border-red-400 dark:border-red-500' : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'}`}
                      />
                      {nameErrors.lastName && (
                        <p role="alert" className="font-lato text-xs text-red-500 mt-1">
                          {nameErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {userName?.firstName && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingName(false)
                          setNameErrors({})
                        }}
                        className="flex-1 py-2.5 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark   text-f10 uppercase tracking-[0.25em] hover:text-text-light dark:hover:text-text-dark transition-colors focus-visible:outline-none"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={!inputs.firstName.trim() || !inputs.lastName.trim() || savingName}
                      className="flex-1 py-2.5 px-4 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white   text-f10 uppercase tracking-[0.25em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      {savingName ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Save Name'
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* ── Address section ── */}
          {addressRequired && (
            <section
              aria-label={hasAddress ? 'Shipping address' : 'Enter shipping address'}
              className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
            >
              {hasAddress ? (
                <>
                  <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                    <p className="  text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">
                      Shipping Address
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingAddress(true)}
                      className="  text-f10 uppercase tracking-[0.2em] text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus-visible:outline-none"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="px-4 py-3 space-y-0.5">
                    <p className="font-lato text-sm text-text-light dark:text-text-dark">{inputs.addressLine1}</p>
                    {inputs.addressLine2 && (
                      <p className="font-lato text-sm text-text-light dark:text-text-dark">{inputs.addressLine2}</p>
                    )}
                    <p className="font-lato text-sm text-text-light dark:text-text-dark">
                      {inputs.city}, {inputs.state} {inputs.zipPostalCode}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                    <h2 className="  text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">
                      Shipping Address
                    </h2>
                    <p className="font-lato text-xs text-muted-light dark:text-muted-dark mt-0.5">
                      Required for shipping your item.
                    </p>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Address line 1 */}
                      <div className="col-span-2">
                        <label
                          htmlFor="addressLine1"
                          className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                        >
                          Address
                        </label>
                        <input
                          id="addressLine1"
                          name="addressLine1"
                          type="text"
                          value={inputs.addressLine1}
                          onChange={(e) => patch({ addressLine1: e.target.value })}
                          autoComplete="address-line1"
                          placeholder="123 Main St"
                          aria-invalid={!!addressErrors.addressLine1}
                          className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${addressErrors.addressLine1 ? 'border-red-400 dark:border-red-500' : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'}`}
                        />
                        {addressErrors.addressLine1 && (
                          <p role="alert" className="font-lato text-xs text-red-500 mt-1">
                            {addressErrors.addressLine1}
                          </p>
                        )}
                      </div>
                      {/* Address line 2 */}
                      <div className="col-span-2">
                        <label
                          htmlFor="addressLine2"
                          className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                        >
                          Apt / Suite <span className="normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          id="addressLine2"
                          name="addressLine2"
                          type="text"
                          value={inputs.addressLine2}
                          onChange={(e) => patch({ addressLine2: e.target.value })}
                          autoComplete="address-line2"
                          placeholder="Apt 4B"
                          className="w-full px-3.5 py-2.5 border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
                        />
                      </div>
                      {/* City */}
                      <div className="col-span-2">
                        <label
                          htmlFor="city"
                          className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={inputs.city}
                          onChange={(e) => patch({ city: e.target.value })}
                          autoComplete="address-level2"
                          placeholder="Boston"
                          aria-invalid={!!addressErrors.city}
                          className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${addressErrors.city ? 'border-red-400 dark:border-red-500' : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'}`}
                        />
                        {addressErrors.city && (
                          <p role="alert" className="font-lato text-xs text-red-500 mt-1">
                            {addressErrors.city}
                          </p>
                        )}
                      </div>
                      {/* State */}
                      <div>
                        <label
                          htmlFor="state"
                          className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                        >
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={inputs.state}
                          onChange={(e) => patch({ state: e.target.value })}
                          autoComplete="address-level1"
                          placeholder="MA"
                          maxLength={2}
                          aria-invalid={!!addressErrors.state}
                          className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors uppercase ${addressErrors.state ? 'border-red-400 dark:border-red-500' : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'}`}
                        />
                        {addressErrors.state && (
                          <p role="alert" className="font-lato text-xs text-red-500 mt-1">
                            {addressErrors.state}
                          </p>
                        )}
                      </div>
                      {/* ZIP */}
                      <div>
                        <label
                          htmlFor="zipPostalCode"
                          className="block   text-f10 uppercase tracking-[0.2em] text-muted-light dark:text-muted-dark mb-1.5"
                        >
                          ZIP
                        </label>
                        <input
                          id="zipPostalCode"
                          name="zipPostalCode"
                          type="text"
                          value={inputs.zipPostalCode}
                          onChange={(e) => patch({ zipPostalCode: e.target.value })}
                          autoComplete="postal-code"
                          placeholder="02101"
                          maxLength={5}
                          aria-invalid={!!addressErrors.zipPostalCode}
                          className={`w-full px-3.5 py-2.5 border bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none transition-colors ${addressErrors.zipPostalCode ? 'border-red-400 dark:border-red-500' : 'border-border-light dark:border-border-dark focus-visible:border-primary-light dark:focus-visible:border-primary-dark'}`}
                        />
                        {addressErrors.zipPostalCode && (
                          <p role="alert" className="font-lato text-xs text-red-500 mt-1">
                            {addressErrors.zipPostalCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {userAddress?.addressLine1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(false)
                            setAddressErrors({})
                          }}
                          className="flex-1 py-2.5 px-4 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark   text-f10 uppercase tracking-[0.25em] hover:text-text-light dark:hover:text-text-dark transition-colors focus-visible:outline-none"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={
                          !inputs.addressLine1.trim() ||
                          !inputs.city.trim() ||
                          !inputs.state.trim() ||
                          !inputs.zipPostalCode.trim() ||
                          savingAddress
                        }
                        className="flex-1 py-2.5 px-4 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white   text-f10 uppercase tracking-[0.25em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        {savingAddress ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="w-3.5 h-3.5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          'Save Address'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Payment form */}
          <section aria-label="Payment details">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {isAuthed && savedCards.length > 0 && (
                <SavedCardSelector
                  savedCards={savedCards}
                  selectedCardId={inputs.selectedCardId}
                  useNewCard={inputs.useNewCard}
                  onSelectCard={(id) => patch({ selectedCardId: id, useNewCard: false })}
                  onUseNewCard={() => patch({ useNewCard: true, selectedCardId: null })}
                  onUseSavedCard={() =>
                    patch({ useNewCard: false, selectedCardId: savedCards[0]?.stripePaymentId ?? null })
                  }
                />
              )}

              {enteringNewCard && (
                <CardElementField
                  onChange={({ complete, error }) => patch({ cardComplete: complete, error: error ?? null })}
                />
              )}

              {enteringNewCard && (
                <Toggle
                  id="instant-buy-save-card"
                  label="Save card for future purchases"
                  description="One-click checkout next time"
                  checked={inputs.saveCard}
                  onToggle={() => patch({ saveCard: !inputs.saveCard })}
                />
              )}

              <CoverFeesToggle
                checked={inputs.coverFees}
                onChange={() => patch({ coverFees: !inputs.coverFees })}
                processingFee={processingFee}
              />

              <FormError error={inputs.error} />

              <SubmitButton loading={inputs.loading} isValid={isValid} label={`Buy Now — $${finalAmount.toFixed(2)}`} />

              <p className="font-lato text-xs text-muted-light dark:text-muted-dark text-center leading-relaxed">
                Your payment is secured by Stripe. Little Paws Dachshund Rescue will never store your card details.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
