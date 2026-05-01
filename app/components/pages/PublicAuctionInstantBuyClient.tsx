'use client'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback, useMemo, useRef } from 'react'
import { CardElementField } from '../common/CardElementField'
import { store, useFormSelector } from 'app/lib/store/store'
import { calculateStripeFees } from 'app/utils/calculateStripeFees'
import { createPaymentIntent } from 'app/lib/actions/createPaymentIntent'
import { useDefaultCard } from '@hooks/useDefaultCard'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor'
import Link from 'next/link'
import { SavedCardSelector } from '../common/SavedCardSelector'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { CoverFeesToggle } from '../common/CoverFeesToggle'
import { SaveCardToggle } from '../common/SaveCardToggle'
import { IAuctionItem } from 'types/entities/auction-item'
import { UsernameForm } from '../forms/UsernameForm'
import { AddressForm } from '../forms/AddressForm'
import { createFormActions } from 'app/utils/formActions'
import { SubmitButton } from '../common/SubmitButton'
import { FormError } from '../common/FormError'
import { setInputs } from 'app/lib/store/slices/formSlice'

export const dynamic = 'force-dynamic'

// ── Form slice ────────────────────────────────────────────────────
const FORM_NAME = 'instantBuyForm'
const { setInputs: setForm } = createFormActions(FORM_NAME, store.dispatch)

interface PublicAuctionInstantBuyClientProps {
  auctionItem: IAuctionItem
  savedCards: IPaymentMethod[]
  initialFormData: any
}

export default function PublicAuctionInstantBuyClient({ auctionItem, savedCards, initialFormData }: PublicAuctionInstantBuyClientProps) {
  const { data: session, status } = useSession()
  const stripe = useStripe()
  const elements = useElements()
  const user = session?.user
  const userId = user?.id
  const email = user?.email ?? ''
  const isAuthed = status === 'authenticated'

  // ── Form state ────────────────────────────────────────────────
  const form = useFormSelector()
  const inputs = form[FORM_NAME]?.inputs

  const coverFees: boolean = inputs?.coverFees ?? false
  const saveCard: boolean = inputs?.saveCard ?? false
  const selectedCardId: string | null = inputs?.selectedCardId ?? null
  const useNewCard: boolean = inputs?.useNewCard ?? false

  // ── Derived amounts ───────────────────────────────────────────
  const baseAmount = Number(auctionItem?.buyNowPrice ?? 0)
  const processingFee = calculateStripeFees(baseAmount)
  const shipping = Number(auctionItem?.shippingCosts)
  const feesCovered = coverFees ? processingFee : 0
  const finalAmount = baseAmount + shipping + feesCovered
  const finalAmountInCents = Math.round(finalAmount * 100)
  const name = `${inputs?.firstName?.trim()} ${inputs?.lastName?.trim()}`

  const usingSavedCard = isAuthed && !!selectedCardId && !useNewCard

  // ── Cover photo ───────────────────────────────────────────────
  const coverPhoto = auctionItem?.photos?.sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const setDefaultCard = useCallback((value: string) => setForm({ selectedCardId: value }), [])

  useDefaultCard(savedCards, setDefaultCard)

  const initialized = useRef(false)

  useMemo(() => {
    if (initialized.current) return
    initialized.current = true
    store.dispatch(setInputs({ formName: FORM_NAME, data: initialFormData }))
  }, [initialFormData])

  // ── Payment processor ─────────────────────────────────────────────────────
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const baseIntentParams = {
    amount: finalAmountInCents,
    name,
    email,
    orderType: 'AUCTION_PURCHASE' as const,
    userId,
    coverFees,
    feesCovered,
    auctionItemId: auctionItem?.id
  }

  const pusherCallbacks = [
    (value: string) => setForm({ error: value }),
    (value: string) => setForm({ processingStatus: value }),
    () => setForm({ loading: false })
  ] as const

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements) return
    setForm({ error: null, processingStatus: 'processing', loading: true })

    try {
      if (usingSavedCard) {
        const result = await createPaymentIntent({ ...baseIntentParams, savedCardId: selectedCardId })

        if (!result.success) throw new Error(result.error)

        setupPusherListenerOneTime(result.paymentIntentId!, false, selectedCardId, inputs?.processingStatus, ...pusherCallbacks)
      } else {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const intentResult = await createPaymentIntent({ ...baseIntentParams, saveCard })
        if (!intentResult.success) throw new Error(intentResult.error)

        const result = await stripe.confirmCardPayment(intentResult.clientSecret!, {
          payment_method: { card: cardElement, billing_details: { name, email } }
        })

        if (result.error) {
          setForm({ error: result.error.message || 'Payment failed', processingStatus: 'failed' })
        } else if (result.paymentIntent?.status === 'succeeded') {
          setupPusherListenerOneTime(
            result.paymentIntent.id,
            saveCard,
            getPaymentMethodId(result.paymentIntent.payment_method),
            inputs?.processingStatus,
            ...pusherCallbacks
          )
        }
      }
    } catch (err) {
      setForm({ error: err instanceof Error ? err.message : 'Something went wrong. Please try again.', processingStatus: 'failed', loading: false })
    }
  }

  // ── Success state ─────────────────────────────────────────────
  if (inputs?.processingStatus === 'succeeded') {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-changa text-xl uppercase tracking-[0.15em] text-text-light dark:text-text-dark">Purchase Complete</h1>
          <p className="font-lato text-sm text-muted-light dark:text-muted-dark leading-relaxed">
            Thank you for your purchase of <span className="text-text-light dark:text-text-dark font-semibold">{auctionItem?.name}</span>. You&apos;ll
            receive a confirmation email shortly.
          </p>
          <Link
            href={`/auctions/${auctionItem?.auction.customAuctionLink}`}
            className="inline-block mt-4 font-changa text-xs uppercase tracking-[0.25em] text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors"
          >
            ← Back to Auction
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg-light dark:bg-bg-dark" id="main-content">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* ── Nav links ── */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/auctions/${auctionItem?.auction.customAuctionLink}/${auctionItem?.id}`}
            className="inline-flex items-center gap-2 font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            aria-label={`Back to ${auctionItem?.auction.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Auction Item
          </Link>
          <Link
            href="/member/portal"
            className="inline-flex items-center gap-2 font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
          >
            Member Portal
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Page title ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <span className="font-changa text-f10 uppercase tracking-[0.25em] text-primary-light dark:text-primary-dark">Instant Buy</span>
          </div>
          <h1 className="font-changa text-2xl sm:text-3xl uppercase tracking-widest text-text-light dark:text-text-dark">Complete Purchase</h1>
        </div>

        <div className="space-y-6">
          {/* ── Item card ── */}
          <section aria-label="Item details" className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex gap-4 p-4">
              {/* Photo */}
              {coverPhoto && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden border border-border-light dark:border-border-dark">
                  <Image src={coverPhoto} alt={auctionItem?.name} fill className="object-cover" sizes="(max-width: 640px) 96px, 128px" />
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-2">
                <h2 className="font-changa text-sm sm:text-base uppercase tracking-widest text-text-light dark:text-text-dark leading-snug">
                  {auctionItem?.name}
                </h2>
                {auctionItem?.description && (
                  <p className="font-lato text-xs text-muted-light dark:text-muted-dark leading-relaxed line-clamp-2">{auctionItem?.description}</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m8 4v10" />
                    </svg>
                    <span className="font-lato text-xs text-muted-light dark:text-muted-dark">
                      {auctionItem?.shippingCosts ? `Shipping: $${Number(auctionItem?.shippingCosts).toFixed(2)}` : 'Shipping included'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Price row */}
            <div className="border-t border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
              <span className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Buy Now Price</span>
              <span className="font-changa text-lg text-primary-light dark:text-primary-dark">${baseAmount.toFixed(2)}</span>
            </div>
          </section>

          {/* ── Order summary ── */}
          <section aria-label="Order summary" className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2 className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark">Order Summary</h2>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-lato text-sm text-text-light dark:text-text-dark">Item price</span>
                <span className="font-lato text-sm text-text-light dark:text-text-dark">${baseAmount.toFixed(2)}</span>
              </div>
              {coverFees && (
                <div className="flex justify-between items-center">
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">Processing fee</span>
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">+${feesCovered.toFixed(2)}</span>
                </div>
              )}
              {auctionItem?.requiresShipping && auctionItem?.shippingCosts && (
                <div className="flex justify-between items-center">
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">Shipping</span>
                  <span className="font-lato text-sm text-muted-light dark:text-muted-dark">+${Number(auctionItem?.shippingCosts).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border-light dark:border-border-dark pt-2 flex justify-between items-center">
                <span className="font-changa text-sm uppercase tracking-widest text-text-light dark:text-text-dark">Total</span>
                <span className="font-changa text-lg text-primary-light dark:text-primary-dark">${finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <UsernameForm formName={FORM_NAME} />
          {auctionItem?.requiresShipping && <AddressForm formName={FORM_NAME} />}

          {/* ── Payment form ── */}
          <section aria-label="Payment details">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Saved cards */}
              {isAuthed && savedCards.length > 0 && (
                <SavedCardSelector
                  savedCards={savedCards}
                  selectedCardId={selectedCardId}
                  useNewCard={useNewCard}
                  onSelectCard={(id) => store.dispatch(setForm({ selectedCardId: id }))}
                  onUseNewCard={() => store.dispatch(setForm({ useNewCard: true, selectedCardId: null }))}
                  onUseSavedCard={() => store.dispatch(setForm({ useNewCard: false, selectedCardId: savedCards[0]?.stripePaymentId ?? null }))}
                />
              )}

              {/* Card element */}
              {(!isAuthed || savedCards.length === 0 || useNewCard) && <CardElementField formName={FORM_NAME} />}

              {/* Save card */}
              {(!isAuthed || useNewCard) && <SaveCardToggle formName={FORM_NAME} />}

              {/* Cover fees */}
              <CoverFeesToggle formName={FORM_NAME} processingFee={processingFee} />

              {/* Error */}
              <FormError formName={FORM_NAME} />

              {/* Submit */}

              <SubmitButton
                formName={FORM_NAME}
                isValid={
                  inputs?.loading ||
                  !stripe ||
                  !elements ||
                  !inputs?.firstName ||
                  !inputs?.lastname ||
                  !inputs?.addressLine1 ||
                  !inputs?.city ||
                  !inputs?.state ||
                  !inputs?.zipPostalCode
                }
                label={`Buy Now — $${finalAmount.toFixed(2)}`}
              />

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
