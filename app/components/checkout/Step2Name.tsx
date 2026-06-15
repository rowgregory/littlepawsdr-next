import { errorClass, fieldClass, labelClass } from 'app/lib/constants/styles'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function Step2Name({ inputs, errors, handleInput, onNext, isAuthed }: any) {
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
