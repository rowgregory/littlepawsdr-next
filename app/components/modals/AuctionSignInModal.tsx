'use client'

import { useState } from 'react'
import { X, Loader2, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { store, useUiSelector } from 'app/lib/store/store'
import { setCloseAuctionSignInModal } from 'app/lib/store/slices/uiSlice'
import { GoogleIcon } from '../ui/icons/GoogleIcon'

export default function AuctionSignInModal() {
  const { auctionSignInModal, auctionSignInRedirectTo } = useUiSelector()
  const [email, setEmail] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [loadingMagicLink, setLoadingMagicLink] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClose = () => {
    store.dispatch(setCloseAuctionSignInModal())
    setEmail('')
    setMagicLinkSent(false)
    setError(null)
  }

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    await signIn('google', { redirectTo: auctionSignInRedirectTo ?? '/' })
  }

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setError('Please enter your email.')
      return
    }
    setLoadingMagicLink(true)
    setError(null)

    const result = await signIn('email', {
      email: email.trim(),
      redirectTo: auctionSignInRedirectTo ?? '/',
      redirect: false
    })

    setLoadingMagicLink(false)

    if (result?.error) {
      setError('Something went wrong. Please try again.')
      return
    }

    setMagicLinkSent(true)
  }

  return (
    <AnimatePresence>
      {auctionSignInModal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auction-signin-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 xs:inset-x-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-auto sm:w-full sm:max-w-md bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark shadow-2xl"
          >
            {/* Top accent */}
            <div
              className="h-0.5 w-full bg-linear-to-r from-primary-light via-secondary-dark to-primary-dark dark:from-primary-dark dark:via-secondary-dark dark:to-primary-light"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 id="auction-signin-title" className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                  Sign in to Bid
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close sign in modal"
                className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {magicLinkSent ? (
              /* ── Magic link sent ── */
              <div className="px-6 py-10 text-center space-y-3">
                <div className="w-12 h-12 mx-auto border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center mb-4">
                  <Mail size={20} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                </div>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Check your inbox</p>
                <p className="text-sm font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                  We sent a magic link to <strong className="text-text-light dark:text-text-dark">{email}</strong>. Click it to sign in and
                  you&apos;ll be taken straight to the auction.
                </p>
                <button
                  onClick={() => {
                    setMagicLinkSent(false)
                    setEmail('')
                  }}
                  className="mt-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              /* ── Sign in options ── */
              <div className="px-6 py-6 space-y-4">
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                  Sign in to place your bid. You&apos;ll be taken straight back to the item after signing in.
                </p>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={loadingGoogle || loadingMagicLink}
                  aria-label="Sign in with Google"
                  className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingGoogle ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : <GoogleIcon />}
                  {loadingGoogle ? 'Redirecting...' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">or</span>
                  <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                </div>

                {/* Magic link */}
                <div className="space-y-2">
                  <label htmlFor="signin-email" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                    Email
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-describedby={error ? 'signin-error' : undefined}
                    aria-invalid={!!error}
                    className="w-full px-3.5 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
                  />
                  {error && (
                    <p id="signin-error" role="alert" className="text-[10px] font-mono text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  <button
                    onClick={handleMagicLink}
                    disabled={loadingMagicLink || loadingGoogle}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-light dark:bg-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase text-white dark:text-bg-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMagicLink ? (
                      <>
                        <Loader2 size={11} className="animate-spin" aria-hidden="true" /> Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={11} aria-hidden="true" /> Send Magic Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
