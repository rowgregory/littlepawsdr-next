'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMagicLink() {
    if (!email || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await signIn('email', { email, redirect: false, redirectTo: '/auth/login' })
      if (res?.error) throw new Error(res.error)
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn('google', { redirect: true, redirectTo: '/auth/login' })
  }

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* ── Background grid ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0891b2 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        {/* Top glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-100 bg-primary-light/10 dark:bg-primary-dark/8 blur-[120px]" />
        {/* Bottom glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-100 h-75 bg-secondary-light/8 dark:bg-secondary-dark/6 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* ── Logo / wordmark ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-3">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary-light dark:text-primary-dark">Little Paws</span>
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          </Link>
          <h1 className="font-quicksand font-black text-3xl text-text-light dark:text-text-dark leading-tight">Welcome back</h1>
          <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1.5">Sign in to your account</p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              /* ── Success state ── */
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8 text-center flex flex-col items-center gap-4"
                role="status"
                aria-live="polite"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-12 h-12 border-2 border-primary-light dark:border-primary-dark flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-primary-light dark:text-primary-dark"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="square"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div>
                  <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark">Check your email</p>
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1 leading-relaxed">
                    We sent a magic link to
                    <br />
                    <span className="text-primary-light dark:text-primary-dark">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSent(false)
                    setEmail('')
                  }}
                  className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors mt-1"
                >
                  Use a different email
                </button>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 sm:p-8 flex flex-col gap-5"
              >
                {/* Google */}
                <motion.button
                  onClick={handleGoogle}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-light dark:border-border-dark bg-surface-light dark:bg-bg-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark group"
                >
                  {/* Google icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs font-mono tracking-wide text-text-light dark:text-text-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-200">
                    Continue with Google
                  </span>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">or</span>
                  <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                </div>

                {/* Magic link */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-1.5"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError(null)
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-describedby={error ? 'email-error' : undefined}
                      className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-200 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        id="email-error"
                        role="alert"
                        aria-live="assertive"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-mono text-red-500 dark:text-red-400 flex items-center gap-1.5"
                      >
                        <span aria-hidden="true">✕</span>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleMagicLink}
                    disabled={!email || loading}
                    whileHover={email && !loading ? { y: -1 } : {}}
                    whileTap={email && !loading ? { scale: 0.98 } : {}}
                    className={`w-full py-3 text-[10px] font-mono font-black tracking-[0.25em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                      email && !loading
                        ? 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
                        : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="block w-3 h-3 border-2 border-white/30 border-t-white"
                          aria-hidden="true"
                        />
                        Sending...
                      </span>
                    ) : (
                      'Send Magic Link'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-[10px] font-mono text-muted-light dark:text-muted-dark mt-6 leading-relaxed"
        >
          By signing in you agree to our{' '}
          <a
            href="/privacy-policy"
            className="text-primary-light dark:text-primary-dark hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Privacy Policy
          </a>
        </motion.p>
      </div>
    </main>
  )
}
