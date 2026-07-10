import { slideVariants } from 'app/lib/constants/motion.constants'
import { motion } from 'framer-motion'
import { Input } from '../ui/Input'

export function Step2Info({
  inputs,
  setInputs,
  verifyingCode,
  bypassError,
  bypassPayment,
  setBypassPayment,
  setBypassError,
  handleVerifyBypassCode,
  isProceeding,
  handleProceed,
  setStep
}) {
  const patch = (data: Partial<typeof inputs>) => setInputs((prev) => ({ ...prev, ...data }))
  return (
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
          <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Have a Bypass Code?
          </p>
        </div>
        <p className="text-xs text-muted-light dark:text-muted-dark mb-4 leading-relaxed">
          If you have a code to waive the application fee, enter it below and verify. A successful verification will
          take you directly to the application — no payment required.
        </p>
        <div className="flex gap-2">
          <input
            id="bypassCode"
            type="text"
            value={inputs.bypassCode}
            onChange={(e) => {
              patch({ bypassCode: e.target.value })
              setBypassPayment(false)
              setBypassError('')
            }}
            placeholder="Enter bypass code"
            className="flex-1 px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition"
          />
          <button
            type="button"
            onClick={handleVerifyBypassCode}
            disabled={!inputs.bypassCode.trim() || verifyingCode}
            aria-disabled={!inputs.bypassCode.trim() || verifyingCode}
            className="px-5 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-text-light dark:text-text-dark disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            {verifyingCode ? 'Verifying…' : 'Verify'}
          </button>
        </div>

        {bypassError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-secondary-light dark:text-secondary-dark"
            role="alert"
          >
            {bypassError}
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
      <h2
        id="step-info-heading"
        className="font-changa text-2xl uppercase leading-none text-text-light dark:text-text-dark mb-6"
      >
        Your Information
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name"
            value={inputs.firstName}
            onChange={(value) => patch({ firstName: value })}
            required
          />
          <Input
            id="lastName"
            label="Last Name"
            value={inputs.lastName}
            onChange={(value) => patch({ lastName: value })}
            required
          />
        </div>
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={inputs.email}
          onChange={(value) => patch({ email: value })}
          required
          disabled
        />

        {/* ── Fee info box ── */}
        <div
          className={`bg-bg-light dark:bg-bg-dark border p-4 transition-colors ${
            bypassPayment
              ? 'border-primary-light/50 dark:border-primary-dark/50'
              : 'border-primary-light/30 dark:border-primary-dark/30'
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
          disabled={!inputs.firstName || !inputs.lastName || !inputs.email || isProceeding}
          aria-disabled={!inputs.firstName || !inputs.lastName || !inputs.email || isProceeding}
          className="w-full bg-button-light dark:bg-button-dark hover:bg-primary-light dark:hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2"
        >
          {isProceeding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white "
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
  )
}
