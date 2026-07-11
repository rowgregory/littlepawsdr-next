'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Trophy, User } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { IAuctionWinningBidder } from 'types/entities/auction-winning-bidder'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { fadeUp } from 'app/lib/constants/motion.constants'
import { usePaymentProcessor } from '@hooks/usePaymentProcessor.hook'
import { useDefaultCard } from '@hooks/useDefaultCard.hook'
import { createPaymentIntent } from 'app/lib/actions/_stripe/createPaymentIntent'
import { AuctionReceipt, WinnerOrderSummary } from 'app/components/auction/public/winner-payment'
import {
  PaymentHandlers,
  PaymentState,
  WinnerPaymentForm
} from 'app/components/auction/public/winner-payment/WinnerPaymentForm'

interface Props {
  winningBidder: IAuctionWinningBidder
  savedCards: IPaymentMethod[]
}

export default function AuctionWinnerPaymentClient({ winningBidder, savedCards }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const session = useSession()
  const { setupPusherListenerOneTime, getPaymentMethodId } = usePaymentProcessor()

  const [cardComplete, setCardComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveCard, setSaveCard] = useState(false)
  const [coverFees, setCoverFees] = useState(true)
  const [useNewCard, setUseNewCard] = useState(savedCards?.length === 0)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards?.[0]?.stripePaymentId ?? null)

  const alreadyPaid = winningBidder?.winningBidPaymentStatus === 'PAID'
  const total = winningBidder?.auctionItems.reduce((sum, item) => sum + item.soldPrice, 0)
  const shipping = winningBidder?.shipping ?? 0
  const processingFee = Math.round(((total + 0.3) / (1 - 0.029) - total) * 100) / 100
  const finalAmount = coverFees ? Math.round((total + shipping + processingFee) * 100) / 100 : total + shipping
  const feesCovered = coverFees ? processingFee : 0

  const name = `${winningBidder?.user.firstName} ${winningBidder?.user.lastName}`
  const email = session.data?.user?.email
  const userId = session.data?.user?.id
  const usingSavedCard = !!selectedCardId && !useNewCard && session.data?.user

  useDefaultCard(savedCards, setSelectedCardId)

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    try {
      const basePayload = {
        amount: Math.round(finalAmount * 100),
        name,
        email,
        orderType: 'AUCTION_PURCHASE' as const,
        userId,
        coverFees,
        feesCovered,
        winningBidderId: winningBidder.id
      }

      if (usingSavedCard) {
        const result = await createPaymentIntent({ ...basePayload, savedCardId: selectedCardId })
        if (!result.success) throw new Error(result.error)
        setupPusherListenerOneTime(false, selectedCardId, setError, setLoading)
      } else {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Card element not found')

        const intentResult = await createPaymentIntent({ ...basePayload, saveCard })
        if (!intentResult.success) throw new Error(intentResult.error)

        const result = await stripe.confirmCardPayment(intentResult.clientSecret!, {
          payment_method: { card: cardElement, billing_details: { name, email } }
        })

        if (result.error) {
          setError(result.error.message || 'Payment failed')
        } else if (result.paymentIntent?.status === 'succeeded') {
          setupPusherListenerOneTime(
            saveCard,
            getPaymentMethodId(result.paymentIntent.payment_method),
            setError,
            setLoading
          )
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (alreadyPaid) return <AuctionReceipt winningBidder={winningBidder} />

  const state: PaymentState = {
    selectedCardId,
    useNewCard,
    cardComplete,
    loading,
    error,
    saveCard,
    coverFees,
    processingFee,
    finalAmount
  }

  const handlers: PaymentHandlers = {
    onSelectCard: setSelectedCardId,
    onUseNewCard: () => {
      setUseNewCard(true)
      setSelectedCardId(null)
    },
    onUseSavedCard: () => {
      setUseNewCard(false)
      setSelectedCardId(savedCards[0]?.stripePaymentId ?? null)
    },
    onCardChange: ({ complete, error }) => {
      setCardComplete(complete)
      setError(error)
    },
    onSaveCardToggle: () => setSaveCard((prev) => !prev),
    onCoverFeesChange: setCoverFees,
    onSubmit: handleSubmit
  }

  return (
    <div className="min-h-dvh bg-white dark:bg-bg-dark">
      <div className="max-w-4xl mx-auto px-4 430:px-6 py-12 430:py-16">
        {/* ── Page header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-cyan-600 dark:bg-violet-400" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-600 dark:text-violet-400">
                {winningBidder?.auction.title}
              </span>
            </div>
            <Link
              href="/member/portal"
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-muted-dark hover:text-cyan-600 dark:hover:text-violet-400 transition-colors"
            >
              <User className="w-3 h-3" aria-hidden="true" />
              Portal
            </Link>
          </div>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-cyan-600/10 dark:bg-violet-400/10">
              <Trophy className="w-5 h-5 text-cyan-600 dark:text-violet-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl 430:text-4xl uppercase leading-none text-zinc-950 dark:text-text-dark mb-2">
                Congratulations, {winningBidder?.user?.firstName}!
              </h1>
              <p className="font-lato text-sm text-zinc-500 dark:text-muted-dark leading-relaxed max-w-lg">
                You won{' '}
                {winningBidder?.auctionItems.length === 1 ? 'an item' : `${winningBidder?.auctionItems.length} items`}{' '}
                in the auction. Complete your payment below to claim{' '}
                {winningBidder?.auctionItems.length === 1 ? 'it' : 'them'}.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Paying as ── */}
        {winningBidder.user?.firstName && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.5} className="mb-6">
            <div className="border-l-2 border-cyan-600 dark:border-violet-400 pl-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 dark:text-muted-dark mb-0.5">
                Paying as
              </p>
              <p className="text-lg uppercase leading-none text-zinc-950 dark:text-text-dark">
                {[winningBidder.user.firstName, winningBidder.user.lastName].filter(Boolean).join(' ')}
              </p>
              <p className="font-lato text-xs text-zinc-400 dark:text-muted-dark/50 mt-0.5">
                {winningBidder.user.email}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Two column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <WinnerPaymentForm winningBidder={winningBidder} savedCards={savedCards} state={state} handlers={handlers} />
          <WinnerOrderSummary
            winningBidder={winningBidder}
            total={total}
            shipping={shipping}
            processingFee={processingFee}
            finalAmount={finalAmount}
          />
        </div>
      </div>
    </div>
  )
}
