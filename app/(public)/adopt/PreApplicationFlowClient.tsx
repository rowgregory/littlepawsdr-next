'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { verifyBypassCode } from 'app/lib/actions/adoption-fee/verifyBypassCode'
import { store } from 'app/lib/store/store'
import { setShowConfetti } from 'app/lib/store/slices/uiSlice'
import { IPaymentForm } from 'types/common.types'
import { updateAdoptionFee } from 'app/lib/actions/adoption-fee/updateAdoptionFee'
import { STEPS } from 'app/lib/constants/adoption-application.constants'
import { STEPS_TYPES } from 'types/_adoption-application.types'
import {
  Header,
  Progress,
  Step0SignIn,
  Step1Terms,
  Step2Info,
  Step3Payment
} from 'app/components/_adoption-application'

export const PreApplicationFlowClient = ({
  savedCards,
  userName,
  isAuthed,
  email,
  id
}: IPaymentForm & { isAuthed: boolean; email: string | null }) => {
  const router = useRouter()

  const [step, setStep] = useState<STEPS_TYPES>(isAuthed ? 'terms' : 'sign-in')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [bypassPayment, setBypassPayment] = useState(false)
  const [adoptionFeeId, setAdoptionFeeId] = useState('')

  // Magic link state
  const [magicEmail, setMagicEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)

  const [inputs, setInputs] = useState({
    firstName: userName?.firstName ?? '',
    lastName: userName?.lastName ?? '',
    email: email ?? '',
    state: '',
    bypassCode: ''
  })

  const [verifyingCode, setVerifyingCode] = useState(false)
  const [bypassError, setBypassError] = useState('')
  const [isProceeding, setIsProceeding] = useState(false)

  const handleContinueToInfo = () => {
    if (!agreedToTerms) return
    setStep('info')
  }

  const handleVerifyBypassCode = async () => {
    const code = inputs.bypassCode.trim()
    if (!code) return

    setVerifyingCode(true)
    setBypassError('')

    try {
      const result = await verifyBypassCode(code)
      if (result.isValid) {
        setBypassPayment(true)
        setAdoptionFeeId(result.data.adoptionFeeId)
        store.dispatch(setShowConfetti())
      } else {
        setBypassPayment(false)
        setBypassError(result.error ?? 'Invalid bypass code')
      }
    } catch {
      setBypassPayment(false)
      setBypassError('Error verifying code. Please try again.')
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleProceed = async () => {
    if (!(bypassPayment && adoptionFeeId)) {
      setStep('payment')
      return
    }

    setIsProceeding(true)
    setBypassError('')
    try {
      const result = await updateAdoptionFee({
        adoptionFeeId,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        state: inputs.state
      })
      if (!result.success) {
        setBypassError(result.error ?? 'Something went wrong. Please try again.')
        return
      }
      router.push('/adopt/application')
    } catch {
      setBypassError('Something went wrong. Please try again.')
    } finally {
      setIsProceeding(false)
    }
  }

  const handleMagicLink = async () => {
    if (!magicEmail) return
    setIsSendingMagicLink(true)
    await signIn('email', { email: magicEmail, redirectTo: '/adopt/application', redirect: false })
    setMagicLinkSent(true)
    setIsSendingMagicLink(false)
  }

  const currentIndex = STEPS.indexOf(step)

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <Header />

        {/* ── Progress ── */}
        <Progress currentIndex={currentIndex} step={step} />

        {/* ── Step content ── */}
        <AnimatePresence mode="wait">
          {/* Step 0: Sign in */}
          {step === 'sign-in' && (
            <Step0SignIn
              handleMagicLink={handleMagicLink}
              isSendingMagicLink={isSendingMagicLink}
              magicEmail={magicEmail}
              magicLinkSent={magicLinkSent}
              setMagicEmail={setMagicEmail}
              setMagicLinkSent={setMagicLinkSent}
            />
          )}

          {/* Step 1: Terms */}
          {step === 'terms' && (
            <Step1Terms
              agreedToTerms={agreedToTerms}
              handleContinueToInfo={handleContinueToInfo}
              setAgreedToTerms={setAgreedToTerms}
            />
          )}

          {/* Step 2: Info */}
          {step === 'info' && (
            <Step2Info
              bypassError={bypassError}
              bypassPayment={bypassPayment}
              handleProceed={handleProceed}
              handleVerifyBypassCode={handleVerifyBypassCode}
              inputs={inputs}
              isProceeding={isProceeding}
              setBypassError={setBypassError}
              setBypassPayment={setBypassPayment}
              setInputs={setInputs}
              setStep={setStep}
              verifyingCode={verifyingCode}
            />
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <Step3Payment
              savedCards={savedCards}
              setStep={setStep}
              email={email}
              firstName={inputs.firstName}
              lastName={inputs.lastName}
              userId={id}
              isAuthed={isAuthed}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
