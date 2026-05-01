'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { AdoptionApplicationPaymentForm } from 'app/components/forms/AdoptionApplicationPaymentForm'
import { verifyBypassCode } from 'app/lib/actions/verifyBypassCode'
import { store, useFormSelector } from 'app/lib/store/store'
import { setShowConfetti } from 'app/lib/store/slices/uiSlice'
import { updateAdoptionFee } from 'app/lib/actions/updateAdoptionFee'
import { slideVariants } from 'app/lib/constants/motion'
import { IPaymentForm } from 'types/common'
import { setInputs } from 'app/lib/store/slices/formSlice'
import { useInitializeForm } from '@hooks/useInitializeForm'
import { CustomSwitch } from '../common/CustomSwitch'

const TERMS_AND_CONDITIONS = [
  {
    title: 'Adoption Requirements',
    content: [
      'Must be 21 years of age or older',
      'Own or rent your home (landlord approval required for rentals)',
      'All household members must agree to the adoption',
      'Financially able to provide proper care'
    ]
  },
  {
    title: 'Home Environment',
    content: [
      'Safe, secure living environment',
      'Proper fencing if you have a yard',
      'No history of animal abuse or neglect',
      'Current pets must be spayed/neutered and up-to-date on vaccinations'
    ]
  },
  {
    title: 'Adoption Process',
    content: [
      'Application fee is non-refundable',
      'Home visit may be required',
      'Reference checks will be conducted',
      'Approval is not guaranteed',
      'Final adoption fee is separate from application fee'
    ]
  },
  {
    title: 'Commitment',
    content: [
      'Lifetime commitment to the adopted dog',
      'Provide necessary medical care',
      'Keep dog indoors as a family member',
      'Return dog to Little Paws if unable to keep'
    ]
  }
]

// ─── Input ─────────────────────────────────────────────────────────────────────
function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-2">
        {label}
        {required && (
          <span className="text-secondary-light dark:text-secondary-dark ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        disabled={disabled}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
        className={`${type === 'email' ? 'bg-surface-light' : 'bg-white'} w-full px-4 py-3 dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition disabled:cursor-not-allowed`}
      />
      {type === 'email' && disabled && (
        <p className="mt-1.5 text-xs text-muted-light dark:text-muted-dark">
          This is the email associated with your account and cannot be changed here.
        </p>
      )}
    </div>
  )
}

const STEPS = ['sign-in', 'terms', 'info', 'payment'] as const
type STEPS_TYPES = 'sign-in' | 'info' | 'terms' | 'payment'

const STEP_LABELS: Record<string, string> = {
  'sign-in': 'Sign In',
  terms: 'Terms',
  info: 'Info',
  payment: 'Payment'
}

const setForm = (data: Record<string, any>) => store.dispatch(setInputs({ formName: 'adoptionFeeForm', data }))

export const AdoptionApplicationClient = ({ savedCards, userName }: IPaymentForm) => {
  const router = useRouter()
  const session = useSession()
  const [step, setStep] = useState<STEPS_TYPES>(session.data?.user?.id ? 'terms' : 'sign-in')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [bypassPayment, setBypassPayment] = useState(false)

  const [magicEmail, setMagicEmail] = useState('')
  const [adoptionFeeId, setAdoptionFeeId] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)

  // Form state
  const { adoptionFeeForm } = useFormSelector()
  const inputs = adoptionFeeForm?.inputs

  useInitializeForm(setForm, { session, savedCards, userName })

  const handleContinueToInfo = () => {
    if (!agreedToTerms) {
      return
    }
    setStep('info')
  }

  const handleVerifyBypassCode = async () => {
    if (!inputs?.bypassCode.trim()) return

    setForm({ verifyingCode: true, bypassError: '' })

    try {
      const result = await verifyBypassCode(inputs?.bypassCode.trim())
      if (result.isValid) {
        setBypassPayment(true)
        setAdoptionFeeId(result.data.adoptionFeeId)
        store.dispatch(setShowConfetti())
      } else {
        setForm({ bypassPayment: false, bypassError: result.error ?? 'Invalid bypass code' })
      }
    } catch {
      setForm({ bypassPayment: false, bypassError: 'Error verifying code. Please try again.' })
    } finally {
      setForm({ verifyingCode: false })
    }
  }

  const handleProceed = async () => {
    if (bypassPayment && adoptionFeeId) {
      setForm({ isProceeding: true })
      try {
        const result = await updateAdoptionFee({
          adoptionFeeId,
          firstName: inputs?.firstName,
          lastName: inputs?.lastName,
          email: inputs?.email,
          state: inputs?.state
        })
        if (!result.success) {
          setForm({ bypassError: result.error ?? 'Something went wrong. Please try again.' })

          return
        }
        router.push('/adopt/application/apply')
      } catch {
        setForm({ bypassError: 'Something went wrong. Please try again.' })
      }
    } else {
      setStep('payment')
    }
  }

  const handleMagicLink = async () => {
    if (!magicEmail) return
    setIsSendingMagicLink(true)
    await signIn('email', { email: magicEmail, callbackUrl: '/adopt/application', redirect: false })
    setMagicLinkSent(true)
    setIsSendingMagicLink(false)
  }

  const currentIndex = STEPS.indexOf(step)
  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Adopt</p>
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          </div>
          <h1 className="font-quicksand text-3xl sm:text-4xl font-bold text-text-light dark:text-text-dark mb-2">
            Adoption <span className="font-light text-muted-light dark:text-muted-dark">Application</span>
          </h1>
          <p className="text-sm text-muted-light dark:text-on-dark">Start your journey to giving a dachshund a forever home</p>
        </motion.div>

        {/* ── Progress ── */}
        <nav aria-label="Application steps" className="mb-10">
          <ol className="flex items-center justify-center gap-0" role="list">
            {STEPS.map((s, index) => {
              const isComplete = index < currentIndex
              const isCurrent = s === step

              return (
                <li key={s} className="flex items-center" role="listitem">
                  <div className="flex flex-col items-center">
                    <div
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`Step ${index + 1}: ${STEP_LABELS[s]}${isComplete ? ' (complete)' : isCurrent ? ' (current)' : ''}`}
                      className={`w-9 h-9 flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
                        isComplete
                          ? 'bg-primary-light dark:bg-primary-dark text-white'
                          : isCurrent
                            ? 'bg-button-light dark:bg-button-dark text-white border-2 border-primary-light dark:border-primary-dark'
                            : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-[10px] font-mono tracking-widest uppercase ${isCurrent ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
                    >
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {index < STEPS?.length - 1 && (
                    <div
                      aria-hidden="true"
                      className={`w-16 sm:w-24 h-px mx-2 mb-5 transition-colors duration-300 ${
                        index < currentIndex ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                      }`}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        {/* ── Step content ── */}
        <AnimatePresence mode="wait">
          {/* Step 0: Sign in */}
          {step === 'sign-in' && (
            <motion.section
              key="sign-in"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-sign-in-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              <h2 id="step-sign-in-heading" className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-2">
                Sign in to continue
              </h2>
              <p className="text-sm text-muted-light dark:text-muted-dark mb-8 leading-relaxed">
                We need to verify your identity before you start your adoption application. Sign in with Google or your email — it only takes a
                moment.
              </p>

              {/* Google */}
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/adopt/application' })}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 mb-3 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark text-sm font-mono tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5" aria-hidden="true">
                <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">or</span>
                <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
              </div>

              {/* Magic link */}
              {!magicLinkSent ? (
                <div>
                  <label
                    htmlFor="magic-email"
                    className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2"
                  >
                    Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="magic-email"
                      type="email"
                      autoComplete="email"
                      value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                      placeholder="you@example.com"
                      className="flex-1 px-3.5 py-3 border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 text-sm font-mono focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={!magicEmail || isSendingMagicLink}
                      className="px-4 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center gap-2"
                    >
                      {isSendingMagicLink ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : 'Send Link'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-l-2 border-primary-light dark:border-primary-dark pl-4">
                  <p className="text-sm text-text-light dark:text-text-dark font-mono mb-1">Check your inbox</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark mb-3">
                    We sent a sign in link to <strong>{magicEmail}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMagicLinkSent(false)
                      setMagicEmail('')
                    }}
                    className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none"
                  >
                    Use a different email
                  </button>
                </div>
              )}
            </motion.section>
          )}

          {/* Step 1: Terms */}
          {step === 'terms' && (
            <motion.section
              key="terms"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-terms-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              <h2 id="step-terms-heading" className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                Terms &amp; Conditions
              </h2>

              <div
                className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-light dark:scrollbar-thumb-border-dark"
                tabIndex={0}
                aria-label="Terms and conditions — scrollable"
                role="region"
              >
                {TERMS_AND_CONDITIONS.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-mono tracking-widest uppercase text-primary-light dark:text-primary-dark mb-3">{section.title}</h3>
                    <ul className="space-y-2" role="list">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-light dark:text-on-dark">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark shrink-0 mt-1.5" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <CustomSwitch id="agree-terms" checked={agreedToTerms} onChange={(checked) => setAgreedToTerms(checked)} />
                  <span className="text-sm font-mono text-muted-light dark:text-on-dark leading-relaxed">
                    I have read and agree to the terms and conditions. I understand that the{' '}
                    <strong className="text-text-light dark:text-text-dark">$15 application fee is non-refundable</strong> and that approval is not
                    guaranteed.
                  </span>
                </label>

                <button
                  onClick={handleContinueToInfo}
                  disabled={!agreedToTerms}
                  aria-disabled={!agreedToTerms}
                  className="w-full bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Continue to Info
                </button>
              </div>
            </motion.section>
          )}

          {/* Step 2: Info */}
          {step === 'info' && (
            <motion.section
              key="info"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-info-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              {/* ── Bypass code ── */}
              <div className="border border-border-light dark:border-border-dark p-5 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Have a Bypass Code?</p>
                </div>
                <p className="text-xs text-muted-light dark:text-muted-dark mb-4 leading-relaxed">
                  If you have a code to waive the application fee, enter it below and verify. A successful verification will take you directly to the
                  application — no payment required.
                </p>
                <div className="flex gap-2">
                  <input
                    id="bypassCode"
                    type="text"
                    value={inputs?.bypassCode || ''}
                    onChange={(e) => setForm({ bypassCode: e.target.value, bypassPayment: false, bypassError: '' })}
                    placeholder="Enter bypass code"
                    className="flex-1 px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyBypassCode}
                    disabled={!inputs?.bypassCode?.trim() || inputs?.verifyingCode}
                    aria-disabled={!inputs?.bypassCode?.trim() || inputs?.verifyingCode}
                    className="px-5 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-text-light dark:text-text-dark disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    {inputs?.verifyingCode ? 'Verifying…' : 'Verify'}
                  </button>
                </div>

                {inputs?.bypassError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-secondary-light dark:text-secondary-dark"
                    role="alert"
                  >
                    {inputs?.bypassError}
                  </motion.p>
                )}
                {bypassPayment && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-2 text-xs text-primary-light dark:text-primary-dark"
                    role="status"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Valid code — application fee waived. Fill in your details below to continue.
                  </motion.p>
                )}
              </div>

              {/* ── Your info ── */}
              <h2 id="step-info-heading" className="font-changa text-2xl uppercase leading-none text-text-light dark:text-text-dark mb-6">
                Your Information
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <Input id="firstName" label="First Name" value={inputs?.firstName} onChange={(value) => setForm({ firstName: value })} required />
                  <Input id="lastName" label="Last Name" value={inputs?.lastName} onChange={(value) => setForm({ lastName: value })} required />
                </div>
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  value={session.data?.user?.email}
                  onChange={(value) => setForm({ email: value })}
                  required
                  disabled
                />

                {/* ── Fee info box ── */}
                <div
                  className={`bg-bg-light dark:bg-bg-dark border p-4 transition-colors ${
                    bypassPayment ? 'border-primary-light/50 dark:border-primary-dark/50' : 'border-primary-light/30 dark:border-primary-dark/30'
                  }`}
                  role="note"
                  aria-label="Application fee information"
                >
                  <div className="flex gap-3">
                    {bypassPayment ? (
                      <svg
                        className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-text-light dark:text-text-dark">Application Fee:</p>
                        {bypassPayment ? (
                          <div className="flex items-center gap-1.5">
                            <span className="line-through text-muted-light dark:text-muted-dark text-xs">$15</span>
                            <span className="font-semibold text-primary-light dark:text-primary-dark">$0</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-text-light dark:text-text-dark">$15</span>
                        )}
                      </div>
                      <p className="text-muted-light dark:text-on-dark text-xs leading-relaxed">
                        {bypassPayment
                          ? 'Your bypass code has been verified — the application fee has been waived.'
                          : 'This non-refundable fee covers application processing and background checks. The final adoption fee will be discussed if your application is approved.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── CTA ── */}
                <button
                  onClick={handleProceed}
                  disabled={!inputs?.firstName || !inputs?.lastName || !inputs?.email || inputs?.isProceeding}
                  aria-disabled={!inputs?.firstName || !inputs?.lastName || !inputs?.email || inputs?.isProceeding}
                  className="w-full bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2"
                >
                  {inputs?.isProceeding ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        aria-hidden="true"
                      />
                      <span>Please wait…</span>
                      <span className="sr-only">Processing, please wait</span>
                    </>
                  ) : bypassPayment ? (
                    'Continue to Application'
                  ) : (
                    'Continue to Payment'
                  )}
                </button>

                <button
                  onClick={() => setStep('terms')}
                  className="w-full text-xs font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  ← Back to Terms
                </button>
              </div>
            </motion.section>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <motion.section
              key="payment"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-labelledby="step-payment-heading"
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
            >
              <h2 id="step-payment-heading" className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-1">
                Payment
              </h2>
              <p className="text-sm text-muted-light dark:text-on-dark mb-6">
                Complete your $15 application fee to submit your adoption application.
              </p>

              <div className="bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark p-4 mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-text-light dark:text-text-dark">Application Fee</span>
                <span className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark">$15.00</span>
              </div>

              <AdoptionApplicationPaymentForm savedCards={savedCards} />

              <button
                onClick={() => setStep('info')}
                className="w-full mt-4 text-xs font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                ← Back to Info
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
