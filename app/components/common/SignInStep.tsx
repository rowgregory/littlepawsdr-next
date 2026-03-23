import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { errorClass, fieldClass, labelClass } from 'app/lib/constants/styles'
import { Mail } from 'lucide-react'

export function StepSignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMagicLink() {
    if (!email || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await signIn('email', { email, redirect: false, redirectTo: '/checkout' })
      if (res?.error) throw new Error(res.error)
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn('google', { redirect: true, redirectTo: '/checkout' })
  }

  return (
    <motion.div
      key="step-signin"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-1">
          Sign in to <span className="font-light text-muted-light dark:text-muted-dark">continue</span>
        </h2>
        <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">Sign in or create an account to complete your donation.</p>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-4 border border-primary-light/20 dark:border-primary-dark/20 bg-surface-light dark:bg-surface-dark"
        >
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark mb-1">Check your inbox</p>
          <p className="text-sm font-mono text-muted-light dark:text-muted-dark">
            We sent a magic link to <span className="text-text-light dark:text-text-dark">{email}</span>. Click the link to sign in and return here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
            <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">or</span>
            <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          </div>

          {/* Magic link */}
          <div>
            <label htmlFor="checkout-email" className={labelClass}>
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                placeholder="you@example.com"
                autoComplete="email"
                required
                aria-required="true"
                className={`${fieldClass} flex-1 min-w-0`}
              />
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={!email || loading}
                aria-disabled={!email || loading}
                className={`shrink-0 px-4 py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                  ${
                    !email || loading
                      ? 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
                      : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
                  }`}
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current"
                    aria-hidden="true"
                  />
                ) : (
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
            {error && (
              <p role="alert" className={errorClass}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
